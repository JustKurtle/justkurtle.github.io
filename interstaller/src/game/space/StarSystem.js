const StarSystem = {
    create() {
        let starSystem = {
            "star": {},
            "planets": [],
            "asteroids": []
        };

        return starSystem;
    }
};
Object.freeze(StarSystem);
export default StarSystem;

const Planet = {
    // types
    "GAS_GIANT": 1,
    "ICE": 2,
    "ROCKY": 3,

    create() {
        let planet = {
            "orbit": 0,

            "size": 0,
            "type": Planet.GAS_GIANT
        };
        return planet;
    }
};