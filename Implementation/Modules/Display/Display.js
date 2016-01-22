var Display = new Module(function(sandbox){
  console.log(sandbox);
  return{
    init : function(){
      sandbox.on('outputText',function(event){
        this.element.innerHTML = event.data;
      }.bind(this))

    },
    template : '<div class="display"></div>'
  }
})
