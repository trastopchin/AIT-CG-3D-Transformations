# AIT-CG-3D-Transformations

Create a small 3D scene implementing some features related to 3D tranformations. Created as a first milestone of the 3D project for my Computer Graphics course at the Aquincum Instute of Technology the fall of 2019 with professor László Szécsi.

<p align="center">
  <img src="/resources/screenshot01.png" alt="A screenshot of the running project demonstrating each of the completed features." width="800">
</p>

One should be able to download the [2D_textures_and_physics]() folder and open up the [index.html]() file in a web browser to see the project. To navigate the scene one can use the WASD keys to move around as well as click down and drag the mouse to change the camera's orientation. In the case of google chrome, one might have to open the browser with `open /Applications/Google\ Chrome.app --args --allow-file-access-from-files` in order to load images and textures properly. This project was built upon László Szécsi's starter code and class powerpoint slides.

## Completed Features:

1. **Avatar control: Rocket science.** The avatar has three thrusters. The UP key corresponds to a thruster that applies a force in the forward direction of the avatar; the LEFT key corresponds to a thruster that applies a force in the forwards and left direction of the avatar as well as a counterclockwise torque; the RIGHT key corresponds to a thruster that applies a force in the forwards and right direction of the avatar as well as a clockwise torque.

1. **Background: Environment background as full viewport quad.** Displays an environment stored in a cube texture as the background of the 3D scene. As the camera rotates the correct part of the surrounding environment is shown.

2. **Procedural solid texturing: Wood texture.** One object has a pixel shader that computes a procedural texture from the model space position.

3. **Ground: Infinite plane.** There is an infinite ground plane with some tileable texture repeated infinitely. The plane is defined with one point at the origin and three points at infinity.

4. **Shadows: Directional plane projected shadows.** A directional light casts shadows of objects on the ground. Every scene object is projected onto the ground and rendered with a black fragment shader.

## Built With

* [WebGLMath](https://github.com/szecsi/WebGLMath) - László Szécsi's vector math library for WebGL programming.
