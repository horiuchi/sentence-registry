'use strict'

const hapi   = require('hapi');
const items  = require('items');
const config = require('./config');

const server = new hapi.Server(config.server);


function createServer(params, callback) {

    const plugin = params.plugin;
    const pluginOptions = params.pluginOptions;
    const connectionOption = params.connection || {port:3000};

    server.connection(connectionOption);

    // //userPlugins (API)
    const userPlugins = [{
        plugins: {
            register: plugin
        },
        options: pluginOptions
    }];
    

    const defaultPlugins = [{
            plugins: require('./plugin/default')
        }];

    //plugin register
    //TBD
    items.serial(defaultPlugins.concat(userPlugins), function (item, done) {
        item.options = item.options || {};
        server.register(item.plugins, item.options, done);
    }, (err) => {
        callback(err, server);
    })
}

module.exports = {
    create: createServer
}
