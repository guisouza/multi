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
