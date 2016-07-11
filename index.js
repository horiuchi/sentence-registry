'use strict';

const hapiServer = require('./lib/server');
const api = require('./lib/plugin/api');

const options = {
    plugin: api,
    pluginOptions: {
        routes: {
            prefix: '/v1'
        }
    }
};

const plugins = [{
    plugin: api,
    pluginOptions: {
        routes: {
            prefix: '/v1'
        }
    }
}];


hapiServer.create(options, function(err, server){

    if (err) {
        //TBD
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

//TBD daemon
