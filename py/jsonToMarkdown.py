import sys
import os.path

#for later
args = sys.argv

if len(args) <= 0 :
    raise "Aie aie aie il manque probablement un argument je crois"

# args[0] = le script qui se voit lui meme
fileName = args[1]
ext1, ext2 = ".json", ".md"
filePath = fileName+ext1
saveFilePath = fileName+ext2

if not os.path.exists(filePath) :
    raise FileNotFoundError("Aie fichier pas trouvé"+filePath)

content = ""

with open(file=filePath, mode="r", encoding="utf8") as reader :

    for line in reader.readlines() :
        rightStripped = line.strip("\n")
        nWhiteSpaces = len(line) - len(line.lstrip(" "))

        content += "&nbsp;"*nWhiteSpaces+rightStripped.lstrip(" ")+"<br>\n"


if len(content) <=0:
    raise "Aie aie content est vide"
print(content)

with open(file=saveFilePath, mode="w", encoding="utf8") as writer :
    writer.write(content)