/*
Tal Rastopchin
November 12, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.

Implemented the following:
  (1) environment background as full viewport quad
    displays an environment stored in a cube texture as the
    background of the 3D scene. as the camera rotates the
    correct part of the surrounding environment is shown

  (2) procedural solid texturing (wood texture)
    one object has a pixel shader that computes a procedural
    texture from the model space position

  (3) infinite plane
    there is an infinite ground plane with some tileable
    texture repeated infinitely. the plane is defined with
    one point at the origin and three points at infinity.

  (4) directional plane projected shadows
    a directional light casts shadows of objects on the
    ground. every scene object is projected onto the ground
    and rendered with a black fragment shader.
*/
"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];

    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");    
    this.programs.push( 
    	this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured));
    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);    

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.material = new Material(this.texturedProgram);
    this.material.colorTexture.set(new Texture2D(gl, "media/usa.jpg"));

    this.slowpokeMaterial = new Material(this.texturedProgram);
    this.slowpokeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonDh.png"));
    this.eyeMaterial = new Material(this.texturedProgram);
    this.eyeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"));

    this.mesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", 
        [this.slowpokeMaterial, this.eyeMaterial]);

    this.gameObjects = [];
    this.avatar =  new GameObject(this.mesh);
    this.avatar.position.set(0, 1, 0);
    this.avatar.scale.set(0.3, 0.3, 0.3);

    this.gameObjects.push(this.avatar);
	this.ballMaterial = new Material(this.texturedProgram);
    this.ballMaterial.colorTexture.set(new Texture2D(gl, "media/ball.png"));
    this.ballMesh = new MultiMesh(gl, "media/sphere.json", [this.ballMaterial]);
    const genericMove = function(t, dt){
      const ahead = new Vec3( Math.sin(this.yaw), 0, Math.cos(this.yaw));
      this.velocity.addScaled(dt * this.invMass, this.force);
      this.position.addScaled(dt, this.velocity);
      this.angularVelocity += dt * this.invAngularMass * this.torque;
      this.yaw += dt * this.angularVelocity;
      const aheadVelocityMagnitude = ahead.dot(this.velocity);
      const aheadVelocity = ahead.times(aheadVelocityMagnitude);
      const sideVelocity = this.velocity.minus(aheadVelocity);
      this.velocity.set(0, 0, 0);
      this.velocity.addScaled(Math.pow(this.backDrag, dt), aheadVelocity);
      this.velocity.addScaled(Math.pow(this.sideDrag, dt), sideVelocity);
      this.angularVelocity *= Math.pow(this.angularDrag, dt);
    };

    for(let i=0; i < 64; i++){
      const ball = new GameObject( this.ballMesh );
      ball.position.setRandom(new Vec3(-22, 1, -22, 0), new Vec3(22, 1, 22) );
      //ball.velocity.setRandom(new Vec3(-2, 0, -2), new Vec3(2, 0, 2));
      this.gameObjects.push(ball);
      ball.move = genericMove;
    }

    this.avatar.backDrag = 0.9;
    this.avatar.sideDrag = 0.5;
    this.avatar.angularDrag = 0.5;
    this.avatar.control = function(t, dt, keysPressed, colliders){
      this.thrust = 0;
      if(keysPressed.UP) {
        this.thrust += 5;
      }
      if(keysPressed.DOWN) {
        this.thrust -= 5;
      }    
      this.torque = 0;
      if(keysPressed.LEFT) {
        this.torque += 2;
      }
      if(keysPressed.RIGHT) {
        this.torque -= 2;
      }      
      let ahead = new Vec3( Math.sin(this.yaw), 0, Math.cos(this.yaw));
      this.force = ahead.times(this.thrust);

      const relativeVelocity = new Vec2();
      let diff = new Vec3();
      for(let i=0; i<colliders.length; i++) {
        const other = colliders[i];
        if(other === this) {
          continue;
        }
        diff.set(this.position).sub(other.position);
        const dist2 = diff.dot(diff);
        if(dist2 < 4) {
          diff.mul( 1.0 / Math.sqrt(dist2) );
          this.position.addScaled(0.05, diff);
          other.position.addScaled(-0.05, diff);
          let tangent = diff.cross(new Vec3(0, 1, 0));
          let vi = this.velocity;
          let bi = this.angularVelocity;
          let vj = other.velocity;
          let bj = other.angularVelocity;
          relativeVelocity.set(vi).sub(vj).addScaled(-bi - bj, tangent).mul(0.5);
          const impulseLength = diff.dot(relativeVelocity);
          diff.mul( impulseLength * 1.5 /*restitution*/ );
          const frictionLength = tangent.dot(relativeVelocity);        
          tangent.mul(frictionLength * 0.5 /*friction*/);
          vi.sub(diff).sub(tangent);
          vj.add(diff).add(tangent);	
          this.angularVelocity += frictionLength /* *radius*/ ;
          other.angularVelocity += frictionLength  /* *radius*/ ;
        }
      }    
    };  
    this.avatar.move = genericMove;
    this.camera = new PerspectiveCamera(...this.programs); 
    this.camera.position.set(0, 5, 25);
    this.camera.update();

    // environment background as full viewport quad (1)
    this.vsEnvBackground = new Shader(gl, gl.VERTEX_SHADER, "env-background-vs.glsl");    
    this.fsEnvBackground = new Shader(gl, gl.FRAGMENT_SHADER, "env-background-fs.glsl");
    this.programs.push( 
      this.envBackgroundProgram = new TexturedProgram(gl, this.vsEnvBackground, this.fsEnvBackground));

    this.envBackgroundMaterial = new Material(this.envBackgroundProgram);
    this.envTexture = new TextureCube(gl, [
      "media/posx512.jpg",
      "media/negx512.jpg",
      "media/posy512.jpg",
      "media/negy512.jpg",
      "media/posz512.jpg",
      "media/negz512.jpg",]
    );
    this.envBackgroundMaterial.envTexture.set(this.envTexture);

    this.envBackroundMesh = new Mesh(this.envBackgroundMaterial, this.texturedQuadGeometry);

    this.envBackgroundObject = new GameObject(this.envBackroundMesh);
    this.envBackgroundObject.drawShadow = false;
    this.gameObjects.push(this.envBackgroundObject);
    // environment background as full viewport quad (1)

    // procedural solid texturing (wood texture) (2)
    this.vsProcTexture = new Shader(gl, gl.VERTEX_SHADER, "proc-texture-vs.glsl");
    this.fsProcTexture = new Shader(gl, gl.FRAGMENT_SHADER, "proc-texture-fs.glsl");
    this.programs.push(
      this.procTextureProgram = new Program(gl, this.vsProcTexture, this.fsProcTexture));

    this.procTextureMaterial = new Material(this.procTextureProgram);
    this.procTextureMaterial.color1.set(0.38, 0.14, 0.12);
    this.procTextureMaterial.color1.mul(2);
    this.procTextureMaterial.color2.set(0.52, 0.29, 0.22);
    this.procTextureMaterial.color2.mul(2);
    this.procTextureMaterial.freq = 2.0;
    this.procTextureMaterial.noiseFreq = 4.0;
    this.procTextureMaterial.noiseExp = 1.0;
    this.procTextureMaterial.noiseAmp = 10.0;

    this.testMesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", 
        [this.procTextureMaterial, this.procTextureMaterial]);

    this.testGameObject = new GameObject(this.testMesh);
    this.gameObjects.push(this.testGameObject);
    // procedural solid texturing (wood texture) (2)

    // infinite plane (3)
    this.infinitePlaneGeometry = new InfinitePlaneGeometry(gl);
    this.infinitePlaneMaterial = new Material(this.texturedProgram);
    this.infinitePlaneTexture = new Texture2D(gl, "media/pattern.jpg");
    this.infinitePlaneMaterial.colorTexture.set(this.infinitePlaneTexture);
    this.infinitePlaneMesh = new Mesh(this.infinitePlaneMaterial, this.infinitePlaneGeometry);
    this.infinitePlaneObject = new GameObject(this.infinitePlaneMesh);
    this.infinitePlaneObject.drawShadow = false;
    this.gameObjects.push(this.infinitePlaneObject);
    // infinite plane (3)

    // plane projected shadows (4)
    this.vsPlaneProjShadow = new Shader(gl, gl.VERTEX_SHADER, "plane-proj-shadow-vs.glsl");
    this.fsShadow = new Shader(gl, gl.FRAGMENT_SHADER, "shadow-fs.glsl");
    this.programs.push(
      this.planeProjShadowProgram = new Program(gl, this.vsPlaneProjShadow, this.fsShadow));

    this.planeProjShadowMaterial = new Material(this.planeProjShadowProgram);

    this.shadowMatrix = new Mat4();
    // plane projected shadows (4)

    this.addComponentsAndGatherUniforms(...this.programs);

    gl.enable(gl.DEPTH_TEST);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.width / canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
    this.timeAtLastFrame = timeAtThisFrame;
    //this.time.set(t);
    this.time = t;

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.move(dt, keysPressed);

    for(const gameObject of this.gameObjects) {
      gameObject.control(t, dt, keysPressed, this.gameObjects);
    }
    for(const gameObject of this.gameObjects) {
      gameObject.move(t, dt);
    }
    for(const gameObject of this.gameObjects) {
      gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
      gameObject.draw(this, this.camera);
    }

    // plane projected shadows (4)
    /* the shadowMatrix is an affine transformation that projects
    each of a mesh's vertices onto its corresponding point on the
    ground plane with the given shadow direction. we construct
    this matrix as follows. firstly, each point already on the
    ground plane should be sent to itself. that is shadowMatrix
    maps (x, 0, z, 1) to (x, 0, z, 1). now, the point representing
    the light direction, (u, v, w, 0), must be mapped to the
    origin.

    as an affine transformation we know that the last column of
    the matrix must be (0, 0, 0, 1). furthermore, since we do not
    want to translate any of our points the last row of the matrix
    must be (0, 0, 0, 1). since after our projection the y component
    of every vertex must be 0, we must have that the second column
    of our matrix is (0, 0, 0, 0). that leaves us with the columns
    corresponding to the x and z components.

    recall that our matrix send (x, 0, z, 1) to (x, 0, z, 1) and
    sends (u, v, w, 1) to (0, 0, 0, 1). since in the first case
    (x, 0, z, 1) is an arbitrary point, this means that we also
    have that (u, 0, w, 1) gets sent to (u, 0, w, 1). since our
    matrix is a representation of a linear transformation we can
    use algebra to determine these remaining columns. firstly,
    suppose the first column of the matrix is (a, b, c, 0). then
    we have that both

      (u, 0, w, 1) dot (a, b, c, 0)T = u
      => au + cw = u

      and

      (u, v, w, 1) dot (a, b, c, 0)T = 0
      => au + vb + cw = 0.

      subtracting the first equation from the second yields

      vb = -u => b = -u/v.

    now, since our matrix is a linear transformation and (x, 0, z, 1)
    gets sent to (x, 0, z, 1), we can decompose (x, 0, z, 1) into
    x(1, 0, 0, 0) + z (0, 0, 1) + 1 (0, 0, 0, 1) and determine that
    a = 1 and c = 0. we can similarly do this for the column
    corresponding to the z component of the resulting vectors and
    determine that that column is (0, -z/y, 1, 0). we therefore
    have determined the affine matrix that does this shadow flattening
    projection for us.

    that last y offset is an epsilon so its above the ground plane
    */
    const shadowDir = new Vec3(Math.cos(this.time), 1, Math.sin(this.time));
    this.shadowMatrix.set(
      1, 0, 0, 0,
      -shadowDir.x / shadowDir.y, 0, -shadowDir.z / shadowDir.y, 0,
      0, 0, 1, 0,
      0, 0.001, 0, 1
      ).
    invert();

    for(const gameObject of this.gameObjects) {
      // dont draw shadow if infinite plane or environment background
      if(gameObject.drawShadow){
        gameObject.using(this.planeProjShadowMaterial).draw(this, this.camera);
      }
    }
    // plane projected shadows (4)
  }
}
