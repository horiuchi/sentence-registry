const routes = [];

routes.push({
    method: 'GET',
    path: '/',
    handler: function (req, reply) {
        reply('Hello, world!');
    }
});

routes.push({
    method: 'GET',
    path: '/{name}',
    handler: function (req, reply) {
        reply('Hello, ' + encodeURIComponent(req.params.name) + '!');
    }
});

routes.push({
    method: 'GET',
    path: '/sample',
    handler: function (req, reply) {
        reply({
            id: 1,
            origin: "This is sample sentence.",
            separate: ["This", "is", "sample", "sentence"]
        });
    }
});

exports.register = function (server, options, next) {
    server.route(routes);
    return next();
}

exports.register.attributes = {
    name: 'sentence-registry'
}
