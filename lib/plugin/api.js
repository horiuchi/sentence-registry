const handler = require('./handler');
const routes = [];

routes.push({
    method: 'GET',
    path: '/',
    handler: handler.notImplemented
});

routes.push({
    method: 'POST',
    path: '/item',
    handler: handler.postItem
});

routes.push({
    method: 'GET',
    path: '/item/{id}',
    handler: handler.getItem
});

routes.push({
    method: 'DELETE',
    path: '/item/{id}',
    handler: handler.deleteItem
});

routes.push({
    method: 'GET',
    path: '/items',
    handler: handler.getItems
});

exports.register = function (server, options, next) {
    server.route(routes);
    return next();
}

exports.register.attributes = {
    name: 'sentence-registry'
}
