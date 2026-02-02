(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("Player_House_F1",
{ "compressionlevel":-1,
 "height":8,
 "infinite":false,
 "layers":[
        {
         "id":5,
         "layers":[
                {
                 "data":[0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 20, 20, 20, 20, 20, 20, 20, 0,
                    0, 20, 20, 20, 20, 20, 20, 20, 0,
                    0, 20, 20, 20, 20, 20, 20, 20, 0,
                    0, 20, 20, 20, 20, 20, 20, 20, 0,
                    0, 20, 20, 20, 20, 20, 20, 20, 0,
                    0, 20, 20, 20, 20, 20, 20, 20, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0],
                 "height":8,
                 "id":1,
                 "name":"floor",
                 "opacity":1,
                 "type":"tilelayer",
                 "visible":true,
                 "width":9,
                 "x":0,
                 "y":0
                }, 
                {
                 "data":[0, 1, 1, 1, 1, 1, 1, 7, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0],
                 "height":8,
                 "id":2,
                 "name":"walls",
                 "opacity":1,
                 "type":"tilelayer",
                 "visible":true,
                 "width":9,
                 "x":0,
                 "y":0
                }, 
                {
                 "data":[0, 2, 3, 0, 5, 5, 0, 0, 0,
                    0, 10, 11, 23, 13, 13, 0, 0, 0,
                    0, 18, 19, 0, 0, 0, 0, 0, 0,
                    0, 0, 9, 0, 41, 49, 0, 0, 0,
                    0, 0, 17, 0, 22, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0],
                 "height":8,
                 "id":3,
                 "name":"furniture",
                 "opacity":1,
                 "type":"tilelayer",
                 "visible":true,
                 "width":9,
                 "x":0,
                 "y":0
                }],
         "name":"objects",
         "opacity":1,
         "type":"group",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 113, 0, 113,
            0, 113, 113, 113, 113, 113, 0, 0, 113,
            113, 0, 0, 0, 0, 0, 0, 0, 113,
            113, 0, 113, 0, 113, 113, 0, 0, 113,
            113, 0, 113, 0, 0, 0, 0, 0, 113,
            113, 0, 0, 0, 0, 0, 0, 0, 113,
            113, 0, 0, 0, 0, 0, 0, 0, 113,
            0, 113, 113, 113, 113, 113, 113, 113, 0],
         "height":8,
         "id":4,
         "name":"collisions",
         "opacity":1,
         "type":"tilelayer",
         "visible":false,
         "width":9,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 116, 116, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 116, 116, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "id":7,
         "name":"interactions",
         "opacity":1,
         "type":"tilelayer",
         "visible":false,
         "width":9,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 115, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":8,
         "id":6,
         "name":"warps",
         "opacity":1,
         "type":"tilelayer",
         "visible":false,
         "width":9,
         "x":0,
         "y":0
        }],
 "nextlayerid":8,
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.11.2",
 "tileheight":16,
 "tilesets":[
        {
         "firstgid":1,
         "source":"assets\/Tilesets\/Tileset_data\/house_1.tsx"
        }, 
        {
         "firstgid":113,
         "source":"assets\/Tilesets\/Tileset_data\/Collisions_Tileset.tsx"
        }],
 "tilewidth":16,
 "type":"map",
 "version":"1.10",
 "width":9
});