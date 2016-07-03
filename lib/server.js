'use strict'

const hapi   = require('hapi');
const items  = require('items');
const config = require('./config');

const server = new hapi.Server(config.server);


function createServer(params, callback) {
    //TBD

    var plugin = params.plugin;
    var pluginOptions = params.pluginOptions;
    var connectionOption = params.connection || {port:3000};

    server.connection(connectionOption);

    // //userPlugins (API)
    var userPlugins = [{
        plugins: {
            register: plugin
        },
        options: pluginOptions
    }];
    

    var defaultPlugins = [
        {
            plugins: require('./plugin/default')
        }
    ];

    //plugin register
    items.serial(defaultPlugins.concat(userPlugins), function (item, done) {
        //console.log(require('util').inspect(item, {depth:5}));
        item.options = item.options || {};
        server.register(item.plugins, item.options, done);
    }, function (err){
        callback(err, server);
    })
}

module.exports = {
    create: createServer
}
