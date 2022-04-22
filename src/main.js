const modSpawn = require('spawn')

module.exports.loop = function () {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    modSpawn.action.RunNormally(Game.spawns['Base-1'])
}