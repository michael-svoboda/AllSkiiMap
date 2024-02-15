import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const MapboxSkiRuns = () => {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGFlbC1zdm9ib2RhIiwiYSI6ImNsZWd0bHQ0MzBhYWEzcXBoMzQ0bnF5djgifQ.17y-XKuBkorntWJCXiEWRw';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-115, 51], // Adjust the center to focus on Alberta or your desired location
      zoom: 6,
    });

    map.on('load', () => {
      // Replace the 'data.geojson' with the path to your generated GeoJSON file
      map.addSource('skiRuns', {
        type: 'geojson',
        data: 'http://localhost:3001/ski-runs', // Updated relative path
      });

      map.addLayer({
        id: 'lineStringsOutline',
        type: 'line',
        source: 'skiRuns',
        paint: {
          'line-width': 6, // Adjust the width to create a visible outline
          'line-color': 'white', // Color for the white outline
          'line-opacity': 0.6, // Adjust the opacity as needed
        },
      });

      map.addLayer({
        id: 'skiRuns-line',
        type: 'line',
        source: 'skiRuns',
        paint: {
          'line-color': [
            'match',
            ['get', 'piste:difficulty'],
            'easy', 'green',        // Color for 'easy' difficulty
            'intermediate', 'blue', // Color for 'intermediate' difficulty
            'advanced', 'red',      // Color for 'advanced' difficulty
            'expert','black',
            'gray',                   // Default color for unknown difficulty levels
          ],
          'line-width': 2,
        },
      });

      map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
      });

      // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      

    });

    // Cleanup on component unmount
    return () => map.remove();
  }, []);

  return <div id="map" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />;
};

export default MapboxSkiRuns;