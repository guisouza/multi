var Well = new Application('Well',function(publicSandbox){
  return{
    init : function(){
      this.timer = window.setInterval(this.getWater.bind(this),10)
    },
    getWater : function(){
      publicSandbox.notify('water:extracted',1)
    },
    template : '<div class="Well"></div>'
  }
})



var Rain = new Application('Rain',function(publicSandbox){
  return{
    init : function(){
      this.timer = window.setInterval(this.getWater.bind(this),100)
    },
    getWater : function(){
      publicSandbox.notify('water:extracted',1)
    },
    template : '<div class="Chuva"></div>'
  }
})
