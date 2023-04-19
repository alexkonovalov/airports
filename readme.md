# Node.js Airport Route Finder API

[**GCLOUD RUN LIVE DEMO**](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=LAX&target=MWC)

This project is a JSON over HTTP API endpoint that calculates the shortest route between two airports, given their IATA codes. It returns the shortest route based on the geographical distance in meters.

## Description

The API is designed to find a route between two airports with the following constraints:

-   The route can consist of at most 4 legs/flights (e.g., A->1->2->3->B or A->1->B).
-   The route should be the shortest in terms of geographical distance (in kilometers).

The API also allows changing airports during layovers within a 100km radius. For example, A->1->2=>3->4->B, where "2=>3" is a change of airports done via ground transportation. These switches are not considered part of the legs/layover/hop count, but their distance should be reflected in the final distance calculated for the route.

## Data Sources Disclaimer

This service utilizes the following data sources:

-   [Flight Route Database from Kaggle](https://www.kaggle.com/datasets/open-flights/flight-route-database), last updated in 2017
-   [Airports Geospatial Database from Kaggle](https://www.kaggle.com/datasets/thoudamyoihenba/airports), last updated in 2022

Please be aware that the provided routes may no longer be valid due to the age of the flight route data. The service is intended for informational purposes only and should not be relied upon for up-to-date flight planning or navigation.

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   You have a **Windows/Linux/Mac** machine running the latest version of your preferred operating system.
-   You have installed **Node.js** version `18.x.x` or higher. To check your Node.js version, run `node -v` in your command line.
-   You have installed **npm** version `8.x.x` or higher. To check your npm version, run `npm -v` in your command line.

## Installation

To set up the project, follow these steps:

1. Clone the repository.
2. Navigate to root
3. `npm install`
4. `npm run build --workspace @airport-routes/server`
5. `npm run start --workspace @airport-routes/server`

Optional. If you want to update data used by service,

1. Update `packages\build-graph\input-data\routes.csv` and `packages\build-graph\input-data\airports.csv` with relevant data.
2. `npm run build --workspace @airport-routes/build-graph`
3. `npm run build-graph --workspace @airport-routes/build-graph`
4. Restart the server.

To run tests:
`npm run test --workspace @airport-routes/server`

## Usage

Send a `GET` request to the `/calculate` endpoint with the following query params:

```json
{
    "source": "IATA code of the origin airport",
    "target": "IATA code of the destination airport"
}
```

## Example 1 (Successful)

Route: Los Angeles International Airport to Milwaukee County's Timmerman Airport

URL: [_/calculate?source=LAX&target=MWC_](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=LAX&target=MWC)

Example response:

```json
{
    "start": "LAX",
    "finish": "MWC",
    "distance": 2845099,
    "path": [
        {
            "means": "AIR",
            "from": "LAX",
            "to": "MKE",
            "distance": 2823750
        },
        {
            "means": "GROUND",
            "from": "MKE",
            "to": "MWC",
            "distance": 21349
        }
    ]
}
```

## Example 2 (<= 4 Leg route not found)

Route: Nuuk Airport to Easter Island Mataveri International Airport

URL: [_calculate?source=GOH&target=IPC_](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=GOH&target=IPC)

Example response:

```json
{
    "start": "GOH",
    "finish": "IPC",
    "distance": "Infinity",
    "path": []
}
```

## Other Examples

1. [John F. Kennedy International Airport to Heathrow Airport](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=JFK&target=LHR)

2. [Tallinn Airport to Zhukovsky International Airport](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=TLL&target=ZIA)

3. [Yellowknife Airport to Bora Bora Airport](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=YZF&target=BOB)

4. [Longyearbyen Airport to Ulaanbaatar Chinggis Khaan International Airport](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=LYR&target=ULN)

5. [Cochabamba Jorge Wilstermann International Airport to Hargeisa Egal International Airport](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=CBB&target=HGA)

6. [Nuuk Airport to Chittagong Shah Amanat International Airport](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=GOH&target=CGP)

7. [La Paz El Alto International Airport to Krasnoyarsk Yemelyanovo International Airport](https://airport-routes-br2xajar3a-lz.a.run.app/calculate?source=LPB&target=KJA)

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
