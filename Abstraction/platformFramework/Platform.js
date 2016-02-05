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
