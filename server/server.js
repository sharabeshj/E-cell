const express=require('express');
const path=require('path');
const http=require('http');
const socketIO=require('socket.io');
//const bodyParser=require('body-parser');
const mysql=require('mysql');
var form=express();
var publicPath=path.join(__dirname,'../public');
//console.log(publicPath);
var server=http.createServer(form);
var io=socketIO(server);
// form.use(bodyParser.urlencoded({extended:true}) );
form.use(express.static(publicPath));
form.get('/',function(req,res){
  res.sendFile(publicPath+'/form.html');
});
form.post('/',function(req,res){
//  console.log(req.query);

console.log(req.body);

var name=req.query.name;
var number=req.query.number;
var email=req.query.email;
var events=req.query.event;
var department=req.query.department;
var year=req.query.year;
var resume=req.query.resume;

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "shara1234",
  database:"DATA"
});

con.connect(function(err) {
  console.log("You got caught");
  if (err) throw err;
 console.log("Connected!");
//  console.log(("'"'+`${req.query.name}`+'"'"));
//  console.log(req.query);
//  console.log("Yo", stringi(req.query.name));
  var sql = `INSERT INTO FORM (NAME,NUMBER,EMAIL,DEPARTMENT,YEAR,EVENT,RESUME) VALUES (?,?,?,?,?,?,?)`;
  con.query(sql,[name,number,email,department,year,events,resume], function (err, result, fields) {
    if (err) throw err;
    console.log("1 record inserted");

    console.log("fields", fields);
});
});
res.send("Thanks for submitting!!");
res.end();
});

/*function stringi(variable) {
  return '"' + variable + '"';
}*/
/*form.post('/shara',function(req,res) {
  console.log(req.body);
})*/
io.on('connection',function(socket) {
  console.log('connection open');

  socket.on('disconnect',function() {
    console.log('connection closed');
  });

  socket.on('trigger',function(){
    var con = mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "shara1234",
      database:"DATA"
    });
    con.connect(function(err) {
      console.log("Hi");
      if (err) throw err;
      con.query("SELECT * FROM FORM", function (err, result, fields) {
        if (err) throw err;
        io.emit('result', result);
      });
    });
  });
});

server.listen(3000,function() {
  console.log('port open');
});