// this file is spinning up an express application which will make handling requests easier,

// so app IS Express application, Express is FOR Handle the requests удобнее чем просто функциями node.js: отслеживание ссылок и добавляет возможность работы с различными шаблонизаторами
const express     = require('express');
const app         = express(); // call express as a function which will spin up an express application where we can use all kind of utility methods
const log         = require('morgan');
const bodyParser  = require('body-parser');
const mongooseClient = require('mongoose');

const productRoutesHandler = require('./api/routes/products');
const ordersRoutesHandler = require('./api/routes/orders');

mongooseClient.connect(
// path to the cloud Atlas DB
    'mongodb+srv://Sandy:9789jojo@cluster0.vtjko.mongodb.net/my_first_db_name?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
       
    }
);
// var options = {
//     // server: {},
//     // replset: {}, 
//     useNewUrlParser: true,
//     useUnifiedTopology: true        
// };
// options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1};

// mongooseClient.connect(
//     'mongodb://mongodb/my_first_db_name_for_docker',
//     options
// );


// если соединение упадет напишеи об этом в консоли
const db = mongooseClient.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function(){
    console.log('we are connected');
    
});
/* middleware function - любая ф-ция выполняемая ДО отправки сервером response и которая имеет доступ к req & res.
    https://developer.mozilla.org/ru/docs/Learn/Server-side/Express_Nodejs/Introduction 
    Middleware functions are functions made for Express that have access to 3 variables: the request object (req), the response object (res), and the 'next' function in the application’s request-response cycle 
    IF a middleware function with has no mount path: it will be executed for any type of HTTP request*/
// app.use((require, res, next) => {
//     res.status(200).json({
//         message: 'It works'
//     });
// }); 
app.use(log('dev')); // funnel all requests through log first
app.use(bodyParser.urlencoded({extended: false})); // if false, then req.body will contain key-value pairs, where the value can be a string or array
app.use(bodyParser.json()); // extract json data for easy to use. 
// As req.body’s shape is based on user-controlled input, all properties and values in this object are untrusted!

// Cross-Origin-Resource-Sharing error handling for BROWSERS only. Here I just set headers for all further responses, I do not send anything
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // разрешить всем * urls дергать api с любых машин
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Reqested-With, Content-Type, Accept, Authorization'
    ); // только какие headers будут приниматься

    // При POST, PUT request, Самым еулевым запросом браузер спросит разрешено ли ему такие запросы отправлять
    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Headers'); // а мы ему ответим - разрешаем тебе вот эти перечисленные запросы серверу отправлять
        req.status(200).json({tt: 'dd'}); // no need to send body
    }
    next(); // нужно всегда ставить если я не беру готовый midlware(там уже это включено) иначе we block our incoming requests
});

app.use('/products', productRoutesHandler);  // anything that starts with /product will use productRoutesHandler function instructions
app.use('/orders', ordersRoutesHandler);

// если дошло до этой строки значит ни один route не подошел
app.use((req, res, next)=> {
    const my_error = new Error('My message-нет такого route-404! 11/20/2020');
    my_error.status = 404;
    next(my_error);
});

// самый последний собиратель ошибок
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        last_error: {
            message: error.message,
        }
    });
});

module.exports = app;

