//职责链模式
//下面的例子是组合模式+职责链模式，组合模式的层级结构已经相当于链式的结构，好处在于，职责链在某一层级的操作不需要
//向下传递，最简单的例子就是如果需要隐藏节点，那么直接隐藏父节点即可

//书中图书馆的例子，要将每本书分类，对于每本书判断是否符合本分类以决定是否纳入，然后将书传递给链上的下个节点，
//这种方式非常方便动态扩展，而不需要初始化所有的分类，这样降低消耗的同时，还可以降低依赖

var Composite = new Interface('Composite',['add','remove','getChild','getAllLeaves']);
var GalleryItem = new Interface('GalleryItem',['hide','show','addTag','getPhotoWithTag']);

var DynamicGallery = function (id) {
    this.children = [];
    this.tags = [];
    this.element = document.createElement('div');
    this.element.id = id;
    this.element.className = 'dynamic-gallery';
};

DynamicGallery.prototype = {
    add:function (child) {
        Interface.ensureImplements(child,Composite,GalleryItem);
        this.children.push(child);
        this.element.appendChild(child.getElement());
    },
    remove:function (child) {
        for(var i=0;i<this.children.length;i++){
            if(child == this.children[i]){
                this.children.splice(i,1);
                break;
            };
        };
        this.element.removeChild(child.getElement());
    },
    getChild:function (i) {
        return this.children[i];
    },
    getElement:function () {
        return this.element;
    },
    hide:function () {
        this.element.style.display = 'none';//职责链，已经无需向下传递
    },
    show:function () {
        this.element.style.display = '';
        for(var i=0;i<this.children.length;i++){
            this.children[i].show();
        };
    },
    addTag:function (tag) {
        this.tags.push(tag);
        for(var node,i=0;node=this.getChild(i);i++){
            node.addTag(tag);
        };
    },
    getAllLeaves:function () {
        var leaves = [];
        for(var node,i=0;node=this.getChild(i);i++){
            leaves = leaves.concat(node.getAllLeaves());
        };
        return leaves;
    },
    getPhotoWithTag:function (tag) {
        for(var i=0;i<this.tags.length;i++){
            if(this.tags[i] == tag){
                return this.getAllLeaves();
            };
        };

        //如果在本层级找不到标签，则向下搜索
        for(var results=[],node,i=0;node = this.getChild(i);i++){
            results = results.concat(node.getPhotoWithTag(tag));
        };
        return results;
    }
};

var GalleryImage = function (src) {
    this.tags = [];
    this.element = document.createElement('img');
    this.element.src = src;
    this.element.className = 'gallery-image';
};

GalleryItem.prototype = {
    add:function () {},
    remove:function () {},
    getChild:function () {},
    show:function () {
        this.element.style.display = '';
    },
    hide:function () {
        this.element.style.display = 'none';
    },
    getElement:function () {
        return this.element;
    },
    addTag:function (tag) {
        this.tags.push(tag);
    },
    getAllLeaves:function () {
        return [this];
    },
    getPhotoWithTag:function (tag) {
        for(var i=0;i<this.tags.length;i++){
            if(tag == this.tags[i]){
                return [this];
            };
        };
        return [];
    }
}
