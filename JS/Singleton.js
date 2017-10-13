
//Singleton
//Namespace, a series of methods and attributes or class than can only be instantiated once

var GiantSoft = window.GiantSoft || {};

GiantSoft.RegPage = {

    FORM_ID:'reg-form',
    OUTPUT_ID:'reg-results',

    handleSubmit:function (e) {
        e.preventDefault();
    },
    
    init:function () {
        //...
    },

    //define private members through underline
    _stripWhitespace:function(str){
        return str.replace(/\s+/,'');
    }
}

window.onload = GiantSoft.RegPage.init;

//Create singleton via encapsulation

GiantSoft.DataParser = (function () {

    var whitespace = /\s+/;

    function stripWhitespace(str) {
        return str.replace(whitespace,'');
    }

    return {
        stringToArray:function (str,delimiter) {
            return stripWhitespace(str).split(delimiter);
        }
    }
})();

console.log(GiantSoft.DataParser.stringToArray("Hello World."));

//lazy loading

GiantSoft.DataParser = (function () {

    var instance;

    function constructor() {
        var whitespace = /\s+/;

        function stripWhitespace(str) {
            return str.replace(whitespace,'');
        }

        return {
            stringToArray:function (str,delimiter) {
                return stripWhitespace(str).split(delimiter);
            }
        }   
    }
    
    return {
        getInstance:function () {
            if(!instance){
                instance = constructor();
            }
            return instance;
        }
    }
    
})();
