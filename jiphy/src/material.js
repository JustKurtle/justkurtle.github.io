self.Shader = class shader {
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

    this.sVar = {
      "aTextureCoord": gl.getAttribLocation(this.shader, "aTextureCoord"),
      "aVertexPosition": gl.getAttribLocation(this.shader, "aVertexPosition"),
      "uModelViewMatrix": gl.getUniformLocation(this.shader, "uModelViewMatrix"),
      "uProjectionMatrix": gl.getUniformLocation(this.shader, "uProjectionMatrix"),
      "uLookAtMatrix": gl.getUniformLocation(this.shader, "uLookAtMatrix"),
      "uSampler": gl.getUniformLocation(this.shader, "uSampler"),
    };

    {
      const tcArray = new Float32Array([
        0/3,0/3,  1/3,0/3,  1/3,1/3,  0/3,1/3,
        1/3,0/3,  2/3,0/3,  2/3,1/3,  1/3,1/3,
        2/3,0/3,  3/3,0/3,  3/3,1/3,  2/3,1/3,

        0/3,1/3,  1/3,1/3,  1/3,2/3,  0/3,2/3,
        1/3,1/3,  2/3,1/3,  2/3,2/3,  1/3,2/3,
        2/3,1/3,  3/3,1/3,  3/3,2/3,  2/3,2/3,

        0/3,2/3,  1/3,2/3,  1/3,3/3,  0/3,3/3,
        1/3,2/3,  2/3,2/3,  2/3,3/3,  1/3,3/3,
        2/3,2/3,  3/3,2/3,  3/3,3/3,  2/3,3/3,
      ]);
      this.tcBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, tcArray, gl.STATIC_DRAW);
    }
    {
      const vArray = new Float32Array([
        0/3,0/3,  1/3,0/3,  1/3,1/3,  0/3,1/3,
        1/3,0/3,  2/3,0/3,  2/3,1/3,  1/3,1/3,
        2/3,0/3,  3/3,0/3,  3/3,1/3,  2/3,1/3,

        0/3,1/3,  1/3,1/3,  1/3,2/3,  0/3,2/3,
        1/3,1/3,  2/3,1/3,  2/3,2/3,  1/3,2/3,
        2/3,1/3,  3/3,1/3,  3/3,2/3,  2/3,2/3,

        0/3,2/3,  1/3,2/3,  1/3,3/3,  0/3,3/3,
        1/3,2/3,  2/3,2/3,  2/3,3/3,  1/3,3/3,
        2/3,2/3,  3/3,2/3,  3/3,3/3,  2/3,3/3,
      ]);
      for(let i in vArray) { vArray[i] -= 0.5; }
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
        24,25,26, 24,26,27,
        28,29,30, 28,30,31,
        32,33,34, 32,34,35,
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
    gl.uniform1i(this.sVar.uSampler, 0);

    gl.uniformMatrix4fv(this.sVar.uModelViewMatrix, false, this.modelViewMatrix);
    gl.uniformMatrix4fv(this.sVar.uProjectionMatrix, false, this.projectionMatrix);
    gl.uniformMatrix4fv(this.sVar.uLookAtMatrix, false, this.lookAtMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
    gl.enableVertexAttribArray(this.sVar.aVertexPosition);
    gl.vertexAttribPointer(this.sVar.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.tcBuffer);
    gl.enableVertexAttribArray(this.sVar.aTextureCoord);
    gl.vertexAttribPointer(this.sVar.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
    gl.drawElements(gl.TRIANGLES, this.iBufferLength, gl.UNSIGNED_SHORT, 0);
  }
};