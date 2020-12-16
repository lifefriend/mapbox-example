import { from } from "core-js/fn/array";
import { genID } from './util'
/**添加点至地图中显示
*/
export function addPoint(map) {
  //用geojson创建一个点
  const pointId = "Point" + genID();
  const geometryPoint = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [90, 40]
    }
  };
  //将点添加到一个图层中，在地图中显示
  map.addLayer({
    //此id可随意设置，但是要唯一
    "id": pointId,
    //指定类型为点
    "type": "circle",
    //设置数据来源
    "source": {
      "type": "geojson",
      "data": geometryPoint
    },
    //设置绘制参数
    "paint": {
      //设置点的半径，像素单位
      "circle-radius": 15,
      //设置点的填充颜色
      "circle-color": 'red'
    }
  });
  return pointId;
}

/**添加线至地图中显示
*/
export function addLine(map) {
  const lineId = "Line" + genID();
  //用geojson创建一条线
  const geometryLine = {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [[82, 35], [95, 25]]
    }
  };
  //将线添加到一个图层中，在地图中显示
  map.addLayer({
    //此id可随意设置，但是要唯一
    "id": lineId,
    //指定类型为线
    "type": "line",
    //设置数据来源
    "source": {
      "type": "geojson",
      "data": geometryLine
    },
    //设置线型
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    //设置绘制参数
    "paint": {
      //设置线颜色
      "line-color": "green",
      //设置线宽度，像素单位
      "line-width": 4
    }
  });
  return lineId;
}

/**添加多边形至地图中显示
*/
export function addPolygon(map) {
  const PolygonId = "Polygon" + genID();
  //用geojson创建一个多边形
  const geometryPolygon = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[100, 40], [110, 40], [115, 35], [110, 30], [100, 30], [95, 35]]]
      }
    }]
  };
  //将多边形添加到一个图层中，在地图中显示
  map.addLayer({
    //此id可随意设置，但是要唯一
    "id": PolygonId,
    //指定类型为fill（填充区域）
    "type": "fill",
    //设置数据来源
    "source": {
      "type": "geojson",
      "data": geometryPolygon
    },
    //设置绘制参数
    "paint": {
      //设置填充颜色
      "fill-color": 'rgb(219,135,20)',
      //设置透明度
      "fill-opacity": 0.9
    }
  });
  return PolygonId;
}