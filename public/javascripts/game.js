 var b2Vec2 = Box2D.Common.Math.b2Vec2;
 var b2BodyDef = Box2D.Dynamics.b2BodyDef;
 var b2Body = Box2D.Dynamics.b2Body;
 var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
 var b2Fixture = Box2D.Dynamics.b2Fixture;
 var b2World = Box2D.Dynamics.b2World;
 var b2MassData = Box2D.Collision.Shapes.b2MassData;
 var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
 var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
 var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
 var b2Math = Box2D.b2
 var b2Listener = Box2D.Dynamics.b2ContactListener;
 var b2AABB = Box2D.Collision.b2AABB;

 var width, height;
 var world//phsyics
 , stage,//drawing canvas
 gui;//Gui Canvas;
 var scale = 30; //pixels per meter


 var player, stage;
 var characters = [];

 //preloading files
 var queue = new createjs.LoadQueue(true);
 queue.on("fileload", handleFileLoad, this);
 queue.on("complete", handleComplete, this);
 var raw_map;
 var map;

 var r_tiles;
 var d_tiles;

 var ppt_w;
 var ppt_h;

 var manifest = [
 {src:"data.json", id:"map", type:createjs.AbstractLoader.JSON},
 {src:"images/rogueliketiles.png", id:"r_tiles", type:createjs.AbstractLoader.IMAGE},
 {src:"images/desert.png", id:"d_tiles", type:createjs.AbstractLoader.IMAGE}

 ];

 queue.loadManifest(manifest, true);

 function handleFileLoad(event){
   console.log(event);
   var item = event.item;
   var type = item.type;
   switch(type){
     case createjs.LoadQueue.JSON:
       raw_map = event.result;
       console.log(event)
       break;
       case createjs.LoadQueue.IMAGE:
         if(item.id == "r_tiles"){
           r_tiles = new createjs.SpriteSheet({
             images:["images/rogueliketiles.png"],
             frames:{width:(96/6), height:(160/10), regX:0, regY:0}
           });
         }
         if(item.id == "d_tiles"){
           d_tiles = new createjs.SpriteSheet({
             images:[item],
             frames:{width:32, height:32, regX:0, regY:0}
           });
           console.log(new Image(queue.getResult("d_tiles").result));
         }
         break;

       }
     }

     function handleComplete(event){
       parseMap();
       setupCharacters();
     }




     function init(){
       world = new b2World(new b2Vec2(0, 0), true)
       stage = new createjs.Stage("gameCanvas");
       gui = new createjs.Stage("guiCanvas");

       height = stage.canvas.height;
       width = stage.canvas.width;

       createjs.Ticker.setFPS(60);
       createjs.Ticker.addEventListener('tick', tick);


       var circle = new createjs.Shape();

       var background = setUpBackground();
       stage.addChild(background);

       gui.addChild(setUpBackground('white'));

       setupWorld();


       //global event handlers
       stage.on("stagemousedown", function(evt){

         var dir = new b2Vec2(evt.stageX , evt.stageY);
         player.moveto(dir);

       });

       setUpDebug();
     }

     function setUpBackground(color){
       var c = color || "#F4A460";
       var background = new createjs.Shape();
       background.graphics.beginFill(c).drawRect(0,0,stage.canvas.width, stage.canvas.height);
       //updates
       return background
     }

     function tick(){
       world.Step(
         1/60,//framerate
         10,//num of velocity iterations
         10//num of position iterations
       );

      // centerCamera();

       stage.update();
       gui.update();
       world.DrawDebugData();
       world.ClearForces();
       //console.log("hi");
     }

     function setupWorld(){

       var fixDef = new b2FixtureDef;
       fixDef.density = 1.0;
       fixDef.friction = 5;
       fixDef.restitution = .2;

       //crate box
       var bodyDef = new b2BodyDef;
       bodyDef.type = b2Body.b2_staticBody;
       fixDef.shape = new b2PolygonShape();
       fixDef.shape.SetAsBox(720/scale, 10/scale);
       bodyDef.position.x = 0;
       bodyDef.position.y = 0;
       var topWall = new GameObject(r_tiles, bodyDef, fixDef)
      // stage.addChild(topWall)
       bodyDef.position.y = 480/scale;
       var bottomWall = new GameObject(r_tiles, bodyDef, fixDef)
       fixDef.shape.SetAsBox(10/scale, 720/scale);
       bodyDef.position.y = 0;
       var leftWall = new GameObject(r_tiles,bodyDef, fixDef)
       bodyDef.position.x = 720/scale;
       var rightWall = new GameObject(r_tiles, bodyDef, fixDef)

     }


     //collsion filters
     //-1 for stuff player can hit
     //-2 for cosmetic stuff
     function parseMap(){
       var h = raw_map.length;//height of map
       var w = raw_map[0].length;
       ppt_w = stage.canvas.width/w;//pixel per tile width
       ppt_h = stage.canvas.height/h;//pixel per tile height

       console.log(stage);

       var fixDef = new b2FixtureDef;
       fixDef.density = 1.0;
       fixDef.friction = 5;
       fixDef.restitution = .2;

       var bodyDef = new b2BodyDef;
       bodyDef.type = b2Body.b2_staticBody;

       console.log(raw_map);
       raw_map.map(function(line, i, original){
         return line.map(function(tile, j, l){
           //two different sprite sheet images so if above 60 i loops
           var tile_sheet = (tile >= 60)? d_tiles:r_tiles;
           switch(tile){
             case 0:
               //air
               return null;
               break;
               //chair
               case 5:
                 case 11:
                   case 17:
                     fixDef.shape = new b2PolygonShape;
                     fixDef.shape.SetAsBox(ppt_w/2/scale, ppt_h/2/scale);

                     bodyDef.position.x = j*ppt_w/scale;
                     bodyDef.position.y = i*ppt_h/scale;
                     var o = new GameObject(tile_sheet, bodyDef, fixDef);
                     o.gotoAndStop(tile);
                     stage.addChild(o);
                     createjs.Ticker.addEventListener("tick", o);

                     break;
                     //table
                     case 30:

                       fixDef.shape = new b2PolygonShape;
                       fixDef.shape.SetAsBox(ppt_w/2/scale, ppt_h/2/scale);

                       bodyDef.position.x = j*ppt_w/scale;
                       bodyDef.position.y = i*ppt_h/scale;
                       //console.log(tile_sheet);
                       var o = new GameObject(tile_sheet, bodyDef, fixDef);
                       //console.log(o);
                       o.gotoAndStop(tile);
                       stage.addChild(o);
                       createjs.Ticker.addEventListener("tick", o);

                       break;
                     }
                   });
                 });



               }

               function setupCharacters(){
                 var fixDef = new b2FixtureDef;
                 fixDef.density = 1.0;
                 fixDef.friction = 5;
                 fixDef.restitution = .2;

                 var bodyDef = new b2BodyDef;

                 bodyDef.type = b2Body.b2_dynamicBody;
                 fixDef.shape = new b2PolygonShape;
                 fixDef.shape.SetAsBox(ppt_w/scale/2, ppt_h/scale/2);

                 bodyDef.position.x = ( 80)/scale;
                 bodyDef.position.y = ( 80)/scale;
                 player = new Character(r_tiles,bodyDef, fixDef);
                 player.gotoAndStop(0);
                 stage.addChild(player);
                 createjs.Ticker.addEventListener('tick', player);

                 //fixDef.filter.groupIndex = -1;
                 bodyDef.type = b2Body.b2_dynamicBody;
                 for(var i = 0; i < 20; i++){
                   bodyDef.position.x = Math.random()*width/scale;
                   bodyDef.position.y = Math.random()*height/scale;

                   characters[i] = new Character(r_tiles,bodyDef, fixDef);
                   characters[i].gotoAndStop(3);
                   stage.addChild(characters[i]);
                   createjs.Ticker.addEventListener('tick', characters[i]);
                 }



                 //setup debug draw

               }

               function centerCamera(){
                 //stage.x = -player.x + stage.canvas.width/2;
                 //stage.y = -player.y + stage.canvas.height/2;
                 // console.log(stage.x);
               }

               function setUpDebug(){
                 var debugDraw = new b2DebugDraw();
                 debugDraw.SetSprite(document.getElementById("debugCanvas").getContext("2d"));
                 debugDraw.SetDrawScale(30.0);
                 debugDraw.SetFillAlpha(0.5);
                 debugDraw.SetLineThickness(1.0);
                 debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                 world.SetDebugDraw(debugDraw);
               }

               window.onload = init;
