let labOp = require('labOperator')

function work(creep) {
    const terminal = creep.room.terminal
    let memory = creep.memory
    if (creep.memory.status === 'miss') {

        const role = creep.memory.role
        const missionid = creep.memory.missionid
        memory = creep.memory = {}
        const room = creep.room
        if (creep.memory.role) {
            if (memory.role === 'power' && labOp.fillPower(creep, memory, room)) {
            }
        } else if (terminal.store[RESOURCE_ENERGY] > 14000 && _.sum(room.storage.store) / room.storage.store.getCapacity() < 0.95) {
            memory.type = RESOURCE_ENERGY
            memory.gettarget = room.terminal.id
            memory.filltarget = room.storage.id
            memory.status = 'getting'
            memory.nexts = 'filling'
        }else if (creep.ticksToLive < 50) {
            creep.memory.status = 'suicide'
        }
        else if (labOp.labFill(creep, memory, room)) {

        } else if (labOp.fillNuke(creep, memory, room)) {

        } else if (labOp.factoryFill(creep, memory, room)) {

        } else if (labOp.factoryGet(creep, memory, room)) {

        } else if (labOp.boostEnergy(creep, memory, room)) {

        } else if (labOp.boostMine(creep, memory, room)) {

        } else if (labOp.labCollect(creep, memory, room)) {

        } else if (_.sum(creep.carry) > 0) {
            for (let type in creep.carry) {
                memory.type = type
                memory.filltarget = room.terminal.id
                memory.status = 'filling'
                memory.nexts = 'miss'
                break
            }
        } else {
            creep.memory.status = 'sleep'
        }
        creep.memory.role = role
        creep.memory.missionid = missionid
        memory = creep.memory
    } else if (creep.memory.status === 'sleep') {
        if (Game.time % 10 === 0) {
            creep.memory.status = 'miss'
        }
    } else if (creep.memory.status === 'suicide') {
        Game.tools.suicide(creep, creep.room.terminal)
        return
    }
    if (memory.status === 'filling') {
        require('labOperator').fill(creep, memory)
    } else if (memory.status === 'getting') {
        require('labOperator').get(creep, memory)

    }
    creep.memory = memory

}


function born(spawnnow, creepname, memory) {

    let body = {
        'carry': 32,
        'move': 16
    }
    if (memory.capacity) {
        body = {
            'carry': Math.ceil(memory.capacity / 50),
            'move': Math.ceil(memory.capacity / 50)
        }
    }
    let bodyarray = require('tools').generatebody(body, spawnnow)
    return spawnnow.spawnCreep(
        bodyarray,
        creepname,
        {
            memory: {
                status: 'miss',
                missionid: memory.roomName,
                role: memory.role,
            }
        }
    )
}

function miss(room) {
    //terminalmamager
    if (!room.memory.missions) return
    room.memory.missions.terminalmanager = {}
    const terminal = room.terminal
    if (terminal) {
        if (!Game.powerCreeps[room.name] && room.controller.level=== 8&&terminal.store[RESOURCE_POWER] > 1400 && room.storage.store[RESOURCE_ENERGY] / room.storage.store.getCapacity() > Game.config.powerLimit && room.powerSpawn) {
            room.memory.missions.terminalmanager[room.name] = {
                roomName: room.name,
                capacity: 100,
                role: 'power',
            }
        }
        if (terminal.store[RESOURCE_ENERGY] > 90e3
            || (room.controller.level < 8 && terminal.store[RESOURCE_ENERGY] > 30e3)
            || (!Game.powerCreeps[room.name] && terminal.store[RESOURCE_GHODIUM] && terminal.store[RESOURCE_GHODIUM] >= 1000 && room.nuker && room.nuker.store[RESOURCE_GHODIUM] < 5000)
            || (!Game.powerCreeps[room.name] && (
                room.memory.factory && (room.memory.factory.status === 'fill' || room.memory.factory.status === 'get') ||
                room.memory.reaction && (room.memory.reaction.status === 'collect' || (room.memory.reaction.status === 'boost' && !room.memory.reaction.boostReady) || room.memory.reaction.status === 'fill')
            ))
            || (!Game.powerCreeps[room.name] && Game.defend.wallWorkLength[room.name] > 0)
        ) {
            if (!Game.powerCreeps[room.name]||!Game.powerCreeps[room.name].ticksToLive) {
                room.memory.missions.terminalmanager[room.name] = {
                    roomName: room.name,
                }
            }

        }
    }
    if (_.size(room.memory.missions.terminalmanager) == 0) {
        room.memory.missions.terminalmanager = undefined
    }


}

// Game.rooms['E29N38'].memory.missions.terminalmanager={}; Game.rooms['E29N38'].memory.missions.terminalmanager['E29N38'] = {roomName:'E29N38'};
module.exports = {
    'work': work,
    'born': born,
    'miss': miss
};