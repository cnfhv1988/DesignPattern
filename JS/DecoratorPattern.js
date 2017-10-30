//装饰者模式
//装饰者可以为对象增加功能


var Bicycle = new Interface('Bicycle',['assemble','wash','ride','repair','getPrice']);

var GiantBicycle = function () {
    this.band = 'Giant';
};

GiantBicycle.prototype = {
    assemble:function () {
    },
    wash:function () {
    },
    ride:function () {
    },
    repair:function () {
    },
    getPrice:function () {
        return 150;
    }
};

//装饰者
//假如现在要给捷安特自行车以及其他更多品牌的自行车增加新的特性，我们不需要为它扩展多个子类，而是通过
//装饰者及其子类进行，例如当我们想为其增加车灯
var BicycleDecorator = function (bicycle) {
    Interface.ensureImplements(bicycle,Bicycle);
    this.bicycle = bicycle;
};
BicycleDecorator.prototype = {
    assemble:function () {
        return this.bicycle.assemble();
    },
    wash:function(){
        return this.bicycle.wash();
    },
    ride:function () {
        return this.bicycle.ride();
    },
    repair:function () {
        return this.bicycle.replace();
    },
    getPrice:function () {
        return this.bicycle.getPrice();
    }

};

var HighlightDecorator = function (bicycle) {
    HighlightDecorator.superClass.constructor.call(this,bicycle);
};
extend(HighlightDecorator,BicycleDecorator);
HighlightDecorator.prototype.assemble = function () {
    return this.bicycle.assemble() + 'Attach Highlight to the bike';
};
HighlightDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 20;
};

var myBike = new GiantBicycle();
console.log(myBike.getPrice());
//增加车灯
myBike = new HighlightDecorator(myBike);
console.log(myBike.getPrice());

//装饰者模式的作用是在不修改对象或者为其派生子类的情况下为其增加功能

var ColorDecorator = function (bicycle,color) {
    ColorDecorator.superClass.constructor.call(this,bicycle);
    this.color = color;
};

extend(ColorDecorator,BicycleDecorator);
ColorDecorator.prototype.assemble = function () {
    return 'Paint the bike ' + this.color + ' and let it dry.' + this.bicycle.assemble();
};
ColorDecorator.prototype.getPrice = function () {
    return this.bicycle.getPrice() + 15;
};

myBike = new ColorDecorator(myBike,'red');
console.log(myBike.getPrice());
//还可以替换对象方法
var WarrantyDecorator = function (bicycle) {
    WarrantyDecorator.superClass.constructor.call(this.bicycle);
    this.warranty = true;
};
extend(WarrantyDecorator,BicycleDecorator);
WarrantyDecorator.prototype.repair = function () {
    if(this.warranty){
        console.log('This bike is current covered by a warranty.')
    }
    else{
        return this.bicycle.repair();
    }
}

//有时候，需要为一个类创建多个装饰对象，理论上这些对象的顺序应该是无所谓的，但是有时候不能满足，注意，如果通过
//装饰者模式为对象添加了新的方法，那么需要在顶层父类的构造方法中添加通道方法，以免再次添加装饰者时，方法被覆盖。
//工厂模式很适合创建装饰对象

//除了类，还可以装饰方法和函数
function getDate(){
    return new Date();
}
function UpperDecorator(func){
    return function(){
        return (func.apply(this,arguments)).toString().toUpperCase();
    }
}
console.log(getDate());
getDate = UpperDecorator(getDate);
console.log(getDate());

//透明的添加方法
var MethodProfiler = function (component) {
    this.component = component;
    this.timer = {}
    for(var key in this.component){
        if(typeof this.component[key] != 'funciont'){
            continue;
        }
        var that = this;
        (function (methodName) {
            that.startTimer(methodName);
            var returnValue = that[methodName].apply(that,arguments);
            that.displayTime(methodName, that.getElpsedTime(methodName));
        })(key);
        }
    }
};
MethodProfiler.prototype = {
    startTimer:function (methodName) {
        this.timer[methodName] = (new Date()).getTime();
    },
    getElpsedTime:function (methodName) {
        return (new Date()).getTime() - this.timer[methodName];
    },
    displayTime:function (methodName, time) {
        console.log(methodName + ' costs' + time + ' ms');
    }
}
//装饰者模式，无法通过类型安全检查，也会增加架构的复杂程度和代码可读性
