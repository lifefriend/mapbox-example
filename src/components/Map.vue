<!--主地图-->
<template>
  <div id="first-map">
    <div id="mouse-position"></div>
    <MiniMap :mapApp="mapApp" />
  </div>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css';
import mapbox from 'mapbox-gl';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import MiniMap from './MiniMap';

export default {
  name: 'Map',
  components: {
    MiniMap,
  },
  data() {
    return {
      mapApp: null,
    };
  },
  mounted() {
    mapbox.accessToken =
      'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A';
    const mapApp = new mapbox.Map({
      container: 'first-map',
      //设置地图样式信息
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [114.318312, 30.47259],
      zoom: 9,
    });

    //实例化导航控件
    const nav = new mapbox.NavigationControl({
      //是否显示指南针按钮，默认为true
      showCompass: true,
      //是否显示缩放按钮，默认为true
      showZoom: true,
    });
    //添加导航控件，控件的位置包括'top-left', 'top-right','bottom-left' ,'bottom-right'四种，默认为'top-right'
    mapApp.addControl(nav, 'top-left');

    //实例化比例尺控件
    var scale = new mapbox.ScaleControl({
      //比例尺控制的最大长度,默认100，以像素为单位
      maxWidth: 100,
      //单位，分为'imperial', 'metric','nautical'三种类型，默认为'metric'
      unit: 'metric',
    });
    //添加导航控件，控件的位置包括'top-left', 'top-right','bottom-left' ,'bottom-right'四种，默认为'bottom-left'
    mapApp.addControl(scale, 'bottom-left');

    //添加绘制控件
    const draw = new MapboxDraw({
      //不允许使用键盘交互绘制
      keybindings: false,
      //设置为ture，可按住shift+拉框来拾取图形
      boxSelect: true,
      //点击要素时的响应半径（像素单位）
      clickBuffer: 5,
      //默认控件显示方式。如果设置为true，则会添加所有的绘图控件
      displayControlsDefault: false,
      //添加指定的绘制控件
      controls: {
        //绘制线控件
        line_string: true,
        //绘制多边形控件
        polygon: true,
        //绘制点控件
        point: true,
        //删除图形控件
        trash: true,
      },
    });
    //将绘制控件添加到左上角
    mapApp.addControl(draw, 'top-left');

    //注册鼠标移动事件
    mapApp.on('mousemove', function(e) {
      document.getElementById('mouse-position').innerHTML =
        '经度：' +
        e.lngLat.lng.toFixed(2) +
        '，纬度：' +
        e.lngLat.lat.toFixed(2);
    });
    this.mapApp = mapApp;
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
#mouse-position {
  top: 20px;
  right: 20px;
  color: blue;
  position: absolute;
  bottom: 5px;
  z-index: 1;
  font-size: 16px;
}
a.mapboxgl-ctrl-logo,
.mapboxgl-ctrl-attrib {
  display: none;
}
</style>
