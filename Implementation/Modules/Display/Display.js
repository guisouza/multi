var Display = new ThreadModule(function(){
  return{
    init : function(){

      this.sandbox.on('outputText',function(event){
        var n = 9000000000;
          while (n > 0) {
            n--;
          }
          this.template.refs.display = {innerHTML : event.data};
          // this.template.refs.display.innerHTML = event.data
      });

    },
    template : '<div class="display" ref="display"></div>'
  };
});
