var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var path = require("path");
var rateLimit = require("express-rate-limit");
var phpExpress = require('php-express')({
  binPath: 'php'
});

var db = require('../database/connectDB');

var app = express();
const router = express.Router();

var server = http.createServer(app);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.engine('php', phpExpress.engine);
app.all(/.+\.php$/, phpExpress.router);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(limiter);

//////////////////////// frontend requests //////////////////////////////
router.get('/', function (req, res) {
  var q = url.parse(req.url, true);
  console.log("GET Received request from " + q.pathname);
  res.redirect("/home.html");
  //res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});

router.post('/', async function (req, res) {
  var q = url.parse(req.url, true);
  console.log("POST Received request from " + q.pathname);

  db.insertReserveData(req, function (err) {
    if (err) {
      console.log(err.message);
      res.redirect('/home.html');
    } else {
      res.redirect('/submitpage.html');
    }
  });
});

router.get("/adminPage", (req, res) => {
  res.redirect("/admin.php");
});

// router.post('/view', function(req,res){
//   // db.serialize(()=>{
//   //   db.each('SELECT id ID, name NAME FROM emp WHERE id =?', [req.body.id], function(err,row){     //db.each() is only one which is funtioning while reading data from the DB
//   //     if(err){
//   //       res.send("Error encountered while displaying");
//   //       return console.error(err.message);
//   //     }
//   //     res.send(` ID: ${row.ID},    Name: ${row.NAME}`);
//   //     console.log("Entry displayed successfully");
//   //   });
//   // });
// });

// //Update
// router.post('/update', function(req,res){
//   // db.serialize(()=>{
//   //   db.run('UPDATE emp SET name = ? WHERE id = ?', [req.body.name,req.body.id], function(err){
//   //     if(err){
//   //       res.send("Error encountered while updating");
//   //       return console.error(err.message);
//   //     }
//   //     res.send("Entry updated successfully");
//   //     console.log("Entry updated successfully");
//   //   });
//   // });
// });

// router.post('/delete', function(req,res){
//   // db.serialize(()=>{
//   //   db.run('DELETE FROM emp WHERE id = ?', req.body.id, function(err) {
//   //     if (err) {
//   //       res.send("Error encountered while deleting");
//   //       return console.error(err.message);
//   //     }
//   //     res.send("Entry deleted");
//   //     console.log("Entry deleted");
//   //   });
//   // });

// });

//////////////////////// backend requests //////////////////////////////
router.get('/API/allReservation', function (req, res) {
  var q = url.parse(req.url, true);
  console.log("Received request from " + q.pathname);

  db.fetchAllReserveData()
    .then(function (results) {
      res.writeHead(200, { 'Content-Type': 'application/json' });

      var data = []
      for (const i of results) {
        data.push(i)
      }
      res.write(JSON.stringify(data));
      return res.end();
    })
    .catch(function (err) {
      console.log("Promise rejection error: " + err);
      res.writeHead(505, { 'Content-Type': 'application/json' });
      return res.end()
    })
});

router.get('/API/oneReservation', function (req, res) {
  var q = url.parse(req.url, true);
  console.log("Received request from " + q.pathname);

  db.fetchOneReserveData(req)
    .then(function (results) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      console.log(results);

      var data = []
      for (const i of results) {
        data.push(i)
      }
      res.write(JSON.stringify(data));
      return res.end();
    })
    .catch(function (err) {
      console.log("Promise rejection error: " + err);
      res.writeHead(505, { 'Content-Type': 'application/json' });
      return res.end()
    })
});

router.get('/API/ReservationByDate', function (req, res) {
  var q = url.parse(req.url, true);
  console.log("Received request from " + q.pathname);

  db.fetchReserveDataByDate(req)
    .then(function (results) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      console.log(results);

      var data = []
      for (const i of results) {
        data.push(i)
      }
      res.write(JSON.stringify(data));
      return res.end();
    })
    .catch(function (err) {
      console.log("Promise rejection error: " + err);
      res.writeHead(505, { 'Content-Type': 'application/json' });
      return res.end()
    })
});

router.post('/API/deleteReservation', function (req, res) {
  var q = url.parse(req.url, true);
  console.log("Received request from " + q.pathname);

  db.deleteReservation(req)
    .then(function (results) {
      res.writeHead(200, { 'Content-Type': 'application/json' });

      return res.end();
    })
    .catch(function (err) {
      console.log("Promise rejection error: " + err);
      res.writeHead(505, { 'Content-Type': 'application/json' });
      return res.end()
    })
});

router.post('/API/makeReservation', function (req, res) {
  var q = url.parse(req.url, true);
  console.log("Received request from " + q.pathname);

  db.insertReserveData(req, function (err) {
    if (err) {
      console.log(err.message);
      res.writeHead(505, { 'Content-Type': 'application/json' });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
    }
    return res.end();
  });
});

router.post('/API/updateReservation', function (req, res) {
  var q = url.parse(req.url, true);
  console.log("Received request from " + q.pathname);

  db.updataReservation(req, function (err) {
    if (err) {
      console.log(err.message);
      res.writeHead(505, { 'Content-Type': 'application/json' });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
    }
    return res.end();
  });
});

app.use('/', router);

server.listen(8080, function () {
  console.log("server is listening on port: 8080");
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

