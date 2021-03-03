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
    constructor(src, w, h, xOff = 0, yOff = 0) {
      this.src = src;
      this.xOff = xOff; 
      this.yOff = yOff;
      this.w = w;
      this.h = h;
    }

    get x() { return this.src.x + this.xOff; }
    get y() { return this.src.y + this.yOff; }
    get xm() { return this.x + this.w; }
    get ym() { return this.y + this.h; }

    overlap(that) {
      const x = check(this.x, this.xm, that.x, that.xm);
      const y = check(this.y, this.ym, that.y, that.ym);

      switch(Math.min(x * x, y * y)) {
        case x * x:
          return new Vec3(x, 0);
        case y * y:
          return new Vec3(0, y);
        default:
          return new Vec3();
      }
    }
    overlaps(that) {
      return !(
        this.x  >= that.xm ||
        this.xm <= that.x  ||
        this.y  >= that.ym ||
        this.ym <= that.y
      );
    }
    contains(that) {
      return (
        this.x  <= that.x  ||
        this.xm >= that.xm ||
        this.y  <= that.y  ||
        this.ym >= that.ym
      );
    }
  };
  self.jLine = class jLine {
    constructor(src, dir) {
      this.src = src;
      this.dir = dir;
    }

    get x() { return this.src[0]; }
    get y() { return this.src[1]; }
    get xm() { return this.x + this.dir[0]; }
    get ym() { return this.y + this.dir[1]; }

    overlap(that) {
      if(this.overlaps(that)) {
        const mx = Math.min((that.x - this.x) / this.dir.x, (that.xm - this.x) / this.dir.x);
        const my = Math.min((that.y - this.y) / this.dir.y, (that.ym - this.y) / this.dir.y);
        return this.dir.m(Math.max(mx, my), new Vec3()).a(this.src);
      }
      return this.dir.a(this.src, new Vec3());
    }
    overlaps(that) {
      if (
        Math.min(this.x, this.xm) >= that.xm ||
        Math.max(this.x, this.xm) <= that.x  ||
        Math.min(this.y, this.ym) >= that.ym ||
        Math.max(this.y, this.ym) <= that.y
      ) return false;
      const l = new Vec3(this.dir.unit.y,-this.dir.unit.x);
      const c = [
        l.dot([that.x  - this.x, that.y  - this.y,0]),
        l.dot([that.x  - this.x, that.ym - this.y,0]),
        l.dot([that.xm - this.x, that.y  - this.y,0]),
        l.dot([that.xm - this.x, that.ym - this.y,0])
      ];
      const min = Math.min(...c), max = Math.max(...c);
      return !(0 >= max || 0 <= min);
    }
  };

  self.jBox = class jBox {
    constructor(src, w, h, d, xOff = 0, yOff = 0, zOff = 0) {
      this.src = src;
      this.xOff = xOff;
      this.yOff = yOff;
      this.zOff = zOff;
      this.w = w;
      this.h = h;
      this.d = d;
    }

    get x() { return this.src[0] + this.xOff; }
    get y() { return this.src[1] + this.yOff; }
    get z() { return this.src[2] + this.zOff; }
    get xm() { return this.x + this.w; }
    get ym() { return this.y + this.h; }
    get zm() { return this.z + this.d; }

    overlap(that) {
      const x = check(this.x, this.xm, that.x, that.xm);
      const y = check(this.y, this.ym, that.y, that.ym);
      const z = check(this.z, this.zm, that.z, that.zm);

      switch(Math.min(x * x, y * y, z * z)) {
        case x * x:
          return new Vec3(x, 0, 0);
        case y * y:
          return new Vec3(0, y, 0);
        case z * z:
          return new Vec3(0, 0, z);
        default:
          return new Vec3();
      }
    }
    overlaps(that) {
      return !(
        this.x  >= that.xm ||
        this.xm <= that.x  ||
        this.y  >= that.ym ||
        this.ym <= that.y  ||
        this.z  >= that.zm ||
        this.zm <= that.z
      );
    }
    contains(that) {
      return (
        this.x  <= that.x  ||
        this.xm >= that.xm ||
        this.y  <= that.y  ||
        this.ym >= that.ym ||
        this.z  <= that.z  ||
        this.zm >= that.zm
      );
    }
  };
  self.jRay = class jRay {
    constructor(src, dir) {
      this.src = src;
      this.dir = dir;
    }

    get x() { return this.src[0]; }
    get y() { return this.src[1]; }
    get z() { return this.src[2]; }
    get xm() { return this.src[0] + this.dir[0]; }
    get ym() { return this.src[1] + this.dir[1]; }
    get zm() { return this.src[2] + this.dir[2]; }

    hit(that) {
      if(this.hits(that)) {
        const mx = Math.min((that.x - this.x) / this.dir.x, (that.xm - this.x) / this.dir.x);
        const my = Math.min((that.y - this.y) / this.dir.y, (that.ym - this.y) / this.dir.y);
        const mz = Math.min((that.z - this.z) / this.dir.z, (that.zm - this.z) / this.dir.z);
        return this.dir.m(Math.max(mx, my, mz), new Vec3());
      }
      return new Vec3();
    }
    hits(that) {
      if (
        Math.min(this.x, this.xm) >= that.xm ||
        Math.max(this.x, this.xm) <= that.x  ||
        Math.min(this.y, this.ym) >= that.ym ||
        Math.max(this.y, this.ym) <= that.y  ||
        Math.min(this.z, this.zm) >= that.zm ||
        Math.max(this.z, this.zm) <= that.z
      ) return false;
      const l = this.dir.cross(that.src.s(this.src, []));
      const c = [
        l.dot([that.x  - this.x, that.y  - this.y, that.z  - this.z]),
        l.dot([that.x  - this.x, that.ym - this.y, that.z  - this.z]),
        l.dot([that.xm - this.x, that.y  - this.y, that.z  - this.z]),
        l.dot([that.xm - this.x, that.ym - this.y, that.z  - this.z]),
        l.dot([that.x  - this.x, that.y  - this.y, that.zm - this.z]),
        l.dot([that.x  - this.x, that.ym - this.y, that.zm - this.z]),
        l.dot([that.xm - this.x, that.y  - this.y, that.zm - this.z]),
        l.dot([that.xm - this.x, that.ym - this.y, that.zm - this.z])
      ];
      const min = Math.min(...c), max = Math.max(...c);
      return !(0 >= max || 0 <= min);
    }
  };
}

