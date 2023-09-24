import { extend, binaryInsert, binarySearch } from "../arrays/ArrayTools.js";

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
        binaryInsert(this.#entities, entity, v => v._id);
    }

    addEntities(entities) {
        extend(this.#entities, entities);
        this.#entities.sort((a, b) => a._id - b._id);
    }

    removeEntity(entity) {
        let index = binarySearch(this.#entities, entity, v => v._id);
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
