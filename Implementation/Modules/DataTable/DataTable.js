var DataTable = new Module(function(sandbox){
  return{
    init : function(){
      sandbox.on('add-name',this.addName.bind(this))
    },
    addName : function(event){
      // var newName = document.createElement('div')
      // console.log(this.templates['linhaDaTabela']);
      // newName.innerHTML = this.templates['linhaDaTabela']
      // console.log(newName);

      newName = this.templates['linhaDaTabela']

      console.log(newName);
      this.refs.table.appendChild(newName)

    },
    templateUrl : 'Implementation/Modules/DataTable/DataTable.html'
  }
})
