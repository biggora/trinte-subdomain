/**
 * Created by Alex on 5/3/2015.
 */

var subdomain = require('../lib/trinte-subdomain');
var base = 'mydomain.dev';
var request = {
    url: '/index.html',
    headers: {
        host: base
    },
    socket: {
        encrypted: false
    }
};

function merge(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

function defdone(req, res, next) {

}

exports['Get Middleware'] = function (test) {
    var middleware = subdomain({
        base: base
    });
    test.ok(typeof middleware === 'function', 'Middleware');
    test.done();
};

exports['Call onExcept Callback'] = function (test) {
    var middleware = subdomain({
        base: base,
        except: 'www',
        onExcept: function (req, res, next) {
            test.ok(true, "callback complete");
        }
    });

    test.expect(2);

    middleware(merge({}, request, {
        headers: {
            host: 'www.' + base
        }
    }), {}, defdone);

    middleware(merge({}, request, {
        headers: {
            host: 'web.' + base
        }
    }), {}, function done(req, res, next) {
        test.ok(true, "next complete");
    });

    test.done();
};

exports['Call onSuccess Callback'] = function (test) {
    var middleware = subdomain({
        base: base,
        only: 'www',
        onSuccess: function (req, res, next) {
            test.ok(true, "callback complete");
        }
    });

    test.expect(2);

    middleware(merge({}, request, {
        headers: {
            host: 'www.' + base
        }
    }), {}, defdone);

    middleware(merge({}, request, {
        headers: {
            host: 'web.' + base
        }
    }), {}, function done(req, res, next) {
        test.ok(true, "next complete");
    });

    test.done();
};

exports['`only` param as string test'] = function (test) {
    var middleware = subdomain({
        base: base,
        only: 'www',
        onSuccess: function (req, res, next, url) {
            test.ok(url === '/subdomain/www/index.html', "url rewrited");
        }
    });

    test.expect(2);

    middleware(merge({}, request, {
        headers: {
            host: 'www.' + base
        }
    }), {}, defdone);

    middleware(merge({}, request, {
        headers: {
            host: 'web.' + base
        }
    }), {}, function done(req, res, next) {
        test.ok(req === undefined, "url not rewrited");
    });

    test.done();
};

exports['`only` param as regexp test'] = function (test) {

    test.expect(2);

    var middleware = subdomain({
        base: base,
        only:'w([a-z]+)',
        onSuccess: function (req, res, next, url) {
            test.ok(url === '/subdomain/www/index.html', "url rewrited");
        }
    });
    middleware(merge({}, request, {
        headers: {
            host: 'ns3.' + base
        }
    }), {}, function done(req, res, next) {
        test.ok(req === undefined, "url not rewrited");
    });

    middleware(merge({}, request, {
        headers: {
            host: 'www.' + base
        }
    }), {}, defdone);

    test.done();
};

exports['`except` param as string test'] = function (test) {
    var middleware = subdomain({
        base: base,
        except: 'www',
        onSuccess: function (req, res, next, url) {
            test.ok(url === '/subdomain/web/index.html', "url rewrited");
        }
    });

    test.expect(2);

    middleware(merge({}, request, {
        headers: {
            host: 'www.' + base
        }
    }), {}, function done(req, res, next) {
        test.ok(req === undefined, "url not rewrited");
    });

    middleware(merge({}, request, {
        headers: {
            host: 'web.' + base
        }
    }), {}, defdone);

    test.done();
};

exports['`except` param as regexp test'] = function (test) {
    var middleware = subdomain({
        base: base,
        except: 'ns([0-9]+)',
        onSuccess: function (req, res, next, url) {
            test.ok(url === '/subdomain/www/index.html', "url rewrited");
        }
    });

    test.expect(2);

    middleware(merge({}, request, {
        headers: {
            host: 'ns3.' + base
        }
    }), {}, function done(req, res, next) {
        test.ok(req === undefined, "url not rewrited");
    });

    middleware(merge({}, request, {
        headers: {
            host: 'www.' + base
        }
    }), {}, defdone);

    test.done();
};

exports['`alias` param test'] = function (test) {
    var middleware = subdomain({
        base: base,
        alias: {
            '(admin|www|web)' : 'admin'
        },
        onSuccess: function (req, res, next, url) {
            test.ok(url === '/subdomain/admin/index.html', "url rewrited");
        }
    });

    test.expect(3);

    middleware(merge({}, request, {
        headers: {
            host: 'www.' + base
        }
    }), {}, defdone);

    middleware(merge({}, request, {
        headers: {
            host: 'web.' + base
        }
    }), {}, defdone);

    middleware(merge({}, request, {
        headers: {
            host: 'ns1.' + base
        }
    }), {}, function done(req, res, next) {
        test.ok(req === undefined, "url not rewrited");
    });

    test.done();
};
