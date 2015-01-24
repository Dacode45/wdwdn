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

var width, height;
var world//phsyics
, stage;//drawing canvas
var scale = 30; //pixels per meter

var fixDef;
var bodyDef;

var player;
function init(){
  world = new b2World(new b2Vec2(0, 0), true)
  stage = new createjs.Stage("gameCanvas");
  height = document.getElementById("gameCanvas").height;
  width = document.getElementById("gameCanvas").width;

  bodyDef = new b2BodyDef;
  fixDef = new b2FixtureDef;

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', tick);

  setupWorld();
  setupCharacters();


  //global event handlers
  stage.on("stagemousedown", function(evt){

    var dir = new b2Vec2(evt.stageX, evt.stageY);
    player.moveto(dir);
    dir.Subtract(player.body.GetPosition());
    console.log(dir);
    player.body.ApplyForce(dir, player.body.GetPosition());
  });
}

function tick(){
  world.Step(
    1/60,//framerate
    10,//num of velocity iterations
    10//num of position iterations
  );
  stage.update();
  //world.DrawDebugData();
  world.ClearForces();
 //console.log("hi");
}

function setupWorld(){

  fixDef.density = 1.0;
  fixDef.friction = .5;
  fixDef.restitution = .2;



  //crate box
  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape();
  fixDef.shape.SetAsBox(720/scale, 10/scale);
  bodyDef.position.x = 0;
  bodyDef.position.y = 0;
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.y = 480/scale;
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  fixDef.shape.SetAsBox(10/scale, 720/scale);
  bodyDef.position.y = 0;
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.x = 720/scale;
  world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function setupCharacters(){


  bodyDef.type = b2Body.b2_dynamicBody;
   for(var i = 0; i < 10; ++i) {
            if(Math.random() > 0.5) {
               fixDef.shape = new b2PolygonShape;
               fixDef.shape.SetAsBox(
                     Math.random() + 0.1 //half width
                  ,  Math.random() + 0.1 //half height
               );
            } else {
               fixDef.shape = new b2CircleShape(
                  Math.random() + 0.1 //radius
               );
            }
            bodyDef.position.x = (Math.random() * 720)/scale;
            bodyDef.position.y = (Math.random() * 480)/scale;
            var o = new GameObject(bodyDef, fixDef);
            o.graphics.beginFill("red").drawCircle(0,0,50);
            stage.addChild(o);
            createjs.Ticker.addEventListener("tick", o);
    }
    bodyDef.position.x = ( 300)/scale;
    bodyDef.position.y = ( 200)/scale;
    player = new Character(bodyDef, fixDef);
    player.graphics.beginFill("green").drawCircle(0,0,50);
    stage.addChild(player);
    createjs.Ticker.addEventListener('tick', player);

         //setup debug draw
         var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("gameCanvas").getContext("2d"));
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.5);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
}


window.onload = init;
