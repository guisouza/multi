'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*  global Application */
/*  global Sandbox */
/*  global Sandbox */
/*  global setInterval */
/*  global XMLHttpRequest */
/*  global Template */

var Application = function Application(applicationTitle, applicationDefinition) {
  _classCallCheck(this, Application);

  var definition = applicationDefinition;

  var newApplication = function () {
    function newApplication(sandbox) {
      _classCallCheck(this, newApplication);

      this.sandbox = new Sandbox(this);
      this.modules = [];
      this.define(definition(sandbox));
    }

    _createClass(newApplication, [{
      key: 'define',
      value: function define(interfaceDefinition) {
        for (var method in interfaceDefinition) {
          if (interfaceDefinition[method].bind) {
            this[method] = interfaceDefinition[method].bind(this);
          } else {
            this[method] = interfaceDefinition[method];
          }
        }
      }
    }, {
      key: 'register',
      value: function register(module) {
        module = new module(this.sandbox);

        this.sandbox.on('DOWN', function applicationDownHandler() {
          if (this.template.element.className.indexOf('down') === -1) {
            this.template.element.className = this.template.element.className + ' down';
          }
        }.bind(this));

        this.checkTimer = setInterval(function checkTrimer() {
          var allOk = true;

          this.modules.forEach(function moduleIterator(currentModule) {
            if (currentModule.hasOwnProperty('alive')) {
              if (currentModule.alive === false) {
                allOk = false;
              }
            }
          });

          if (allOk) {
            this.template.element.className = this.template.element.className.replace('down', '');
          }
        }.bind(this), 1000);

        this.modules.push(module);
        return module;
      }
    }, {
      key: 'startAll',
      value: function startAll() {
        this.modules.forEach(this.startModule.bind(this));
      }
    }, {
      key: 'startModule',
      value: function startModule(module) {
        module.load(this.template.element, function (currentModule) {
          if (currentModule.init) {
            currentModule.init.bind(currentModule)();
          }
        });
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        // this.modules.forEach(function(module){
        // module.unload();
        // module.destroy;
        // }.bind(this))
      }
    }, {
      key: 'load',
      value: function load(HTMLElement) {
        this.element = HTMLElement;
        if (this.template) {
          this.processLayout();
          this.init();
        } else {
          this.sandbox.requestLayout(this.templateUrl, function requestLayout(template) {
            this.template = template;
            this.processLayout();
            this.init();
          }.bind(this));
        }
      }
    }, {
      key: 'processLayout',
      value: function processLayout() {
        this.template = new Template(this.element, this.template, this);
      }
    }, {
      key: 'get',
      value: function get(path, callback) {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener('load', function layoutRequestCallback() {
          callback(this.responseText);
        });
        oReq.open('GET', path);
        oReq.send();
      }
    }]);

    return newApplication;
  }();

  newApplication.prototype.title = applicationTitle;

  return newApplication;
};

/*  global Template */

var Module = function Module(moduleDefinition) {
  _classCallCheck(this, Module);

  var newModule = function () {
    function newModule(sandbox) {
      _classCallCheck(this, newModule);

      moduleDefinition = this.definition(sandbox);
      this.sandbox = sandbox;
      this.define(moduleDefinition);
    }

    _createClass(newModule, [{
      key: 'define',
      value: function define(definition) {
        for (var method in definition) {
          if (definition[method].bind) {
            this[method] = definition[method].bind(this);
          } else {
            this[method] = definition[method];
          }
        }
      }
    }, {
      key: 'load',
      value: function load(HTMLElement, callback) {
        this.element = HTMLElement;
        if (this.template) {
          this.processLayout();
          callback(this);
        } else {
          this.sandbox.requestLayout(this.templateUrl, function templateHandler(template) {
            this.template = template;
            this.processLayout();
            callback(this);
          }.bind(this));
        }
      }
    }, {
      key: 'processLayout',
      value: function processLayout() {
        this.template = new Template(this.element, this.template, this);
        this.element = this.template.element;
      }
    }]);

    return newModule;
  }();

  newModule.prototype.definition = moduleDefinition;

  return newModule;
};

var multi = {};

/*  global setTimeout */
/*  global Worker */
/*  global Template */
/*  global clearInterval */
/*  global setInterval*/

