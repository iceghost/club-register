var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views')

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var names = [];
client.query('SELECT * FROM clubmembers', (err, res) => {
  if (err) throw err;
  res.rows.forEach((row, index) => {
    // console.log('pushing ' + row.name);
    names.push(row.name);
  })
});



io.on('connection', function(socket){
  console.log("Connection from " + socket.id);

  socket.on("send-name", (name) => {
    // console.log(name + " received");


    client.query('INSERT INTO clubmembers (name) VALUES ($1)', [name], (err, res) => {

      if (err) throw err;
      console.log(res);
    });
    // console.log(names)
    names.push(name)
    io.sockets.emit("update-new-name", name)
  });

  socket.on("update-old-names", () => {
    console.log(names)
    socket.emit("update-old-names", names);
  })
});

app.get('/', function(req, res){
  res.render('index')
});

server.listen(PORT, function(){
  console.log(`Example app listening on port ${PORT}!`)
});
