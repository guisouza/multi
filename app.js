var crudzinho = new Application(function(publicSandbox){
  return {
    init : function(){
      this.register(new Form());
      this.register(new DataTable());
      this.register(new DataTable());
      this.register(new DataTable());
      this.startAll();
      publicSandbox.on('public-name',function(name){
        this.sandbox.notify('add-name',name)
      }.bind(this))
    },
    template : '<div class="application"></div>'
  }
});

var broadCast = new Application(function(publicSandbox){
  return {
    init : function(){
      this.register(new Form());
      this.startAll();
      this.sandbox.on('add-name',this.broadCastMessage)
    },
    broadCastMessage : function(name){
      console.log(publicSandbox);
      publicSandbox.notify('public-name',name)
    },
    template : '<div class="application"></div>'
  }
});


x = new crudzinho(document.body);
x = new crudzinho(document.body);
y = new broadCast(document.body);
