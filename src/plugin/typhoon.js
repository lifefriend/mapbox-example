import './typhoon.css';
import mapbox from 'mapbox-gl';
import proj4 from 'proj4';

/**
 * 台风（未测试）
 */
export default class Typhoon {
  constructor(map, typhoonData) {
    this._map = map;
    this.typhoonData = typhoonData;
  }
  addTyphoonLabel(data) {
    const map = this._map;
    const ele = document.createElement('div');
    ele.setAttribute('class', 'typhoon-label');
    ele.innerHTML = data.tfbh + data.name;
    var r = data.points[0];
    const option = {
      element: ele,
      anchor: 'left',
      offset: [10, 0]
    };
    var marker = new mapbox.Marker(option).setLngLat([r.longitude, r.latitude]).addTo(map);
    this.typhoonData[data.tfbh]['label'] = marker;
  }
  addTyphoonCircle(data) {
    const map = this._map;
    var points = data.points;
    var geojson = {
      'type': 'FeatureCollection',
      'features': []
    };
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var center = [p.longitude, p.latitude];
      // 7级风圈
      if (p.radius7 > 0) {
        const coords = this.getCircleCoords(center, p.radius7_quad);
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: coords
          },
          properties: {
            index: i,
            radius: '7'
          }
        });
      }
      // 10级风圈
      if (p.radius10 > 0) {
        const coords = this.getCircleCoords(center, p.radius10_quad);
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: coords
          },
          properties: {
            index: i,
            radius: '10'
          }
        });
      }
      // 12级风圈
      if (p.radius12 > 0) {
        const coords = this.getCircleCoords(center, p.radius12_quad);
        geojson.features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: coords
          },
          properties: {
            index: i,
            radius: '12'
          }
        });
      }
    }
    map.addSource('circle-source-' + data.tfbh, {
      type: 'geojson',
      data: geojson
    });
    map.addLayer({
      id: 'circle-layer-' + data.tfbh,
      type: 'fill',
      source: 'circle-source-' + data.tfbh,
      paint: {
        'fill-color': [
          'match',
          ['get', 'radius'],
          '7',
          '#00bab2',
          '10',
          '#ffff00',
          '#da7341'
        ],
        'fill-opacity': 0.2,
        'fill-outline-color': [
          'match',
          ['get', 'radius'],
          '7',
          '#00bab2',
          '10',
          '#ffff00',
          '#da7341'
        ]
      }
    });
  }
  getCircleCoords(center, radiusData) {
    center = proj4(proj4('EPSG:4326'), proj4('EPSG:3857'), center);
    let _coords = [];
    let _angInterval = 6;
    let _pointNums = 360 / (_angInterval * 4);
    let quadrant = {
      // 逆时针算角度
      '0': 'ne',
      '1': 'nw',
      '2': 'sw',
      '3': 'se'
    };
    for (let i = 0; i < 4; i++) {
      let _r = parseFloat(radiusData[quadrant[i]]) * 1000; // 单位是km
      if (!_r) _r = 0;
      for (let j = i * _pointNums; j <= (i + 1) * _pointNums; j++) {
        let _ang = _angInterval * j;
        let x = center[0] + _r * Math.cos((_ang * Math.PI) / 180);
        let y = center[1] + _r * Math.sin((_ang * Math.PI) / 180);
        var coord = proj4(proj4('EPSG:3857'), proj4('EPSG:4326'), [x, y]);
        _coords.push(coord);
      }
    }

    return [_coords];
  }
  addTyphoonPath(data) {
    const map = this._map;
    var points = data.points;
    var geojsonLive = {
      'type': 'FeatureCollection',
      'features': []
    };
    var geojsonForc = {
      'type': 'FeatureCollection',
      'features': []
    };
    var pts = [[points[0].longitude, points[0].latitude]];
    for (var i = 1; i < points.length; i++) {
      var p = points[i];
      pts.push([p.longitude, p.latitude]);
      geojsonLive.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: pts.concat([])
        },
        properties: {
          index: i,
          type: 'live'
        }
      });
      // 预报路径
      var _p = points[i - 1];
      var _pts = [[_p.longitude, _p.latitude]];
      var _points = _p.forecast[0]['points'];
      for (var j = 0; j < _points.length; j++) {
        var _fp = _points[j];
        _pts.push([_fp.longitude, _fp.latitude]);
      }
      geojsonForc.features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: _pts
        },
        properties: {
          index: i - 1,
          type: 'forc'
        }
      });
    }
    // 实况线
    map.addSource('path-source-live-' + data.tfbh, {
      type: 'geojson',
      data: geojsonLive
    });
    map.addLayer({
      id: 'path-layer-live-' + data.tfbh,
      type: 'line',
      source: 'path-source-live-' + data.tfbh,
      paint: {
        'line-color': '#ffffff',
        'line-width': 3
      }
    });

    // 预报线
    map.addSource('path-source-forc-' + data.tfbh, {
      type: 'geojson',
      data: geojsonForc
    });
    map.addLayer({
      id: 'path-layer-forc-' + data.tfbh,
      type: 'line',
      source: 'path-source-forc-' + data.tfbh,
      paint: {
        'line-color': '#ec5d72',
        'line-width': 1,
        'line-dasharray': [5, 3]
      }
    });
  }
  addTyphoonPoints(data) {
    const map = this._map;
    var points = data.points;
    var geojsonLive = {
      'type': 'FeatureCollection',
      'features': []
    };
    var geojsonForc = {
      'type': 'FeatureCollection',
      'features': []
    };
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      p.index = i;
      geojsonLive.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.longitude, p.latitude]
        },
        properties: p
      });
      // 预报点
      var forcPoints = p.forecast[0]['points'];
      for (var j = 0; j < forcPoints.length; j++) {
        var _p = forcPoints[j];
        _p.index = i;
        geojsonForc.features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [_p.longitude, _p.latitude]
          },
          properties: _p
        });
      }
    }

    var paint = {
      'circle-color': [
        'step',
        ['get', 'speed'],
        'rgba(153, 255, 153, .9)',
        17.2,
        'rgba(102, 204, 255, .9)',
        24.5,
        'rgba(255, 255, 102, .9)',
        32.7,
        'rgba(253, 139, 0, .9)',
        41.5,
        'rgba(255, 51, 0, .9)',
        50.1,
        'rgba(255, 0, 255, .9)'
      ],
      'circle-radius': 6,
      'circle-stroke-width': 0
    };
    // 实况点
    map.addSource('points-source-live-' + data.tfbh, {
      type: 'geojson',
      data: geojsonLive
    });
    map.addLayer({
      id: 'points-layer-live-' + data.tfbh,
      type: 'circle',
      source: 'points-source-live-' + data.tfbh,
      paint: paint
    });

    // 预报点
    map.addSource('points-source-forc-' + data.tfbh, {
      type: 'geojson',
      data: geojsonForc
    });
    map.addLayer({
      id: 'points-layer-forc-' + data.tfbh,
      type: 'circle',
      source: 'points-source-forc-' + data.tfbh,
      paint: paint
    });
  }
  playTyphoon() {
    const map = this._map;
    var tfbh = this.typhoonPlay;
    var index = this.typhoonData[tfbh]['playIndex'];
    // 台风风圈
    map.setPaintProperty(
      'circle-layer-' + tfbh,
      'fill-opacity',
      [
        'match',
        ['get', 'index'],
        index,
        0.2,
        0
      ]
    );
    // 实况线
    map.setPaintProperty(
      'path-layer-live-' + tfbh,
      'line-opacity',
      [
        'match',
        ['get', 'index'],
        index,
        0.65,
        0
      ]
    );
    // 预报线
    map.setPaintProperty(
      'path-layer-forc-' + tfbh,
      'line-opacity',
      [
        'match',
        ['get', 'index'],
        index,
        1,
        0
      ]
    );
    // 实况点
    map.setPaintProperty(
      'points-layer-live-' + tfbh,
      'circle-opacity',
      [
        'step',
        ['get', 'index'],
        1,
        index + 0.1,
        0
      ]
    );
    // 预报点
    map.setPaintProperty(
      'points-layer-forc-' + tfbh,
      'circle-opacity',
      [
        'match',
        ['get', 'index'],
        index,
        1,
        0
      ]
    );
  }
  play() {
    var tfbh = this.typhoonPlay;
    this.typhoonData[tfbh]['playFlag'] = setInterval(function () {
      this.typhoonData[tfbh]['playIndex']++;
      var len = this.typhoonData[tfbh]['data']['points'].length;
      if (this.typhoonData[tfbh]['playIndex'] === len) {
        this.stop();
      } else {
        this.playTyphoon();
      }
    }, 1000);
  }
  stop() {
    var tfbh = this.typhoonPlay;
    window.clearInterval(this.typhoonData[tfbh]['playFlag']);
  }
}
