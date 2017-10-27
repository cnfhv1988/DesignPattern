//外观模式
//对象结构型模式，定义一个高层接口供外部使用，降低外部对于内部对象调用的复杂度，即对于多个内部对象时，外部不需要一一与之打交道，
//而通过一个统一接口而使其更容易使用。
//外观模式可以简化内部与外部的调用关系，降低耦合度，但是带来的缺点则是降低了调用的灵活性

function addEvent(el,type,fn){
  if(window.addEventListener){
    el.addEventListener(type,fn,false);
  }
  else if(window.attachEvent){
    el.attachEvent('on'+type,fn);
  }
  else{
    el['on'+type] = fn;
  }
}

DED.util.Event = {
    stopPropagation:function (e) {
        if(e.stopPropagation){
            e.stopPropagation();
        }
        else{
            e.cancelBubble = true;
        }
    },
    preventDefault:function (e) {
        if(e.preventDefault){
            e.preventDefault();
        }
        else{
            e.returnValue = false;
        }
    },
    getEvent:function (e) {
        return e||window.event;
    },
    getTarget:function (e) {
        return e.target || e.srcElement;
    }
    //facade
    stopEvent:function (e) {
        DED.util.stopPropagation(e);
        DED.util.preventDefault(e);
    }
}
