
var Calculator = new Application('Calculator',function(publicSandbox){
  return {
    init : function(){
      this.register(Display);
      this.register(Keyboard);
      this.startAll();
      this.value = 0;

      this.sandbox.on('buttonPressed:number',function(event){
        var value = event.data;
        if (this.value === 0){
            this.value = value
        }else{
            this.value = (this.value*10) + value
        }
        this.sandbox.notify('outputText',this.value)

      }.bind(this))


      this.sandbox.on('buttonPressed:operation',function(event){
        var value = event.data
        this.sandbox.notify('outputText','')
        if (value !== '='){
          this.auxiliarValue = this.value;
          this.value = 0;
          this.currentOperation = value
        }

        if (value === '='){
          this.value = this.eval()
        }

      }.bind(this))


    },
    eval :function(){
      var result = eval(this.auxiliarValue+this.currentOperation+this.value);
      this.sandbox.notify('outputText',result);
      return result;
    },
    template : '<div class="application"></div>'
  }
});
