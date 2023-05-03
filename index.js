import fs from 'fs';
import yargs from 'yargs';
import { exec } from 'child_process';

const options = yargs(process.argv.slice(2))
 .usage("Usage: --csv <path>")
 .option("c", { alias: "csv", describe: "Path to folder of CSVs with CJ data", type: "string", demandOption: true })
 .argv;

 // Take folder name path from args
const folder = `${options.csv}`;

fs.readdir(folder, (_, files) => {
    files.forEach((file) => { 
      
        const filePath = `${folder}/${file}`;
        
        fs.readFile(filePath,'utf8',  (_, data) =>{
            const dataArray = data.split(',');
            const noEmptyFields = dataArray.filter(x => x != '');
            const cleanImgSrc = noEmptyFields.map((x) => {
                const match = x.match(/img src[^=]*=""([^""]+)""/);
                return match ? match[1] : x;
            });
            console.log(`FILE PATH: ${filePath}`);
            fs.writeFile(filePath, cleanImgSrc.join(','), null, ()=>{});
            exec(`mongoimport --uri "mongodb+srv://davie-deals-node-server:cvTrNbdzA7sAvNIj@davie-deals.ltkcsre.mongodb.net/development?authSource=admin&replicaSet=atlas-ofdyqw-shard-0&ssl=true" --collection deals --headerline --type csv ${filePath}`);
        });        
    });
});