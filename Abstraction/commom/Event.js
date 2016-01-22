var Event = (function(){
  function Event(){
    this.constructor.apply(this, arguments);
  }

  Event.prototype.constructor = function(data){
    this.data = data;
    this.stopped = false;
  }

  Event.prototype.stopPropagation = function(){
    this.stopped = true;
  }

  Event.prototype.shouldExecute = function(){
    return !this.stopped;
  }

  return Event;
})()
