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
