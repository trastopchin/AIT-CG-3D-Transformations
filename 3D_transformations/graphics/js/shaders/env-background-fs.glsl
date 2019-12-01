/*
Tal Rastopchin
November 10, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.

Implemented the following:
  (1) fragment shader for environment background as full
  viewport quad
*/
Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  in vec4 rayDirection;
  out vec4 fragmentColor;

  uniform struct {
  	samplerCube envTexture;
  } material;

  void main(void) {
    fragmentColor = texture (material.envTexture, rayDirection.xyz);
  }
`;