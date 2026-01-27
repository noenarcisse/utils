const fs = require('fs');

const currentDirectory = __dirname+"\\";

const search = process.argv[2];
const replace = process.argv[3];
const searchRegex = new RegExp(search, "g");

if(!search || !replace)
{
    console.log("ARGS error");
    process.exit(1);
}


console.log(`
SEARCH:\t\t\t${search}
REPLACE:\t\t${replace}
FOLDER:\t\t\t${currentDirectory}
`);

const files = fs.readdirSync(currentDirectory);


for(const [key, value] of files.entries())
{
    if(searchRegex.test(value))
    {
        const newFileName = value.replace(searchRegex, replace);
        fs.renameSync(currentDirectory+value, currentDirectory+newFileName);

        console.log(key+".\t\t\t"+value+" > "+newFileName);
        continue;
    }
    console.log(key+".\t\t\t"+value);
}


