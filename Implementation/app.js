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

/*  global Application*/
/*  global Keyboard*/
/*  global Display*/

const Calculator = new Application('Calculator', function calculatorConstructor() {
  return {
    init: function init() {
      this.value = 0;

      this.register(Keyboard);
      this.register(Display);
      this.startAll();

      this.sandbox.on('buttonPressed:number', this.numberHandler.bind(this));
      this.sandbox.on('buttonPressed:operation', this.operationHandler.bind(this));
    },

    numberHandler: function numberHandler(event) {
      this.value = (this.value * 10) + event.data;
      return this.sandbox.notify('outputText', this.value);
    },

    operationHandler: function operationHandler(event) {
      if (event.data !== '=') {
        this.auxiliarValue = this.value;
        this.value = 0;
        this.currentOperation = event.data;
        return this.sandbox.notify('outputText', '');
      }

      this.value = this.eval();
      return this.sandbox.notify('outputText', this.value);
    },

    eval: () => eval(this.auxiliarValue + this.currentOperation + this.value),
    template: '<div class="application"></div>'};
});

var NewApplication = new Application('NewApplication',function(publicSandbox){
  return {
    init : function(){
      console.log('im here !')
    },
    template : '<div class="NewApplication"></div>'
  }
})

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

// var WaterSystem = new Application('Water System',function(publicSandbox){
//   return {
//     init : function(){
//       this.register(Well);
//       this.register(WaterBox);
//       this.register(Tap);
//       this.startAll();
//       this.sandbox.on('box:full',function(){
//         var newWaterBox = this.register(WaterBox);
//         this.startModule(newWaterBox);
//       }.bind(this))
//     },
//     template : '<div class="application"></div>'
//   }
// });

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

var Water = new Module(function(sandbox){
  return{
    init : function(){
      this.sandbox.on('waterAmmount',function(event){
        this.template.refs.water.style.height=event.data+'px';
      }.bind(this))
    },
    template : '<div ref="water" class="water"></div>'
  }
})

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

var Display = new ThreadModule(function(){
  return{
    init : function(){

      this.sandbox.on('outputText',function(event){
        var n = 9000000000;
          while (n > 0) {
            n--;
          }
          this.template.refs.display = {innerHTML : event.data};
          // this.template.refs.display.innerHTML = event.data
      });

    },
    template : '<div class="display" ref="display"></div>'
  };
});

var Form = new Module(function(sandbox){
  return{
    addName : function(){
      sandbox.notify('add-name',this.template.refs.name.value)
    },
    templateUrl : 'Implementation/Modules/Form/Form.html'
  }
})

var Keyboard = new Module(sandbox => {
  return {
    pressButton : function(input){
      if (isNaN(input)){
        sandbox.notify('buttonPressed:operation',input)
      }else{
        sandbox.notify('buttonPressed:number',input)
      }
    },
    templateUrl : 'Implementation/Modules/Keyboard/Keyboard.html'
  }
})


var Inspector = new Application('Inspector',function(sandbox){
  return {
    init : function(){
      sandbox.on('application:init',function(event) {
        console.log(event.data)
      })
    },
    templateUrl : 'Implementation/Platform/Applications/Inspector/Inspector.html'
  }
});
