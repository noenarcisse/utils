open System.IO
//unused, mut dictionnary precedent
open System.Collections.Generic
//WIP script auto generate md files

//alias unused
//type FilePath = string
//s'il faut faire ca facile type File = {name string, ext string} pour pas appeler des func en boucle sur un path

let excludes = Set.ofList  [".git" ; "README.md" ; "package"]
let searchOpt = SearchOption.AllDirectories

let getFileName (path:string) = 
    Path.GetFileNameWithoutExtension(path)

let getFileExt (path:string) = 
    Path.GetExtension(path)

let containsExclude (fileName : string) =
    excludes |> Set.exists(fun e -> fileName.Contains(e)) 

let listDirs path= 
    Directory.EnumerateDirectories(path , "*", searchOpt)
    |> Seq.filter (containsExclude >> not)
    |> Seq.toList

let listFilesFlat (list : string list) =
    list 
    |> List.collect (fun e -> Directory.EnumerateFiles e |> Seq.toList) //flatmap
    |> List.filter(fun f -> containsExclude f|> not)

//for dictionnary sorting
let getLanguageDir (path:string) =
    //Path.GetRelativePath ? pour safe
    path.[2..] // ghetto, c'est vraiment pour forcer le ./ en moins du nom comme je part en path rel
    |> Path.GetDirectoryName
    |> fun pathDir -> pathDir.Split Path.DirectorySeparatorChar
    |> Array.head


let createDict (paths: string list) =
    paths 
    |> List.toSeq
    |> Seq.groupBy getLanguageDir
    |> Seq.map(fun (dir, fileNames)-> dir, fileNames |> Seq.toList)
    |> Map.ofSeq
        
let displayFileWithExt (path:string) = $"{getFileName path}{getFileExt path}"


printfn "FILES MAP:"

"."
|> listDirs  
|> listFilesFlat
|> createDict
|> Map.iter(fun k v -> printfn "[%s] %A" k (v|>List.map(fun f -> displayFileWithExt f)))