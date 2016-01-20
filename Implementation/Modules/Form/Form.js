var Form = new Module(function(sandbox){
  return{
    init : function(){
      console.log(this.element);
      this.inputField = this.element.querySelector('input[type="text"]')
      this.submitButton = this.element.querySelector('input[type="button"]')
      console.log(this.submitButton)
      this.submitButton.addEventListener('click',function(){
        this.sandbox.notify('add-name',this.inputField.value)
        this.inputField.value = ''
      }.bind(this))

      this.sandbox.on('changeText',function(data){
        this.inputField.value = 'data'
      }.bind(this))
    },
    template : '<div class="form">\
      <form class="" action="index.html" method="post">\
        <input type="text" name="name" value="texto qualquer">\
        <input type="button" name="name" value="enviar" class="submit">\
      </form>\
    </div>',
    destroy : function(){
      console.log('destroyed')
    }
  }
})
