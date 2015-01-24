function init() {
   document.getElementById("sprite").style.display = 'none';
   var stage = new createjs.Stage("demoCanvas");
   var rectangle = new createjs.Shape();
   rectangle.graphics.beginFill("Grey").drawRect(0,0,350,100);
   rectangle.x = 75;
   rectangle.y = 200;
   var text = new createjs.Text("Hello World", "20px Arial", "#000000");
   text.x = 185;
   text.y = 210;
   stage.addChild(rectangle);
   stage.addChild(text);
   var data = {
      images: ["sprite.png"],
      frames: {width:98, height:98}
   };
   var spriteSheet = new createjs.SpriteSheet(data);
   var sp = new createjs.Sprite(spriteSheet);
   sp.x = 76;
   sp.y = 201;
   stage.addChild(sp);
   stage.update();
}