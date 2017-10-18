
//工厂模式好处，弱化对象间的耦合，减少代码重复，但是切勿滥用
//一般做法是，创建抽象父类，在子类中实现工厂方法，这样提供了一种灵活性，可以在运行期间自由选择实现


var AjaxHandler = new Interface('AjaxHandler',['request','createXhrObject']);

var SimpleHandler = function () {};
SimpleHandler.prototype = {
    request:function (method, url, callback, postVars) {
        var xhr = this.createXhrObject();
        xhr.onreadystatechange = function () {
            if(xhr.readyState !== 4)return; // 0:unset,1:opened,2:headers_recieved,3:loading,4:done
            xhr.status == 200 ? callback.success(xhr.responseText,xhr.responseXML)
                :callback.failure(xhr.status);
        };
        console.log(xhr);
        xhr.open(method,url,true);
        if(method !== 'POST')postVars = null;
        xhr.send(postVars);
    },

    //这是一个简单工厂模式
    createXhrObject:function () {
        //工厂方法，视当前执行环境创建xhr，并且在同一个环境只需执行一次，之后就会替换掉createXhrObject(line40)
        var methods = [
            function () {
                return new XMLHttpRequest();
            },
            function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            },
            function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for(var i=0,len=methods.length;i<len;i++){
            try{
                methods[i]();
            }
            catch(e){
                continue;
            }
            this.createXhrObject = methods[i];
            return methods[i](); //注意，如果不加括号，第一次执行返回的将是一个函数，而得不到xhr对象
        }
        throw new Error('SimpleHandler:Could not create XHR Object.');
    }
}


//处理器类，应对高网络延迟
var QueueHandler = function () {
    this.queue = [];
    this.requestInProgress = false;
    this.retryDelay = 5;
}

extend(QueueHandler, SimpleHandler);

QueueHandler.prototype.request = function (method,url,callback,postVars,override) {
    if(this.requestInProgress && !override){
        //if override = true,the request will be send immediately, else override = false / undefined,
        //the request will be push into the queue
        this.queue.push({method:method,url:url,callback:callback,postVars:postVars});
    }
    else{
        this.requestInProgress = true;
        var xhr = this.createXhrObject();
        xhr.onreadystatechange = function () {
            if(xhr.readyState !== 4){
                return;
            }
            if(xhr.status === 200){
                callback.success(xhr.responseText,xhr.responseXML);
                this.advanceQueue();
            }
            else{
                callback.failure(xhr.status);
                setTimeout(function () {
                    this.request(method,url,callback,postVars);
                },this.retryDelay*1000);
            }
        };
        if(method !== 'POST')postVars = null;
        xhr.send(postVars);
    }
}

QueueHandler.prototype.advanceQueue = function () {
    if(this.queue.length === 0){
        this.requestInProgress = false;
        return;
    }
    var req = this.queue.shift();
    this.request(req.method,req.url,req.callback,req.postVars);
}


//处理器类，应对离线模式
var OfflineHandler = function () {
    this.storedRequests = [];
}

extend(OfflineHandler,SimpleHandler);

OfflineHandler.prototype.request = function (method,url,callback,postVars) {
    if(XhrManager.isOffline()){
        this.storedRequests.push({method:method,url:url,callback:callback,postVars:postVars});
    }
    else{
        this.flushRequests();
        this.superClass.request(method,url,callback,postVars);
    }
}

OfflineHandler.prototype.flushRequests = function () {
    for(var i=0,len=this.storedRequests.length;i<len;i++){
        var request = this.storedRequests[i];
        OfflineHandler.superClass.request(request.method,request.url,request.callback,request.postVars);
    }
}


var XhrManager = {

    //另一个工厂模式，根据实际情况选择创建合适的Xhr对象
    createXhrObject:function () {
        var xhr;
        if(this.isOffline()){
            xhr = new OfflineHandler();
        }
        else if(this.isHighLatency()){
            xhr = new QueueHandler();
        }
        else{
            xhr = new SimpleHandler();
        }
        Interface.ensureImplements(xhr,AjaxHandler);
        return xhr;
    },
    isOffline:function () {
        //send a request to verify offline or not
    },
    isHighLatency:function () {
        //send some requests to verify whether there is a high latency
    }
}

//使用XhrManager
var handler = XhrManager.createXhrObject();
callback = {
    success:function (responseText) {
        console.log(responseText);
    },
    failure:function (responseCode) {
        console.log(responseCode);
    }
}
handler.request('GET','https://www.baidu.com',callback);

