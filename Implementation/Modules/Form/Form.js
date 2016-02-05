var Form = new Module(function(sandbox){
  return{
    addName : function(){
      sandbox.notify('add-name',this.template.refs.name.value)
    },
    templateUrl : 'Implementation/Modules/Form/Form.html'
  }
})
