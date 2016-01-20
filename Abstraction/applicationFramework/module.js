  Module = function(){
    return this.constructor.apply(this,arguments)
  }

  Module.prototype.constructor = function(moduleDefinition){

    var moduleDefinition = moduleDefinition();

    function newModule(){
      this.constructor.apply(this,arguments);
    }

    newModule.prototype.constructor = function(HTMLElement){
      this.define(moduleDefinition)
    }

    newModule.prototype.define = function (definition) {
      for (method in definition){
        if (definition[method].bind){
          this[method] = definition[method].bind(this);
        }else{
          this[method] = definition[method];
        }
      }
    };

    newModule.prototype.attachSandbox = function(sandbox){
      this.sandbox = sandbox;
    }

    newModule.prototype.load = function(HTMLElement){
      this.element = HTMLElement;
      var element = document.createElement('div');
      element.innerHTML = this.template
      element = element.children[0]
      this.element.appendChild (element);
      this.element = element
    }

    return newModule;
  }
