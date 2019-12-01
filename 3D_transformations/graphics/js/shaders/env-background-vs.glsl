/*
Tal Rastopchin
November 10, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.

Implemented the following:
  (1) vertex shader for environment background as full
  viewport quad
*/
Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  out vec4 rayDirection;

  uniform struct {
    mat4 rayDirMatrix;
  } camera;

  void main(void) {
    gl_Position = vertexPosition;
    gl_Position.z = 0.99999;

  	rayDirection = vertexPosition * camera.rayDirMatrix;
  }
`;