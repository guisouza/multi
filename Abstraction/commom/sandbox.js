var SandBox = (function(){

  Sandbox = function(){
    this.constructor.apply(this,arguments)
  }

  Sandbox.prototype.constructor = function(ApplicationCore){
    this.core = ApplicationCore;
    this.get = this.core.get
    this.events = {}
  }

  Sandbox.prototype.notify = function(label,data){
    if (this.events[label])
    this.events[label].forEach(function(action){
      action(data);
    })
  }

  Sandbox.prototype.on = function(label,action){
    if (!this.events[label])
      this.events[label] = [];

    this.events[label].push(action);
  }

  return Sandbox

})()
