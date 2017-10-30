//适配器模式
//************************************************************************
//String.prototype.replace,当第二个参数为function时，主要参数：
//match	匹配的子串。（对应于上述的$&。）
//p1,p2, ...	假如replace()方法的第一个参数是一个RegExp 对象，则代表第n个括号匹配的字符串。（对应于上述的$1，$2等。）
//offset	匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是“abcd”，匹配到的子字符串是“bc”，那么这个参数将是1）
//string	被匹配的原字符串。

function substitude(s,o){
  return s.replace(/{([^{}]*)}/,function(a,b){
    //正则表达式匹配  {1}  此种格式的字符串，小括号为分组，中括号内表示非(^)大括号的任意字符
    //a表示匹配到的字符串（{1}），b表示匹配的第一个分组的内容（即$1，此处即为1）
    //函数的返回值将会替换增则表达式匹配的字符串
    return typeof o[b] == 'string' || typeof o[b] == 'number' ? o[b] : a;
  })
}

//************************************************************************
//适配器模式，对对象进行包装进而改变其呈现的接口，它是两个不兼容接口之间的代码薄层，在充分了解接收方和提供方的情况，
//截取提供方的逻辑，使之转变为接收方理解的逻辑
function Afun(id,name){
    console.log('This is Afun and id:' + id + ' name:' + name);
}

function Bfun(name){
    //some logic
    console.log('This is Bfun and name:' + name);
}

function AtoBadapter(id,name){
    //some loigc
    return Bfun(name);
}

Afun(1,'MaChao'); //This is Afun and id:1 name:MaChao
//convert Afun to Bfun
Afun = AtoBadapter;
Afun(1,'MaChao'); //This is Bfun and name:MaChao
