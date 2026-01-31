(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("Rival_House",
{ "compressionlevel":-1,
 "height":9,
 "infinite":false,
 "layers":[
        {
         "id":3,
         "layers":[
                {
                 "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 12, 12, 12, 12, 12, 12, 12, 12, 0,
                    0, 12, 12, 12, 12, 12, 12, 12, 12, 0,
                    0, 12, 12, 12, 12, 12, 12, 12, 12, 0,
                    0, 12, 12, 12, 12, 12, 12, 12, 12, 0,
                    0, 12, 12, 12, 12, 12, 12, 12, 12, 0,
                    0, 12, 12, 12, 12, 12, 12, 12, 12, 0,
                    0, 12, 12, 12, 12, 12, 12, 12, 12, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 "height":9,
                 "id":1,
                 "name":"Floor",
                 "opacity":1,
                 "type":"tilelayer",
                 "visible":true,
                 "width":10,
                 "x":0,
                 "y":0
                }, 
                {
                 "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 5, 5, 5, 5, 5, 5, 5, 5, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 "height":9,
                 "id":2,
                 "name":"Walls",
                 "opacity":1,
                 "type":"tilelayer",
                 "visible":true,
                 "width":10,
                 "x":0,
                 "y":0
                }, 
                {
                 "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 2, 6, 3, 1, 7, 6, 363, 0,
                    0, 9, 10, 0, 11, 9, 15, 0, 371, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 13, 37, 19, 13, 0, 0, 0,
                    0, 0, 0, 13, 45, 27, 13, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 1846, 1848, 0, 0, 0, 421, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 "height":9,
                 "id":6,
                 "name":"Furniture",
                 "opacity":1,
                 "type":"tilelayer",
                 "visible":true,
                 "width":10,
                 "x":0,
                 "y":0
                }],
         "name":"Group Layer 1",
         "opacity":1,
         "type":"group",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1929, 0, 0, 0, 1929, 0, 0,
            0, 1929, 1929, 0, 1929, 1929, 1929, 0, 1929, 0,
            1929, 0, 0, 0, 0, 0, 0, 0, 0, 1929,
            1929, 0, 0, 0, 1929, 1929, 0, 0, 0, 1929,
            1929, 0, 0, 0, 1929, 1929, 0, 0, 0, 1929,
            1929, 0, 0, 0, 0, 0, 0, 0, 0, 1929,
            1929, 0, 0, 0, 0, 0, 0, 0, 1929, 1929,
            0, 1929, 1929, 0, 0, 1929, 1929, 1929, 1929, 0],
         "height":9,
         "id":4,
         "name":"Collisions",
         "opacity":0.5,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 1931, 1931, 0, 0, 0, 0, 0],
         "height":9,
         "id":5,
         "name":"Warp",
         "opacity":0.5,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }],
 "nextlayerid":7,
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.11.2",
 "tileheight":16,
 "tilesets":[
        {
         "firstgid":1,
         "source":"Tilesets\/Tileset_data\/house_2.tsx"
        }, 
        {
         "firstgid":49,
         "source":"Tilesets\/Tileset_data\/gsc style html.tsx"
        }, 
        {
         "firstgid":1929,
         "source":"Tilesets\/Tileset_data\/Collisions_Tileset.tsx"
        }],
 "tilewidth":16,
 "type":"map",
 "version":"1.10",
 "width":10
});