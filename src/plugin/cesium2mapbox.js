import { Map } from 'mapbox-gl';
import { Camera } from 'cesium';

/**
 * @param {Map} map mapbox map
 * @returns {Object} 含 heading、pitch、roll=0 的对象
 */
const toCesium = (map) => {
  if (map == undefined || !(map instanceof Map))
    return;

  return {
    heading: 360 + map.painter.transform.pitch,
    pitch: map.painter.transform.bearing * (-1),
    roll: 0
  };
};

/**
 * @param {Camera} cesiumCamera CesiumCamera
 * @returns {Object} 含 bearing、pitch 的对象
 */
const toMapbox = (cesiumCamera) => {
  if (cesiumCamera == undefined || !(cesiumCamera instanceof Camera))
    return;

  return {
    bearing: cesiumCamera.heading - 360,
    pitch: cesiumCamera.pitch * (-1)
  };
};

export {
  toCesium,
  toMapbox
};