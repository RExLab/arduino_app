var fs = require('fs');
var exec = require('child_process').exec;

result_default = {
    "success": false,
    "exit_code": "",
    "element": "div_ide_output",
    "response_type": "ide_output",
    "output": "",
    "error_output": "The compiler directory has not been set.\nPlease set it in the Settings.",
    "conclusion": 'error_conclusion'
};

exports.upload = function (filename, socket, callback) {
    var message = JSON.parse(JSON.stringify(result_default));
    var child = exec("make -C " + __dirname + " upload TARGET=lab/" + filename, function (error, stdout, stderr) {
        if (error !== null) {
            message.error_output = error.cmd;
        } else {
            message.success = true;
            message.output = stdout;
            message.conclusion = 'upload_success';
        }
        socket.emit('done upload', message);

        if (typeof (callback) === "function") {
            callback();
        }

    });

};



exports.compile = function (file, socket) {

    var message = JSON.parse(JSON.stringify(result_default));
    var child;
    fs.writeFile(__dirname + "/lab/" + socket.filename + ".ino", file, function (err) {
        if (err) {
            message.error_output = err;

        } else {

            child = exec("make -C " + __dirname + " TARGET=lab/" + socket.filename, function (error, stdout, stderr) {
                if (error !== null) {
                    message.error_output = error;
                }

                if (stderr.length < 120) {
                    var idx = stdout.indexOf("AVR Memory Usage");
                    if (idx > -1) { // Compiling successful
                        message.success = true;
                        stdout = stdout.substring(idx, stdout.length);
                        idx = stdout.indexOf("make:");
                        idx = (idx > -1) ? idx : stdout.length;
                        stdout = stdout.substring(0,idx);
                        message.output = stdout;
                        message.conclusion = 'compile_success';
                        socket.hasCompiled = true;
                        socket.lastfilecompiled = file;
                    } else { // Error
                        var re = new RegExp(socket.filename, "g");
                        stderr = stderr.replace(re, socket.aliasname.split(".")[0]);
                        var re = new RegExp(__dirname, "g");
                        stderr = stderr.replace(re, "/arduino/");

                        message.error_output = stderr;
                    }

                } else {
                    var re = new RegExp(socket.filename, "g");
                    stderr = stderr.replace(re, socket.aliasname.split(".")[0]);
                    var re = new RegExp(__dirname, "g");
                    stderr = stderr.replace(re, "/arduino/");
                    message.error_output = stderr;
                }
                socket.emit('done compiling', message);

            });

        }




    });

};


exports.clean = function (filename) {

    var child;

    child = exec("make -C " + __dirname + " clean TARGET=lab/" + filename, function (error, stdout, stderr) {

        if (error !== null) {
            console.log('exec error: ' + error);
        }

    });

};


exports.reset = function (filename, callback) {

    var child;

    child = exec("make -C " + __dirname + " reset TARGET=lab/" + filename, function (error, stdout, stderr) {

        if (error !== null) {
            return ('exec error: ' + error);
        }
        if (typeof (callback) === "function") {
            callback();
        }

    });

};