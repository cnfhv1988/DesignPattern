//命令模式
//隔离调用操作的对象和实际实施操作的对象

var Command = new Interface('Command',['execute']);
var Composite = new Interface('Composite',['add','remove','getChild','getElement']);
var MenuObject = new Interface('MenuObject',['show']);

var MenuBar = function () {
    this.menus = {};
    this.element = document.createElement('ul');
    this.element.style.display = 'none';
};

MenuBar.prototype = {
    add:function (menuObject) {
        Interface.ensureImplements(menuObject,Composite,MenuObject);
        this.menus[menuObject.name] = menuObject;
        this.element.appendChild(this.menus[menuObject.name].getElement());
    },
    remove:function (name) {
        delete this.menus[name];
    },
    getChild:function (name) {
        return this.menus[name];
    },
    getElement:function () {
        return this.element;
    },
    show:function () {
        this.element.style.display = 'block';
        for(var name in this.menus){
            this.menus[name].show();
        }
    }
};

var Menu = function (name) {
    this.name = name;
    this.items = {};
    this.element = document.createElement('li');
    this.element.innerHTML = this.name;
    this.element.style.display = 'none';
    this.container = document.createElement('ul');
    this.element.appendChild(this.container);
};

Menu.prototype = {
    add:function (menuItem) {
        Interface.ensureImplements(menuItem,Composite,MenuObject);
        this.items[menuItem.name] = menuItem;
        this.container.appendChild(this.items[menuItem.name].getElement());
    },
    remove:function (name) {
        delete this.items[name];
    },
    getChild:function (name) {
        return this.items[name];
    },
    getElement:function () {
        return this.element;
    },
    show:function () {
        this.element.style.display = 'block';
        for(var name in this.items){
            this.items[name].show();
        }
    }
};

var MenuItem = function (name, command) {
    Interface.ensureImplements(command,Command);
    this.name = name;
    this.element = document.createElement('li');
    this.element.style.display = 'none';
    this.anchor = document.createElement('a');
    this.anchor.href = '#';
    this.element.appendChild(this.anchor);
    this.anchor.innerHTML = this.name;

    this.anchor.onclick = function (e) {
        e.preventDefault();
        command.execute();
    };
};

MenuItem.prototype = {
    add:function () {},
    remove:function () {},
    getChild:function () {},
    getElement:function () {
        return this.element;
    },
    show:function () {
        this.element.style.display = 'block';
    }
};

var MenuCommand = function (action) {
    this.action = action;
};

MenuCommand.prototype.execute = function () {
    this.action();
};

var FileActions = function () {};
FileActions.prototype = {
    open:function () {
        console.log('open a file');
    },
    close:function () {
        console.log('close a file');
    },
    save:function () {
        console.log('save a file');
    },
    saveAs:function () {
        console.log('save a file as ...');
    }
};

var fileActions = new FileActions();
var appMenuBar = new MenuBar();
var fileMenu = new Menu('File');
var openCommand = new MenuCommand(fileActions.open);
var closeCommand = new MenuCommand(fileActions.close);
var saveCommand = new MenuCommand(fileActions.save);
var saveAsCommand = new MenuCommand(fileActions.saveAs);
fileMenu.add(new MenuItem('Open',openCommand));
fileMenu.add(new MenuItem('Close',closeCommand));
fileMenu.add(new MenuItem('Save',saveCommand));
fileMenu.add(new MenuItem('SaveAs',saveAsCommand));
appMenuBar.add(fileMenu);

var Cursor = function (width, height, parent) {
    this.width = width;
    this.height = height;
    this.position = {x:width/2,y:height/2};

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    parent.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.fillStyle = '#c00';
    this.move(0,0);
};

Cursor.prototype = {
    move:function (x, y) {
        this.position.x += x;
        this.position.y += y;
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.fillRect(this.position.x,this.position.y,20,20);
    }
};

var MoveUp = function (cursor) {
    this.cursor = cursor;
};

MoveUp.prototype = {
    execute:function () {
        this.cursor.move(0,-10);
    },
    undo:function () {
        this.cursor.move(0,10);
    }
};

var MoveDown = function (cursor) {
    this.cursor = cursor;
};

MoveDown.prototype = {
    execute:function () {
        this.cursor.move(0,10);
    },
    undo:function () {
        this.cursor.move(0,-10);
    }
};

var MoveLeft = function (cursor) {
    this.cursor = cursor;
};

MoveLeft.prototype = {
    execute:function () {
        this.cursor.move(-10,0);
    },
    undo:function () {
        this.cursor.move(10,0);
    }
};

var MoveRight = function (cursor) {
    this.cursor = cursor;
};

MoveRight.prototype = {
    execute:function () {
        this.cursor.move(10,0);
    },
    undo:function () {
        this.cursor.move(-10,0);
    }
};

var Undo = function (undoStack) {
    this.undoStack = undoStack;
};

Undo.prototype.execute = function () {
    if(this.undoStack.length > 0){
        var lastCommand = this.undoStack.pop();
        lastCommand.undo();
    };
};

var UndoDecorator = function (command,undoStack) {
    this.undoStack = undoStack;
    this.command = command;
};
UndoDecorator.prototype = {
    execute:function () {
        this.undoStack.push(this.command)
        this.command.execute();
    },
    undo:function () {
        this.command.undo();
    }
};


window.onload = function () {
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(appMenuBar.getElement());
    var cursor = new Cursor(400,400,body);
    var undoStack = [];

    var OpMenu = new Menu('Operations');
    var MoveUpComand = new UndoDecorator(new MoveUp(cursor),undoStack);
    var MoveDownComand = new UndoDecorator(new MoveDown(cursor),undoStack);
    var MoveLeftComand = new UndoDecorator(new MoveLeft(cursor),undoStack);
    var MoveRightComand = new UndoDecorator(new MoveRight(cursor),undoStack);
    var UndoCommand = new Undo(undoStack);
    OpMenu.add(new MenuItem('Up',MoveUpComand));
    OpMenu.add(new MenuItem('Down',MoveDownComand));
    OpMenu.add(new MenuItem('Left',MoveLeftComand));
    OpMenu.add(new MenuItem('Right',MoveRightComand));
    OpMenu.add(new MenuItem('Undo',UndoCommand));
    appMenuBar.add(OpMenu);
    appMenuBar.show();
};

//对于更复杂的操作，可逆比较困难的情况下，可以将命令全部压栈，在执行undo时最后一个命令出栈后，再次全部执行全部命令来实现
