
GameObject = function(sprite_sheet, bodyDef, fixDef){

  this.Sprite_constructor(sprite_sheet);
  this.bodyDef = bodyDef;
  this.fixDef = fixDef;

  this.body = world.CreateBody(this.bodyDef);
  this.body.SetFixedRotation(true);
  this.fixture = this.body.CreateFixture(this.fixDef);

}

var gO = createjs.extend(GameObject, createjs.Sprite);

gO.handleEvent = function(e){

  this.x = this.body.GetPosition().x * scale -16;
  this.y = this.body.GetPosition().y * scale - 16;
  this.rotation = this.body.GetAngle() * (180/Math.PI);
  //console.log("child tick");
}

window.GameObject = createjs.promote(GameObject, "Sprite");

Character = function(sprite_sheet, bodyDef, fixDef){
  GameObject.call(this, sprite_sheet, bodyDef, fixDef);
  this.inputs = [];

  this.keys = {u:false, d:false, l:false, r:false};

  this.speed = scale;
  this.max_speed = 4*scale; //pixels per meeter
  this.marker;//place its trying to get to.
  this.dialog_color = "brown";

  //Wehn stuff is clicked
  this.on("click", function(){
    this.dialogBox = new Dialog(gui.canvas.width, 300, this, this.dialog_color);
    gui.addChild(this.dialogBox);
  });
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = GameObject;

Character.prototype.moveto = function(to){
  to.Multiply(1/scale);
  this.marker = to;
  console.log("player marker changed ")
  console.log( to);
}

Character.prototype.handleEvent = function(e){
  GameObject.prototype.handleEvent.call(this, e);
  //console.log(this.marker);
  //  console.log("update")
  //handle Inputs
  var input = this.inputs.reduce(function(previous, current){
    var i;
    switch(current){
      case 'w':
        previous.y -= 1;
        break;
        case 's':
          previous.y += 1;
          break;
          case 'a':
            previous.x -= 1;
            break;
            case 'd':
              previous.x += 1;
              break;
            }
            return previous;

          }, {x:0,y:0});
          this.inputs = [];
          var velocity = new b2Vec2(input.x*this.speed, input.y*this.speed);
          
          //console.log(velocity);

            this.body.ApplyImpulse(velocity, this.body.GetWorldCenter());
            // var currentVector = this.body.GetLinearVelocity();
            // if(currentVector.Length() >= this.max_speed){
            //   //set velocity to max;
            //   currentVector.Multiply(currentVector.Normalize()*this.max_speed);
            //   this.body.SetLinearVelocity(currentVector);
            // }

          this.body.SetLinearVelocity(new b2Vec2(input.x, input.y), this.body.GetWorldCenter());
        }

        Dialog = function(width, height, character, dialog_color){
          this.Container_constructor();
          this.character = character;
          this.background_color = dialog_color||dialog_color;

          this.background = new createjs.Shape();
          this.background.graphics.beginFill(this.background_color).drawRect(0,0,width, height);
          this.addChild(this.background);

          this.closeButton = new createjs.Container();
          var closeButtonBackground = new createjs.Shape();
          closeButtonBackground.graphics.beginFill("red").drawRect(0,0,scale,scale);
          this.closeButton.addChild(closeButtonBackground);
          var closeSign = new createjs.Text("X", "20px Arial", "#000000");
          this.closeButton.addChild(closeSign);
          closeSign.x = this.closeButton.getBounds().width-closeSign.getBounds().width/2;
          this.closeButton.x = gui.canvas.width - 2*this.closeButton.getBounds().width;
          this.addChild(this.closeButton);

          this.closeButton.on("click", function(){
            gui.removeChild(this);
          }.bind(this));

          this.talkButton = new createjs.Container();
          var talkButtonBackground = new createjs.Shape();
          talkButtonBackground.graphics.beginStroke("black").beginFill("green").drawRect(0,0,5*scale,scale);
          this.talkButton.addChild(talkButtonBackground);
          var talkSign = new createjs.Text("Talk", "20px Arial", "#000000");
          this.talkButton.addChild(talkSign);
          talkSign.x = this.talkButton.getBounds().width-talkSign.getBounds().width/2;
          this.addChild(this.talkButton);
          this.talkButton.y = 300- this.talkButton.getBounds().height;

          this.talkButton.on("click", function(){
            //implment talking
          });

          this.hijackButton = new createjs.Container();
          var hijackButtonBackground = new createjs.Shape();
          hijackButtonBackground.graphics.beginStroke("black").beginFill("blue").drawRect(0,0,5*scale,scale);
          this.hijackButton.addChild(hijackButtonBackground);
          var hijackSign = new createjs.Text("Hijack", "20px Arial", "#000000");
          this.hijackButton.addChild(hijackSign);
          hijackSign.x = this.hijackButton.getBounds().width-hijackSign.getBounds().width/2;
          this.addChild(this.hijackButton);
          this.hijackButton.y = 300- this.hijackButton.getBounds().height;
          this.hijackButton.x = gui.canvas.width/2;
          this.hijackButton.on("click", function(){
            //implment Hijack
          });

          console.log(this.getBounds());
        }

        var dO = createjs.extend(Dialog, createjs.Container);

        window.Dialog =  createjs.promote(Dialog, "Container");
