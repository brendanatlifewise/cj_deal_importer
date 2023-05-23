import fs from 'fs';
import yargs from 'yargs';
import { exec } from 'child_process';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const options = yargs(process.argv.slice(2))
 .usage("Usage: --csv <path>")
 .option("c", { alias: "csv", describe: "Path to folder of CSVs with CJ data", type: "string", demandOption: true })
 .argv;

 // Take folder name path from args
const folder = `${options.csv}`;

// TODO: insert davie category id instead of string

fs.readdir(folder, (_, files) => {
    files.forEach((file) => { 
        // skip hidden files
        // Array.from safer than charAt, see: https://stackoverflow.com/a/3427148/2036427
        if(Array.from(file)[0] == '.') return;

        const filePath = `${folder}/${file}`;
        console.log(filePath);
        
        fs.readFile(filePath,'utf8',  (_, data) =>{
            data = data.trim();
            const records = parse(data, { 
                columns: true, 
                skip_empty_lines: true
            });

            // remove empty columns
            // and clean img src
            records.forEach((r) => {
                delete r[''];
                const match = r['imgSrc'].match(/img src[^=]*="([^""]+)"/);
                if(match) r['imgSrc'] = match[1];
            });
        
            const columns = Object.keys(records[0])
            console.log(`columns: ${columns}`);

            const csvString = stringify(records, { columns : columns, header:true })
       
            fs.writeFile(filePath, csvString, null, ()=>{});
            exec(`mongoimport --uri "mongodb+srv://davie-deals-node-server:cvTrNbdzA7sAvNIj@davie-deals.ltkcsre.mongodb.net/development?authSource=admin&replicaSet=atlas-ofdyqw-shard-0&ssl=true" --collection deals --headerline --type csv ${filePath}`);
        });        
    });
});

// var isUnixHiddenPath = function (path) {
//     return (/(^|\/)\.[^\/\.]/g).test(path);
// };