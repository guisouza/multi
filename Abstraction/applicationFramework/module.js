  Module = function(){
    return this.constructor.apply(this,arguments)
  }

  Module.prototype.constructor = function(moduleDefinition){

    function newModule(){
      this.constructor.apply(this,arguments);
    }

    newModule.prototype.definition = moduleDefinition;

    newModule.prototype.constructor = function(sandbox){
      this.sandbox = sandbox;
      var moduleDefinition = this.definition(sandbox);
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

    newModule.prototype.load = function(HTMLElement,callback){
      this.element = HTMLElement;
      if (this.template){
        this.processLayout();
        callback(this)
      }else{
        this.sandbox.requestLayout(this.templateUrl,function(template){
          this.template = template
          this.processLayout();
          callback(this)
        }.bind(this))
      }
    }

    newModule.prototype.processLayout = function(){
      var element = document.createElement('div');
      element.innerHTML = this.template
      element = element.children[0]
      this.element.appendChild(element);
      this.element = element;
      [].forEach.call(this.element.querySelectorAll('[ref]'),this.attachReference.bind(this));
      [].forEach.call(this.element.querySelectorAll('[click]'),function(element){
        this.attachEvent('click',element)
      }.bind(this));
      [].forEach.call(this.element.querySelectorAll('[template]'),this.attachTemplate.bind(this))
    }

    newModule.prototype.attachReference = function(element){
      if (!this.refs)
        this.refs = {};
      this.refs[element.getAttribute('ref')] = element;
    }

    newModule.prototype.attachTemplate = function(element){
      if (!this.templates)
        this.templates = {};
      this.templates[element.getAttribute('template')] = element.outerHTML;
    }

    newModule.prototype.attachEvent = function(event,element){
      var expression = element.getAttribute(event);
      var regex = new RegExp('([^(]+)\s?(\([\S\s]*\)?)','gmi')

      expression = expression.match(regex);

      var method = expression[0];
      var args = expression[1].split('');

      args.pop();
      args = args.join('').split(',');
      args = args.map(this.format)

      element.addEventListener('click',function(evt){
        var indexOfEvent = args.indexOf('$event')
        if (indexOfEvent !== -1){
          args[indexOfEvent] = evt;
        }
        this[method].apply(this,args);
      }.bind(this))

    }

    newModule.prototype.format = function(arg){
      if (arg === '$event' || arg === '$e' || arg === '$evt'){
        return '$event';
      }
      if (isNaN(parseInt(arg,10))){
          return eval(arg);
      }
      return parseInt(arg,10)
    }

    return newModule;
  }
