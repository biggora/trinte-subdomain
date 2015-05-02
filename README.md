[![NPM version](https://badge.fury.io/js/trinte-subdomain.png)](http://badge.fury.io/js/trinte-subdomain)
## Subdomain Middleware for TrinteJS

Subdomain Middleware for TrinteJS &amp; ExpressJS Javascript Frameworks.

### Installation

    npm install trinte-subdomain --save
    
## Usage overview

### for [TrinteJS](http://www.trintejs.com/)

#### manual setup in project config/middleware.js

```js
var subdomain = require('trinte-subdomain');

module.exports = function (app, express) {
    app.use(subdomain({
        base: 'mydomain.dev',
        only : '(test|admin)',
        except : '(group|panel|my)',
        onSuccess: function(req, res, next){
            console.log('onSuccess');
            next();
        },
        onExcept: function(req, res, next){
            console.log('onExcept');
            next();
        },
        alias: {
            '.*': 'admin'
        }
    }));
    ...
}
```

#### manual setup in project config/routes.js

```js
module.exports = function routes(map, app) { 

    map.namespace('admin', {
        subdomain: true
     }, function(admin) {
        admin.resources('users');
    });
    ...
});
```

### for [ExpressJS](http://expressjs.com/)

```js
var express = require('express')
  , app = express.createServer()
  , subdomain = require('trinte-subdomain');

  ...
  app.use(subdomain({
      base: 'mydomain.dev',
      only : '(test|admin)',
      except : '(group|panel|my)',
      onSuccess: function(req, res, next){
               console.log('onSuccess');
               next();
      },
      onExcept: function(req, res, next){
               console.log('onExcept');
               next();
      },
      alias: {
               '.*': 'admin'
      }
   }));

   app.get('/subdomain/admin', function(req, res){
      res.send('Ok!');
   });
   app.listen(3000);
```

Options
-----------------

<table style="width:100%">
    <thead>
        <tr>
            <th>
                Name
            </th>
            <th>
                Type
            </th>
            <th>
                Default
            </th>
            <th>
                Description
            </th>
        </tr>
    </thead>
    <tr>
        <td>
            base
        </td>
        <td>
            string
        </td>
        <td>
            
        </td>
        <td>
            Base damain name (required)
        </td>
    </tr>
    <tr>
        <td>
            only
        </td>
        <td>
            string
        </td>
        <td>
            
        </td>
        <td>
            Only for subdomains
        </td>
    </tr>
    <tr>
        <td>
            except
        </td>
        <td>
            string
        </td>
        <td>
            
        </td>
        <td>
            Except subdomains
        </td>
    </tr>
    <tr>
        <td>
            onSuccess
        </td>
        <td>
            function
        </td>
        <td>
            
        </td>
        <td>
            onSuccess callback
        </td>
    </tr>
    <tr>
        <td>
            onExcept
        </td>
        <td>
            function
        </td>
        <td>
           
        </td>
        <td>
            onExcept callback
        </td>
    </tr>    
    <tr>
        <td>
            alias
        </td>
        <td>
            object
        </td>
        <td>
           
        </td>
        <td>
            Domains mapping
        </td>
    </tr>     
</table>

### Copyright & License

    (The MIT License)

    Copyright (c) 2013 Alexey Gordeyev

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

### Resources

- Visit the [author website](http://www.gordejev.lv).
- Follow [@biggora](https://twitter.com/#!/biggora) on Twitter for updates.
- Follow [agbiggora](https://www.facebook.com/agbiggora) on Facebook for updates.
- Report issues on the [github issues](https://github.com/biggora/trinte-subdomain/issues) page.

### Recommend extensions

- [CaminteJS](http://www.camintejs.com/) - Cross-db ORM for NodeJS
- [2CO](https://github.com/biggora/2co) - is the module that will provide nodejs adapters for 2checkout API payment gateway.
