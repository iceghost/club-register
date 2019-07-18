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

var members = [];
client.query('SELECT * FROM clubmembers', (err, res) => {
  if (err) throw err;
  res.rows.forEach((row, index) => {
    // console.log('pushing ' + row.name);
    members.push({name: row.name, class: row.class});
  })
});



io.on('connection', function(socket){
  // console.log("Connection from " + socket.id);

  socket.on("send-member", (member) => {
    client.query('INSERT INTO clubmembers (name, class, birthday, phone) VALUES ($1, $2, $3, $4)', [member.name, member.class, member.birthday, member.phone], (err, res) => {
      if (err) throw err;
    });

    members.push({name: member.name, class: member.class});
    console.log(member)
    io.sockets.emit("update-new-member", member);
  });

  socket.on("update-old-members", () => {
    socket.emit("update-old-members", members);
  })
});

app.get('/', function(req, res){
  res.render('index')
});

server.listen(PORT, function(){
  console.log(`Example app listening on port ${PORT}!`)
});
