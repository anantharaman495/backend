const express = require('express');
const app = express();
const path = require ('path');
const mysql = require ('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router =require('./Router');

app.use(express.static(path.join(__dirname,'build')));
app.use(express.json());

// For DB Access
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3308,
    database: 'myapp'
});

db.connect(function(err){
    if(err){
        console.log('DB Connection Err');
        throw err;
        return false;    
    }
    console.log('Connected to the MySQL server.');
});

const sessionStore = new MySQLStore ({
    expiration:6000000,//100 Minutes
    endConnectionOnClose:false
},db)

app.use(session({
    key:'123456789keyvalue',
    secret:'9876543210secret',
    store: sessionStore,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:600000,//10 minutes
        httpOnly:false
    }
}));

new Router(app, db);

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname),'build','index.html')
});
app.listen(3000);