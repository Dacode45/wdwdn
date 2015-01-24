
GameObject = function(bodyDef, fixDef, fill_clolor, outline_color){
  this.Shape_constructor();
  this.bodyDef = bodyDef;
  this.fixDef = fixDef;
  this.body = world.CreateBody(this.bodyDef);
  this.body.SetFixedRotation(true);
  this.fixture = this.body.CreateFixture(this.fixDef);
  //check if polygon shape
  //console.log(this.fixDef.shape);
  this.outline_color = outline_color || "black";
  this.fill_clolor = fill_clolor || "pink";

  this.x = this.body.GetPosition().x*scale;
  this.y = this.body.GetPosition().y*scale;

  this.draw_object_from_physics = function(){
    this.graphics.clear();

    var vertices = this.fixDef.shape.m_vertices;
    this.graphics.beginStroke(this.outline_color).beginFill(this.fill_clolor);
    this.graphics.moveTo(vertices[0].x*scale, vertices[0].y*scale);
    for(var i = 1; i < vertices.length; i++){
      this.graphics.lineTo(vertices[i].x*scale, vertices[i].y*scale)
    }
    this.graphics.lineTo(vertices[0].x*scale, vertices[0].y*scale);

  }


  this.draw_object_from_physics();

}

var gO = createjs.extend(GameObject, createjs.Shape);


gO.handleEvent = function(e){
  this.x = this.body.GetPosition().x * scale;
  this.y = this.body.GetPosition().y * scale;
  this.rotation = this.body.GetAngle() * (180/Math.PI);
  //console.log("child tick");
}

window.GameObject = createjs.promote(GameObject, "Shape");

Character = function(bodyDef, fixDef, fill_clolor, outline_color){
  GameObject.call(this, bodyDef, fixDef, fill_clolor, outline_color);
  this.speed = 5;
  this.max_speed = 10; //pixels per meeter
  this.marker;//place its trying to get to.
  this.dialog_color = "brown";
  this.collided = false;

  this.collision_listener = new b2Listener;

  this.collision_listener.BeginContact = function(contact){
    this.collided = true;
  }

  world.SetContactListener(this.collision_listener);

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
  //console.log("player marker changed ")
  //console.log( to);
}

Character.prototype.handleEvent = function(e){
  GameObject.prototype.handleEvent.call(this, e);

  //  console.log("update")
  if(this.marker){
    if(this.fixture.TestPoint(this.marker) || this.collided){
      this.marker = null;
      this.body.SetLinearVelocity(new b2Vec2());
      this.collided = false;
      console.log('arrived');
    }else{

      var velocity = this.body.GetLinearVelocity();
      var speed = velocity.Length();
      //console.log(this.max_speed)
      if(speed > this.max_speed){
        this.body.SetLinearVelocity( velocity.Multiply((this.max_speed/speed)));
      }else{
        var dir = this.marker.Copy();
        dir.Subtract(this.body.GetPosition());
        dir.Multiply(this.speed);
        //console.log(dir);
        this.body.ApplyForce(dir, this.body.GetPosition());
      }

    }
  }
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
