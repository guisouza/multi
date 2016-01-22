var UsersTable = new Application('Users Table',function(publicSandbox){
  return {
    init : function(){
      this.register(Form);
      this.register(DataTable);
      this.startAll();

      publicSandbox.on('public-name',function(event){
        this.sandbox.notify('add-name',event.data)
      }.bind(this))
    },
    template : '<div class="application"></div>'
  }
});
