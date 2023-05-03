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
      
        const filePath = `${folder}//${file}`;
        

        fs.readFile(filePath,'utf-8',  (err,data) =>{
           
            var dataArray = data.split(',');
            var noExtraCommas = dataArray.filter(x => x != '');
            var cleanImgSrc = noExtraCommas.map((x) => {
                if(x.includes('img src=')) {
                 console.log(x.match(/img src[^=]*="([^"]+)"/));
                 return null
                }
                return x;
            });
            //console.log(cleanImgSrc);
        
        });
    });
});
    
