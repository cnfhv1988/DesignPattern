//享元模式
//将对象的状态分为内部数据和外部数据，将内在状态相同的对象替换为一个共享对象，减少内存的开销
//例如一个汽车登记系统，记录所有汽车的品牌，型号，出厂日期，车主，车牌号和登记日期，此时进行拆分，
//品牌，型号和出厂日期作为内部数据存储，将会极大减少内存开销
var Car = function (make,model,year) {
    this.make = make;
    this.model = model;
    this.year = year;
};
Car.prototype = {
    getMake:function () {
        return this.make;
    },
    getModel:function () {
        return this.model;
    },
    getYear:function () {
        return this.year;
    }
};
//用工厂来实例化
var CarFactory = (function () {
    var createdCars = {};
    return {
        createCar:function (make,model,year) {
            if(createdCars[make+'-'+model+''+year]){
                return createdCars[make+'-'+model+''+year];
            }
            else{
                createdCars[make+'-'+model+''+year] = new Car(make,model,year);
            }
        }
    }
})();

//管理器中的外部数据
var CarRecordManager = (function () {

    var carRecordDatabase = {};

    return {
        addCarRecord:function (make,model,year,owner,tag,renewDate) {
            var car = CarFactory.createCar(make,model,year);
            carRecordDatabase[tag] = {
                owner:owner,
                car:car,
                renewDate:renewDate
            }
        },
        transferOwnship:function (tag,newOwner,newTag,newRenewDate) {
            var record = carRecordDatabase[tag];
            record.owner = newOwner;
            record.tag = newTag;
            record.renewDate = newRenewDate;
        },
        renewRegistration:function (tag,newRenewDate) {
            carRecordDatabase[tag].renewDate = newRenewDate;
        },
        isRegistrationCurrent:function (tag) {
            var today = new Date();
            return today.getTime() < Date.parse(carRecordDatabase[tag].renewDate);
        }
    }
})();

//上述例子中管理外部数据的方式是一个单体，另一种保存外部数据的方式是采用组合模式，这样外部数据便会保存在组合模式的结构中
//总体来说，剥离外部数据，实现内部数据共享
