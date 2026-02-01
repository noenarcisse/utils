namespace Tests;
public static class Salt
{
    /// <summary>
    /// Returns a simple salt with 3 letters and 3 numbers
    /// </summary>
    /// <returns></returns>
    public static string Generate()
    {
        byte a = (byte)'a';
        byte z = (byte)'z'+1;
        int n = Random.Shared.Next(0, 1000);

        List<char> chars=[];

        for(int i=0; i<3; i++)
        {
            chars.Add((char)(byte)Random.Shared.Next(a,z));
        }

        return $"{string.Join("",chars)}{n:D3}";
    }

    /// <summary>
    /// Returns a complex salt of a fixed size. The result is composed of any non space character and numbers in any order.
    /// </summary>
    /// <param name="size">The size of the salt</param>
    /// <returns>The final salt</returns>
    public static string GenerateComplex(int size)
    {
        int[] range = [33, 122+1];
        List<char> chars=[];

        for(int i=0; i<size+1; i++)
        {
            chars.Add((char)(byte)Random.Shared.Next(range[0], range[1]));
        }

        return $"{string.Join("",chars)}";
    }

    /// <summary>
    /// Returns a complex salt of a random size between 16 and 32 chars. The result is composed of any non space character and numbers in any order.
    /// </summary>
    /// <returns>The final salt</returns>
    public static string GenerateComplex()
    {
        return GenerateComplex(Random.Shared.Next(16,33));
    }

    //TESTING
    public static void Test()
    {
        for(int i=0; i < 50; i++)
        {
            GenerateComplex();
        }
    }
}
