import fs from "fs";
import csv from "csv-parser";

export const csvParse = <TRowData>(
    path: string,
    optionsOrHeaders?: csv.Options | readonly string[] | undefined
) => {
    return new Promise<TRowData[]>((resolve, reject) => {
        const array: TRowData[] = [];
        fs.createReadStream(path)
            .pipe(csv(optionsOrHeaders))
            .on("data", (x) => {
                array.push(x);
            })
            .on("end", () => {
                resolve(array);
            })
            .on("error", reject);
    });
};