Function.prototype.superBind = function superBind(worker) {
  return function superBindHandler(event) {
    worker.postMessage({
      action: 'contextualExecution',
      data: this.toString(),
      event: {
        data: event.data
      }
    });
  }.bind(this);
};

var ThreadModule = function ThreadModule(moduleDefinition) {
  _classCallCheck(this, ThreadModule);

  var newModule = function () {
    function newModule(sandbox) {
      var _this = this;

      _classCallCheck(this, newModule);

      moduleDefinition = this.definition(sandbox);
      this.sandbox = sandbox;
      this.worker = new Worker('worker.js');
      this.alive = true;
      this.methods = {};

      this.define(moduleDefinition);

      this.worker.addEventListener('message', this.messageHandler.bind(this));

      this.worker.postMessage({
        action: 'define',
        data: this.methods
      });

      this.check = setInterval(function () {
        return _this.ping();
      }, 1000);

      this.itsAlive = setTimeout(function checkAlive() {
        this.sandbox.notify('DOWN', this);
      }.bind(this), 2000);
    }

    _createClass(newModule, [{
      key: 'ping',
      value: function ping() {
        this.worker.postMessage({
          action: 'ping'
        });
      }
    }, {
      key: 'define',
      value: function define(definition) {
        for (var method in definition) {
          if (method !== 'template') {
            this.methods[method] = definition[method].toString();
          }
        }
        this.template = definition.template;
      }
    }, {
      key: 'messageHandler',
      value: function messageHandler(event) {
        var action = event.data.action;
        var data = event.data.data;
        var operation = undefined;
        switch (action) {
          case 'sandbox:on':
            var label = data[0];
            operation = new Function('event', 'return (' + data[1] + ').bind(this)(event)').superBind(this.worker);
            this.sandbox.on(label, operation);
            break;
          case 'sandbox:notify':
            this.sandbox.notify(data[0], data[1]);
            break;
          case 'setRefProp':
            this.template.refs[data.ref][data.key] = data.value;
            break;
          case 'template':
            var element = this.template.refs[data[0]];
            operation = new Function('el', 'return (' + data[1] + ')(el)');
            operation(element);
            break;
          case 'pong':
            clearInterval(this.itsAlive);
            this.alive = true;
            this.itsAlive = setTimeout(function checkAlive() {
              this.alive = false;
              this.sandbox.notify('DOWN', this);
            }.bind(this), 1500);
            break;

        }
      }
    }, {
      key: 'init',
      value: function init() {
        this.sendRefs();
        this.worker.postMessage({
          action: 'execute',
          data: 'init'
        });
      }
    }, {
      key: 'sendRefs',
      value: function sendRefs() {
        for (var ref in this.template.refs) {
          this.worker.postMessage({ action: 'registerRef', data: ref });
        }
      }
    }, {
      key: 'load',
      value: function load(HTMLElement, callback) {
        this.element = HTMLElement;
        if (this.template) {
          this.processLayout();
          callback(this);
        } else {
          this.sandbox.requestLayout(this.templateUrl, function requestLayout(template) {
            this.template = template;
            this.processLayout();
            callback(this);
          }.bind(this));
        }
      }
    }, {
      key: 'processLayout',
      value: function processLayout() {
        this.template = new Template(this.element, this.template, this);
        this.element = this.template.element;
      }
    }]);

    return newModule;
  }();

  newModule.prototype.definition = moduleDefinition;

  return newModule;
};

var Event = function () {
  function Event(data) {
    _classCallCheck(this, Event);

    this.data = data;
    this.stopped = false;
  }

  _createClass(Event, [{
    key: 'stopPropagation',
    value: function stopPropagation() {
      this.stopped = true;
    }
  }, {
    key: 'shouldExecute',
    value: function shouldExecute() {
      return !this.stopped;
    }
  }]);

  return Event;
}();

// class MessageHandler {
//   constructor(owner, worker) {
//     this.worker.addEventListener('message',this.messageHandler.bind(this))
//   }
//
// }

/* global document */

