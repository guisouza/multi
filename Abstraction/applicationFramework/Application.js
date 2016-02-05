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
