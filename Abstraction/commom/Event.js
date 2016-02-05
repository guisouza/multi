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
