
GameObject = function(bodyDef, fixDef){
  this.Shape_constructor();
  this.bodyDef = bodyDef;
  this.fixDef = fixDef;
  this.body = world.CreateBody(this.bodyDef);
  this.fixture = this.body.CreateFixture(this.fixDef);
  this.x = this.body.GetPosition().x*scale;
  this.y = this.body.GetPosition().y*scale;
}

var gO = createjs.extend(GameObject, createjs.Shape);
gO.handleEvent = function(e){
  this.x = this.body.GetPosition().x * scale;
  this.y = this.body.GetPosition().y * scale;
  this.rotation = this.body.GetAngle() * (180/Math.PI);
  //console.log("child tick");
}
window.GameObject = createjs.promote(GameObject, "Shape");

Character = function(bodyDef, fixDef){
  GameObject.call(this, bodyDef, fixDef);
  this.speed = 5000; //pixels per meeter
  this.marker;//place its trying to get to.
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = GameObject;

Character.prototype.moveto = function(to){
  this.marker = to.Multiply(1/scale);
}

Character.prototype.handleEvent = function(e){
  GameObject.prototype.handleEvent.call(this, e);

  if(this.marker){
    if(this.fixture.TestPoint(this.marker)){
      this.marker = null;
    }else{
      var dir = this.marker;
      dir.Subtract(this.body.GetPosition());
      dir.Multiply(this.speed);
      console.log(dir);
      this.body.ApplyForce(dir, this.body.GetPosition());
    }
  }
}
