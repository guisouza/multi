/*  global Application */
/*  global Sandbox */
/*  global Sandbox */
/*  global setInterval */
/*  global XMLHttpRequest */
/*  global Template */

class Application {
    constructor(applicationTitle, applicationDefinition) {
      const definition = applicationDefinition;

      class newApplication {

        constructor(sandbox) {
          this.sandbox = new Sandbox(this);
          this.modules = [];
          this.define(definition(sandbox));
        }

        define(interfaceDefinition) {
          for (const method in interfaceDefinition) {
            if (interfaceDefinition[method].bind) {
              this[method] = interfaceDefinition[method].bind(this);
            }else {
              this[method] = interfaceDefinition[method];
            }
          }
        }

        register(module) {
          module = new module(this.sandbox);

          this.sandbox.on('DOWN', function applicationDownHandler() {
            if (this.template.element.className.indexOf('down') === -1) {
              this.template.element.className = `${this.template.element.className} down`;
            }
          }.bind(this));

          this.checkTimer = setInterval(function checkTrimer() {
            let allOk = true;

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

        startAll() {
          this.modules.forEach(this.startModule.bind(this));
        }

        startModule(module) {
          module.load(this.template.element, (currentModule) => {
            if (currentModule.init) {
              currentModule.init.bind(currentModule)();
            }
          });
        }

        destroy() {
          // this.modules.forEach(function(module){
            // module.unload();
            // module.destroy;
          // }.bind(this))
        }

        load(HTMLElement) {
          this.element = HTMLElement;
          if (this.template) {
            this.processLayout();
            this.init();
          }else {
            this.sandbox.requestLayout(this.templateUrl, function requestLayout(template) {
              this.template = template;
              this.processLayout();
              this.init();
            }.bind(this));
          }
        }

        processLayout() {
          this.template = new Template(this.element, this.template, this);
        }

        get(path, callback) {
          const oReq = new XMLHttpRequest();
          oReq.addEventListener('load', function layoutRequestCallback() {
            callback(this.responseText);
          });
          oReq.open('GET', path);
          oReq.send();
        }

      }

      newApplication.prototype.title = applicationTitle;

      return newApplication;

    }
  }

/*  global Template */

class Module {
  constructor(moduleDefinition) {
    class newModule {
      constructor(sandbox) {
        moduleDefinition = this.definition(sandbox);
        this.sandbox = sandbox;
        this.define(moduleDefinition);
      }

      define(definition) {
        for (const method in definition) {
          if (definition[method].bind) {
            this[method] = definition[method].bind(this);
          }else {
            this[method] = definition[method];
          }
        }
      }

      load(HTMLElement, callback) {
        this.element = HTMLElement;
        if (this.template) {
          this.processLayout();
          callback(this);
        }else {
          this.sandbox.requestLayout(this.templateUrl,
            function templateHandler(template) {
              this.template = template;
              this.processLayout();
              callback(this);
            }.bind(this));
        }
      }

      processLayout() {
        this.template = new Template(this.element, this.template, this);
        this.element = this.template.element;
      }

    }

    newModule.prototype.definition = moduleDefinition;

    return newModule;
  }
}

var multi = {
  
}

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
        data: event.data,
      },
    });
  }.bind(this);
};

