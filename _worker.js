const createGetterAndSetter = function (field){
  var field = field
  return {
    set: function (value){
      Object.keys(value)
      .forEach(function(key){
        var message = {
          action: 'setRefProp',
          data : {
            key : key,
            value : value[key],
            ref : field
          }
        }
          WorkerContext.postMessage(message)
      })

    },
    get: function (){
      return 'caraiba'
    },
    enumerable: true
  }
}

var WorkerContext = self;

var methods = {};

methods.sandbox = {
  on: function(label,action){
    WorkerContext.postMessage({
      action : 'sandbox:on',
      data : [label,action.toString()]
    })
  },

  notify: function(label,data){
    WorkerContext.postMessage({
      action : 'sandbox:notify',
      data : [label,data]
    })
  }
}

methods.templates = function(templateName,callback){
  WorkerContext.postMessage({
    action : 'template',
    data : [templateName,callback.toString()]
  })
}

methods.template = {
  refs : {}
};

self.addEventListener('message', function(e) {

  var action = e.data.action;
  var data = e.data.data;



  switch(action){
    case 'define':
      Object.keys(data).forEach(function(index){
        try{
          methods[index] = new Function(('return ('+data[index]+').bind(methods)()'))
        }catch(e){
          methods[index] = data[index];
        }
      })
    break;
    case 'ping':
      WorkerContext.postMessage({action : 'pong'})
    break;
    case 'registerRef':

      Object.defineProperty(methods.template.refs, data, createGetterAndSetter(data))

    break;
    case 'contextualExecution':

      var operation = new Function('event','return ('+data+'.bind(this))(event)').bind(methods)
      operation(e.data.event)

    break;
    case 'execute':
      methods[data]()
    break;
  }


},false);
