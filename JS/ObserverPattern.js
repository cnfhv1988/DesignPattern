//观察者模式，发布-订阅模式
//将行为与程序分开

//发布者
var Publisher = function () {
    this.subscribers = [];
};

Publisher.prototype.deliver = function (data) {
    this.subscribers.forEach(function (fn) {
        fn(data);
    });
    return this;
};

//订阅方法
//查看调用者是否应订阅，否则订阅，通过扩展Function的prototype方法实现
Function.prototype.subscribe = function (publisher) {
    var that = this;
    var alreadyExist = publisher.subscribers.some(function (t) {
        return t === that;
    });
    if(!alreadyExist){
        publisher.subscribers.push(this);
    };
    return this; //支持链式调用
};

//退订方法
Function.prototype.unsubscribe = function (publisher) {
    var that = this;
    publisher.subscribers.filter(function (t) {
        return t !== that;
    });
    return this;
}
