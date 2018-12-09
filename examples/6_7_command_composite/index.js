
var ball = document.getElementById('ball')
var moveStrategies = {
    left(distance) {
        var left = ball.style.left || '0px'
        left = parseInt(left.slice(0, -2), 10)
        console.log(left, distance);

        return {direction: 'left', end: left - distance + 'px'}
    },
    right(distance) {
        var left = ball.style.left || '0px'
        left = parseInt(left.slice(0, -2), 10)
        return {direction: 'left', end: left + distance + 'px'}
    }
}
function move(elem, direction, distance) {
    console.log('move', direction, distance)
    var position = moveStrategies[direction](distance)
    elem.style[position.direction] = position.end

    position.distance = distance
    return position
}

function MoveCommand(receiver, direction, distance) {
    this.receiver = receiver
    this.direction = direction
    this.distance = distance
}

MoveCommand.prototype.execute = function () {
    this.position = move(this.receiver, this.direction, this.distance)
    console.log('this.position', this.position)
    
}

MoveCommand.prototype.undo = function () {
    move(this.receiver, this.direction, -this.position.distance)
}

var commands = []
var moveCommand
document.getElementById('btn-left').onclick = function () {
    moveCommand = new MoveCommand(ball, 'left', 50)
    moveCommand.execute()
    commands.push(moveCommand)
}

document.getElementById('btn-right').onclick = function () {
    moveCommand = new MoveCommand(ball, 'right', 50)
    moveCommand.execute()
    commands.push(moveCommand)
}

document.getElementById('btn-undo').onclick = function () {
    commands.pop().undo()
}

document.getElementById('btn-redo').onclick = function () {
    ball.style.left = '0px'
    commands.forEach(function (command, i) {
        setTimeout(() => {
            command.execute()
        }, (i + 1) * 500);
    })
}


// 组合命令
var MarcoCommand = {
    list: [],
    add: function (command) {
        this.list.push(command)
    },
    execute: function () {
        this.list.forEach(function (command, i) {
            setTimeout(() => { // 为了演示加个延迟
                command.execute()
            }, (i + 1) * 500);
        })
    }
}
MarcoCommand.add(new MoveCommand(ball, 'right', 50))
MarcoCommand.add(new MoveCommand(ball, 'right', 50))
MarcoCommand.add(new MoveCommand(ball, 'left', 50))
MarcoCommand.add(new MoveCommand(ball, 'left', 50))
document.getElementById('btn-marco').onclick = function () {
    ball.style.left = '0px'
    MarcoCommand.execute()
}