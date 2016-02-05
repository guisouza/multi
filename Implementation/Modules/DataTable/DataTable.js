var DataTable = new Module(function(sandbox){
  return{
    init : function(){
      sandbox.on('add-name',this.addName.bind(this))
    },
    addName : function(event){

      this.template.refs.table.appendChild(document.createElement('tr'));
      console.log(this.templates);

    },
    templateUrl : 'Implementation/Modules/DataTable/DataTable.html'
  }
})
