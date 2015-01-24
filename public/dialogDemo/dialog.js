function init() {
   document.getElementById("sprite").style.display = 'none';
   var stage = new createjs.Stage("demoCanvas");
   var container = new createjs.Container();
   container.x = 50;
   container.y = 50;
   var rectangle = new createjs.Shape();
   rectangle.graphics.beginFill("Grey").drawRect(0,0,350,100);
   var text = new createjs.Text("Hello World", "20px Arial", "#000000");
   stage.addChild(container);
   container.addChild(rectangle);
   container.addChild(text);
   text.x = 100;
   var data = {
      images: ["sprite.png"],
      frames: {width:98, height:98}
   };
   var spriteSheet = new createjs.SpriteSheet(data);
   var sp = new createjs.Sprite(spriteSheet);
   container.addChild(sp);
   stage.update();
}
