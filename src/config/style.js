export const tdtVecStyle = {
  //设置版本号，一定要设置
  version: 8,
  //添加来源
  sources: {
    tdtVec: {
      //来源类型为栅格瓦片
      type: 'raster',
      tiles: [
        //来源请求地址
        'http://t0.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
      ],
      //栅格瓦片的分辨率
      tileSize: 256,
    },
    tdtCva: {
      //来源类型为栅格瓦片
      type: 'raster',
      tiles: [
        //来源请求地址
        'http://t0.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=de0dc270a51aaca3dd4e64d4f8c81ff6',
      ],
      //栅格瓦片的分辨率
      tileSize: 256,
    },
  },
  //设置加载并显示来源的图层信息
  layers: [
    {
      //图层id，要保证唯一性
      id: 'tdtVec',
      //图层类型
      type: 'raster',
      //连接图层来源
      source: 'tdtVec',
      //图层最小缩放级数
      minzoom: 0,
      //图层最大缩放级数
      maxzoom: 17,
    },
    {
      //图层id，要保证唯一性
      id: 'tdtCva',
      //图层类型
      type: 'raster',
      //连接图层来源
      source: 'tdtCva',
      //图层最小缩放级数
      minzoom: 0,
      //图层最大缩放级数
      maxzoom: 17,
    },
  ],
};
export const officeStyle = [
  'mapbox://styles/mapbox/streets-v11',
  'mapbox://styles/mapbox/outdoors-v11',
  'mapbox://styles/mapbox/light-v10',
  'mapbox://styles/mapbox/dark-v10',
  'mapbox://styles/mapbox/satellite-v9',
  'mapbox://styles/mapbox/satellite-streets-v11',
  'mapbox://styles/mapbox/navigation-preview-day-v4',
  'mapbox://styles/mapbox/navigation-preview-night-v4',
  'mapbox://styles/mapbox/navigation-guidance-day-v4',
  'mapbox://styles/mapbox/navigation-guidance-night-v4'
];