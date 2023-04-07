# Node.js Airport Route Finder API

This project is a JSON over HTTP API endpoint that calculates the shortest route between two airports, given their IATA/ICAO codes. It returns the shortest route based on the geographical distance in kilometers.

## Description

The API is designed to find a route between two airports with the following constraints:

-   The route can consist of at most 4 legs/flights (e.g., A->1->2->3->B or A->1->B).
-   The route should be the shortest in terms of geographical distance (in kilometers).

**Bonus Feature**: The API also allows changing airports during layovers within a 100km radius. For example, A->1->2=>3->4->B, where "2=>3" is a change of airports done via ground transportation. These switches are not considered part of the legs/layover/hop count, but their distance should be reflected in the final distance calculated for the route.

## Installation

To set up the project, follow these steps:

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Optional. Update `data\routes.csv` and `data\airports.csv` with relevant data. Run `npm run build-graph` to generate the graph data that the server will use.
4. Run `npm start` to start the server.

## Usage

Send a `POST` request to the `/route` endpoint with the following JSON request body:

```json
{
    "source": "IATA code of the origin airport",
    "target": "IATA code of the destination airport"
}
```

Example request:

```json
{
    "source": "LAX",
    "target": "JFK"
}
```

Example response:

```json
{
    "start": "LAX",
    "finish": "JFK",
    "distance": 4154,
    "path": [
        {
            "means": "AIR",
            "from": "LAX",
            "to": "ORD",
            "distance": 2800
        },
        {
            "means": "AIR",
            "from": "ORD",
            "to": "JFK",
            "distance": 1354
        }
    ]
}
```

## License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).