/*  global Application*/
/*  global Keyboard*/
/*  global Display*/

const Calculator = new Application('Calculator', function calculatorConstructor() {
  return {
    init: function init() {
      this.value = 0;

      this.register(Keyboard);
      this.register(Display);
      this.startAll();

      this.sandbox.on('buttonPressed:number', this.numberHandler.bind(this));
      this.sandbox.on('buttonPressed:operation', this.operationHandler.bind(this));
    },

    numberHandler: function numberHandler(event) {
      this.value = (this.value * 10) + event.data;
      return this.sandbox.notify('outputText', this.value);
    },

    operationHandler: function operationHandler(event) {
      if (event.data !== '=') {
        this.auxiliarValue = this.value;
        this.value = 0;
        this.currentOperation = event.data;
        return this.sandbox.notify('outputText', '');
      }

      this.value = this.eval();
      return this.sandbox.notify('outputText', this.value);
    },

    eval: () => eval(this.auxiliarValue + this.currentOperation + this.value),
    template: '<div class="application"></div>'};
});
