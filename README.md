# 设计模式

## 简介
本项目是一个介绍如何在JavaScript中使用设计模式的示例项目，example目录中是相对复杂的示例代码

## 目录
* 单例模式：1_single
* 策略模式：2_strategy
* 代理模式：3_agency
* 迭代器模式：4_iteration
* 发布订阅模式：5_event
* 命令模式：6_7_commond_composite
* 组合模式：6_7_commond_composite

#### 单例模式
定义：保证一个类只有一个实例，并提供一个访问他的全局访问点

简介：单例模式是一种常用的模式，我们在多次引入其他模块时，并不需要每次都创建一个新的模块对象，复用之前引入过的对象不仅能减少内存的开销，同时也可以体验共享对象带来的便利。简单来说就是使用闭包持久保存函数上一次的执行结果，在之后的调用中直接返回。例如js 中模块加载的方式：require、import都使用到了该模式

例：
```
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
```


### 策略模式
定义：定义一系列算法，把他们一个个封装起来，并且可以相互替换

简介：现实生活中当我们要达成一个目的的时候通常会有多种方案可以选择。比如马上年底要发年终奖了，公司针对不同类型的员工有不同的奖金策略，对于表现突出的员工发3个月的工资，一般的员工发2个月的，打酱油的发1个月的，专写Bug的扣一个月。在这里 发年终奖 是目的，针对表现不同的员工我们有多种发奖金的策略，可以使用策略模式来实现

例：
```
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

```

进阶示例：[表单校验]()


### 代理模式
定义：当直接访问一个对象不方便或者不满足需要时，为其提供一个替身对象来控制对这个对象的访问

简介：代理模式是一种非常有意义的模式，在我们日常开发中有许多常用功能都可以通过代理模式实现的，例如 防抖动函数（debounce 常用于控制用户输入后回调函数触发的时机），节流函数（throttle 常用于控制resize、scroll等事件的触发频率），下面我们实现一个简单的节流函数

例：
```
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

setInterval(throttleOnScroll, 300) // 每2秒执行一次onScroll函数
```

进阶示例：[图片预加载]()


### 迭代器模式
定义：提供一种方法顺序访问一个聚合对象中的各个元素，而要不需要暴露该对象的内部表示

简介：迭代器模式简单来说就是将迭代过程从业务逻辑中抽离，简化开发，其分为内迭代和外迭代。目前许多语言都已经内置了迭代器的实现，如ES5中的forEach函数就是一种内迭代的实现。

例：
```
Array.prototype.myEach = function (cb) {
    for (let index = 0; index < this.length; index++) {
        const element = this[index];
        if(cb(element, index) === false) {
            break
        }
        
    }
};

['a','b','c'].myEach(console.log) // a b c
```
进阶示例：[外迭代]()


### 发布订阅模式（划重点）
定义：分离事件创建者和执行者，执行方只需订阅感兴趣的事件发生点。减少对象间的耦合关系，新的订阅者出现时不必修改原有代码逻辑

简介：发布订阅模式又叫观察者模式，它定义了对象间一种一对多的关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。
发布订阅模式在我们日常开发中应用十分广泛，如浏览器的dom事件通知机制(document.addEventListener)，以及vue框架中数据改变时自动刷新dom的双向绑定机制都是基于该模式

例：
```
var Event = function () {
    var clientList = {} // 订阅者数组

    this.listen = function (key, cb) { // 订阅方法
        clientList[key] = clientList[key] || []
        clientList[key].push(cb)
    }

    this.remove = function (key, cb) { // 取消订阅
        var fns = clientList[key]
        if(!cb) {
            clientList[key] = []
        }else if(fns && fns.length) {
            clientList[key] = fns.filter(fn => fn !== cb)
        }
    }

    this.trigger = function () { // 通知订阅者
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

event.trigger('phone', '大狗子') // 有个挨千刀的半夜打电话来了他是：大狗子
event.trigger('phone', '二狗子') // 有个挨千刀的半夜打电话来了他是：二狗子
```
进阶示例：[进阶版发布订阅模式]()

### 命令模式
定义：将一组行为抽象为对像并提供执行、撤销等方法，解决它与调用者的之间的耦合关系

简介：命令模式是对简单优雅的模式之一，其中“命令”指的是一个执行某些特定事情的指令。该模式适用于需要向某些对象发出请求，但不知道接受者是谁，也不知道要执行哪些操作。例如我们平时去饭店点菜是我们并不需要知道这道菜是谁做的怎么做的，我们只需要请服务员把需求写在订单上就可以了。

例：
```
var client = { // 顾客（命令发出者）
    name: '铁蛋儿'
}
var cook = { // 厨师（命令发执行者）
    makeFood: function (food) {
        console.log('开始做：', food)
    },
    serveFood: function (client) {
        console.log('上菜给：', client.name)
    }    
}

function OrderCommand(receiver, food) { // 命令对象
    this.receiver = receiver
    this.food = food
}

OrderCommand.prototype.execute = function (cook) { // 提供执行方法
    cook.makeFood(this.food)
    cook.serveFood(this.receiver)
}

var command = new OrderCommand(client, '宫保鸡丁')
command.execute(cook) // 开始做：宫保鸡丁； 上菜给铁蛋儿

```
进阶示例：[控制小球运动]()

### 组合模式
定义：将一系列具有相同方法的对象合并成一个具有该方法的组合对象，统一执行

简介：组合模式将对象组合成树形结构，以表示“部分-整体”的层次结构。同时利用对象的多态性，使得单个对象的使用和组合对象的使用具有一致性。例如我们通过命令模式定义了一系列的命令，并且希望组合这些命令形成一个命令宏统一的执行。

例：
```
// 定义一些命令
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

// 定义命令宏组合命令
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
MarcoCommand.execute() // 开门 开电脑 撸一局

```

## 总结
相信看到这里的同学会发现其实我们平时编写的代码中已经多多少少用到了一些设计模式，他们并不是一些高深复杂的理论知识。掌握一些常用的设计模式在帮助我们提升自己的代码质量的同时也能帮我们更好的和同事沟通。
本文的所有内容都托管到了github，包括一些进阶的示例，近期会出本文的下半章节感兴趣的同学可以关注下哦