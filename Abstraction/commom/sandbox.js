var SandBox = (function(){

  Sandbox = function(){
    this.constructor.apply(this,arguments)
  }

  Sandbox.prototype.constructor = function(core){
    this.events = {}
    this.core = core;
  }

  Sandbox.prototype.requestLayout = function(url,callback){
    this.core.get(url,callback);
  }

  Sandbox.prototype.on = function(label,action){
    if (!this.events[label])
      this.events[label] = [];

    this.events[label].push(action);
  }

  Sandbox.prototype.notify = function notify(label,data){
    var event = new Event(data)
    if (this.events[label])
    this.events[label].forEach(function(action){
      if (event.shouldExecute()){
          action(event);
      }

    })
  }

  return Sandbox

})()
