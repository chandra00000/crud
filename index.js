var express = require('express')
var app = express();
var crypto = require('crypto');
var mongo = require('mongoose')
var User = require('./models/index.js');
var jwt = require('jsonwebtoken')
var jwtKey = 'jwt';
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongo.connect('mongodb://localhost:27017/crud', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
var con = mongo.connection;
con.once('open', function() {
    // console.log('Connection Successs Full')
})
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('insert');
})
app.post('/insert', function(req, res) {
    var encode = crypto.createHmac('sha256', secert)
        .update(req.body.password)
        .digest('hex');

    var ur = new User({
        _id: new mongo.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: encode
    });
    ur.save((err, re) => {
        // console.log(re);
        // console.log(err);
        // res.redirect('/show')
        jwt.sign({ re }, jwtKey, { expiresIn: '300s' }, (err, token) => {
            res.status(200).json({ token })
            res.end();
        })
    })
})

app.get('/show', function(req, res) {

    User.find({
            where: {
                name: ['Gage Fischer', 'Callie Guy'],
                // ['name', 'ASC'],
            },
        },
        function(err, data) {

            res.render('show', { data: data });
        })

});


app.get('/delete/:id', async function(req, res) {
    await User.findByIdAndDelete(req.params.id)
    res.redirect('/show');
})

app.get('/edit/:id', function(req, res) {
    User.findById(req.params.id, function(err, data) {
        res.render('edit', { data: data })
    })
})

app.post('/update/:id', async function(req, res) {
    await User.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/show');
})

var secert = 'hdjcksl';
app.post('/login', veryfyToken, function(req, res) {

    User.findOne({ email: req.body.email }).then((data) => {
        var encode = crypto.createHmac('sha256', secert)
            .update(req.body.password)
            .digest('hex');
        if (encode == data.password) {
            // jwt.sign({ data }, jwtKey, { expiresIn: '300s' }, (err, token) => {
            res.status(200).json({ data });
            // })
        } else {
            res.json({ message: "you are login" });
        }
    })
})

function veryfyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        req.token = bearer[1]

        jwt.verify(req.token, jwtKey, (err, authData) => {
            if (err) {
                res.json({ result: err })
            } else {
                console.log("Token Pass");

                next();
            }
        })
    } else {
        res.send({ "result": "Token not provided" })
    }
}
app.listen(9999);