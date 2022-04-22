const porter = {
    Transport: (creep) => transport(creep),
};

const PORTER = {
    role: 'porter',
    item: [WORK, CARRY, MOVE],
}

const STATUS_PORTER = {
    'CHARGING': 1,
    'TRANSPORTING': 2,
}

function transport(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.status = STATUS_PORTER.CHARGING
    } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.status = STATUS_PORTER.TRANSPORTING
    }

    switch (creep.memory.status) {
        case STATUS_PORTER.CHARGING:
            charging(creep)
            break
        case STATUS_PORTER.TRANSPORTING:
            transporting(creep)
            break
    }
}

function charging(creep) {
    let spawn = Game.getObjectById(creep.memory.spawn);
    // if the energy storage of spawn is not full
    if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        switch (creep.withdraw(spawn, RESOURCE_ENERGY)) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(spawn)
                break
        }
    } else {
        creep.moveTo(spawn)
    }
}

function transporting(creep) {
    const ctl = creep.room.controller
    switch (creep.upgradeController(ctl)) {
        case ERR_NOT_IN_RANGE:
            creep.moveTo(ctl)
            break
        case ERR_NOT_ENOUGH_RESOURCES:
            creep.memory.status = STATUS_PORTER.CHARGING
            charging(creep)
            return
        // todo: add default
    }
}

module.exports.action = porter
module.exports.entity = PORTER