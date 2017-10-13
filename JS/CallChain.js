
(function () {

    //private method
    function _$(els) {
        this.elements = [];
        for(var i=0,len=els.length;i<len;i++){
            var element = els[i];
            if(typeof element === 'string'){
                element = document.getElementById(element);
            }
            this.elements.push(element);
        }
    }

    _$.prototype = {
        each:function (fn) {
            for(var i=0,len=this.elements.length;i<len;i++){
                fn.call(this.elements[i]);
            }
            return this; //
        },
        getElements:function (cb) {
            cb.call(this,this.elements);
            return this;
        }
    }

    //a install helper to prevent interface duplicate
    window.installHelper = function (scope,interface) {
        scope[interface] = function () {
            return new _$(arguments);
        };
    }

})();
