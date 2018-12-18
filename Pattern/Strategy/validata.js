var form = document.getElementById('form'),
    warn = document.getElementById('warn');
Function.prototype.before = function(beforeFn){
  var self = this;
  return function(){
    if(beforeFn.apply(this, arguments) === false)
      return;
    return self.apply(this, arguments);
  }
}
var vldStrategy = { //策略对象-验证规则
  isNonEmpty: function(value, warnMsg){ //输入不为空
    if(value === '')
      return warnMsg;
  },
  isLongEnough: function(value, length, warnMsg){ //输入足够长
    if(value.length < length)
      return warnMsg;
  },
  isShortEnough: function(value, length, warnMsg){ //输入足够短
    if(value.length > length)
      return warnMsg;
  },
  isMobile: function(value, warnMsg){ //手机号验证
    var reg = /^1[3|5|8][0-9]{9}$/;
    if(!reg.test(value))
      return warnMsg;
  }
}
var Validator = function(){ //环境类
  this.rules = []; //数组用于存放负责验证的函数
};
Validator.prototype.add = function(domNode, ruleArr){ //添加验证规则
  var self = this;
  for(var i = 0, rule; rule = ruleArr[i++];){
    (function(rule){
      var strategyArr = rule.strategy.split(':'),
          warnMsg = rule.warnMsg;
      self.rules.push(function(){
        var tempArr = strategyArr.concat();
        var ruleName = tempArr.shift();
        tempArr.unshift(domNode.value);
        tempArr.push(warnMsg);
        return vldStrategy[ruleName].apply(domNode, tempArr);
      });
    })(rule);
  }
  return this;
};
Validator.prototype.start = function(){ //开始验证表单
  for(var i = 0, vldFn; vldFn = this.rules[i++];){
    var warnMsg = vldFn();
    if(warnMsg){
      warn.textContent = warnMsg;
      return false;
    }
  }
}
var vld = new Validator();
vld.add(form.username, [
  {
    strategy: 'isNonEmpty',
    warnMsg: '账号不能为空'
  },
  {
    strategy: 'isLongEnough:4',
    warnMsg: '账号不能小于4位'
  },
  {
    strategy: 'isShortEnough:20',
    warnMsg: '账号不能大于20位'
  }
]).add(form.password, [
  {
    strategy: 'isNonEmpty',
    warnMsg: '密码不能为空'
  }
]).add(form.phonenum, [
  {
    strategy: 'isNonEmpty',
    warnMsg: '手机号不能为空'
  },
  {
    strategy: 'isMobile',
    warnMsg: '手机号格式不正确'
  }
]);
var submitMsg = function(){
  var msg = {
    username: form.username.value,
    password: form.password.value,
    phonenum: form.phonenum.value
  }
  //ajax('...', msg);
  return warn.textContent = '用户信息已成功提交至服务器';
}
submitMsg = submitMsg.before(vld.start.bind(vld));
form.submit.onclick = function(){
  submitMsg();
};