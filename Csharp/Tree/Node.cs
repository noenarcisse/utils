namespace Tests;

public abstract class Node
{
    public readonly int Adress;

    public Node(int adress)
    {
        Adress=adress;
    }

    public override string ToString()
    {
        return "node#"+Adress;
    }
}

public sealed class RootNode : Node
{
    public RootNode(int adress):base(adress)
    {}
}
public class ChildNode : Node
{
    public ChildNode(int adress): base(adress)
    {}
}