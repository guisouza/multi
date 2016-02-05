var Water = new Module(function(sandbox){
  return{
    init : function(){
      this.sandbox.on('waterAmmount',function(event){
        this.template.refs.water.style.height=event.data+'px';
      }.bind(this))
    },
    template : '<div ref="water" class="water"></div>'
  }
})
