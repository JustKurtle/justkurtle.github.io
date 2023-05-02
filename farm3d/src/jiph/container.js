// const Container = {
//     create() {
//         let output = {
//             "entities": [],
//             "systems": [],
//         };
//         return output;
//     },

//     addSystem(out, system) {
//         out.systems.unshift(system);
//     },

//     addEntity(out, entity) {
//         out.entities.push(entity);
//     },

//     runSystems(out, dt = 1) {
//         let sysIter = out.systems.length;
//         // run through the systems
//         while(sysIter--) {
//             let system = out.systems[sysIter];
//             // run through the entities
//             let entIter = out.entities.length;
//             while(entIter--) {
//                 let entity = out.entities[entIter];

//                 // run the system on the entity
//                 system(entity, dt);
//             }
//         }
//     }
// };

// Object.freeze(Container);
// export default Container;


// * welcome to funky town
const Container = {
    // flags
    "INDEPENDENT" : 1,

    create() {
        let output = {
            "entities": [],
            "systems": [],
        };
        return output;
    },

    addSystem(out, system, cull = () => false, flags) {
        out.systems.unshift({
            "main_callback": system,
            "cull_callback": cull,
            "independent": (flags & 1) === 1,
        });
    },

    addEntity(out, entity) {
        out.entities.push(entity);
    },

    runSystems(out, dt = 1) {
        let sysIter = out.systems.length;
        // run through the systems
        while(sysIter--) {
            let system = out.systems[sysIter];
            // run once and without entity
            if(system.independent) {
                system.main_callback(dt);
                continue;
            }
            // run through the entities
            let entIter = out.entities.length;
            while(entIter--) {
                let entity = out.entities[entIter];
                // run cull if the cull flag is on
                if(system.cull_callback(entity, dt)) continue;
                // run the system on the entity
                system.main_callback(entity, dt);
            }
        }
    }
};

Object.freeze(Container);
export default Container;