var Broadcast = new Application('Broadcast',function(publicSandbox){
  return {
    init : function(){
      this.register(Form);
      this.startAll();
      this.sandbox.on('add-name',this.broadCastMessage)
    },
    broadCastMessage : function(event){
      publicSandbox.notify('public-name',event.data)
    },
    template : '<div class="application"></div>'
  }
});
