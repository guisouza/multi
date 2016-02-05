var Tap = new Application('Tap',function(publicSandbox){
  return{
    init : function(){
        this.timer = window.setInterval(this.drainWater.bind(this),1000)
    },
    drainWater : function(){
      publicSandbox.notify('water:drain',30)
    },
    template : '<div class="tap"></div>'
  }
})
