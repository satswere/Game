let tablero = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let w; // = width / 3;
let h; // = height / 3;

let robot = 'X'; //valores de cada uno de los jugadores
let humano = 'O';
let actual_turno = humano;

//cargar el juego
function setup() {
  createCanvas(400, 400);
  w = width / 3;
  h = height / 3;
 // mejor_moviento();
 //quitar si quieres que inicie primero el robot
}
function draw() { //pintado del juego
  background(255);
  strokeWeight(4);

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = tablero[i][j];
      textSize(32);
      let r = w / 4;
      if (spot == humano) {
        noFill();
        ellipse(x, y, r * 2);
      } else if (spot == robot) {
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  let result = comprobar_ganador();
  if (result != null) {
    noLoop();
    let resultP = createP('');
    resultP.style('font-size', '42pt');
    if (result == 'empate') {
      resultP.html('Empate!');
    } else {
      resultP.html(`${result} gana el juego`);
    }
  }
}
//compara si las 3 posiciones son iguales
function comparar(a, b, c) {
  return a == b && b == c && a != '';
}
function comprobar_ganador() {
  let ganador = null;
  for (let i = 0; i < 3; i++) {    // horizontal
    if (comparar(tablero[i][0], tablero[i][1], tablero[i][2])) {
      ganador = tablero[i][0];
    }
  }
  for (let i = 0; i < 3; i++) {   // Vertical
    if (comparar(tablero[0][i], tablero[1][i], tablero[2][i])) {
      ganador = tablero[0][i];
    }
  }
  if (comparar(tablero[0][0], tablero[1][1], tablero[2][2])) {
    ganador = tablero[0][0];   // Diagonal
  }
  if (comparar(tablero[2][0], tablero[1][1], tablero[0][2])) {
    ganador = tablero[2][0];
  }
  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (tablero[i][j] == '') {
        openSpots++;
      }
    }
  }
  if (ganador == null && openSpots == 0) {
    return 'empate';
  } else {
    return ganador;
  }
}

function mousePressed() { //al seleccionar un lugar
  if (actual_turno == humano) {
    // toma la casilla seleccionada
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // valida que se pueda escribir sobre la casilla
    if (tablero[i][j] == '') {
      tablero[i][j] = humano;
      actual_turno = robot;
      mejor_moviento();
    }
  }
}

function mejor_moviento() {
    // turno del robot
    let Mejor_Puntaje = -Infinity;
    let Movimiento;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tablero[i][j] == '') {
          tablero[i][j] = robot;
          let score = Maximin_minimax(tablero, 0, false);
          tablero[i][j] = '';
          console.log(score);
          if (score > Mejor_Puntaje) {
            Mejor_Puntaje = score;
            Movimiento = { i, j };
          }
        }
      }
    }
    tablero[Movimiento.i][Movimiento.j] = robot;
    actual_turno = humano;
  }
  let scores = {
    X: 10,
    O: -10, //puntajes del mixmax
    empate: 0
  };
  
  function Maximin_minimax(tablero, depth, isMaximizing) {
    let result = comprobar_ganador();
    if (result !== null) {
      return scores[result];
    }
  
    if (isMaximizing) {  //la mejor jugada
      let Mejor_Puntaje = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (tablero[i][j] == '') {
            tablero[i][j] = robot;
            let score = Maximin_minimax(tablero, depth + 1, false);
            tablero[i][j] = '';
            Mejor_Puntaje = max(score, Mejor_Puntaje);
          }
        }
      }
      return Mejor_Puntaje;
    } else {
      let Mejor_Puntaje = Infinity;  //la peor jugada
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (tablero[i][j] == '') {
            tablero[i][j] = humano;
            let score = Maximin_minimax(tablero, depth + 1, true);
            tablero[i][j] = '';
            Mejor_Puntaje = min(score, Mejor_Puntaje);
          }
        }
      }
      return Mejor_Puntaje;
    }
  }
  