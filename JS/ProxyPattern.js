//代理模式
//代理与本体实现了相同的方法和接口，从而实现对本体的访问控制（保护代理），访问远程对象（远程代理）以及推迟本体实例化（虚拟代理）

var WebServiceProxy = function () {
    this.xhrHandler = XhrManager.createXhrObject();
}

WebServiceProxy.prototype = {
    _xhrFailure:function (statusCode) {
        throw new Error('Asynchronous request failed, code:' + statusCode + '.');
    },
    _fetchData:function (url,datacallback,getvars) {
        var that = this;
        var callback = {
            success:function (responseText) {
                var obj = eval('(' + responseText + ')');
                datacallback(obj);
            },
            falilure:that._xhrFailure
        };
        var getVarArray = [];
        for(var name in getvars){
            getVarArray.push(name + '=' + encodeURIComponent(getvars[name]));
        };
        if(getVarArray.length > 0){
            url = url + '/?' + getVarArray.join('&');
        }
        this.xhrHandler.request('GET',url,callback);
    }
}
//可以继承这个代理类，通过调用_fetchData来扩展，使其可以应对具体的应用


var Directory = new Interface('Directory',['showPage']);

var PersonalDirectory = function (parent) {
    this.xhrHandler = XhrManager.createXhrObject();
    this.parent = parent;
    this.data = null;
    this.currentPage = null;

    var that = this;
    var callback = {
        success:function(){
            that._configure()
        },
        fail:function() {
            throw new Error('failure in data retrieval.');
        }
    }
    this.xhrHandler.request('GET','resource/01.txt',callback);
}

PersonalDirectory.prototype = {
    _configure:function (responseText) {
        this.data = eval('('+responseText+')');
        //...
        this.currentPage = 'a';
    },
    showPage:function (page) {
        //set current page display = none;
        //set the page display = block;
        this.currentPage = page;
        console.log('showpage');
    }
}

//虚拟代理，将实例化动作放在initialize里，延迟加载，提高性能和易用性
var DirectoryProxy = function (parent) {
    this.parent = parent;
    this.directory = null;
    this.warning = null;
    this.initialized = false;
    this.interval = null;
    var that = this;
    this.parent.onmouseover = function () {
        that._initialize();
    }
}

DirectoryProxy.prototype = {
    _initialize:function () {
        if(!this.warning){
            this.warning = document.createElement('div');
            this.parent.appendChild(this.warning);
            this.warning.innerHTML = 'Loading......';
            this.directory = new PersonalDirectory(this.parent);
            var that = this;
            this.interval = setInterval(that._initialize.bind(that),100);//实际上，应该订阅实例化事件，而不是不断去查询
        }
    },
    checkInitialize:function () {
        if(this.directory.currentPage != null){
            clearInterval(this.interval);
            this.initialized = true;
            this.parent.removeChild(this.warning);
            this.show('a');
        }
    },
    show:function (page) {
        if(!this.initialized)return;
        return this.directory.showPage(page);
    }
};

//动态代理
var DynamicProxy = function () {

    this.args = arguments;
    this.initialized = false;

    if(typeof this.class != 'function'){
        throw new Error("DynamicProxy: the class attribute must be set before calling the constructor.");
    };

    for(var key in this.class.prototype){
        if(typeof  this.class.prototype[key] != 'function')continue;
        var that = this;
        (function(methodName) {
            that[methodName] = function () {
                if(!that.initialized)return;
                that.subject[methodName].apply(that.subject,arguments);
            }

        })(key);
    }
};

DynamicProxy.prototype = {
    _initialize:function () {
        this.subject = {};
        this.class.apply(this.subject,this.args);
        this.subject.__proto__ = this.class.prototype;

        var that = this;
        this.interval = setInterval(function () {
            that.checkInitialized();
        },100);
    },
    checkInitialized:function () {
        if(this._isInitialized()){
            clearInterval(this.interval);
            this.initialized = true;
        }
    },
    _isInitialized:function () {
        throw new Error("Unsupported operation on an abstract class.");
    }
};
