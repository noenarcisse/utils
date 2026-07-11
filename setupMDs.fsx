open System.IO
open System.Text
open System
//WIP script auto generate md files

let stopWatch = System.Diagnostics.Stopwatch.StartNew()


let saveFileName = "./test.md"

let excludes = Set.ofList  [".git" ; "README.md" ; "package"]
let searchOpt = SearchOption.AllDirectories

let getFileName (path:string) = Path.GetFileNameWithoutExtension(path)
let getFileExt (path:string) = Path.GetExtension(path)
let containsExclude (fileName : string) = excludes |> Set.exists fileName.Contains
let displayFileWithExt (path:string) = $"{getFileName path}{getFileExt path}"

let listDirs path= 
    Directory.EnumerateDirectories(path , "*", searchOpt)
    |> Seq.filter (containsExclude >> not)
    |> Seq.toList

// en soi ca fonctionne, mais dans la pratique, go utilise plusieurs fichiers dans un dossier
// pareil en C# sur mon /Tree/ qui utilise plusieurs classes diff pour un meme util
// ca separe tout de maniere un peu absurde ?
let listFilesFlat (dirs : string list) =
    dirs 
    |> List.collect (Directory.EnumerateFiles >> Seq.toList) //flatmap
    |> List.filter(containsExclude >> not)

//for dictionnary sorting
let getLanguageDir (path:string) =
    Path.GetRelativePath("./", path)
    |> Path.GetDirectoryName
    |> fun pathDir -> pathDir.Split Path.DirectorySeparatorChar
    |> Array.head
    //|> fun head ->  printfn "%s" head ; head

let createDict (paths: string list) =
    paths |> List.toSeq
    |> Seq.groupBy getLanguageDir
    |> Seq.map(fun (dir, fileNames)-> dir, fileNames |> Seq.toList)
    |> Map.ofSeq

//TESTING
let formatFiles (f: string -> string) (list : string list) = list |> List.map f

//format pour l'ecriture du fichier .md
let formatDict (dic:Map<string, string list>) =
    let str = StringBuilder()

    let appendLine (str : string) (s : StringBuilder) : StringBuilder =
        s.AppendLine str

    for k in dic.Keys do
        str 
        |> appendLine ("## "+k)
        |> appendLine $"[{k} utilities](https://github.com/noenarcisse/utils/tree/main/{k}/)"
        |> appendLine (String.Join("<br>\n", formatFiles Path.GetFileName dic[k]))
        |> appendLine ""
        |> ignore
    str.ToString()

let saveToFile filepath (dic : Map<string,string list>) =
    let str = dic |> formatDict
    File.WriteAllText(filepath, str)
    dic     

let displayDict =
    Map.iter(fun k v -> printfn "[%s] %A" k (v |> List.map displayFileWithExt))

let tee f x = f x; x

//RESULT
printfn "FILES MAP:"

"."
|> listDirs  
|> listFilesFlat
|> createDict
|> tee displayDict
|> saveToFile saveFileName


stopWatch.Stop()
printfn "Exec time: %.2fms" stopWatch.Elapsed.TotalMilliseconds