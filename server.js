/* Set up all the code to spin up my Node.js server which we do through the code (js code), not like in PHP were we have a separate server software which is connected to our PHP script. We create a server instead in js when using Node.js
 How do we create a server?: http module is FOR CREATE a SERVER  */

// 1. We use a package from Node named http, that provides the functionality to spin up a server
const http = require('http');
const app  = require('./app'); 
// const { SERVFAIL } = require('dns');??? само напечатолось?

// 2. Assign a port at which my project should run. I can get it from the environment variable or hard code it
const port = process.env.PORT || 5000; // process.env is a Node.js environment variable. This process.env would be set on the server I DEPLOY ON. Most hosting providers offer me tools to inject environment variables into my running project and I will just need to add PORT environment variable there. If not-> use hard coded default

/* 3. Create a server & save it in a variable with using http package & its createServer command.
    It needs a function(aka listener) which will be executed WHENEVER we get a new request.
    This function is responsible to provide a response.
    Function createServer needs Listener to have 2 param: 'request' & 'response' */
const server = http.createServer(app);// express app is qualified as a request handler

// 4. Start a server: it starts listening on this port. And now it will execute Listener function when a request is gotten
server.listen(port);

// this comment is only for triggering aws pipeline!!