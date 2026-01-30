namespace Tests;
public class Branch
{
    public int Id { get; set; }
    public HashSet<Node> Nodes { get; set; }

    public string Name;

    public Branch(int id, string name)
    {
        Nodes=[];
        Name=name;
        Id=id;
    }


    public void AppendNode(ChildNode node)
    {
        Nodes.Add(node);
    }
}