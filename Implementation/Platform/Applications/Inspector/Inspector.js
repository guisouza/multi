
var Inspector = new Application('Inspector',function(sandbox){
  return {
    init : function(){
      sandbox.on('application:init',function(event) {
        console.log(event.data)
      })
    },
    templateUrl : 'Implementation/Platform/Applications/Inspector/Inspector.html'
  }
});
