using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AntigravityZhCn
{
    public class ExtractResult
    {
        public int ExtractedFiles { get; set; }
        public int SkippedUnpacked { get; set; }
        public int SkippedLinks { get; set; }
        public long TotalBytes { get; set; }
    }

    /// <summary>
    /// 零外部依赖的 Electron ASAR 标准无损解包器（兼容 .NET Framework 4.x 与 .NET 6/7/8+）
    /// </summary>
    public static class AsarExtractor
    {
        public static ExtractResult Extract(string asarPath, string outputDir)
        {
            if (string.IsNullOrEmpty(asarPath) || !File.Exists(asarPath))
                throw new FileNotFoundException("找不到 app.asar 文件", asarPath);

            string fullOutDir = Path.GetFullPath(outputDir);
            if (!fullOutDir.EndsWith(Path.DirectorySeparatorChar.ToString()))
                fullOutDir += Path.DirectorySeparatorChar;

            Directory.CreateDirectory(fullOutDir);

            using (var fs = new FileStream(asarPath, FileMode.Open, FileAccess.Read, FileShare.Read))
            using (var br = new BinaryReader(fs))
            {
                if (fs.Length < 16)
                    throw new InvalidDataException("ASAR 文件过小，格式无效。");

                uint sizePicklePayload = br.ReadUInt32(); // 通常为 4
                uint headerSize = br.ReadUInt32();
                uint headerPicklePayload = br.ReadUInt32();
                uint jsonStringLen = br.ReadUInt32();

                if (sizePicklePayload != 4 || headerSize < 8 || jsonStringLen == 0 || 16L + jsonStringLen > fs.Length)
                    throw new InvalidDataException("ASAR 文件头格式异常，无法解析。");

                long dataBaseOffset = 8L + headerSize;
                if (dataBaseOffset > fs.Length)
                    throw new InvalidDataException("ASAR 数据区偏移超出文件大小。");

                byte[] jsonBytes = br.ReadBytes((int)jsonStringLen);
                string headerJson = Encoding.UTF8.GetString(jsonBytes);

                var parser = new MiniJsonParser(headerJson);
                var rootObj = parser.Parse() as Dictionary<string, object>;
                if (rootObj == null || !rootObj.ContainsKey("files"))
                    throw new InvalidDataException("ASAR 头部缺少 files 节点。");

                var result = new ExtractResult();
                byte[] copyBuffer = new byte[81920];
                ExtractDirectory(fs, dataBaseOffset, rootObj["files"] as Dictionary<string, object>, fullOutDir, fullOutDir, copyBuffer, result);
                return result;
            }
        }

        private static void ExtractDirectory(
            FileStream fs,
            long dataBaseOffset,
            Dictionary<string, object> filesNode,
            string rootOutDir,
            string currentDir,
            byte[] copyBuffer,
            ExtractResult result)
        {
            if (filesNode == null) return;
            Directory.CreateDirectory(currentDir);

            foreach (var kv in filesNode)
            {
                string name = kv.Key;
                var entry = kv.Value as Dictionary<string, object>;
                if (entry == null) continue;

                // 防止恶意路径穿越
                string targetPath = Path.GetFullPath(Path.Combine(currentDir, name));
                if (!targetPath.StartsWith(rootOutDir, StringComparison.OrdinalIgnoreCase))
                    throw new InvalidDataException("检测到非法 ASAR 路径: " + name);

                if (entry.ContainsKey("files"))
                {
                    ExtractDirectory(fs, dataBaseOffset, entry["files"] as Dictionary<string, object>, rootOutDir, targetPath, copyBuffer, result);
                    continue;
                }

                if (entry.ContainsKey("unpacked") && entry["unpacked"] is bool && (bool)entry["unpacked"])
                {
                    result.SkippedUnpacked++;
                    continue;
                }

                if (entry.ContainsKey("link"))
                {
                    result.SkippedLinks++;
                    continue;
                }

                long fileSize = ToLong(entry, "size");
                long relOffset = ToLong(entry, "offset");
                long absOffset = dataBaseOffset + relOffset;

                if (absOffset < 0 || absOffset + fileSize > fs.Length)
                    throw new InvalidDataException("ASAR 文件数据偏移越界: " + name);

                string parentDir = Path.GetDirectoryName(targetPath);
                if (!string.IsNullOrEmpty(parentDir))
                    Directory.CreateDirectory(parentDir);

                fs.Seek(absOffset, SeekOrigin.Begin);
                using (var outFs = new FileStream(targetPath, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    long remaining = fileSize;
                    while (remaining > 0)
                    {
                        int toRead = (int)Math.Min(copyBuffer.Length, remaining);
                        int read = fs.Read(copyBuffer, 0, toRead);
                        if (read <= 0)
                            throw new EndOfStreamException("读取 ASAR 文件数据时意外到达末尾: " + name);
                        outFs.Write(copyBuffer, 0, read);
                        remaining -= read;
                    }
                }

                result.ExtractedFiles++;
                result.TotalBytes += fileSize;
            }
        }

        private static long ToLong(Dictionary<string, object> dict, string key)
        {
            if (!dict.ContainsKey(key) || dict[key] == null) return 0L;
            object v = dict[key];
            if (v is long) return (long)v;
            if (v is int) return (int)v;
            if (v is double) return (long)(double)v;
            long parsed;
            if (long.TryParse(v.ToString(), out parsed)) return parsed;
            return 0L;
        }

        /// <summary>
        /// 轻量零依赖 RFC 8259 JSON 解析器（专为解析 ASAR Header 设计，兼容全部 .NET 版本）
        /// </summary>
        private sealed class MiniJsonParser
        {
            private readonly string _s;
            private int _i;

            public MiniJsonParser(string s)
            {
                _s = s ?? string.Empty;
                _i = 0;
            }

            public object Parse()
            {
                SkipWs();
                return ParseValue();
            }

            private void SkipWs()
            {
                while (_i < _s.Length)
                {
                    char c = _s[_i];
                    if (c == ' ' || c == '\t' || c == '\r' || c == '\n') _i++;
                    else break;
                }
            }

            private object ParseValue()
            {
                SkipWs();
                if (_i >= _s.Length) return null;
                char c = _s[_i];
                if (c == '{') return ParseObject();
                if (c == '[') return ParseArray();
                if (c == '"') return ParseString();
                if (c == 't') { _i += 4; return true; }
                if (c == 'f') { _i += 5; return false; }
                if (c == 'n') { _i += 4; return null; }
                return ParseNumber();
            }

            private Dictionary<string, object> ParseObject()
            {
                var dict = new Dictionary<string, object>(StringComparer.Ordinal);
                _i++; // '{'
                SkipWs();
                if (_i < _s.Length && _s[_i] == '}') { _i++; return dict; }

                while (_i < _s.Length)
                {
                    SkipWs();
                    string key = ParseString();
                    SkipWs();
                    if (_i < _s.Length && _s[_i] == ':') _i++;
                    object val = ParseValue();
                    dict[key] = val;
                    SkipWs();
                    if (_i < _s.Length && _s[_i] == ',') { _i++; continue; }
                    if (_i < _s.Length && _s[_i] == '}') { _i++; break; }
                    break;
                }
                return dict;
            }

            private List<object> ParseArray()
            {
                var list = new List<object>();
                _i++; // '['
                SkipWs();
                if (_i < _s.Length && _s[_i] == ']') { _i++; return list; }

                while (_i < _s.Length)
                {
                    list.Add(ParseValue());
                    SkipWs();
                    if (_i < _s.Length && _s[_i] == ',') { _i++; continue; }
                    if (_i < _s.Length && _s[_i] == ']') { _i++; break; }
                    break;
                }
                return list;
            }

            private string ParseString()
            {
                var sb = new StringBuilder();
                _i++; // '"'
                while (_i < _s.Length)
                {
                    char c = _s[_i++];
                    if (c == '"') break;
                    if (c == '\\' && _i < _s.Length)
                    {
                        char e = _s[_i++];
                        switch (e)
                        {
                            case '"': sb.Append('"'); break;
                            case '\\': sb.Append('\\'); break;
                            case '/': sb.Append('/'); break;
                            case 'b': sb.Append('\b'); break;
                            case 'f': sb.Append('\f'); break;
                            case 'n': sb.Append('\n'); break;
                            case 'r': sb.Append('\r'); break;
                            case 't': sb.Append('\t'); break;
                            case 'u':
                                if (_i + 4 <= _s.Length)
                                {
                                    int code = Convert.ToInt32(_s.Substring(_i, 4), 16);
                                    sb.Append((char)code);
                                    _i += 4;
                                }
                                break;
                            default: sb.Append(e); break;
                        }
                    }
                    else
                    {
                        sb.Append(c);
                    }
                }
                return sb.ToString();
            }

            private object ParseNumber()
            {
                int start = _i;
                if (_i < _s.Length && _s[_i] == '-') _i++;
                bool isFloat = false;
                while (_i < _s.Length)
                {
                    char c = _s[_i];
                    if ((c >= '0' && c <= '9')) { _i++; }
                    else if (c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-') { isFloat = true; _i++; }
                    else break;
                }
                string raw = _s.Substring(start, _i - start);
                if (!isFloat)
                {
                    long l;
                    if (long.TryParse(raw, out l)) return l;
                }
                double d;
                if (double.TryParse(raw, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out d))
                    return d;
                return 0L;
            }
        }
    }
}
