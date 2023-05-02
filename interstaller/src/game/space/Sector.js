const Sector = {
    create() {
        let obj = {
            "location": [/* x, y, z */],
            "starSystems": [/* stars */],
        };
        return obj;
    }
};
Object.freeze(Sector);
export default Sector;