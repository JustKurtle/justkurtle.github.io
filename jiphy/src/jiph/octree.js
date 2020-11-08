if(self.Octree === undefined) {
  self.Octree = class Octree {
    constructor(center, size, maxDepth = 16) {
      this.#center = center;
      this.#size = size;
      this.#depth = maxDepth;
    }

    #center;
    #size;
    #depth;

    #values = [];
    #nodes = [];

    get(center,size) {
      let out = [];
      if(this.#intersects(center,size)) {
        if(this.#nodes.length) {
          out.push(...this.#nodes[0].get(center,size));
          out.push(...this.#nodes[1].get(center,size));
          out.push(...this.#nodes[2].get(center,size));
          out.push(...this.#nodes[3].get(center,size));
          out.push(...this.#nodes[4].get(center,size));
          out.push(...this.#nodes[5].get(center,size));
          out.push(...this.#nodes[6].get(center,size));
          out.push(...this.#nodes[7].get(center,size));
        }
        out.push(...this.#values);
      }
      return out;
    }
    set(center,size,value) {
      if(this.#contains(center,size)) {
        if(!!this.#depth && !this.#nodes.length) this.#split();
        if(!!this.#depth && (
          this.#nodes[0].set(center,size,value) ||
          this.#nodes[1].set(center,size,value) ||
          this.#nodes[2].set(center,size,value) ||
          this.#nodes[3].set(center,size,value) ||
          this.#nodes[4].set(center,size,value) ||
          this.#nodes[5].set(center,size,value) ||
          this.#nodes[6].set(center,size,value) ||
          this.#nodes[7].set(center,size,value)
        )) return true;
        this.#values.push(value);
        return true;
      }
      return false
    }

    // Private utils
    #split() {    
      let size = [this.#size[0] / 2, this.#size[1] / 2, this.#size[2] / 2];
      let [x,_x] = [this.#center[0] + size[0], this.#center[0] - size[0]];
      let [y,_y] = [this.#center[1] + size[1], this.#center[1] - size[1]];
      let [z,_z] = [this.#center[2] + size[2], this.#center[2] - size[2]];
      this.#nodes[0] = new Octree([_x,_y,_z], size, this.#depth - 1);
      this.#nodes[1] = new Octree([ x,_y,_z], size, this.#depth - 1);
      this.#nodes[2] = new Octree([_x, y,_z], size, this.#depth - 1);
      this.#nodes[3] = new Octree([ x, y,_z], size, this.#depth - 1);
      this.#nodes[4] = new Octree([_x,_y, z], size, this.#depth - 1);
      this.#nodes[5] = new Octree([ x,_y, z], size, this.#depth - 1);
      this.#nodes[6] = new Octree([_x, y, z], size, this.#depth - 1);
      this.#nodes[7] = new Octree([ x, y, z], size, this.#depth - 1);
    }
    #intersects(center, size) {
      return !(
        this.#center[0] - this.#size[0] >= center[0] + size[0] ||
        this.#center[0] + this.#size[0] <= center[0] - size[0] ||
        this.#center[1] - this.#size[1] >= center[1] + size[1] ||
        this.#center[1] + this.#size[1] <= center[1] - size[1] ||
        this.#center[3] - this.#size[3] >= center[3] + size[3] ||
        this.#center[3] + this.#size[3] <= center[3] - size[3]
      );
    }
    #contains(center, size) {
      return (
        this.#center[0] - this.#size[0] <= center[0] - size[0] &&
        this.#center[0] + this.#size[0] >= center[0] + size[0] &&
        this.#center[1] - this.#size[1] <= center[1] - size[1] &&
        this.#center[1] + this.#size[1] >= center[1] + size[1] &&
        this.#center[2] - this.#size[2] <= center[2] - size[2] &&
        this.#center[2] + this.#size[2] >= center[2] + size[2]
      );
    }
  };

  self.Quadtree = class Quadtree {
    constructor(center, size, depth = 16) {
      this.#center = center;
      this.#size = size;
      this.#depth = depth;
    }
  
    #center;
    #size;
    #depth; 
    #nodes = [];
    #values = [];
  
    get(center, size) {
      let out = [];
      if(this.#intersects(center, size)) {
        out.push(...this.#values);
        if(this.#nodes.length) {
          out.push(...this.#nodes[0].get(center,size));
          out.push(...this.#nodes[1].get(center,size));
          out.push(...this.#nodes[2].get(center,size));
          out.push(...this.#nodes[3].get(center,size));
        }
      }
      return out;
    }
    set(center, size, value) {
      if(this.#contains(center, size)) {
        if(!!this.#depth && !this.#nodes.length) this.split();
        if(!!this.#depth && ( 
          this.#nodes[0].set(center,size,value) || 
          this.#nodes[1].set(center,size,value) || 
          this.#nodes[2].set(center,size,value) || 
          this.#nodes[3].set(center,size,value)
          )) return true;
        this.#values.push(value);
        return true;
      }
      return false;
    }
  
    // Private Utils
    #split() {
      let size = [this.#size[0] / 2, this.#size[1] / 2];
      let [x,_x] = [this.#center[0] + size[0], this.#center[0] - size[0]];
      let [y,_y] = [this.#center[1] + size[1], this.#center[1] - size[1]];
      this.#nodes[3] = new Quadtree([ x, y], size, this.#depth - 1);
      this.#nodes[2] = new Quadtree([_x, y], size, this.#depth - 1);
      this.#nodes[1] = new Quadtree([ x,_y], size, this.#depth - 1);
      this.#nodes[0] = new Quadtree([_x,_y], size, this.#depth - 1);
    }
    #intersects(center, size) {
      return !(
        this.#center[0] - this.#size[0] >= center[0] + size[0] ||
        this.#center[0] + this.#size[0] <= center[0] - size[0] ||
        this.#center[1] - this.#size[1] >= center[1] + size[1] ||
        this.#center[1] + this.#size[1] <= center[1] - size[1]
      );
    }
    #contains(center, size) {
      return (
        this.#center[0] - this.#size[0] <= center[0] - size[0] &&
        this.#center[0] + this.#size[0] >= center[0] + size[0] &&
        this.#center[1] - this.#size[1] <= center[1] - size[1] &&
        this.#center[1] + this.#size[1] >= center[1] + size[1]
      );
    }
  };
}
