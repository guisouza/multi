var DataTable = new Module(function(sandbox){
  return{
    init : function(){
      this.table = this.element.querySelector('table')
      this.tableBody = this.element.querySelector('tbody')
      this.sandbox.on('add-name',this.addName.bind(this))
    },
    addName : function(name){
      var newName = document.createElement('tr')
      newName.innerHTML = '<td>'+name+'</td>'
      this.tableBody.appendChild(newName)
    },
    template : '<div class="dataTable"><table border="1"><tr><td>Guilherme</td></tr><tr><td>Alberto</td></tr><tr><td>João</td></tr></table></div>',
    destroy : function(){
      console.log('destroyed')
    }
  }
})
