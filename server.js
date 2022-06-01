const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
//
const moment = require('moment');

const mongoose = require('mongoose');
//onst cors = require('cors');
//const router = express.Router();
//models
const User = require('./models/user');
const Exercise = require('./models/exercise');

const app = express();
app.use(express.static('public'));
// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }))
//app.use(express.json())
//app.use(morgan("dev"));

//const uri = 'mongodb+srv://imuhammadosama:comfortzone@comfort-zone-cluster-2o6ke.mongodb.net/comfortzone?retryWrites=true&w=majority';
const uri = 'mongodb+srv://mrdbhere:MrDbhere@cluster0.5yux0cl.mongodb.net/?retryWrites=true&w=majority';
const options = { useNewUrlParser: true, useUnifiedTopology: false };
mongoose.connect(uri, options).then(() => { console.log("coneectes") }).catch(err => console.log("33333333", err))
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.once('open', () => console.log('Connected to DB!'));
db.on('errors', (err) => console.log(err));




const PORT = process.env.PORT || 4000;


//view forms
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/forms.html')

});

///////****************************************//////////
///////****************************************//////////
///////****************************************//////////

app.post('/api/new-user', (req, res, next) => {
    const { username } = req.body;
    User.findOne({ username }).then(user => {
        if (user) throw new Error('username already taken');
        console.log("here", username);
        return User.create({ username })
    })
        .then(user => res.status(200).send({
            username: user.username,
            _id: user._id
        }))
        .catch(err => {
            console.log(err);
            res.status(500).send(err.message);
        })
})

app.post('/api/users/:id/exercises', (req, res, next) => {
    let { _id, description, duration, date } = req.body;
    User.findOne({ _id }).then(user => {
        if (!user) throw new Error('Unknown user with _id');
        date = date || Date.now();
        return Exercise.create({
            description, duration, date, userID: _id
        })
            .then(ex => res.status(200).send({
                username: user.username,
                description, duration,
                _id: user._id,
                date: moment(ex.date).format('ddd MMMM DD YYYY')
            }))
    })
        .catch(err => {
            console.log(err);
            res.status(500).send(err.message);
        })
})

app.get('/api/users/:userId/logs', (req, res, next) => {
    let { from, to, limit } = req.query;
    let { userId } = req.params
    from = moment(from, 'YYYY-MM-DD').isValid() ? moment(from, 'YYYY-MM-DD') : 0;
    to = moment(to, 'YYYY-MM-DD').isValid() ? moment(to, 'YYYY-MM-DD') : moment().add(1000000000000);
    User.findById(userId).then(user => {
        if (!user) throw new Error('Unknown user with _id');
        Exercise.find({ userID: userId })
            .where('date').gte(from).lte(to)
            .limit(+limit).exec()
            .then(log => res.status(200).send({
                _id: userId,
                username: user.username,
                count: log.length,
                log: log.map(o => ({
                    description: o.description,
                    duration: o.duration,
                    date: moment(o).format('ddd MMMM DD YYYY')
                }))
            }))
    })
        .catch(err => {
            console.log(err);
            res.status(500).send(err.message);
        })
})



// select  where 




///////////////////////////****************************************************************************************////////////////////////////////
///////////Here we add two post apis for create new user + add user exercise + get those exercise with different paramas || string query //////////
///////////////////////////****************************************************************************************////////////////////////////////


///api/users/:_id/logs?[from][&to][&limit]
//get user logs by id 
// app.get('/api/users/logs', (req, res) => {
//     // res.send("hi");
//     // res.end();
//     //get query string
//     let { from, to, limit } = req.query;

//     //check list of users
//     if (users && users.length > 0) {
//         //check the specified user
//         const user = users.find(u => u.id === parseInt(req.params.id));
//         //if not found
//         //else check specified user id logs         
//         if (!user) {
//             return res.status(404).send("Opps We Not found this user");
//         }
//         else {
//             let { logs } = user;
//             console.log(user);
//             if (!(user && user.hasOwnProperty('logs') && logs.length >= 0)) {
//                 return res.status(404).send("Opps we not found this user logs");
//             }
//             else {
//                 return res.status(200).send(user.logs);
//             }
//         }

//     }
//     else {
//         return res.status(404).send("Opps No users Found!");
//     }

// });



// //Create a New User
// app.post('/api/addUser', (req, res) => {

//     console.log(req.body);
//     const { username } = req.body;
//     if (!username) {
//         return res.status(400).send("Name is Required feild");
//     }
//     else {
//         const user = {
//             id: users.length + 1,
//             username: username
//         }

//         users.push(user);
//         res.status(200).send(users);

//     }
// });
// //POST /api/users/:_id/exercises
// //Add Exercise
// app.post('/api/users/exercise/:id', (req, res) => {

//     const { id, description, duration, date } = req.body;

//     const user = users.find(u => u.id === parseInt(req.params.id))
//     if (user) {
//         const exerciseObj = {
//             id: user.id,
//             description: description,
//             duration: duration,
//             date: date
//         }
//         return res.status(200).send(exerciseObj);
//     }
//     else {
//         res.status(404).send("This id of user not found");
//     }


//     //add exercise to find id
//     //insert data

//     // res.send(exerciseObj);


// })



app.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
});