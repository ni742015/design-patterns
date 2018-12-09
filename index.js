// 单例模式：保证一个类只有一个实例，并提供一个访问他的全局访问点
// 例 import require
var getSingle = function (fn) { // 创建单例方法
    var result // 通过闭包保存创建过的对象
    return function () {
        return result || (result = fn.apply(this, arguments))
    }
}

var createPerson = getSingle(function (name) {
    return {name: name}
})

var person1 = createPerson('张三')
var person2 = createPerson('李四')

console.log(person1, person2);  // {name: '张三'} {name: '张三'}


// 策略模式：定义一系列算法并把他们封装起来
// 例：表单校验
var strategies = { // 针对不同表现的员工定制策略，每个策略接受同类型的参数返回相同的结果
    S(salary) {
        return salary * 3
    },
    A(salary) {
        return salary * 2
    },
    B(salary) {
        return salary
    },
    C(salary) {
        return -salary
    }
}

var calculateBonus = function (salary, strategy) {
    return strategies[strategy](salary)
}

console.log(calculateBonus(10000, 'S')); // 30000
console.log(calculateBonus(1000, 'C')); // -1000 


// 代理模式：为一个对象提供一个代用品或占位符，以便控制对他的访问
// 例：节流函数
var throttle = function (fn, interval) {
    var firstTime, timer
    return function () {
        var _this = this
        if(!firstTime) {
            fn.apply(this, arguments)
            firstTime = true
        }
        
        if (!timer) {
            timer = setTimeout(function() {
                fn.apply(_this, arguments)
                timer = null
            }, interval);
        }
    }
}

var onScroll = function () {
    console.log('onScroll', Date.now())
}
var throttleOnScroll = throttle(onScroll, 2000)

// setInterval(throttleOnScroll, 300)


// 迭代器模式
// 将迭代过程从业务逻辑中抽离，简化开发，分内迭代和外迭代
Array.prototype.myEach = function (cb) {
    for (let index = 0; index < this.length; index++) {
        const element = this[index];
        if(cb(element, index) === false) {
            break
        }
        
    }
};

['a','b','c'].myEach(console.log)


// 发布订阅模式
// 分离事件创建者和执行者，执行方只需订阅感兴趣的事件发生点。减少对象间的耦合关系，新的订阅者出现时不必修改原有代码逻辑
var Event = function () {
    var clientList = {}

    this.listen = function (key, cb) {
        clientList[key] = clientList[key] || []
        clientList[key].push(cb)
    }

    this.one = function (key, cb) {
        var fn = function () {
            cb.apply(this, arguments)
            this.remove(key, fn)
        }
        clientList[key] = clientList[key] || []
        clientList[key].push(fn)
    }

    this.remove = function (key, cb) {
        var fns = clientList[key]
        if(!cb) {
            clientList[key] = []
        }else if(fns && fns.length) {
            clientList[key] = fns.filter(fn => fn !== cb)
        }
    }

    this.trigger = function () {
        var key = Array.prototype.shift.call(arguments)
        var args = arguments
        var fns = clientList[key]
        var _this = this

        if(fns && fns.length) {
            fns.myEach(function(fn) {
                fn.apply(_this, args)
            })
        }
    }
}

var event = new Event()

event.listen('phone', function getPhone() {
    Array.prototype.unshift.call(arguments, '有个挨千刀的半夜打电话来了他是：')
    console.log.apply(this, arguments)
})

event.one('phone', function () {
    Array.prototype.unshift.call(arguments, '我只接一次电话：')
    console.log.apply(this, arguments)
})

event.trigger('phone', '大狗子')
event.trigger('phone', '二狗子')
event.trigger('phone', '狗剩子')


// 命令模式
// 适用：需要向某些对象发出请求，但不知道接受者是谁，也不知道要执行哪些操作。命令模式是为了解决命令的请求者和命令的实现者之间的耦合关系
// 提供execute、undo、redo方法
var client = {
    name: '铁蛋儿'
}
var cook = {
    makeFood: function (food) {
        console.log('开始做：', food)
    },
    serveFood: function (client) {
        console.log('上菜给：', client.name)
    }    
}

function OrderCommand(receiver, food) {
    this.receiver = receiver
    this.food = food
}

OrderCommand.prototype.execute = function (cook) {
    cook.makeFood(this.food)
    cook.serveFood(this.receiver)
}

var command = new OrderCommand(client, '宫保鸡丁')
command.execute(cook)

// 组合模式
// 将一系列具有相同方法的对象合并成一个具有该方法的组合对象，统一执行
var openDoorCommand = {
    execute: function(){
        console.log('开门')
    }
}

var openPcCommand = {
    execute: function(){
        console.log('开电脑')
    }
}

var openLolCommand = {
    execute: function(){
        console.log('撸一局')
    }
}

var MarcoCommand = {
    list: [],
    add: function (command) {
        this.list.push(command)
    },
    execute: function () {
        this.list.forEach(function(command) {
            command.execute()
        })
    }
}

MarcoCommand.add(openDoorCommand)
MarcoCommand.add(openPcCommand)
MarcoCommand.add(openLolCommand)
MarcoCommand.execute()

// 模板方法模式
// 基于继承的设计模式，在父类中定义需要实现的方法，并定义好方法的执行逻辑，子类只需实现对应方法即可
var Game = function (username, pwd) { // 父类
    this.username = username,
    this.pwd = pwd
}

// 定义需要实现的方法
Game.prototype.login = function () {}
Game.prototype.start = function () {}
Game.prototype.choose = function () {}
Game.prototype.result = function () {}
// 定义执行逻辑
Game.prototype.init = function () {
    this.login()
    this.start()
    this.choose()
    this.result(Math.random() > 0.5)
}

var Lol = function (username, pwd) {
    Game.call(this, username, pwd)
}
Lol.prototype = new Game()

Lol.prototype.login = function () {
    console.log('登录lol账号：', this.username, this.pwd)
}
Lol.prototype.start = function () {
    console.log('开始匹配。。。')
}
Lol.prototype.choose = function () {
    console.log('选择英雄')
}
Lol.prototype.result = function (res) {
    console.log('游戏结果：', res ? 'victory':'defeat')
}

var lol = new Lol('张全蛋', '12345678')
lol.init()
