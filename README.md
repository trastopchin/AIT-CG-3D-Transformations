# AIT-CG-3D-Transformations

Created a small 3D scene implementing some features related to 3D transformations. Created as a first milestone of the 3D project for my Computer Graphics course at the Aquincum Instute of Technology the fall of 2019 with professor László Szécsi.

<p align="center">
  <img src="/resources/screenshot01.png" alt="A screenshot of the running project demonstrating each of the completed features." width="800">
</p>

One should be able to download the [3D_transformations](https://github.com/trastopchin/AIT-CG-3D-Transformations/tree/master/3D_transformations) folder and open up the [index.html](https://github.com/trastopchin/AIT-CG-3D-Transformations/blob/master/3D_transformations/graphics/index.html) file in a web browser to see the project. To navigate the scene one can use the WASD keys to move around as well as click down and drag the mouse to change the camera's orientation. In the case of google chrome, one might have to open the browser with `open /Applications/Google\ Chrome.app --args --allow-file-access-from-files` in order to load images and textures properly. This project was built upon László Szécsi's starter code and class powerpoint slides.

## Completed Features:

1. **Background: Environment background as full viewport quad.** Displays an environment stored in a cube texture as the background of the 3D scene. As the camera rotates the correct part of the surrounding environment is shown.

2. **Procedural solid texturing: Wood texture.** One object has a pixel shader that computes a procedural texture from the model space position.

3. **Ground: Infinite plane.** There is an infinite ground plane with some tileable texture repeated infinitely. The plane is defined with one point at the origin and three points at infinity.

4. **Shadows: Directional plane projected shadows.** A directional light casts shadows of objects on the ground. Every scene object is projected onto the ground and rendered with a black fragment shader.

## Built With

* [WebGLMath](https://github.com/szecsi/WebGLMath) - László Szécsi's vector math library for WebGL programming.
