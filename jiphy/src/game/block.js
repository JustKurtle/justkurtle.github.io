import "../jiph/core.js"
import "../jiph/math.js"

self.Shader = class Shader {
  constructor(gl, texture) {
    this.shader = jLoadShader(gl, `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;

      uniform mat4 uModelViewMatrix;

      uniform mat4 uProjectionMatrix;
      uniform mat4 uLookAtMatrix;

      varying highp vec2 vTextureCoord;

      void main(void) {
        gl_Position = aVertexPosition * (uModelViewMatrix * uLookAtMatrix * uProjectionMatrix);
        vTextureCoord = aTextureCoord;
      }`,
      `
      varying highp vec2 vTextureCoord;

      uniform sampler2D uSampler;

      void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
      }`
    );

    this.variables = {
      "aTextureCoord": gl.getAttribLocation(this.shader, "aTextureCoord"),
      "aVertexPosition": gl.getAttribLocation(this.shader, "aVertexPosition"),
      "uModelViewMatrix": gl.getUniformLocation(this.shader, "uModelViewMatrix"),
      "uProjectionMatrix": gl.getUniformLocation(this.shader, "uProjectionMatrix"),
      "uLookAtMatrix": gl.getUniformLocation(this.shader, "uLookAtMatrix"),
      "uSampler": gl.getUniformLocation(this.shader, "uSampler"),
    };

    {
      const tcArray = new Float32Array([
        0,0,  1,0,  1,1,  0,1, // +z
        0,0,  1,0,  1,1,  0,1, // -z
        0,0,  1,0,  1,1,  0,1, // +y
        0,0,  1,0,  1,1,  0,1, // -y
        0,0,  1,0,  1,1,  0,1, // +x
        0,0,  1,0,  1,1,  0,1, // -x
      ]);
      this.tcBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, tcArray, gl.STATIC_DRAW);
    }
    {
      const vArray = new Float32Array([
        0,0,1,  1,0,1,  1,1,1,  0,1,1, // +z
        0,1,0,  1,1,0,  1,0,0,  0,0,0, // -z
        0,0,0,  1,0,0,  1,0,1,  0,0,1, // +y
        0,1,1,  1,1,1,  1,1,0,  0,1,0, // -y
        1,0,0,  1,1,0,  1,1,1,  1,0,1, // +x
        0,0,1,  0,1,1,  0,1,0,  0,0,0, // -x
      ]);
      this.vBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vArray, gl.STATIC_DRAW);
    }
    {
      const iArray = new Uint16Array([
         0, 1, 2,  0, 2, 3,
         4, 5, 6,  4, 6, 7,
         8, 9,10,  8,10,11,
        12,13,14, 12,14,15,
        16,17,18, 16,18,19,
        20,21,22, 20,22,23,
      ]);
      this.iBufferLength = iArray.length;

      this.iBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, iArray, gl.STATIC_DRAW);
    }

    this.modelViewMatrix = new Mat4f();
    this.projectionMatrix = new Mat4f();
    this.lookAtMatrix = new Mat4f();
    this.texture = texture;
  }

  use(gl) {
    gl.useProgram(this.shader);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.variables.uSampler, 0);

    gl.uniformMatrix4fv(this.variables.uModelViewMatrix, false, this.modelViewMatrix);
    gl.uniformMatrix4fv(this.variables.uProjectionMatrix, false, this.projectionMatrix);
    gl.uniformMatrix4fv(this.variables.uLookAtMatrix, false, this.lookAtMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
    gl.enableVertexAttribArray(this.variables.aVertexPosition);
    gl.vertexAttribPointer(this.variables.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
    gl.enableVertexAttribArray(this.variables.aTextureCoord);
    gl.vertexAttribPointer(this.variables.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
    gl.drawElements(gl.TRIANGLES, this.iBufferLength, gl.UNSIGNED_SHORT, 0);
  }
}

self.Block = class Chunk {
  constructor(x, y, z, material) {
    this.box = new jBox(new Vec3f(x, y, z), 1, 1, 1);
    this.shaderMat = material;
  }

  update(dt = 1) {
    
  }

  draw(gl) {
    this.shaderMat.modelViewMatrix.t(this.box.srcPos);
    this.shaderMat.use(gl);
  }
};
