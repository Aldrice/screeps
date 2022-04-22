const farmer = {
    Collect: (creep) => collect(creep),
};

const FARMER = {
    role: 'farmer',
    item: [WORK, CARRY, MOVE],
}

const STATUS_FARMER = {
    'FARMING': 1,
    'TRANSPORTING': 2,
    'RECYCLING': 3,
}

function collect(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.status = STATUS_FARMER.FARMING
    } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.status = STATUS_FARMER.TRANSPORTING
    }

    switch (creep.memory.status) {
        case STATUS_FARMER.FARMING:
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0])
            }
            break
        case STATUS_FARMER.TRANSPORTING:
            const spawn = Game.getObjectById(creep.memory.spawn);
            if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn)
            }
            break
    }
}

module.exports.action = farmer
module.exports.entity = FARMER