var Template = function () {
  function Template(container, HTMLString, context) {
    _classCallCheck(this, Template);

    var element = document.createElement('div');
    this.container = container;
    element.innerHTML = HTMLString;
    element = element.children[0];
    this.element = element;
    this.container.appendChild(element);
    this.context = context;

    [].forEach.call(this.container.querySelectorAll('[ref]'), this.attachReference.bind(this));

    [].forEach.call(this.container.querySelectorAll('[click]'), function clickEventIterator(currentElement) {
      this.attachEvent('click', currentElement);
    }.bind(this));

    [].forEach.call(this.container.querySelectorAll('[template]'), this.attachTemplate.bind(this));
    this.container = element;
  }

  _createClass(Template, [{
    key: 'attachReference',
    value: function attachReference(element) {
      if (!this.refs) {
        this.refs = {};
      }
      this.refs[element.getAttribute('ref')] = element;
    }
  }, {
    key: 'attachTemplate',
    value: function attachTemplate(element) {
      if (!this.templates) {
        this.templates = {};
      }
      this.templates[element.getAttribute('template')] = element.outerHTML;
    }
  }, {
    key: 'attachEvent',
    value: function attachEvent(event, element) {
      var regex = new RegExp('([^(]+)\s?(\([\S\s]*\)?)', 'gmi');
      var expression = element.getAttribute(event).match(regex);
      var method = expression[0];
      var args = expression[1].split('');

      args.pop();
      args = args.join('').split(',');
      args = args.map(this.format);

      element.addEventListener('click', function internalClickHandler(evt) {
        var indexOfEvent = args.indexOf('$event');
        if (indexOfEvent !== -1) {
          args[indexOfEvent] = evt;
        }
        this.context[method].apply(this, args);
      }.bind(this));
    }
  }, {
    key: 'format',
    value: function format(arg) {
      if (arg === '$event' || arg === '$e' || arg === '$evt') {
        return '$event';
      }
      if (isNaN(parseInt(arg, 10))) {
        try {
          return eval(arg);
        } catch (e) {
          return arg.toString();
        }
      }
      return parseInt(arg, 10);
    }
  }]);

  return Template;
}();

/*  global Event */

var Sandbox = function () {
  function Sandbox(core) {
    _classCallCheck(this, Sandbox);

    if (!core) {
      core = {};
    }
    this.events = {};
    this.core = core;
  }

  _createClass(Sandbox, [{
    key: 'requestLayout',
    value: function requestLayout(url, callback) {
      this.core.get(url, callback);
    }
  }, {
    key: 'on',
    value: function on(label, action) {
      if (!this.events[label]) {
        this.events[label] = [];
      }
      this.events[label].push(action);
    }
  }, {
    key: 'notify',
    value: function notify(label, data) {
      var event = new Event(data);
      if (this.events[label]) {
        this.events[label].forEach(function (action) {
          if (event.shouldExecute()) {
            action(event);
          }
        });
      }
    }
  }]);

  return Sandbox;
}();

/* global document */
/* global Sandbox */

var Platform = function () {
  function Platform(rootElement) {
    _classCallCheck(this, Platform);

    this.element = document.querySelector('.applications');
    this.sandbox = new Sandbox(this);
    this.publicSandbox = new Sandbox(this);
    this.applications = [];
    this.instances = [];
    this.root = rootElement;
  }

  _createClass(Platform, [{
    key: 'register',
    value: function register(application) {
      var child = document.createElement('li');
      this.applications.push(application);
      child.addEventListener('click', this.initApplication.bind(this, application, this.publicSandbox));
      child.innerHTML = application.prototype.title;
      this.element.appendChild(child);
    }
  }, {
    key: 'registerCoreApplication',
    value: function registerCoreApplication(application) {
      var child = document.createElement('li');
      this.applications.push(application);
      child.addEventListener('click', this.initApplication.bind(this, application, this.sandbox));
      child.innerHTML = application.prototype.title;
      this.element.appendChild(child);
    }
  }, {
    key: 'initApplication',
    value: function initApplication(application) {
      var applicationInstance = new application(this.sandbox);
      applicationInstance.load(this.root);
      this.sandbox.notify('application:init', applicationInstance);
      this.instances.push(applicationInstance);
    }
  }]);

  return Platform;
}();
//# sourceMappingURL=fw.dist.js.map
