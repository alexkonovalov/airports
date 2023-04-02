import fs from "fs";
import csv from "csv-parser";
import { getDistance } from "geolib";
import { AirportRowData } from "./AirportRowData";
import {
    AIRPORTS_SOURCE_PATH,
    NEIGBOUR_AIRPORTS_SOURCE_PATH,
} from "./constants";
import { createWriteStream } from "fs";
import { stringify } from "csv-stringify";

const airportsList: { IATA: string; latitude: string; longitude: string }[] =
    [];
const neighbors: { airport1: string; airport2: string; distance: number }[] =
    [];

fs.createReadStream(AIRPORTS_SOURCE_PATH)
    .pipe(csv())
    .on(
        "data",
        ({
            IATA,
            Latitude: latitude,
            Longitude: longitude,
        }: AirportRowData) => {
            if (IATA !== "\\N") {
                airportsList.push({ IATA, latitude, longitude });
            }
        }
    )
    .on("end", () => {
        console.log("prepare neighbours");
        performance.mark("example-start");
        airportsList.forEach((airport1, i) => {
            airportsList.forEach((airport2, j) => {
                if (i !== j) {
                    const distance = getDistance(
                        {
                            latitude: airport1.latitude,
                            longitude: airport1.longitude,
                        },
                        {
                            latitude: airport2.latitude,
                            longitude: airport2.longitude,
                        }
                    );

                    if (distance / 1000 <= 100) {
                        neighbors.push({
                            airport1: airport1.IATA,
                            airport2: airport2.IATA,
                            distance,
                        });
                    }
                }
            });
        });

        performance.mark("example-end");
        console.log({
            perf: performance.measure(
                "example",
                "example-start",
                "example-end"
            ),
        });

        console.log({ neighbors });

        // Write neighbors object to a new CSV file
        const outputCsvStream = createWriteStream(
            NEIGBOUR_AIRPORTS_SOURCE_PATH
        );
        const csvStringifier = stringify({
            header: true,
            columns: {
                airport1: "IATA_1",
                airport2: "IATA_2",
                distance: "Distance",
            },
        });

        csvStringifier.pipe(outputCsvStream);
        neighbors.forEach((neighbor) => {
            csvStringifier.write(neighbor);
        });
        csvStringifier.end();

        console.log(`Neighbors exported`);
    });
