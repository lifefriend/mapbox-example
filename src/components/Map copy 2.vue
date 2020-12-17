<!--主地图-->
<template>
  <div id="first-map"></div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css';
import mapbox from 'mapbox-gl';
import Mapbox3DTiles from '../plugin/mapbox3DTiles';

// https://github.com/Geodan/mapbox-3dtiles
export default {
  name: 'Map',
  mounted() {
    mapbox.accessToken =
      'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A';
    const map = new mapbox.Map({
      container: 'first-map',
      style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
      center: [4.48732, 51.90217],
      zoom: 14.3,
      bearing: 0,
      pitch: 45,
      hash: true,
    });
    map.on('style.load', function() {
      let rotterdam = new Mapbox3DTiles.Layer({
        id: 'rotterdam',
        url: 'https://geodan.github.io/mapbox-3dtiles/rotterdam/tileset.json',
        color: 0x0033aa,
        opacity: 0.5,
      });
      map.addLayer(rotterdam, 'waterway-label');

      let ahn = new Mapbox3DTiles.Layer({
        id: 'ahn',
        url: 'https://geodan.github.io/mapbox-3dtiles/ahn/tileset.json',
        color: 0x007722,
        opacity: 1.0,
        pointsize: 1.0,
      });
      map.addLayer(ahn, 'rotterdam');
    });
  },
};
</script>

<style>
#first-map {
  padding: 0%;
  margin: 0%;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
a.mapboxgl-ctrl-logo,
.mapboxgl-ctrl-attrib {
  display: none;
}
</style>
