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
import * as turf from '@turf/turf';


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






    map.on("load", async () => {
      // Replace the 'data.geojson' with the path to your generated GeoJSON file
      map.addSource("skiRuns", {
        type: "geojson",
        data: "http://localhost:3001/ski-runs", // Updated relative path
      });

      //adding mock geojson data
      const geojsonData = {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              -116.143883,
              51.449265
            ],
            [
              -116.144698,
              51.448307
            ],
            [
              -116.144859,
              51.448181
            ],
            [
              -116.145084,
              51.44809
            ],
            [
              -116.145449,
              51.448003
            ],
            [
              -116.145605,
              51.447934
            ],
            [
              -116.146463,
              51.447319
            ],
            [
              -116.146962,
              51.446993
            ],
            [
              -116.147365,
              51.446784
            ],
            [
              -116.147772,
              51.446635
            ],
            [
              -116.149124,
              51.446249
            ],
            [
              -116.15046,
              51.445836
            ],
            [
              -116.150803,
              51.445761
            ],
            [
              -116.151211,
              51.445741
            ],
            [
              -116.151769,
              51.445701
            ],
            [
              -116.153325,
              51.44554
            ]
          ]
        },
        "properties": {
          "name": "Ladies' Downhill",
          "piste:difficulty": "advanced",
          "piste:type": "downhill"
        }
      };

      const pinRoute = geojsonData.geometry.coordinates.reverse();
      const popup = new mapboxgl.Popup({ closeButton: false }).setHTML('<h3>Popup Content</h3>');
      const marker = new mapboxgl.Marker({
        color: 'red',
        scale: 1.8,
        draggable: false,
        pitchAlignment: 'auto',
        rotationAlignment: 'auto'
    })
        marker.setLngLat([-116.143883,51.449265])
        marker.setPopup(popup)
        marker.addTo(map)
        marker.togglePopup();

      // Add a source and layer displaying a point which will be used to highlight the route
      map.addSource('line', {
        type: 'geojson',
        lineMetrics: true,
        data: geojsonData
      });
      map.addLayer({
        id: 'line',
        type: 'line',
        source: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'rgba(0,0,0,0)',
          'line-width': 10
        }
      });

      const animationDuration = 20000;
      const path = turf.lineString(pinRoute);
      const pathDistance = turf.lineDistance(path);
      let start;
      function frame(time) {
        if (!start) start = time;
        const animationPhase = (time - start) / animationDuration;
        if (animationPhase > 1) {
            return;
        }

        // Get the new latitude and longitude by sampling along the path
        const alongPath = turf.along(path, pathDistance * animationPhase)
            .geometry.coordinates;
        const lngLat = {
            lng: alongPath[0],
            lat: alongPath[1]
        };
        const elevation = Math.floor(
          // Do not use terrain exaggeration to get actual meter values
          map.queryTerrainElevation(lngLat, { exaggerated: false })
        );
        
        // Update the popup altitude value and marker location
        popup.setHTML('Altitude: ' + elevation + 'm<br/>');
        marker.setLngLat(lngLat);
        map.setPaintProperty('line', 'line-gradient', [
          'step',
          ['line-progress'],
          'red',
          animationPhase,
          'rgba(255, 0, 0, 0)'   
      ]);
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);

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
