import csv from 'csv-parser';
import fs from 'fs';
import yargs from 'yargs';

const options = yargs(process.argv.slice(2))
 .usage("Usage: --csv <path>")
 .option("c", { alias: "csv", describe: "Path to folder of CSVs with CJ data", type: "string", demandOption: true })
 .argv;

 const folder = `${options.csv}`;
 const data = [];

// Take folder name path from args
fs.readdir(folder, (err, files) => {
    files.forEach((file) =>
fs.createReadStream(`${folder}//${file}`)
  .pipe(csv())
  //.pipe(parse({ delimiter: ",", from_line: 1, columns: true }))
  .on("data", function (row) {
    data.push(row);

  })
  .on("end", async function () {
 await Promise.all(data.map(async (r) => {
        const imgSrc = r["ImgSrc"].toString().match(/img src="([^"]+)"/g);
        r["imgSrc"] = imgSrc[0];
        fs.writeFile(`${folder}//${file}`, r, 'utf8', function (err) {
            if (err) return console.log(err);
         });

    }));
   // console.log("Finished reading emails.");
  })
    );
});
// foreach file
    // open the file in a stream
        // Edit csv file column 'imgSrc' using node
    // execute shell command
        // mongoimport --uri "mongodb+srv://davie-deals-node-server:cvTrNbdzA7sAvNIj@davie-deals.ltkcsre.mongodb.net/development?authSource=admin&replicaSet=atlas-ofdyqw-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true" --collection deals --headerline --type csv --file <concatenate or interpolate file as last argument of this shell command here>