var Keyboard = new Module(sandbox => {
  return {
    pressButton : function(input){
      if (isNaN(input)){
        sandbox.notify('buttonPressed:operation',input)
      }else{
        sandbox.notify('buttonPressed:number',input)
      }
    },
    templateUrl : 'Implementation/Modules/Keyboard/Keyboard.html'
  }
})
