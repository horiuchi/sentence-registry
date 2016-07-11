'use strict'

const boom = require('boom');
const redis = require('redis');
const bluebird = require('bluebird');

// Promise
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/**
 * @method errorHandle
 * @param {Object}
 * @param {Function} reply
 */
function wrapedError(err, reply) {
    return reply(boom.wrap(err, err.code || 500));
}

/**
 * @method notImplemented
 * @param {Object}
 * @param {Function} reply
 */
function notImplemented(req, reply) {
    return reply(boom.notImplemented());
}

/**
 * @method postItem
 * @param {Object}
 * @param {Function} reply
 */
function postItem(req, reply) {

    if (req.payload == null || !req.payload.hasOwnProperty('text')) {
        return reply(boom.badRequest());
    }

    const client = redis.createClient();    
    const text = req.payload.text;
    const splitText = text.replace(/[,.]/, ' ').trim().split(' ');

    client.on("error", (err) => {
        console.log("redis Error " + err);
        return reply(boom.badImplementation());
    });


    return client.incrAsync('sequence')
        .then((seq) => {

            const item = {
                id: seq,
                origin: text,
                shuffle: shuffle(splitText)
            };

            const id = 'id_' + seq;
            return client.setAsync(id, JSON.stringify(item))
                .then(() => {
                    return {
                        data: {
                            item:item
                        }
                    }
                });

        })
        .then((data) => {
            client.quit;

            return reply(data).code(201); 
        })
        .catch((err) => {
            console.log(err);
            return reply(boom.badImplementation);
        })
}

/**
 * @method getItem
 * @param {Object}
 * @param {Function} reply
 */
function getItem(req, reply) {

    const client = redis.createClient();
    const id = 'id_' + req.params.id;

    client.on("error", (err) => {
        console.log("redis Error " + err);
        return reply(boom.badImplementation());
    });

    return client.getAsync(id)
        .then((item) => {
            client.quit();
            
            if (item == null) {
                return reply(boom.notFound());
            } else {
                return {
                    data: {
                        item:item
                    }
                }

            }
        })
        .catch ((err) => {
            console.log(err);
            return reply(boom.badImplementation);
        });

}

/**
 * @method deleteItem
 * @param {Object}
 * @param {Function} reply
 */
function deleteItem(req, reply) {
    const client = redis.createClient();
    const id = 'id_' + req.params.id;

    client.on("error", (err) => {
        console.log("redis Error " + err);
        return reply(boom.badImplementation());
    });

    return client.delAsync(id)
        .then ((num) => {
            client.quit();
            
            if (num == 0) {
                return reply(boom.notFound('item (id=' + id +') is not exists.'));
            } else {
                reply({statusCode:200, message: 'item (id='+ id +') has been deleted.'});
            }
        });
}

/**
 * experimental !!!!
 * return All Data.
 *
 * @method getItems
 * @param {Object}
 * @param {Function} reply
 */
function getItems(req, reply) {

    const client = redis.createClient();

    client.on("error", (err) => {
        console.log("redis Error " + err);
        return reply(boom.badImplementation());
    });

    return client.keysAsync('id_*')
        .then((replies) => {
            if (replies.length == 0) {
                return reply(boom.notFound('data is empty.'));
            }
            return client.mgetAsync(replies)
                .then((data) => {
                    const res ={
                        data:{
                            items:[]
                        }
                    };

                    data.forEach((item) => {
                        res.data.items.push(JSON.parse(item));
                    });
                    res.data.items.sort(function(a, b){
                        return (parseInt(a.id, 10) < parseInt(b.id, 10)) ? -1 : 1;
                    });
                    return reply(res);
                });
        })
        .catch ((err) => {
            console.log(err);
            return reply(boom.badImplementation);
        });
}

/**
 * @method shuffle
 * @param {Array}
 * @see https://bost.ocks.org/mike/shuffle/
 */
function shuffle(array) {
    let m = array.length;
    let t;
    let i;

    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t
    }
    
    return array;
}

module.exports = {
    notImplemented: notImplemented,
    postItem: postItem,
    getItem: getItem,
    deleteItem: deleteItem,
    getItems: getItems
}
