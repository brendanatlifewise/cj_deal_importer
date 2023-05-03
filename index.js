import csv from 'csv-parser';
import fs from 'fs';
import yargs from 'yargs';
import { AsyncParser } from '@json2csv/node';
import stripBomStream from 'strip-bom-stream';
import { execSync, exec } from 'child_process';
import path from 'path';

const options = yargs(process.argv.slice(2))
 .usage("Usage: --csv <path>")
 .option("c", { alias: "csv", describe: "Path to folder of CSVs with CJ data", type: "string", demandOption: true })
 .argv;

 // Take folder name path from args
const folder = `${options.csv}`;

console.log('NEW RUN \n\n\n\n\n\n\n\n');


fs.readdir(folder, (err, files) => {
    files.forEach((file) => { 
      
        const filePath = `${folder}/${file}`;
        
        let cleanImgSrc;
        fs.readFile(filePath,'utf8',  (err,data) =>{
           
            var dataArray = data.split(',');
            var noEmptyFields = dataArray.filter(x => x != '');
            cleanImgSrc = noEmptyFields.map((x) => {
                if(x.includes('img src=')) {
                    
                    
                 var match = x.match(/img src[^=]*=""([^""]+)""/);
           
                 return match ? match[1] : x; 
                }
                return x;
            });
            console.log(`FILE PATH: ${filePath}`);
            fs.writeFile(filePath, cleanImgSrc.join(','), null, ()=>{});
            exec(`mongoimport --uri "mongodb+srv://davie-deals-node-server:cvTrNbdzA7sAvNIj@davie-deals.ltkcsre.mongodb.net/development?authSource=admin&replicaSet=atlas-ofdyqw-shard-0&ssl=true" --collection deals --headerline --type csv ${filePath}`);
        });

        
    });
});
    
