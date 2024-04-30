// //server.js
// const express = require('express');
// const session = require('express-session');
// const bodyparser = require('body-parser');
// const mysql = require('mysql');
// const path = require('path');
// const app = express()

// app.use(bodyparser.urlencoded({extended:true}));
// // app.use(bodyparser.json());
// // app.use(express.static(path.join(__dirname,'public')));

// const db = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'root',
//     database:'userspage',
// });

// db.connect((err) =>{
//     if(err){
//         console.log("failed to connect:",err.stack);
//         return;
//     } 
//     console.log("connection established");
// });

// app.get('/', (req, res) => {
//     res.redirect('/login');
// })
// app.get('/login', (req, res) => {
//     res.render('login.ejs');
// })
// app.get('/register',(req,res) =>{
//     res.render('./registration.ejs');
// })
// app.post('/register',(req,res) =>{
//     const{username,email,password} =req.body;
//     console.log(username,email,password);
//     const query=`INSERT INTO registration (username,email,password) VALUES(?, ?,?)`;
//     db.query(query,[username,email,password],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         res.redirect('/login');
//     })
// })
// app.get('/home',(req,res) =>{
//     res.render('./home.ejs');})
    
    
// app.listen(2001,()=>{
//     console.log('http://localhost:2001');})


//server.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'userspage',
});

db.connect((err) => {
    if (err) {
        console.log("failed to connect:", err.stack);
        return;
    }
    console.log("connection established");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM registration WHERE email = ? AND password = ?`;
    db.query(query, [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.email = email;
            res.redirect('/home');
        } else {
            res.send('Incorrect email or password');
        }
    });
});

app.get('/register', (req, res) => {
    res.render('registration');
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const query = `INSERT INTO registration (username, email, password) VALUES (?, ?, ?)`;
    db.query(query, [username, email, password], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.redirect('/login');
    });
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.render('home', { email: req.session.email });
    } else {
        res.redirect('/login');
    }
});

app.listen(2001, () => {
    console.log('http://localhost:2001');
});
