#!/usr/bin/env node
(function() {
    var Writer = require("./index"),
        redis  = require("redis"),
        domain = require("domain").createDomain(),
        args   = process.argv.slice(2);

    require('heapdump');

    if (args.length < 4) {
        console.log("Please provide args in format:");
        console.log("topface-stats redis_host redis_port1 listen_host listen_port");
        return;
    }

    domain.on("error", function(error) {
        console.log(new Date().toString() + " error " + error.toString() + "\n" + error.stack);
    });

    domain.run(function() {
        var writer;

        writer = new Writer(redis.createClient(args[1], args[0]));
        writer.listen(args[3], args[2]);
        console.log("listening on: " + args[2] + ":" + args[3]);
    });
})();
