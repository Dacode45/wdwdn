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
 var scale = tile_size = (1024/32); //pixels per meter
 var character_size = {x:832/13, y:1344/21};

 var player, stage;
 var characters = [];

 //preloading files
 var queue = new createjs.LoadQueue(true);
 queue.on("fileload", handleFileLoad, this);
 queue.on("complete", handleComplete, this);
 var raw_map;
 var map;

 var tile_sheet, player_sheet;

 var ppt_w;
 var ppt_h;

 var manifest = [
 {src:"images/tilesheet.png", id:"tile_sheet", type:createjs.AbstractLoader.IMAGE},
 {src:"images/player.png", id:"player_sheet", type:createjs.AbstractLoader.IMAGE}

 ];

 queue.loadManifest(manifest, true);

 function handleFileLoad(event){
   console.log(event);
   var item = event.item;
   var type = item.type;
   switch(type){
     case createjs.LoadQueue.IMAGE:
       switch(item.id){
          case "tile_sheet":
            tile_sheet = new createjs.SpriteSheet({
              images:[event.result],
              frames:{width:tile_size, height:tile_size}
            });
            // console.log(new Image(queue.getResult("d_tiles").result));

          break;

          case "player_sheet":
            player_sheet = new createjs.SpriteSheet({

              images:[event.result],
              frames:{width:character_size.x, height:character_size.y},
              animations:{
                "stand_f":0,
                "stand_l":13,
                "stand_b":26,
                "stand_r":39,

                "cast_f":[0,7],
                "cast_l":[13,20],
                "cast_b":[26, 33],
                "cast_r":[39,46],

                "thrust_f":[52, 60],
                "thrust_l":[65, 73],
                "thrust_b":[78, 86],
                "thrust_r":[91, 99],

                "walk_f":[104, 112, "walk_f"],
                "walk_l":[117, 125, "walk_l"],
                "walk_b":[130, 138, "walk_b"],
                "walk_r":[143, 151, "walk_r"],

                "slash_f":[156, 162],
                "slash_l":[169, 175],
                "slash_b":[182, 188],
                "slash_r":[195, 201],

                "shoot_f":[208, 220],
                "shoot_f":[221, 233],
                "shoot_f":[234, 246],
                "shoot_f":[247, 259],

                "death":[260, 265]

              }
            });
            player_sheet.framerate = 7;
            // console.log(new Image(queue.getResult("d_tiles").result));

          break;


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

     createjs.Ticker.timingMode = createjs.Ticker.RAF;
     createjs.Ticker.setFPS(60);
     createjs.Ticker.addEventListener('tick', tick);

     //global event handlers
     setUpDebug();
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

   //collsion filters
   //-1 for stuff player can hit
   //-2 for cosmetic stuff
   var air_tiles = [176];
   function parseMap(){
     var sprite_sheet_controller = new createjs.Sprite(tile_sheet);
     sprite_sheet_controller.gotoAndStop(sprite_sheet_controller.currentFrame+1);
     sprite_sheet_controller.addEventListener("click", function(){
       this.gotoAndStop(this.currentFrame+1);
       console.log(this.currentFrame);
     }.bind(sprite_sheet_controller))
     gui.addChild(sprite_sheet_controller);


     var map = [];
     var spriteMap = [];
     for(var x = 0; x < stage.canvas.width/scale; x++ ){
       map[x] = [];
       spriteMap[x] = []
       for(var y = 0; y < stage.canvas.height/scale; y++){
         if(y==0 || x==0 || x>=stage.canvas.width/scale - 1){
           if(x%2 == 0){
              map[x][y] = 32*3-14; //tile position.//brick wall

           }else{
             map[x][y] = 32*2-13; //tile position.//brick wall

           }
         }else if(y==1){
           if(x%2 == 0){
              map[x][y] = 32*4-14; //tile position.//brick wall

           }else{
             map[x][y] = 32*4-13; //tile position.//brick wall

           }

         }else if(y==2){
           if(x%2 == 0){
              map[x][y] = 32*5-14; //tile position.//brick wall

           }else{
             map[x][y] = 32*5-13; //tile position.//brick wall

           }

         }else if(y>=stage.canvas.height/scale-1){
              map[x][y] = 32*3-14;
         }
         else{
             map[x][y] = 32*6-16; //tile position. //wood floor
         }
         if(air_tiles.indexOf(map[x][y]) == -1){

           var fixDef = new b2FixtureDef;
           fixDef.density = 1.0;
           fixDef.friction = 5;
           fixDef.restitution = .2;

           var bodyDef = new b2BodyDef;
           bodyDef.type = b2Body.b2_staticBody;

           fixDef.shape = new b2PolygonShape;
           fixDef.shape.SetAsBox(scale/scale/2, scale/scale/2);

           bodyDef.position.x = x*scale/scale;
           bodyDef.position.y = y*scale/scale;

          // console.log("Made collider tiles")
          spriteMap[x][y] = new GameObject(tile_sheet, bodyDef,fixDef);
        }else{
          spriteMap[x][y] = new createjs.Sprite(tile_sheet);
        //  console.log('made air tiles');
        }
        //  console.log(x*scale);
         spriteMap[x][y].gotoAndStop( map[x][y]);
         stage.addChild(spriteMap[x][y]);
         spriteMap[x][y].x = x*scale;
         spriteMap[x][y].y = y*scale;

       }
     }
}

function setupCharacters(){


  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 1;
  fixDef.restitution = .2;

  var bodyDef = new b2BodyDef;

  bodyDef.type = b2Body.b2_dynamicBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(scale/scale/2, scale/scale/2);

  bodyDef.position.x = ( 150)/scale;
  bodyDef.position.y = ( 150)/scale;
  player = new Character(player_sheet,bodyDef, fixDef);
  player.gotoAndStop(0);
  stage.addChild(player);
  createjs.Ticker.addEventListener('tick', player);

  Mousetrap.bind('w', function(e){
    player.inputs.push('w');
    if(!player.keys.u){
        player.gotoAndPlay("walk_f");
        player.keys.u = true;
    }
    //console.log("keydown");
  },"keydown");
  Mousetrap.bind('w', function(e){
    player.stop("walk_f");
    player.gotoAndStop("walk_f");
    player.keys.u = false;
  },"keyup");
  Mousetrap.bind('s', function(e){
    player.inputs.push('s');
    if(!player.keys.d){
        player.gotoAndPlay("walk_b");
        player.keys.d = true;
    }
    //console.log("keydown");
  },"keydown");
  Mousetrap.bind('s', function(e){
    player.stop("walk_b");
    player.gotoAndStop("walk_b");
    player.keys.d = false;
  },"keyup");

Mousetrap.bind('d', function(e){
  player.inputs.push('d');
  if(!player.keys.r){
      player.gotoAndPlay("walk_r");
      player.keys.r = true;
  }
  //console.log("keydown");
},"keydown");
Mousetrap.bind('d', function(e){
  player.stop("walk_r");
  player.gotoAndStop("walk_r");
  player.keys.r = false;
},"keyup");
Mousetrap.bind('a', function(e){
  player.inputs.push('a');
  if(!player.keys.l){
      player.gotoAndPlay("walk_l");
      player.keys.l = true;
  }
  //console.log("keydown");
},"keydown");
Mousetrap.bind('a', function(e){
  player.stop("walk_l");
  player.gotoAndStop("walk_l");
  player.keys.l = false;
},"keyup");


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
  debugDraw.SetDrawScale(scale);
  debugDraw.SetFillAlpha(0.5);
  debugDraw.SetLineThickness(1.0);
  debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
  world.SetDebugDraw(debugDraw);
}

window.onload = init;
