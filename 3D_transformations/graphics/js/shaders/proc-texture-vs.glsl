/*
Tal Rastopchin
November 10, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.

Implemented the following:
  (1) vertex shader for wood procedural texturing
*/
Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  
  in vec4 vertexPosition;
  out vec4 modelPosition;

  uniform struct {
  	mat4 modelMatrix;
  } gameObject;

  uniform struct {
    mat4 viewProjMatrix;
  } camera;

  void main(void) {
    gl_Position = vertexPosition * gameObject.modelMatrix * camera.viewProjMatrix;
    modelPosition = vertexPosition;
  }
`;