/*
Tal Rastopchin
November 10, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.

Implemented the following:
  (1) homogeneous division in FS before using texture
  coords -> tex.xy/tex.w
*/
Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color;
  in vec4 tex;

  uniform struct{
  	vec4 solidColor;
  	sampler2D colorTexture;
  } material;

  uniform struct {
    float time;
  } scene;

  void main(void) {
    fragmentColor = material.solidColor * cos(scene.time) * 0.01
     + texture(material.colorTexture, tex.xy/tex.w);
  }
`;