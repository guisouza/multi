var Platform = (function(){

  function Platform(){
    this.constructor.apply(this,arguments);
  }

  Platform.prototype.constructor = function(rootElement){
    this.element = document.querySelector('.applications')
    this.applications = [];
    this.instances = [];
    this.root = rootElement
  }

  Platform.prototype.register = function(application){
    this.applications.push(application);
    var child = document.createElement('li');
    child.addEventListener('click',this.init.bind(this,application))
    child.innerHTML = application.prototype.title;
    this.element.appendChild(child)
  }

  Platform.prototype.init = function(application){
      this.instances.push(new application(this.root))
  }

  return Platform

})()
