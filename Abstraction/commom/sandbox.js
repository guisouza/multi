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
