var express = require('express')
var app = express();
var mongo = require('mongodb')
var mongoclint = mongo.MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors'); 
const mongourl = "mongodb+srv://first:first1@cluster0.mvuhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var db;  
var port = process.env.PORT||3000;  
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())



app.get('/', (req, res) => {
    res.send(" Its working properly")
});


app.get('/city', function(req, res) {
    let sortcondition = { city_name: 1 }
    let limit = 100;
    if (req.query.sort && req.query.limit) {
        sortcondition = { city_name: Number(req.query.sort) },
            limit = Number(req.query.limit)
    } else if (req.query.sort) {
        sortcondition = { city_name: Number(req.query.sort) }
    } else if (req.query.limit) {
        limit = Number(req.query.limit)
    }
    db.collection('city').find().sort(sortcondition).limit(limit).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

//////rest route/////// 
app.get('/rest', (req, res) => {
    var condition = {};
    ///sort data basis of cost// 
   let sortcondition = {cost:1} ;
   if(req.query.mealtype && req.query.sort){
       condition = {"type.mealtype":req.query.mealtype}
       sortcondition = {cost:Number(req.query.sort)}; 
   } 
    //meal+city
    if (req.query.mealtype && req.query.city) {
        condition = { $and: [{ "type.mealtype": req.query.mealtype }, { city: req.query.city }] }
    }
    //meal+cuision
    else if (req.query.mealtype && req.query.cuision) {
        condition = { $and: [{ "type.mealtype": req.query.mealtype }, { "Cuisine.cuisine": req.query.cuision }] }
    }
    //meal+cost 
    else if (req.query.mealtype && req.query.lcost && req.query.hcost) {
        condition = {
            $and: [{ "type.mealtype": req.query.mealtype }, { cost: { $lt: Number(req.query.hcost), $gt: Number(req.query.lcost) } }]
        }
    } 
    //city//
    else if (req.query.city) {
        condition = { city: req.query.city }
    }
    // mealtype 
    else if (req.query.mealtype) {
        condition = { "type.mealtype": req.query.mealtype }
    }
    db.collection('rest').find(condition).sort(sortcondition).toArray((err, result) => {
        if (err) throw err;
        // res.status(200).send(result)
        res.send(result)
    })
})

//////rest parem
app.get('/rest/:id', (req,res) => {
    var id = req.params.id
    db.collection('rest').find({_id:id}).toArray((err,result) => {
        if (err) throw err;
        res.send(result)
    })
})



////cuision route//////
app.get('/cusion', (req, res) => {
    db.collection('cuision').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

//// mealtype route//////
app.get('/mealtype', (req, res) => {
    db.collection('mealType').find().toArray(function(err, result) {
        if (err) throw err;
        res.send(result)
    })
})

///placeorder 
app.post('/placeholder', (req, res) => {
    db.collection('orders').insert(req.body, (err, result) => {
        if (err) throw err;
        res.send("data added")
    })
})

////get booking 
app.get('/order', (req, res) => {
    db.collection('orders').find({}).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

////////connection with mongodb ///////
mongoclint.connect(mongourl, (err, connection) => {
    if (err) throw err;
    db = connection.db('restaurentapp')
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`server is running port ${port}`)
})