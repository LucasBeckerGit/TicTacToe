const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


//0 if not, 1 if player1, 2 if player2, 3 if draw
function winningMatrix(Matrix){

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (Matrix[a] && Matrix[a] === Matrix[b] && Matrix[a] === Matrix[c]) {

      if (Matrix[a] === "X"){
        return 1;
      }
      else{
        return 2;
      }
    }
  }

  let draw = true;

  Matrix.forEach(element => {
    if(element === ""){
      draw = false;
    }
  });

  if(draw){
    return 3;
  }

  return 0;
}

let GameData = {
  Player1: {},
  Player2:{},
  Matrix: [
    "", "", "",
    "", "", "",
    "", "", "",
  ],
}

console.log(GameData.Matrix[1])

io.on('connection', (socket) => {
  //console.log('a user connected');

  socket.on('newPlayer', (username) => {
    console.log(`${username} just joined !`);
    
    if(GameData.Player1.username){
      GameData.Player2.username = username
      GameData.Player2.character = "O";
      GameData.Player2.play = false;

      console.log(GameData);

      io.emit('newTurn', GameData);
    }
    else{
      GameData.Player1.username = username;
      GameData.Player1.character = "X";
      GameData.Player1.play = true;
    }

  });

  socket.on('endTurn', cellId => {

    let cellNumber = cellId.slice(-1)

    if(GameData.Player1.play){
      GameData.Matrix[cellNumber-1] = GameData.Player1.character
    }
    else{
      GameData.Matrix[cellNumber-1] = GameData.Player2.character
    }

    GameData.Player1.play = !GameData.Player1.play;
    GameData.Player2.play = !GameData.Player2.play;

    let result = winningMatrix(GameData.Matrix);

    switch (result) {
      case 0:
        io.emit('newTurn', GameData);
        break;
      case 1:
        console.log('Player1 won');
        io.emit('Player1', GameData)
        break;
      case 2:
        console.log('Player2 won');
        io.emit('Player2', GameData)
        break;
      case 3:
        console.log('Draw');
        io.emit('Draw', GameData)
        break;
    }
    
  })


  socket.on('replay', (username) => {
    console.log("Replay")
    console.log(`${username} just joined !`);
    
    if(GameData.Player2.username){ //so this is the first person who wants to replay because Player2 still has its username
      
      GameData = {
        Player1: {},
        Player2:{},
        Matrix: [
          "", "", "",
          "", "", "",
          "", "", "",
        ],
      }
      
      GameData.Player1.username = username
      GameData.Player1.character = "X";
      GameData.Player1.play = true;
    }
    else{

      GameData.Player2.username = username;
      GameData.Player2.character = "O";
      GameData.Player2.play = false;

      console.log(GameData);

      io.emit('newTurn', GameData);
    }
  });

});


server.listen(80, () => {
  console.log('listening on *:80');
});