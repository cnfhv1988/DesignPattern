//组合模式Composite Pattern
//对于一系列组合有层次结构的对象，组合对象和叶对象，类似一棵树的形式，例如一个动态表单，为其添加
//save和validate方法时，为了避免多次循环嵌套，可以采用组合模式，在顶层对象的方法会递归调用底层
//方法，适合对大批对象进行操作，并且弱化对象间的耦合
//注意，组合模式中顶层与底层对象并不是继承关系，虽然他们具有相同的方法
//表单的例子并不是特别好，因为表单无法内嵌表单，而真正的组合模式，同类对象是可以嵌套的

var Composite = new Interface('Composite',['add','remove','getChild']);
var form = new Interface('form',['save','restore']);

var CompositeForm = function (id,method,action) {
    this.formComponents = [];
    this.element = document.createElement('form');
    this.element.id = id;
    this.element.method = method || 'POST';
    this.element.action = action || '#';
};

CompositeForm.prototype.add = function (child) {
    Interface.ensureImplements(child,Composite,form);
    this.formComponents.push(child);
    this.element.appendChild(child.getElement());
};

CompositeForm.prototype.remove = function (child) {
    for(var i=0,len=this.formComponents.length;i<len;i++){
        if(this.formComponents[i] == child){
            this.formComponents.splice(i,1);
            break;
        }
    }
};

CompositeForm.prototype.getChild = function (i) {
    return this.formComponents[i];
};

CompositeForm.prototype.save = function () {
    for(var i=0,len=this.formComponents.length;i<len;i++){
        this.formComponents[i].save();
    }
};

CompositeForm.prototype.getElement = function () {
    return this.element;
};

//扩展restore方法
CompositeForm.prototype.restore = function () {
    for(var i=0;i<this.formComponents.length;i++){
        this.formComponents[i].restore();
    }
};

//叶对象 父类
var Field = function (id) {
    this.id = id;
    this.element;
};

Field.prototype = {
    add:function () {},
    remove:function () {},
    getChild:function () {},
    save:function () {
        setCookie(this.id,this.getValue());
    },
    getElement:function () {
        return this.element;
    },
    getValue:function () {
        throw new Error('Unsupported operation on the class field.');
    },
    getField:function () {
        throw new Error('Unsupported operation on the class field.');
    },
    //扩展restore方法
    restore:function () {
        this.getField().value = getCookie(this.id);
    }

};

//input类,继承Field

var InputField = function (id,label) {
    Field.call(this,id);
    this.input = document.createElement('input');
    this.input.id = id;

    this.label = document.createElement('label');
    var labelTextNode = document.createTextNode(label);
    this.label.appendChild(labelTextNode);

    this.element = document.createElement('div');
    this.element.className = 'input-field';
    this.element.appendChild(this.label);
    this.element.appendChild(this.input);
};

extend(InputField,Field);

InputField.prototype.getValue = function () {
    return this.input.value;
};

InputField.prototype.getField = function () {
    return this.input;
};

//textarea类

var TextareaField = function (id,label) {
    Field.call(this,id);
    this.textarea = document.createElement('textarea');
    this.textarea.id = id;

    this.label = document.createElement('label');
    var labelTextNode = document.createTextNode(label);
    this.label.appendChild(labelTextNode);

    this.element = document.createElement('div');
    this.element.className = 'textarea-field';
    this.element.appendChild(this.label);
    this.element.appendChild(this.textarea);
};

extend(TextareaField,Field);

TextareaField.prototype.getValue = function () {
    return this.textarea.value;
};

TextareaField.prototype.getField = function () {
    return this.textarea;
};

//select类
var SelectField = function (id, label,options) {
    Field.call(this,id);
    this.select = document.createElement('select');
    this.select.id = id;

    this.label = document.createElement('label');
    var labelTextNode = document.createTextNode(label);
    this.label.appendChild(labelTextNode);

    this.options = options || ['Please Select'];
    for(var i=0;i<this.options.length;i++){
        this.select.options.add(new Option(this.options[i]));
    }

    this.element = document.createElement('div');
    this.element.className = 'select-field';
    this.element.appendChild(this.label);
    this.element.appendChild(this.select);
};

extend(SelectField,Field);

SelectField.prototype.getValue = function () {
    return this.select.options[this.select.selectedIndex].value;
};

SelectField.prototype.getField = function () {
    return this.select;
};


//如果想要对表单域扩展方法，不需要为每一个域类的实现扩展，大多数情况只需要扩展Field类即可，同时在组合对象添加方法
//类似于save，则可以对整个批次的表单对象执行一次操作即可

//组合模式的威力还不仅限于此，还可以组织更加负责的层级接口，以便对部分对象进行更加细粒度的控制
//例如下面实现的域集对象，将部分对象组织起来，只要实现了相应接口即可，具体实现细节可以任意
var FieldSet = function (id,lengendText) {
    this.components = {};

    this.element = document.createElement('fieldset');
    this.element.id = id;

    if(lengendText){
        this.legend = document.createElement('legend');
        this.legend.appendChild(document.createTextNode(lengendText));
        this.element.appendChild(this.legend);
    }
};

FieldSet.prototype = {
    add:function (child) {
        Interface.ensureImplements(child,Composite,form);
        this.components[child.id] = child;
        this.element.appendChild(child.getElement());
    },
    remove:function (child) {
        delete this.components[child.getElement().id];
    },
    getChild:function (id) {
        if(this.components[id]){
            return this.components[id];
        }
        else{
            return null;
        }
    },
    save:function () {
        for(var id in this.components){
            if(!this.components.hasOwnProperty(id))continue;
            this.components[id].save();
        }
    },
    restore:function () {
        for(var id in this.components){
            if(!this.components.hasOwnProperty(id))continue;
            this.components[id].restore();
        }
    },
    getElement:function () {
        return this.element;
    }
};
