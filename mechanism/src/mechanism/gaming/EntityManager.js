function create() {
    let _entities = [];
    let _systems = [];
    
    return {
        _entities,
        _systems,
    };
}

function addEntity(target, entity) {
    target._entities.push(entity);
}

function addSystem(target, system) {
    target._systems.unshift(system);
}

function logOnErr(systemOut, system, entity) {
    if(systemOut.error)
        console.error(`${systemOut.error} @ ${system.name} : ${entity}`);
}

function run(target, dt) {
    let sysIter = target._systems.length;
    while(sysIter--) {
        let system = target._systems[sysIter];
        let entIter = target._entities.length;
        while(entIter--) {
            let entity = target._entities[entIter];
            logOnErr(
                system(entity, dt),
                system,
                entity
            );
        }
    }
}

export default {
    create,
    addEntity,
    addSystem,
    run,
};