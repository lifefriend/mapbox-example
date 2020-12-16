<!--主地图-->
<template>
  <div id="first-map"></div>
</template>

<script>
import turf from 'turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapbox from 'mapbox-gl';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import LngLat from '../plugin/lngLat';
import MiniMap from '../plugin/miniMap';

export default {
  name: 'Map',
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

    // 添加显示经纬度控件
    mapApp.addControl(new LngLat(), 'top-right');

    // 鹰眼地图
    mapApp.addControl(new MiniMap(mapbox.accessToken), 'bottom-right');

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

    /**绘制完成事件(测量)
     *  @param {string} type 事件类型（绘制完成）
     *  @param {function} fn 事件触发后的响应函数
     */
    mapApp.on('draw.create', (e) => {
      //绘制的图形类型
      var type = e.features[0].geometry.type;
      let coords = null;
      let popPosition = null;
      //判断类型
      switch (type) {
        //线类型
        case 'LineString':
          //获取线的几何
          var linestring = e.features[0].geometry;
          //调用turf的距离计算方法，计算长度
          var wholeLength = turf.lineDistance(linestring) + 'km';
          //获取折线对象的最后一个点坐标
          coords = e.features[0].geometry.coordinates;
          popPosition = coords[coords.length - 1];
          //在该位置添加Popup弹框，显示长度（单位千米）
          new mapbox.Popup({ closeOnClick: false })
            .setLngLat(popPosition)
            .setHTML('<b>长度为：' + wholeLength + '</b>')
            .addTo(mapApp);
          break;
        //多边形类型
        case 'Polygon':
          //获取多边形几何
          var polygonArea = e.features[0].geometry;
          //调用turf的面积计算方法，计算面积
          var area = turf.area(polygonArea) / 1000000 + '平方公里';
          //获取多边形对象的最后一个点坐标
          coords = e.features[0].geometry.coordinates[0];
          popPosition = coords[coords.length - 2];
          //在该位置添加Popup弹框，显示面积
          new mapbox.Popup({ closeOnClick: false })
            .setLngLat(popPosition)
            .setHTML('<b>面积为：' + area + '</b>')
            .addTo(mapApp);
          break;
      }
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
