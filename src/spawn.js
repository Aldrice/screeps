const spawn = {
    RunNormally: (spawn) => runNormally(spawn),
};

const modBuilder = require('builder');
const modFarmer = require('farmer');
const modPorter = require('porter');
const _ = require("lodash");

function runNormally(spawn) {
    maintainCreeps(spawn)
}

function maintainCreeps(spawn) {
    let farmers = getOwnedCreeps(spawn, modFarmer.entity.role)
    let porters = getOwnedCreeps(spawn, modPorter.entity.role)
    let builders = getOwnedCreeps(spawn, modBuilder.entity.role)

    if (farmers.length < 3) {
        createCreep(spawn, modFarmer.entity)
    }
    if (builders.length < 1) {
        createCreep(spawn, modBuilder.entity)
    }
    if (porters.length < 3) {
        createCreep(spawn, modPorter.entity)
    }

    farmers.forEach(function (value) {
        modFarmer.action.Collect(value)
    })
    porters.forEach(function (value) {
        modPorter.action.Transport(value)
    })
    builders.forEach(function (value) {
        modBuilder.action.Work(value)
    })
}

function getOwnedCreeps(spawn, role) {
    let list = []
    _.forIn(Game.creeps, function (value) {
        if (value.memory.role === role && value.memory.spawn === spawn.id) {
            list.push(value)
        }
    })
    return list
}

function createCreep(spawn, entity) {
    let ts = Date.parse(new Date());
    spawn.spawnCreep(entity.item, entity.role + ts, {
        memory: {
            role: entity.role,
            spawn: spawn.id
        }
    })
}

module.exports.action = spawn;