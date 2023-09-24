import { binarySearch } from "../arrays/ArrayTools.js";

class EntityContainer {
    #entityUID;
    #entities;
    #systems;

    constructor() {
        this.#entityUID = 0;
        this.#entities = [];
        this.#systems = [];
    }

    addEntity(entity) {
        entity._id = this.#entityUID++;
        this.#entities.push(entity);
    }

    addEntities(entities) {
        this.#entities.length += entities.length;
        for(let iter = 0;iter < entities.length;iter++) {
            entities[iter]._id = this.#entityUID++;
            this.#entities[this.#entities.length - iter] = entities[iter];
        }
    }

    removeEntity(entity) {
        let index = binarySearch(this.#entities, entity, v => v._id);
        console.log(index);
        this.#entities.splice(index, 1);
    }

    addSystem(system) {
        this.#systems.unshift(system);
    }

    removeSystem(systemName) {
        // May need to be faster in cases with large amounts of systems
        let i = this.#systems.length;
        while(i-- && this.#systems[i].name != systemName);
        return this.#systems.splice(i, 1);
    }

    run(dt) {
        let sysIter = this.#systems.length;
        while(sysIter--) {
            let system = this.#systems[sysIter];

            let entIter = this.#entities.length;
            while(entIter--) {
                let entity = this.#entities[entIter];
                
                system(entity, dt);
            }
        }
    }
}

export default EntityContainer;
