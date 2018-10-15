
var EventEmitter = require('events').EventEmitter;

var event = new EventEmitter();

event.on('a_event', function(arg1){
    console.log('a_event 事件触发',arg1);
});

event.on('a_event',function(arg1, arg2){
    console.log('listerner2', arg1, arg2);
});

setTimeout(function(){
    event.emit('a_event','arg1');
}, 1000);

event.emit('a_event','arg1','arg2');