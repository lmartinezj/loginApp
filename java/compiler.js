import { spawn } from 'child_process';
import { parse } from 'path';
 
// compile the given java source file and execute it.
export function java (srcfile) {
    // if srcfile = 'main.java'
    var filename = parse(srcfile).name; // main
    var extension = parse(srcfile).ext;  // .java
    if (extension === ".java") {
        var args_compile = [];
        args_compile[0] = srcfile;
        var args_run = [];
        args_run[0] = filename;
        this.execute('javac', args_compile, 'java', args_run);
    } else {
        console.log(srcfile + " is not a java file.");
    }
}
 
// compile source file and execute it.
export function execute (cmd_compile, args_compile, cmd_run, args_run) {
    //var compile = spawn('gcc', ['codec.c', '-o','codec.out']);
    //var compile = spawn('javac', ['CodeJava.java']);
    var compile = spawn(cmd_compile, args_compile);
    compile.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    compile.stderr.on('data', function (data) {
        console.log('stderr: ' + String(data));
    });
    compile.on('close', function (data) {
        if (data === 0) {
            var run = spawn(cmd_run, args_run);
            run.stdout.on('data', function (output) {
                console.log(String(output));
            });
            run.stderr.on('data', function (output) {
                console.log('stderr: ' + String(output));
            });
            run.on('close', function (output) {
                console.log('stdout: ' + output);
            })
        }
    });
}