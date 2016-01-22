var Form = new Module(function(sandbox){
  return{
    addName : function(){
      sandbox.notify('add-name',this.refs.name.value)
    },
    templateUrl : 'Implementation/Modules/Form/Form.html'
  }
})
