/*
 * Subdomain middleware
 * keep shipping next()
 */

module.exports = function (options) {

    // options?
    options = options || {};

    if (!options.base) {
        throw new Error('options.base required!');
    } else {
        options.removeWWW = options.removeWWW || false;
        options.debug = options.debug || false;
        options.ignoreWWW = options.ignoreWWW || false;
        options.prefix = options.prefix || 'subdomain';
    }

    // return middleware
    return function (request, response, next) {

        // get host & protocol
        var host = request.headers.host
            , protocol = request.socket.encrypted ? 'https' : 'http';

        // remove 'www' prefix from URL? (tacky, right?)
        if (options.removeWWW === true) {
            if (/^www/.test(host)) {
                return response.redirect(protocol + '://' + host.replace(/^www\./, '') + request.url);
            }
        }

        // subdomain specific middleware
        if (host === options.base
            || host === 'localhost:3000'
            || host === '127.0.0.1:3000'
            || (options.ignoreWWW && /^www\./.test(host))) {
            // not a subdomain or ignoring www subdomain
            return next();
        } else {
            // if callbacks exists`s
            var successCallback = options && options.onSuccess && typeof options.onSuccess === 'function'? options.onSuccess : null;
            var exceptCallback = options && options.onExcept && typeof options.onExcept === 'function'? options.onExcept : null;

            // `except` subdomains test
            if(options.except) {
                if (new RegExp(options.except + '\.' + options.base,'i').test(host)) {
                    console.log('return for except')
                    return exceptCallback ? exceptCallback(request, response, next) : response.status(404).send('Not found');
                }
            }

            // `only` subdomains test
            if(options.only) {
                if (!new RegExp(options.only + '\.' + options.base,'i').test(host)) {
                    console.log('return for only')
                    return exceptCallback ? exceptCallback(request, response, next) : response.status(404).send('Not found');
                }
            }

            var matches = [], actual = '', aliased = false;
            if (options.alias && typeof options.alias === 'object') {
                // aliases test for subdomain
                for (var key in options.alias) {
                    if (typeof key === 'string') {
                        if (new RegExp(key + '\.' + options.base,'i').test(host)) {
                            actual = options.alias[key];
                            aliased = true;
                        }
                    }
                }
            } else {
                // default test for subdomain
                matches = host.match(new RegExp('(.*)\.' + options.base,'i'));
                actual = matches[1] || '';
            }

            // rewrite request url for subdomain
            if ((matches && matches.length === 2) || aliased) {
                request.url = '/' + options.prefix + '/' + actual + request.url;
                return  successCallback ? successCallback(request, response, next) : next();
            } else {
                return next();
            }
        }
    };
};