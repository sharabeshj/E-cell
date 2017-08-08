const express=require('express');
const path=require('path');
const http=require('http');
const socketIO=require('socket.io');
const bodyParser=require('body-parser');
const mysql=require('mysql');
var form=express();
var publicPath=path.join(__dirname,'../public');
//console.log(publicPath);
var server=http.createServer(form);
var io=socketIO(server);
form.use(bodyParser.urlencoded({extended:true}) );
form.use(express.static(publicPath));
form.get('/',function(req,res){
  res.sendFile(publicPath+'/form.html');
});
form.post('/',function(req,res){
//  console.log(req.query);


var name=stringi(req.query.name);
var number=stringi(req.query.number);
var email=stringi(req.query.email)
var events=stringi(req.query.event);
var department=stringi(req.query.department);
var year=req.query.year;
var resume=stringi(req.query.resume);

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
  var sql = `INSERT INTO FORM (NAME,NUMBER,EMAIL,DEPARTMENT,YEAR,EVENT,RESUME) VALUES (${name},${number},${email},${department},${year},${events},${resume})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
});
});
res.send("Thanks for submitting!!");
res.end();
});

function stringi(variable) {
  return '"' + variable + '"';
}
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
        socket.emit('result', result);
      });
    });
  });
});
server.listen(3000,function() {
  console.log('port open');
})
