open System.IO

//WIP script auto generate md files

let excludes = Set.ofList  [".git"]
let searchOpt = SearchOption.AllDirectories

let containsExclude (fileName : string) =
    excludes |> Set.exists(fun e -> fileName.Contains(e)) 

let listDirs path= 
    Directory.EnumerateDirectories(path , "*", searchOpt)
    |> Seq.filter(fun f -> f |> containsExclude |> not)
    |> Seq.toList


let displayList list =
    list
    |> List.iter(fun e -> printfn "%s" e)


let listFilesFlat (list : string list) =
    list 
    |> List.collect (fun e -> Directory.EnumerateFiles(e) |> Seq.toList) //flatmap


printfn "DIRS:"
displayList (listDirs ".")

printfn "FILES:"
displayList (listDirs "." |> listFilesFlat)