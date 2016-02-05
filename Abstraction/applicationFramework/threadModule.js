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
