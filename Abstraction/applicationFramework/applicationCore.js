var platform = {}

var publicSandbox = new Sandbox(platform)

  Application = function(){
    return this.constructor.apply(this,arguments)
  }

  Application.prototype.constructor = function(applicationDefinition){
    var definition = applicationDefinition(publicSandbox)
    function newApplication(){
      this.constructor.apply(this,arguments);
    }

    newApplication.prototype.constructor = function(HTMLElement){
      this.element = HTMLElement;
      this.sandbox = new Sandbox(this);
      this.modules = [];
      this.define(definition);
      this.load();
      this.init();
    }

    newApplication.prototype.define = function(definition){
      for (method in definition){
        if (definition[method].bind){
          this[method] = definition[method].bind(this);
        }else{
          this[method] = definition[method];
        }
      }
    }

    newApplication.prototype.register = function(module){
      if(module.attachSandbox)
        module.attachSandbox(this.sandbox)
      this.modules.push(module);
    }

    newApplication.prototype.startAll = function(){
      this.modules.forEach(function(module){
        module.load(this.element)
        module.init.call(module.prototype);
      }.bind(this))
    }

    newApplication.prototype.load = function(callback){
      var element = document.createElement('div');
      element.innerHTML = this.template
      element = element.children[0]
      this.element.appendChild (element);
      this.element = element
    }


    newApplication.prototype.get = function(path,callback){

      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", function(){
        callback(this.responseText)
      });
      oReq.open("GET", path);
      oReq.send();

    }

    return newApplication

  }
