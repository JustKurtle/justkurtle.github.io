// @ts-check
import { binarySearch } from "./arrays/ArrayTools.js";

/**
 * @param {any} a 
 * @param {number} b 
 * @returns {number}
 */
function entity_accessor(a, b) { return a._id - b; }

/** Contains and semi-manages entities and systems */
class EntityManager {
    /** @type number */
    #entityUID;
    /** @type Object[] */
    #entities;
    /** @type Function[] */
    #systems;

    constructor() {
        this.#entityUID = 0;
        this.#entities = [];
        this.#systems = [];

        this.entities = this.#entities;
    }

    /**
     * Adds an entity
     * @param {Object} entity The entity to add
     * @returns {number} The id of the entity added
     */
    addEntity(entity) {
        entity._id = this.#entityUID++;
        this.#entities.push(entity);
        return entity._id;
    }
    /**
     * 
     * @param {Object} entity The entity to remove
     */
    removeEntity(entity) {
        let index = binarySearch(this.#entities, entity._id, entity_accessor);
        if(!index.error)
            this.#entities.splice(index, 1);
    }
    /**
     * Searches for and returns an entity
     * @param {number} id The id of the entity wanted
     * @returns {Object} The entity found or error
     */
    getEntity(id) {
        let index = binarySearch(this.#entities, id, entity_accessor);
        if(!index.error)
            return this.#entities[index];
    }

    /**
     * Adds a system to the container
     * @param {Function} system the system to add
     */
    addSystem(system) {
        this.#systems.unshift(system);
    }
    /**
     * Removes a system with the coresponding systemName
     * @param {string} systemName The name of the system to be removed
     * @returns {Function} The system that was removed
     */
    removeSystem(systemName) {
        // May need to be faster in cases with large amounts of systems
        let i = this.#systems.length;
        while(i-- && this.#systems[i].name != systemName);
        return this.#systems.splice(i, 1)[0];
    }

    /**
     * Runs all of the entities through all of the systems they qualify for
     * @param {number} dt The time the last frame took 
     */
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
export default EntityManager;