// gl things
{
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
  self.jShader = function(gl, source) {
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, source[0]);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vShader));
      gl.deleteShader(vShader);
      return -1;
    }

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, source[1]);
    gl.compileShader(fShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fShader));
      gl.deleteShader(fShader);
      return -2;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getShaderInfoLog(program));
      return -3;
    }

    let setters = {};
    {
      let i = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      while(i--) {
        const info = gl.getActiveAttrib(program, i);
        const location = gl.getAttribLocation(program, info.name);
        setters[info.name] = b => {
          if (b.value) {
            gl.disableVertexAttribArray(location);
            gl['vertexAttrib'+b.value.length+'fv'](location, b.value);
          } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
          }
        }
      }
    }

    {
      let i = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      while(i--) {
        const info = gl.getActiveUniform(program, i);
        const location = gl.getUniformLocation(program, info.name);
        switch(info.type) {
          case gl.FLOAT:
            setters[info.name] = v => gl.uniform1fv(location, v.length >= 0 ? v : [v]);
            break;
          case gl.FLOAT_VEC2:
            setters[info.name] = v => gl.uniform2fv(location, v);
            break;
          case gl.FLOAT_VEC3:
            setters[info.name] = v => gl.uniform3fv(location, v);
            break;
          case gl.FLOAT_VEC4:
            setters[info.name] = v => gl.uniform4fv(location, v);
            break;
          case gl.INT:
          case gl.BOOL:
            setters[info.name] = v => gl.uniform1iv(location, v.length >= 0 ? v : [v]);
            break;
          case gl.INT_VEC2:
          case gl.BOOL_VEC2:
            setters[info.name] = v => gl.uniform2iv(location, v);
            break;
          case gl.INT_VEC3:
          case gl.BOOL_VEC3:
            setters[info.name] = v => gl.uniform3iv(location, v);
            break;
          case gl.INT_VEC4:
          case gl.BOOL_VEC4:
            setters[info.name] = v => gl.uniform4iv(location, v);
            break;
          case gl.FLOAT_MAT2:
            setters[info.name] = v => gl.uniformMatrix2fv(location, false, v);
            break;
          case gl.FLOAT_MAT3:
            setters[info.name] = v => gl.uniformMatrix3fv(location, false, v);
            break;
          case gl.FLOAT_MAT4:
            setters[info.name] = v => gl.uniformMatrix4fv(location, false, v);
            break;
          case gl.SAMPLER_2D:
          case gl.SAMPLER_CUBE:
            setters[info.name] = (v) => {
              gl.uniform1i(location, 0);
              gl.activeTexture(gl.TEXTURE0);
              gl.bindTexture(gl.TEXTURE_2D, v);
            };
            break;
        }
      }
    }
    return {
      program: program,
      set(values) {
        gl.useProgram(program);
        for(let i in values) if(setters[i]) setters[i](values[i]);
      }
    }
  };
  self.jBuffers = (gl, arrays) => {
    let out = {};
    for(let i in arrays) { 
      out[i] = {...arrays[i]};
      delete(out[i].array);
      out[i].buffer = gl.createBuffer();
      if(i === 'index') {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, out[i].buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrays[i].array), gl.STATIC_DRAW);
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, out[i].buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrays[i].array), gl.STATIC_DRAW);
      }
    }
    return out;
  };

  // todo
  self.jScene = class Scene {
    constructor(gl) {
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clearColor(0.0, 0.2, 0.5, 1.0);
      gl.clearDepth(1.0);
    }

    clear(gl) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    draw(gl) {
      
    }
  };
  self.jCamera = class Camera {
    projection;
    lookAt;
  };
}
