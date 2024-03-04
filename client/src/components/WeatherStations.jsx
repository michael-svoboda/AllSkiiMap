import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import fernieImage from "../images/fernie.png"
import kickingHorseImage from "../images/kicking-horse.png"
import nakiskaImage from "../images/nakiska.png"
import sunshineImage from "../images/sunshine.png"
import lakeLouiseImage from "../images/lakeLouise.png"
import revelstokeImage from "../images/revelstoke.png"
import panoramaImage from "../images/panorama.png"
import norquayImage from "../images/norquay.png"
import kimberleyImage from "../images/kimberley.png"
import silverStarImage from "../images/silverStar.png"
import sunPeaksImage from "../images/sunPeaks.png"
import bigWhiteImage from "../images/bigWhite.png"

const MapboxSkiRuns = () => {
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWljaGFlbC1zdm9ib2RhIiwiYSI6ImNsZWd0bHQ0MzBhYWEzcXBoMzQ0bnF5djgifQ.17y-XKuBkorntWJCXiEWRw";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-115, 51], // Adjust the center to focus on Alberta or your desired location
      zoom: 6,
      pitch: 45
    });

    const zoom = (index, angle) => { 
      map.flyTo({
        center: index,
        zoom: 12.5,
        essential: true, 
        bearing: angle,
      });
    }

    function loadImageAndAddToMap(map, imageUrl, imageName, coordinates, layerId, bearing, source, iconSize) {
      map.loadImage(imageUrl, (error, image) => {
        if (error) throw error;
    
        // Add the image to the map style.
        map.addImage(imageName, image);
    
        // Add a data source containing one point feature.
        map.addSource(source, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: coordinates,
                },
              },
            ],
          },
        });
    
        // Add a layer to use the image to represent the data.
        map.addLayer({
          id: layerId,
          type: "symbol",
          source: source, // reference the data source
          layout: {
            "icon-image": imageName, // reference the image
            "icon-size": iconSize,
          },
        });
    
        // Add click event listener for the 'points' layer
        map.on("click", layerId, (e) => {
          // Display the message or handle the click event as needed
          //zoom
          zoom(coordinates, bearing);
        });
      });
    }




    map.on("load", () => {
      // Replace the 'data.geojson' with the path to your generated GeoJSON file
      map.addSource("skiRuns", {
        type: "geojson",
        data: "http://localhost:3001/ski-runs", // Updated relative path
      });

      map.addLayer({
        id: "lineStringsOutline",
        type: "line",
        source: "skiRuns",
        paint: {
          "line-width": 6, // Adjust the width to create a visible outline
          "line-color": "white", // Color for the white outline
          "line-opacity": 0.6, // Adjust the opacity as needed
        },
      });

      map.addLayer({
        id: "skiRuns-line",
        type: "line",
        source: "skiRuns",
        paint: {
          "line-color": [
            "match",
            ["get", "piste:difficulty"],
            "easy",
            "green", // Color for 'easy' difficulty
            "intermediate",
            "blue", // Color for 'intermediate' difficulty
            "advanced",
            "red", // Color for 'advanced' difficulty
            "expert",
            "black",
            "gray", // Default color for unknown difficulty levels
          ],
          "line-width": 2,
        },
      });

      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      

      

      // add the DEM source as a terrain layer with exaggerated height
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      
      // Usage
      loadImageAndAddToMap(map, fernieImage, "fernie", [-115.0873, 49.4627], "Ski-marker1", -100, "point1", 0.05);
      loadImageAndAddToMap(map, kickingHorseImage, "kickinghorse", [-117.0483, 51.2976], "Ski-marker2", -100, "point2", 0.10);
      loadImageAndAddToMap(map, nakiskaImage, "nakiska", [-115.1511, 50.9427], "Ski-marker3", -40, "point3", 0.15);
      loadImageAndAddToMap(map, sunshineImage, "sunshine", [-115.7765, 51.0785], "Ski-marker4", 130, "point4", 0.10);
      loadImageAndAddToMap(map, lakeLouiseImage, "lakelouise", [-116.1622, 51.4419], "Ski-marker5", 40, "point5", 0.077);
      loadImageAndAddToMap(map, revelstokeImage, "revelstoke", [-118.1631, 50.9584], "Ski-marker6", 90, "point6", 0.10);
      loadImageAndAddToMap(map, panoramaImage, "panorama", [-116.238157, 50.460374], "Ski-marker7", 150, "point7", 0.077);
      loadImageAndAddToMap(map, norquayImage, "norquay", [-115.6068, 51.2053], "Ski-marker8", 220, "point8", 0.05);
      loadImageAndAddToMap(map, kimberleyImage, "kimberley", [-116.0048, 49.6879], "Ski-marker9", 220, "point9", 0.05);
      loadImageAndAddToMap(map, silverStarImage, "silverStar", [-119.0610, 50.3598], "Ski-marker10", 60, "point10", 0.08);
      loadImageAndAddToMap(map, sunPeaksImage, "sunPeaks", [-119.8891, 50.8837], "Ski-marker11", 60, "point11", 0.08);
      loadImageAndAddToMap(map, bigWhiteImage, "bigWhite", [-118.93528, 49.7160], "Ski-marker12", 30, "point12", 0.08);



    });

    // Cleanup on component unmount
    return () => map.remove();
  }, []);

  return (
    <div
      id="map"
      style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
    />
  );
};

export default MapboxSkiRuns;
