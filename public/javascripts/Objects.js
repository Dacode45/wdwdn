
GameObject = function(bodyDef, fixDef){
  this.Shape_constructor();
  this.bodyDef = bodyDef;
  this.fixDef = fixDef;
  this.body = world.CreateBody(this.bodyDef);
  this.fixture = this.body.CreateFixture(this.fixDef);
  //check if polygon shape
  console.log(this.fixDef.shape);
  this.outline_color = "black";
  this.fill_clolor = "red";

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

Character = function(bodyDef, fixDef){
  GameObject.call(this, bodyDef, fixDef);
  this.speed = 5; //pixels per meeter
  this.marker;//place its trying to get to.
}

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = GameObject;

Character.prototype.moveto = function(to){
  to.Multiply(1/scale);
  this.marker = to;
  console.log("player marker changed " + this.marker)
}

Character.prototype.handleEvent = function(e){
  GameObject.prototype.handleEvent.call(this, e);
  this.body.SetFixedRotation(true);
//  console.log("update")
  if(this.marker){
    if(this.fixture.TestPoint(this.marker)){
      this.marker = null;
      this.body.SetLinearVelocity(new b2Vec2());
    }else{


      var dir = this.marker.Copy();
      dir.Subtract(this.body.GetPosition());
      dir.Multiply(this.speed);
      //console.log(dir);
      this.body.ApplyForce(dir, this.body.GetPosition());
    }
  }
}
