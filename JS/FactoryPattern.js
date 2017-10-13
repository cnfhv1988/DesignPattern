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

var QueueHandler = function () {
    this.queue = [];
    this.requestInProgress = false;
    this.retryDelay = 5;
}

extend(QueueHandler, SimpleHandler);

QueueHandler.prototype.request = function (method,url,callback,postVars,override) {
    if(this.requestInProgress && !override){

    }
}
