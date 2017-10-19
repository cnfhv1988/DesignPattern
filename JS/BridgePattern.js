
//桥接模式，通过抽象与实现的分离，提高灵活性
//书中第一例，事件响应函数同时也是一个API接口，那么此时这个API函数作用非常有限，甚至不能单独单元测试（因为
// 与事件的触发耦合在一起），而通过桥接模式，将抽象与实现分离，getSomething这个API只专注于实现自身功能
/*

function getSomething() {
    return 'something';
}


function getSomethingBridge() {
    return getSomething();
}

document.getElementById('test').onclick = getSomething;
document.getElementById('test').onclick = getSomethingBridge;
*/

var asyncRequest = function () {

    function handleReadyState(o,callback) {
      var poll = window.setInterval(function () {
          if(o && o.readyState == 4){
              window.clearInterval(poll);
              if(callback){
                  //setTimeout(callback,20000,o);
                  callback(o);
              }
          }
      },50);
    };
    var getXHR = function () {
        var http;
        try{
            http = new XMLHttpRequest;
            getXHR = function () {
                return new XMLHttpRequest();
            }
        }
        catch(e){
            var msxml = ['MSXML.XMLHTTP.3.0','MSXML.XMLHTTP','Microsoft.XMLHTTP'];
            for(var i=0;i<msxml.length;i++){
                try{
                    http = new ActiveXObject(msxml[i]);
                    getXHR = function () {
                        return new ActiveXObject(msxml[i]);
                    };
                    break;
                }
                catch(e){}
            };
        }
        return http;
    }
    
    return function (method,url,callback,postData) {
        var http = getXHR();
        http.open(method,url,true);
        handleReadyState(http,callback);
        //setTimeout(http.send,20000,postData || null);
        http.send(postData || null);
        return http;
    }
}();


window.DED = window.DED || {};
DED.util = DED.util || {};
DED.util.Observer = function () {
    this.fns = [];
};
DED.util.Observer.prototype = {
    subscribe:function (fn) {
        this.fns.push(fn);
    },
    unsubscribe:function (fn) {
        this.fns = this.fns.filter(function (t) { return t !== fn; });
    },
    fire:function (o) {
        this.fns.forEach(function (t) { t(o); })
    }
};

DED.Queue = function () {
    this.queue = [];

    this.onComplete = new DED.util.Observer();
    this.onFailure = new DED.util.Observer();
    this.onFlush = new DED.util.Observer();

    this.retryCount = 3;
    this.currentRetry = 0;
    this.paused = false;
    this.timeout = 5000;
    this.conn = {};
    this.timer = {};
};

DED.Queue.prototype = {
    setRetryCount:function (count) {
        this.retryCount =count;
    },
    setTimeout:function (timeout) {
        this.timeout = timeout;
    },
    add:function (o) {
        this.queue.push(o);
    },
    pause:function () {
        this.paused = true;
    },
    dequeue:function () {
        this.queue.pop();
    },
    clear:function () {
        this.queue = [];
    }
};

DED.Queue.prototype.flush = function () {
    if(this.queue.length == 0)return;
    if(this.paused){
        this.paused = false;
        return;
    }
    var that = this;
    this.currentRetry++;
    var abort = function () {
        that.conn.abort();//XMLHttpRequest.abort:terminate the request
        if(that.currentRetry == that.retryCount){
            that.onFailure.fire();
            that.currentRetry = 0;
        }
        else{
            that.flush();
        }
    };
    this.timer = window.setTimeout(abort,this.timeout);
    var callback = function (o) {
        window.clearTimeout(this.timer);
        that.currentRetry = 0;
        that.queue.shift();
        that.onFlush.fire(o.responseText);
        if (that.queue.length === 0) {
            that.onComplete.fire();
            return;
        };
        that.flush();
    };

    this.conn = asyncRequest(
        this.queue[0]['method'],
        this.queue[0]['url'],
        callback,
        this.queue[0]['params']
    )

};
