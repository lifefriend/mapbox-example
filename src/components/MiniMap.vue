<!--鹰眼地图-->
<template>
  <div
    style="position: absolute;bottom:0px;right: 0px;z-index: 200;width: 308px;height:208px;background-color: #fff;border: 1px solid #555;border-radius: 1px;"
  >
    <div
      id="overview"
      style="background-color: #fff;width:300px;height:200px;margin: 3px 3px 3px 3px;border:1px solid #7b98bc"
    ></div>
  </div>
</template>

<script>
import mapbox from 'mapbox-gl';
import turf from 'turf';

export default {
  name: 'MiniMap',
  props: {
    mapApp: Object,
  },
  data() {
    return {
      map_x: null, //地图的x坐标
      map_y: null, //地图的y坐标
      map_zoom: null, //地图的比例尺
      overView: null,
    };
  },
  methods: {
    init() {
      mapbox.accessToken =
        'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A';
      const overView = new mapbox.Map({
        container: 'overview',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [114.318312, 30.47259],
        zoom: 5,
      });
      overView.scrollZoom.disable();
      overView.dragPan.disable();
      this.overView = overView;

      const map = this.mapApp;
      this.initextent();
      map.on('drag', this.mapdrag);
      map.on('zoom', this.mapzoom);

      const canvas = map.getCanvasContainer();
      overView.on('mousedown', 'maine', (e) => {
        e.preventDefault();
        canvas.style.cursor = 'grab';
        overView.on('mousemove', this.onMove);
        overView.once('mouseup', this.onUp);
      });
    },
    initextent() {
      const map = this.mapApp;
      const overview = this.overView;
      const extent = map.getBounds();
      const coor = [
        [
          [extent._sw.lng, extent._ne.lat],
          [extent._ne.lng, extent._ne.lat],
          [extent._ne.lng, extent._sw.lat],
          [extent._sw.lng, extent._sw.lat],
          [extent._sw.lng, extent._ne.lat],
        ],
      ];
      const polygon = turf.polygon(coor);
      overview.on('load', function() {
        overview.addSource('maine', {
          type: 'geojson',
          data: polygon,
        });
        overview.addLayer({
          id: 'maine',
          type: 'fill',
          source: 'maine',
          paint: {
            'fill-color': 'red',
            'fill-opacity': 0.2,
            'fill-outline-color': 'red',
          },
          layout: {
            visibility: 'visible',
          },
        });
      });
    },
    // 拖拽
    mapdrag() {
      const map = this.mapApp;
      const overview = this.overView;
      this.map_x = map.getCenter().lng;
      this.map_y = map.getCenter().lat;
      overview.setCenter([this.map_x, this.map_y]);
      this.extent();
    },
    // 放大缩小
    mapzoom() {
      const map = this.mapApp;
      const overview = this.overView;
      this.map_zoom = map.getZoom();
      overview.setZoom(this.map_zoom - 4);
      this.map_x = map.getCenter().lng;
      this.map_y = map.getCenter().lat;
      overview.setCenter([this.map_x, this.map_y]);
      this.extent();
    },
    //移动大图，鹰眼始终在中间
    extent() {
      const map = this.mapApp;
      const overview = this.overView;
      var extent = map.getBounds();
      var coor = [
        [
          [extent._sw.lng, extent._ne.lat],
          [extent._ne.lng, extent._ne.lat],
          [extent._ne.lng, extent._sw.lat],
          [extent._sw.lng, extent._sw.lat],
          [extent._sw.lng, extent._ne.lat],
        ],
      ];
      var polygon = turf.polygon(coor);
      overview.getSource('maine').setData({
        type: 'FeatureCollection',
        features: [polygon],
      });
    },
    onMove(e) {
      const map = this.mapApp;
      var coords = e.lngLat;
      var canvas = map.getCanvasContainer();
      canvas.style.cursor = 'grab';
      map.setCenter(coords);
      this.extent();
    },
    onUp(/* e */) {
      const overview = this.overView;
      // const map = this.mapApp;
      // const coords = e.lngLat;
      // const canvas = map.getCanvasContainer();
      overview.off('mousemove', this.onMove);
      overview.off('touchmove', this.onMove);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
