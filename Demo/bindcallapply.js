// es6实现
Function.prototype.myCall = function(content, ...args){
    content = content || window;
    content.fn = this;
    const res = content.fn(...args);
    delete content.fn;
    return res;
};
// es5实现
Function.prototype.myCall = function (context) {
    context = context || window;
    context.fn = this;
    var args = [];
    for(let i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args +')');
    delete context.fn;
    return result;
}
// es6实现
Function.prototype.myApply = function (content, args) {
    content = content || window;
    content.fn = this;
    const res = content.fn(...args);
    delete content.fn;
    return res;
};
// es5实现
Function.prototype.myApply = function (content, arr=[]) {
    content = content || window;
    content.fn = this;
    var args = [];
    for(var i=0; i<arr.length; i++){
        args.push("arr["+i+"]")
    }
    var res = eval("content.fn("+args+")");
    delete content.fn;
    return res;
};


// 简单实现Object.create方法
Object.create = function(proto){
    function F() {};
    F.prototype = proto;
    F.prototype.constructor = F;
    return new F();
}
// 注意：bind返回的函数可通过new实例化(需要确保bind后的函数与原函数在同一原型链)
Function.prototype.myBind = function (content) {
    const args = Array.prototype.slice.call(arguments, 1);  // bind层参数
    const func = this;
    const bindFunc = function () {
        func.apply(content, args.concat([...arguments]))  
    };
    bindFunc.prototype = Object.create(func.prototype);
    return bindFunc
};


