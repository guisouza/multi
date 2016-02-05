var WaterBox = new Application('WaterBox',function(publicSandbox){
  return{
    init : function(){


      var water = this.register(Water);
      this.startModule(water)
      this.storedWater = 0;
      publicSandbox.on('water:extracted',this.collectWater.bind(this))
      publicSandbox.on('water:drain',this.drainWater.bind(this))
    },
    collectWater : function(event){
      if (this.storedWater < 80){
        var waterAmmount = event.data;
        this.storedWater = this.storedWater+waterAmmount;
        this.render()
        return event.stopPropagation();
      }

      if (!this.full){
        publicSandbox.notify('box:full',this)
      }
      this.full = true

    },
    render : function(){
      this.sandbox.notify('waterAmmount',this.storedWater);
    },
    drainWater : function(event){
      if (this.storedWater > 0){
        if (event.data > this.storedWater){
          event.data = event.data - this.storedWater
          this.storedWater = 0;
        }else{
          this.storedWater -= event.data;
          event.stopPropagation()
        }
        this.render();
        if (this.full){
          this.full = false
        }
      }

    },
    template : '<div class="WaterBox"></div>'
  }
})
