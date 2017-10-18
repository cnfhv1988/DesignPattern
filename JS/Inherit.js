//此种继承方式的缺点在于，line11和15中，父类的构造函数调用了两次，导致出去子类继承的属性（11）后，其原型对象中也保存一份（15），
//并且子类实例中的属性对其覆盖，导致了内存的浪费
function Person(name) {
    this.name = name;
}

Person.prototype.getName = function () {
    return this.name;
}

function Author(name,books) {
    Person.call(this,name);
    this.books = books;
}

Author.prototype = new Person();
Author.prototype.constructor = Author;
Author.prototype.getBooks = function () {
    return this.books;
}

//最佳实现
function extend(subClass,superClass) {
    var F = function(){};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    
    subClass.superClass = superClass.prototype;
    //此处要添加superClass.prototype这个实例对象为子类的superClass属性，
    //因为superClass是一个函数对象，subClass的superClass属性是为了访问父类对象
    if(superClass.prototype.constructor === Object.prototype.constructor){
        superClass.prototype.constructor = superClass;
    }
}

function Super() {
    this.val = 217;
}

Super.prototype.getVal = function () {
    return this.val;
}

function Sub() {
    Super.call(this);
}

extend(Sub,Super);

//原型继承
//优点是节约内存，简洁，子对象其实是一个空对象，也造成其缺点是读写不对等，即读的其实是原型对象的属性，但是写入时要先为子对象
//添加属性后再写，避免修改原型对象的属性造成对其余对象造成影响
function clone(obj) {
    var F = function () {};
    F.prototype = obj;
    return new F();
}

//Minin Class
//通过扩容接收类的prototype，达到多重继承的效果，一般适用于为类添加公共方法，但不适合继承的情况
function augment(recievingClass, givingClass) {

    for(var method in givingClass){
        if(!recievingClass[method]){
            recievingClass[method] = givingClass[method];
        }
    }
}
