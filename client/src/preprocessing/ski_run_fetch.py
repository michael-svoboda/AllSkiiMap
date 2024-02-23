import requests
import json
import os
from geojson import LineString, Feature, FeatureCollection, Point

# Define the bounding box for Alberta in EPSG:4326 format
bbox_alberta = "48.734455, -122.354736, 53.41608, -113.082275"

print("BOUNDING BOX:", bbox_alberta)

# Overpass QL query to retrieve ski runs in the specified bounding box
overpass_query = f"""
[out:json];
(
  way["piste:type"="downhill"]({bbox_alberta});
);
out body;
>;
out skel qt;
"""

# Overpass API endpoint
overpass_url = "https://overpass-api.de/api/interpreter"

# Make the request to the Overpass API
response = requests.post(overpass_url, data=overpass_query)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the JSON response
    data = response.json()

    # Separate ways and nodes
    ways = [element for element in data.get("elements", []) if element["type"] == "way"]
    nodes = [element for element in data.get("elements", []) if element["type"] == "node"]

    # Convert ways to GeoJSON LineString features
    way_features = []
    for way in ways:
        coordinates = [
            (node["lon"], node["lat"]) for node_id in way["nodes"]
            if (node := next((node for node in nodes if node["id"] == node_id), None))
        ]
        if coordinates:
            way_features.append(
                Feature(geometry=LineString(coordinates), properties=way["tags"])
            )

    # Convert nodes to GeoJSON Point features
    node_features = [
        Feature(geometry=Point((node["lon"], node["lat"])), properties={})
        for node in nodes
    ]

    # Combine features into a FeatureCollection
    feature_collection = FeatureCollection(way_features + node_features)

    # Create a "data" folder if it doesn't exist
    os.makedirs("data", exist_ok=True)

    # Save the fetched data as a GeoJSON file
    geojson_path = os.path.join("data", "ski_runs_alberta.geojson")
    with open(geojson_path, "w") as geojson_file:
        json.dump(feature_collection, geojson_file, indent=2)

    print(f"Data saved successfully to {geojson_path}")

    # Extract and print relevant information about each ski run
    #for way in ways:
        #print(f"Ski Run ID: {way['id']}")
        # Add more properties as needed

else:
    print(f"Error: Unable to fetch data. Status Code: {response.status_code}")
    print(response.text)
