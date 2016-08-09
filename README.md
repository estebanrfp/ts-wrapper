#ts-wrapper

Ultra lightweight timeStamp wrapper by @estebanrfp [ts-wrapper](https://desarrolloactivo.com/articulos/ts-wrapper/).

#install

    npm install ts-wrapper

#usage

````javascript
var tswrapper = require('ts-wrapper');


var timestamp = tswrapper(+new Date());

console.log(timestamp); // just now
````

You can also use it in Express app templates:

````javascript
var app = express.createServer();

app.helpers({
  tswrapper: require('ts-wrapper')
});
````

````ejs
<div class="tswrapper"><%- ts-wrapper(data.timestamp) %></div>
````
