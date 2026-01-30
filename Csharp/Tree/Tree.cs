namespace Tests;

//TO DO
    // il faut pouvoir append des elements a d'autres
    // il faut empecher l'accroche d'une branche a un node dans celle ci
    // il faut pouvoir rebase

public class Tree
{
    //  ADRESS  <->     OBJ
    public Dictionary<int, Node> Nodes { get; set; }
    //  ID      <->     ADRESS(repeatable)
    public Dictionary<int, int> BranchesToNode { get; private set; }
    //  ID      <->     OBJ
    public Dictionary<int,Branch> Branches { get; private set; }

    //lorsqu'on delete une adresse ou ID, on vient la stocker pour etre reused et on la retire
    public HashSet<int> UnusedAdresses { get; private set; }
    public HashSet<int> UnusedIds { get; private set; }

    // ROOT node immuable en 0
    public readonly Node Root;

    public int LastAdress {get; private set;}
    public int LastId {get; private set;}

    public Tree()
    {
        LastAdress = 0;
        LastId = 0;

        Nodes = [];
        Branches=[];
        BranchesToNode=[];
        UnusedAdresses=[];
        UnusedIds=[];

        Root = new RootNode(LastAdress);
        Branch main = new Branch(LastId, "main");

        Nodes.Add(Root.Adress, Root);
        Branches.Add(LastId, main);  
        BranchesToNode.Add(main.Id, Root.Adress);
    }

    public Node AddNode(Branch b)
    {
        var parent = b;
        LastAdress += 1;
        var n = new ChildNode(LastAdress);

        b.AppendNode(n);
        Nodes.Add(LastAdress, n);
        //Branches.Add(LastAdress, []);
        return n;
    }

    public Branch AddNode(int branchId)
    {
        if(!BranchesToNode.ContainsKey(branchId))
            throw new Exception("AddNode: could not find branch id "+branchId);

        Branch parent = Branches[branchId];

        LastAdress += 1;
        var n = new ChildNode(LastAdress);
        parent.AppendNode(n);
        Nodes.Add(LastAdress, n);
        return parent;
    }

        public Branch AddBranch(int adress, string name)
    {
        if(!Nodes.ContainsKey(adress))
            throw new Exception("Tree.AddBranch: The adress "+ adress+" could not be found");

        LastId +=1;
        Branch b = new(LastId,name);

        BranchesToNode.Add(LastId, adress);
        Branches.Add(LastId, b);
        
        return b;
    }

    public List<int> GetAllBranchesIdsAt(int adress)
    {
        var branchesOnNode = BranchesToNode
                                .Where(node => node.Value == adress)
                                .Select(b2n => b2n.Key)
                                .ToList();

        return branchesOnNode;
    }
    public List<Branch> GetAllBranchesAt(int adress)
    {
        var branchesOnNode = BranchesToNode
                                .Where(node => node.Value == adress)
                                .Select(b2n => b2n.Key)
                                .ToList();

        List<Branch> branchesReturn=[];
        foreach (int id in branchesOnNode)
        {
            branchesReturn.Add(Branches[id]);
        }

        return branchesReturn;
    }


    public bool DeleteBranch(Branch b)
    {
        HashSet<int> nodesADelete=[];
        HashSet<int> branchesADelete=[];

        branchesADelete.Add(b.Id);

        foreach(Node n in b.Nodes)
        {
            nodesADelete.Add(n.Adress);
        }

        foreach(int adress in nodesADelete)
        {
            List<Branch> subBranches = GetAllBranchesAt(adress);

            if(subBranches.Count > 0)
            {
                var subBranchesImage = subBranches.ToList();

                foreach(Branch subBranch in subBranchesImage)
                {
                    branchesADelete.Add(subBranch.Id);
                    DeleteBranch(subBranch);
                }
            }
        }

        //DELETE

        foreach(int adress in nodesADelete)
        {            
            UnusedAdresses.Add(adress);
            Nodes.Remove(adress);
        }
        foreach(int id in branchesADelete)
        {
            UnusedIds.Add(id);
            Branches.Remove(id);
            BranchesToNode.Remove(id);
        }

        return true;
    }
    // A TESTER
    public bool DeleteAllBranches(int adress)
    {
        var branchesToDelete = GetAllBranchesAt(adress);
        foreach(Branch b in branchesToDelete)
        {
            DeleteBranch(b);
        }
        return true;
    }

    //TESTER
    public bool DeleteNode(int adress)
    {
        DeleteAllBranches(adress);
        Nodes.Remove(adress);

        return true;
    }
    //TESTER
    public bool DeleteNode(Node n)
    {
        DeleteNode(n.Adress);
        return true;
    }


    public void ShowTree()
    {
        foreach((int adress, Node n) in Nodes)
        {
            Console.WriteLine("NODE ADRESS:"+ adress);

            List<int> ids = GetAllBranchesIdsAt(adress);

            if(ids.Count <= 0)
                continue;

            foreach(int id in ids)
            {
                Console.WriteLine($"\tBRANCH#{id} '{Branches[id].Name.ToUpper()}'");
                Console.WriteLine("\t |");
                Console.WriteLine($"\t |— {string.Join("\r\n \t |— ", Branches[id].Nodes)}");
                Console.WriteLine("\t |");
                Console.WriteLine(" ");
            }
        }
        Console.WriteLine(" ----- ");
        Console.WriteLine("UNUSED ADRESSES: "+string.Join(",", UnusedAdresses));
        Console.WriteLine("UNUSED IDS: "+string.Join(",", UnusedIds));
    }
}

