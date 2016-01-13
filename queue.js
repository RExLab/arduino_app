var queue_d = [];
var actual = {};
var timeslice = 20000;
var timeout_id = null;

var status = {
    myturn: false,
    video: 'http://150.162.232.4:8025',
    timeslice: timeslice,
    output: "Aguarde um momento",
};



exports.push = function (socket, callback, data) {

    if (socket == actual.socket) {
        if (typeof callback == 'function')
            callback(socket, data);
        return;
    }

    for (var i = 0; i < queue_d.length; i++) {
        if (queue_d[i].socket === socket) {
            queue_d[i].callback = callback;
            queue_d[i].data = data;
            return;
        }
    }

    queue_d.push({'socket': socket,
        'callback': callback,
        'data': data});

    if (queue_d.length === 1 && timeout_id === null)
        this.schedule();
    
    console.log("push - tamanho da fila: "+ queue_d.length);

};

exports.remove = function (socket, callback, data) {

    for (var i = 0; i < queue_d.length; i++) {
        if (queue_d[i].socket.id == socket.id) {
            queue_d.splice(i, 1);
        }
    }
    if (actual.socket == socket)
        this.schedule();

    if (typeof callback == 'function') {
        callback(socket, data);
    }
    
    console.log("remove - tamanho da fila: "+ queue_d.length);

};



exports.isAuthorized = function (id) {
    if (typeof actual.socket === 'undefined') {
        return false;
    }
    return (actual.socket.id === id);
};



exports.schedule = function () {
    clearTimeout(timeout_id);
    console.log('entering schedule '+queue_d.length);
    if (queue_d.length > 0) {
        var m1 = JSON.parse(JSON.stringify(status));
        m1.output = "Tempo limite para testes expirou."
        m1.myturn = false;
        if (typeof actual.socket != 'undefined')
            actual.socket.emit('queue status', m1);

        var m2 = JSON.parse(JSON.stringify(status));
        
        actual = queue_d.shift();
              
        m2.myturn = true;
        m2.output = "Sessão de testes iniciada. Foram reservados " + timeslice / 1000 + "s  para você.";
        if (typeof actual.socket !== 'undefined')
            actual.socket.emit('queue status', m2);

        if (typeof actual.callback === 'function') {
            actual.callback(actual.socket, actual.data);
        }
    } else {
        timeout_id = null;
        var m3 = JSON.parse(JSON.stringify(status));
        m3.myturn = true;
        m3.timeslice = timeslice/2;
        m3.output = "Continue usando normalmente, porém seu tempo mínimo já expirou.";
        if (typeof actual.socket != 'undefined')
            actual.socket.emit('queue status', m3);
        return;
    }
    
    timeout_id = setTimeout(this.schedule.bind(this), timeslice);
    console.log('leaving schedule '+ queue_d.length);
};