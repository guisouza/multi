var Keyboard = new Module(function(sandbox){

  return{
    init : function(){
    },
    pressButton : function(e){
      var value = e.target.innerHTML;
      if (isNaN(parseInt(value))){
        sandbox.notify('buttonPressed:operation',value)
      }else{
        value = parseInt(value);
        sandbox.notify('buttonPressed:number',value)
      }

    },
    templateUrl : 'Implementation/Modules/Keyboard/Keyboard.html'
  }
})
