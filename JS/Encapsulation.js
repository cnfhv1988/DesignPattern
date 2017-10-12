var Book = (function(){

    var numOfBooks = 0;

    //privileged static method
    //静态方法
    function checkIsbn(isbn){
        return true;
    }

    //通过闭包使得部分成员私有，仅能通过this标志的特权方法进行读写，弊端是每个实例都会保存一份副本
    var BookConstructor = function(newIsbn,newTitle,newAuthor){

        var isbn,title,author;

        this.getIsbn = function(){
            return isbn;
        }
        this.setIsbn = function(newIsbn){
            if(!checkIsbn(newIsbn)){
                throw new Error("Invalid ISBN:" + newIsbn);
            }
            isbn = newIsbn;
        }
        this.getTitle = function(){
            return title;
        }
        this.setTitle = function(newTitle){
            title = newTitle || "No title specified";
        }
        this.getAuthor = function(){
            return author;
        }
        this.setAuthor = function(newAuthor){
            autor = newAuthor || "No author specified";
        }

        this.setIsbn(newIsbn);
        this.setTitle(newTitle);
        this.setAuthor(newAuthor);
    }

    BookConstructor.prototype.getNumbers = function(){
        return numOfBooks;
    }

    return BookConstructor;
})();

//Public static method
Book.convertToTitleCase = function(){
    alert("Book.convertToTitleCase");
}

//instance method
Book.prototype = {
    display:function(){
        alert("Book.prototype.display");
    }
}