class ThreadModule {
  constructor(moduleDefinition) {
    class newModule {
      constructor(sandbox) {
        moduleDefinition = this.definition(sandbox);
        this.sandbox = sandbox;
        this.worker = new Worker('worker.js');
        this.alive = true;
        this.methods = {};

        this.define(moduleDefinition);

        this.worker.addEventListener('message', this.messageHandler.bind(this));

        this.worker.postMessage({
          action: 'define',
          data: this.methods,
        });

        this.check = setInterval(()=> this.ping(), 1000);

        this.itsAlive = setTimeout(function checkAlive() {
          this.sandbox.notify('DOWN', this);
        }.bind(this), 2000);

      }

      ping() {
        this.worker.postMessage({
          action: 'ping',
        });
      }

      define(definition) {
        for (const method in definition) {
          if (method !== 'template') {
            this.methods[method] = definition[method].toString();
          }
        }
        this.template = definition.template;
      }

      messageHandler(event) {
        const action = event.data.action;
        const data = event.data.data;
        let operation;
        switch (action) {
        case 'sandbox:on':
          const label = data[0];
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
          const element = this.template.refs[data[0]];
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

      init() {
        this.sendRefs();
        this.worker.postMessage({
          action: 'execute',
          data: 'init',
        });
      }

      sendRefs() {
        for(const ref in this.template.refs) {
          this.worker.postMessage({action: 'registerRef', data: ref});
        }
      }

      load(HTMLElement, callback) {
        this.element = HTMLElement;
        if (this.template) {
          this.processLayout();
          callback(this);
        }else {
          this.sandbox.requestLayout(this.templateUrl,
            function requestLayout(template) {
              this.template = template;
              this.processLayout();
              callback(this);
            }.bind(this));
        }
      }

      processLayout() {
        this.template = new Template(this.element, this.template, this);
        this.element = this.template.element;
      }

    }

    newModule.prototype.definition = moduleDefinition;

    return newModule;
  }
}

class Event {
  constructor(data) {
    this.data = data;
    this.stopped = false;
  }

  stopPropagation() {
    this.stopped = true;
  }

  shouldExecute() {
    return !this.stopped;
  }
}

// class MessageHandler {
//   constructor(owner, worker) {
//     this.worker.addEventListener('message',this.messageHandler.bind(this))
//   }
//
// }

/* global document */

class Template {
  constructor(container, HTMLString, context) {
    let element = document.createElement('div');
    this.container = container;
    element.innerHTML = HTMLString;
    element = element.children[0];
    this.element = element;
    this.container.appendChild(element);
    this.context = context;

    [].forEach.call(this.container.querySelectorAll('[ref]'), this.attachReference.bind(this));

    [].forEach.call(
      this.container.querySelectorAll('[click]'),
      function clickEventIterator(currentElement) {
        this.attachEvent('click', currentElement);
      }.bind(this));

    [].forEach.call(this.container.querySelectorAll('[template]'), this.attachTemplate.bind(this));
    this.container = element;
  }
  attachReference(element) {
    if (!this.refs) {
      this.refs = {};
    }
    this.refs[element.getAttribute('ref')] = element;
  }

  attachTemplate(element) {
    if (!this.templates) {
      this.templates = {};
    }
    this.templates[element.getAttribute('template')] = element.outerHTML;
  }

  attachEvent(event, element) {
    const regex = new RegExp('([^(]+)\s?(\([\S\s]*\)?)', 'gmi');
    const expression = element.getAttribute(event).match(regex);
    const method = expression[0];
    let args = expression[1].split('');

    args.pop();
    args = args.join('').split(',');
    args = args.map(this.format);

    element.addEventListener('click', function internalClickHandler(evt) {
      const indexOfEvent = args.indexOf('$event');
      if (indexOfEvent !== -1) {
        args[indexOfEvent] = evt;
      }
      this.context[method].apply(this, args);
    }.bind(this));

  }

  format(arg) {
    if (arg === '$event' || arg === '$e' || arg === '$evt') {
      return '$event';
    }
    if (isNaN(parseInt(arg, 10))) {
      try {
        return eval(arg);
      }catch(e) {
        return arg.toString();
      }
    }
    return parseInt(arg, 10);
  }

}

/*  global Event */
class Sandbox {
  constructor(core) {
    if (!core) {
      core = {};
    }
    this.events = {};
    this.core = core;
  }

  requestLayout(url, callback) {
    this.core.get(url, callback);
  }

  on(label, action) {
    if (!this.events[label]) {
      this.events[label] = [];
    }
    this.events[label].push(action);
  }

  notify(label, data) {
    const event = new Event(data);
    if (this.events[label]) {
      this.events[label].forEach((action)=>{
        if (event.shouldExecute()) {
          action(event);
        }
      });
    }
  }
}

/* global document */
/* global Sandbox */

class Platform {

  constructor(rootElement) {
    this.element = document.querySelector('.applications');
    this.sandbox = new Sandbox(this);
    this.publicSandbox = new Sandbox(this);
    this.applications = [];
    this.instances = [];
    this.root = rootElement;
  }

  register(application) {
    const child = document.createElement('li');
    this.applications.push(application);
    child.addEventListener('click', this.initApplication.bind(this, application, this.publicSandbox));
    child.innerHTML = application.prototype.title;
    this.element.appendChild(child);
  }

  registerCoreApplication(application) {
    const child = document.createElement('li');
    this.applications.push(application);
    child.addEventListener('click', this.initApplication.bind(this, application, this.sandbox));
    child.innerHTML = application.prototype.title;
    this.element.appendChild(child);
  }

  initApplication(application) {
    const applicationInstance = new application(this.sandbox);
    applicationInstance.load(this.root);
    this.sandbox.notify('application:init', applicationInstance);
    this.instances.push(applicationInstance);
  }

}
