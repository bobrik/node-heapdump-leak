(function(module) {
    var http = require("http"),
        url  = require("url"),
        gif  = require("empty-gif");

    function Writer(redis) {
        this.redis = redis;
    }

    Writer.prototype.process = function(req, callback) {
        var params = url.parse(req.url, true),
            key    = params.query.n || "wtf";

        if (params.query.s) {
            key += params.query.s;
        }

        key = 'BUFFER_' + 'VIEWS' + "_" + key;

        this.redis.incrby(key, 1, callback);
    };

    Writer.prototype.getServer = function() {
        var self = this;

        if (!self.server) {
            self.server = http.createServer(function(req, res) {
                var params = url.parse(req.url, true);

                req.pipe(process.stdout);

                self.process(req, function(error) {
                    if (error) {
                        res.writeHeader(403, {"Content-type": "text/plain"});
                        res.end("ktxbye\n");
                        return;
                    }

                    res.writeHeader(200, {"Content-type": "image/gif"});
                    res.end(gif);
                });
            });
        }

        return self.server;
    };

    Writer.prototype.listen = function() {
        var server = this.getServer();
        server.listen.apply(server, arguments);
    };

    Writer.prototype.close = function() {
        var server = this.getServer();
        server.close.apply(server, arguments);
    };

    module.exports = Writer;
})(module);
