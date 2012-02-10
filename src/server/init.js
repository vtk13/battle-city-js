var requirejs = require("requirejs");

requirejs(['http', 'url', 'path', 'fs',
           'src/common/collection.js',
           'src/server/premadelist.js',
           'src/server/messagelist.js',
           'src/edu/courselist.js',
           'src/common/server.js',
           'src/store/serialization.js',
           'src/store/odb.js',
           'src/common/registry.js'], function(http, url, path, fs, Collection,
                   TPremadeList, TMessageList, CoursesList, BcServerInterface,
                   serialization, odb, resitry) {
    resitry.odb = odb;
    // todo globals
    oldGlobalRegistry = {};

    oldGlobalRegistry.users = new Collection();
    oldGlobalRegistry.premades = new TPremadeList();
    oldGlobalRegistry.messages = new TMessageList();
    oldGlobalRegistry.courses = new CoursesList();

    process.on('uncaughtException', function(ex) {
        if (ex.stack) {
            console.log(ex.stack);
        } else {
            console.log(ex);
            console.trace();
        }
    });

    /**
     * Server is responsible for accepting user connections.
     */
    var server = require('http').createServer(function(request, response) {
        if (process.argv.indexOf('serve-static') == -1) {
            // static served with haproxy + nginx
            response.writeHead(301, {'Location':'http://'+request.headers.host.replace(/:\d+$/, '')});
            response.end();
        } else {
            var uri = url.parse(request.url).pathname;
            if (uri == '/') {
                uri = '/index.html';
            }
            var filename = path.join(process.cwd(), uri);
            path.exists(filename, function(exists) {
                if(!exists) {
                    response.writeHead(404, {"Content-Type": "text/plain"});
                    response.write("404 Not Found\n");
                    response.end();
                    return;
                }

                fs.readFile(filename, "binary", function(err, file) {
                    if(err) {
                        response.writeHead(500, {"Content-Type": "text/plain"});
                        response.write(err + "\n");
                        response.end();
                        return;
                    }

                    var exts = {
                            '.html': 'text/html',
                            '.js': 'application/x-javascript',
                            '.png': 'image/png',
                            '.css': 'text/css'
                    };
                    response.writeHead(200, {
                        'Content-Type': exts[path.extname(filename)]
                    });
                    response.write(file, "binary");
                    response.end();
                });
            });
        }

    });
    server.listen(8124);

    var io = require('socket.io');
    var config = {
        'browser client minification': true,
        'browser client etag': true,
        'browser client gzip': true,
        'transports': ['websocket'],
        'log level': 1
    };

    io.listen(server, config).sockets.on('connection', function(socket) {
        new BcServerInterface(socket);
    });
});