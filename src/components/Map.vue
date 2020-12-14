<template>
  <div id="first-map"></div>
</template>

<script>
import mapbox from 'mapbox-gl';

export default {
  name: 'Map',
  mounted() {
    mapbox.accessToken =
      'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A';
    const mapApp = new mapbox.Map({
      container: 'first-map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [120.57229, 31.28505],
      zoom: 9,
    });
    console.log(mapApp);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#first-map {
  padding: 0%;
  margin: 0%;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
