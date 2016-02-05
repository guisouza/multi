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

//
// class Broadcast extends Application{
//   init(){
//     this.register(Form);
//     this.startAll();
//     this.template = '<div class="application"></div>'
//     this.sandbox.on('add-name',this.broadCastMessage)
//   }
//   broadCastMessage(event){
//     publicSandbox.notify('public-name',event.data)
//   }
// }
