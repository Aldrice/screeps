const builder = {
    Work: (creep) => work(creep),
};

const BUILDER = {
    role: 'builder',
    item: [WORK, CARRY, MOVE],
}

const STATUS_BUILDER = {
    'FREE': 1,
    'CHARGING': 2,
    'BUILDING': 3,
    'REPAIRING': 4,
}

function work(creep) {
    // if creep's storage is empty
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.status = STATUS_BUILDER.CHARGING
    } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.status = STATUS_BUILDER.FREE
    }

    switch (creep.memory.status) {
        case STATUS_BUILDER.CHARGING:
            charging(creep)
            break
        case STATUS_BUILDER.REPAIRING:
            repairing(creep)
            break
        case STATUS_BUILDER.BUILDING:
            building(creep)
            break
        case STATUS_BUILDER.FREE:
            allocating(creep)
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

function repairing(creep) {
    let targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
    });

    targets.sort((a, b) => a.hits - b.hits);

    if (targets.length > 0) {
        creep.memory.status = STATUS_BUILDER.REPAIRING
        if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
    } else {
        creep.memory.status = STATUS_BUILDER.FREE
    }
}

function building(creep) {
    let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (target) {
        creep.memory.status = STATUS_BUILDER.BUILDING
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        creep.memory.status = STATUS_BUILDER.FREE
    }
}

function allocating(creep) {
    building(creep)
    if (creep.memory.status === STATUS_BUILDER.FREE) {
        repairing(creep)
    }
}

module.exports.action = builder
module.exports.entity = BUILDER