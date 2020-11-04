// math things
{
  function check(sMin, sMax, oMin, oMax) {
    const O1 = sMin <= oMax && sMin >= oMin,
          O2 = oMin <= sMax && oMin >= sMin;
    if(O1 || O2) {
      const min1 = oMax - sMin,
            min2 = oMin - sMax;
      return (Math.abs(min1) <= Math.abs(min2)) ? min1 : min2;
    }
    return null;
  }

  self.jRect = class jRect {
    constructor(srcPos, w, h, xOff = 0, yOff = 0) {
      this.srcPos = srcPos;
      this.offset = new Vec3f(xOff, yOff);

      this.w = w;
      this.h = h;
    }

    get x() { return this.srcPos.x + this.offset.x; }
    get y() { return this.srcPos.y + this.offset.y; }
    get xm() { return this.x + this.w; }
    get ym() { return this.y + this.h; }

    intersect(that) {
      const x = check(this.x, this.xm, that.x, that.xm);
      const y = check(this.y, this.ym, that.y, that.ym);

      switch(Math.min(x * x, y * y)) {
        case x * x:
          return new Vec3f(x, 0);
        case y * y:
          return new Vec3f(0, y);
        default:
          return new Vec3f();
      }
    }
  };
  self.jBox = class jRect {
    constructor(srcPos, w, h, d, xOff = 0, yOff = 0, zOff = 0) {
      this.srcPos = srcPos;
      this.offset = new Vec3f(xOff, yOff, zOff);

      this.w = w;
      this.h = h;
      this.d = d;
    }

    get x() { return this.srcPos.x + this.offset.x; }
    get y() { return this.srcPos.y + this.offset.y; }
    get z() { return this.srcPos.z + this.offset.z; }
    get xm() { return this.x + this.w; }
    get ym() { return this.y + this.h; }
    get zm() { return this.z + this.d; }

    intersect(that) {
      const x = check(this.x, this.xm, that.x, that.xm);
      const y = check(this.y, this.ym, that.y, that.ym);
      const z = check(this.z, this.zm, that.z, that.zm);

      switch(Math.min(x * x, y * y, z * z)) {
        case x * x:
          return new Vec3f(x, 0, 0);
        case y * y:
          return new Vec3f(0, y, 0);
        case z * z:
          return new Vec3f(0, 0, z);
        default:
          return new Vec3f();
      }
    }
  };
}

// gl things
{
  self.jLoadShader = function(gl, vertexSrc, fragmentSrc) {
    function compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw('An error occurred compiling the shaders: ' + log);
      }

      return shader;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const log = gl.getShaderInfoLog(shaderProgram);
      throw('Unable to initialize the shader program: ' + log);
    }
    return shaderProgram;
  };

  self.jLoadTexture = function(gl, path) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, 1, 1, 0, srcFormat, srcType, pixel);

    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    };
    image.src = path;
    return texture;
  };

  self.Camera = class Camera {
    constructor() {
      
    }

    lookAt;  
    projection;
  };
}
