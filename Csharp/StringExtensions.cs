
// namespace TheNamespace;
public static class StringExtensions
{
    public static string OrDefault(this string? str) => string.IsNullOrWhiteSpace(str) ? "Empty value" : str;

    public static bool ContainsWord(this string str, string pattern)
    {
        char[] separators = [' ', ','];
        HashSet<string> str1 = str.ToLowerInvariant().Split(separators).ToHashSet();
        return str1.Contains(pattern, StringComparer.InvariantCultureIgnoreCase);
    }
}

