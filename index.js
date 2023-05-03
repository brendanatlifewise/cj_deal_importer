import csv from 'csv-parser';
import fs from 'fs';
import yargs from 'yargs';
import { AsyncParser } from '@json2csv/node';
import stripBomStream from 'strip-bom-stream';
import { execSync } from 'child_process';

const options = yargs(process.argv.slice(2))
 .usage("Usage: --csv <path>")
 .option("c", { alias: "csv", describe: "Path to folder of CSVs with CJ data", type: "string", demandOption: true })
 .argv;

 // Take folder name path from args
const folder = `${options.csv}`;


fs.readdir(folder, (err, files) => {
    files.forEach((file) => { 
      // Scope ensures each file goes into a single data array instead of all files into one data array.
      const fileData = []; 
      const filePath = `${folder}//${file}`;
fs.createReadStream(filePath)
  .pipe(stripBomStream())
  .pipe(csv({mapValues: ({header, index, value}) => {
    if(index == 0 && header == '') throw Error('Empty row')
    // Use regex capture group (located at index 1 of array) to replace imgSrc tag with url.
    if(header == 'imgSrc') {
      const regexMatch = value.toString().match(/img src[^=]*="([^"]+)"/);
      return regexMatch ? regexMatch[1] : value;
    };
    return value;
  }}))
  .on("data", function (row) {
    fileData.push(row);

  })
  .on("end", async function () {
    // AsyncParser parses the fileData and pipes it out to the file via the write stream.
    new AsyncParser().parse(fileData).pipe(fs.createWriteStream(filePath))
    const command = `mongoimport --uri "mongodb+srv://davie-deals-node-server:cvTrNbdzA7sAvNIj@davie-deals.ltkcsre.mongodb.net/development?authSource=admin&replicaSet=atlas-ofdyqw-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true" --collection deals --headerline --type csv --file ${filePath}`;
    execSync(command);

  })
  .on("error", (err) => console.log(err))
});
});
// foreach file
    // open the file in a stream
        // Edit csv file column 'imgSrc' using node
    // execute shell command
        // mongoimport --uri "mongodb+srv://davie-deals-node-server:cvTrNbdzA7sAvNIj@davie-deals.ltkcsre.mongodb.net/development?authSource=admin&replicaSet=atlas-ofdyqw-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true" --collection deals --headerline --type csv --file <concatenate or interpolate file as last argument of this shell command here>