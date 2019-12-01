/*
Tal Rastopchin
November 10, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.

Implemented the following:
  (1) vertex shader for wood procedural texturing
*/
Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  in vec4 modelPosition;
  out vec4 fragmentColor;

  uniform struct {
    vec3 color1;
    vec3 color2;
    float freq;
    float noiseFreq;
    float noiseExp;
    float noiseAmp;
  } material;

  float snoise(vec3 r);

  void main(void) {
    float noise = pow(snoise(modelPosition.xyz * material.noiseFreq), material.noiseExp) * material.noiseAmp;

    float w = fract(modelPosition.z * material.freq + noise);
    vec3 color = mix(material.color1, material.color2 ,w);
    fragmentColor = vec4(color.xyz, 1);
  }

  float snoise(vec3 r) {
    vec3 s = vec3(7502, 22777, 4767);
    float f = 0.0;
    for(int i=0; i<16; i++) {
      f += sin( dot(s - vec3(32768, 32768, 32768), r)
       / 65536.0);
      s = mod(s, 32768.0) * 2.0 + floor(s / 32768.0);
    }
    return f / 32.0 + 0.5;
  }
`;