/*
Tal Rastopchin
November 10, 2019

Adapted from Laszlo Szecsi's homework starter code and
powerpoint slide instructions.

Implemented the following:
  (1) infinite plane
*/
"use strict";
/* exported InfinitePlaneGeometry */
class InfinitePlaneGeometry {
	constructor(gl) {
		this.gl = gl;

		this.vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array([
				0, 0, 0, 1,
        Math.cos(0), 0, Math.sin(0), 0,
        Math.cos(2*Math.PI/3), 0, Math.sin(2*Math.PI/3), 0,
        Math.cos(2*Math.PI*2/3), 0, Math.sin(2*Math.PI*2/3), 0
				]),
			gl.STATIC_DRAW);

		this.vertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array([
				0,  0, 1,
				0,  0, 1,
				0,  0, 1,
				0,  0, 1,         
				]),
			gl.STATIC_DRAW);

    // multiply texcoords by 0.1 to hardcode a scaling
		this.vertexTexCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer); 
		gl.bufferData(gl.ARRAY_BUFFER, 
			new Float32Array([
        0, 0, 0, 1,
        0.1 * Math.cos(0), 0.1 * Math.sin(0), 0, 0,
        0.1 * Math.cos(2*Math.PI/3), 0.1 *  Math.sin(2*Math.PI/3), 0, 0,
        0.1 * Math.cos(2*Math.PI*2/3), 0.1 *  Math.sin(2*Math.PI*2/3), 0, 0
				]), 
			gl.STATIC_DRAW);


    // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([
        0, 1, 2,
        0, 2, 3,
        0, 3, 1
      ]),
      gl.STATIC_DRAW);


    // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
    this.inputLayout = gl.createVertexArray();
    gl.bindVertexArray(this.inputLayout);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,
      4, gl.FLOAT,
      false,
      0,
      0
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,
      3, gl.FLOAT,
      false,
      0,
      0 
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2,
      4, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );     

    gl.bindVertexArray(null);
  }

  draw() {
    const gl = this.gl;

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);  

    gl.drawElements(gl.TRIANGLES, 9, gl.UNSIGNED_SHORT, 0);
  }
}