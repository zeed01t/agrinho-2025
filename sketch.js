let player;
let gravity = 0.6;
let jumpForce = -12;
let groundY = 400;
let platforms = [];
let frutas = [];
let inimigos = [];
let especiais = [];
let cidade;
let pontuacao = 0;
let mochila = 0;
let scrollX = 0;
let vidas = 3;
let gameOver = false;
let gameStarted = false;
let venceu = false;

function setup() {
  createCanvas(800, 450);
  textSize(32);
  textAlign(CENTER, CENTER);
  player = new Player();

  let levelLength = 3000;

  // Plataforma sólida e contínua para o chão
  platforms.push(new Platform(0, groundY, levelLength, 50));
  // Plataformas aéreas para pular
  for (let i = 600; i < levelLength - 200; i += 400) {
    platforms.push(new Platform(i, random(250, 350), 100, 10));
  }

  // Frutas
  for (let i = 300; i < levelLength - 300; i += 600) {
    frutas.push(new Fruta(i, random(180, 300)));
  }

  // Inimigos
  for (let i = 500; i < levelLength - 500; i += 500) {
    inimigos.push(new Inimigo(i, groundY - 30, 100));
  }

  // Estrelas (vidas extras)
  for (let i = 800; i < levelLength - 800; i += 1000) {
    especiais.push(new Estrela(i, random(150, 300)));
  }

  // Cidade ao final do mapa
  cidade = createVector(levelLength - 100, groundY - 70);
}

function draw() {
  background(135, 206, 235);

  if (!gameStarted) {
    mostrarTelaInicio();
    return;
  }

  if (gameOver) {
    mostrarGameOver();
    return;
  }

  if (venceu) {
    mostrarVitoria();
    return;
  }

  translate(-scrollX, 0);

  // Desenhar cidade
  fill(150, 150, 255);
  rect(cidade.x, cidade.y, 50, 70);
  fill(0);
  textSize(16);
  text("🏙️ Cidade", cidade.x + 25, cidade.y - 10);

  // Plataformas
  for (let p of platforms) p.show();

  // Frutas
  for (let f of frutas) f.show();

  // Estrelas
  for (let s of especiais) s.show();

  // Inimigos
  for (let i of inimigos) {
    i.update();
    i.show();
    if (player.checkEnemyCollision(i)) {
      vidas--;
      player.reset();
      if (vidas <= 0) gameOver = true;
    }
  }

  player.update();
  player.show();
  player.checkPlatformCollision(platforms);
  player.checkFruitCollision(frutas);
  player.checkCidadeEntrega(cidade);
  player.checkEstrela(especiais);

  // Controle do scroll da tela para seguir o jogador
  if (player.pos.x - scrollX > width * 0.6) {
    scrollX = player.pos.x - width * 0.6;
  } else if (player.pos.x - scrollX < width * 0.3) {
    scrollX = player.pos.x - width * 0.3;
  }
  scrollX = constrain(scrollX, 0, 3000 - width);

  resetMatrix();
  fill(0);
  textSize(18);
  textAlign(LEFT);
  text("🍎 Frutas: " + mochila, 10, 20);
  text("🎯 Pontuação: " + pontuacao, 10, 40);
  text("❤️ Vidas: " + vidas, 10, 60);
}

function keyPressed() {
  if (!gameStarted) {
    if (key === ' ' || keyCode === ENTER) {
      gameStarted = true;
    }
    return;
  }

  if (gameOver || venceu) {
    if (key === 'r' || key === 'R') {
      reiniciarJogo();
    }
    return;
  }

  if (key === ' ' && player.onGround) {
    player.velocity.y = jumpForce;
  }
}

// ========== FUNÇÕES DE TELA ==========

function mostrarTelaInicio() {
  background(135, 206, 235);
  fill(0);
  textSize(36);
  text("Jogo: Coletar Frutas e Levar à Cidade", width / 2, height / 3);
  textSize(20);
  text("Use as setas ← → para mover", width / 2, height / 2);
  text("Pressione ESPAÇO para pular", width / 2, height / 2 + 30);
  text("Colete 🍎 frutas e entregue na cidade 🏙️", width / 2, height / 2 + 60);
  text("Evite os 🚜 tratores inimigos!", width / 2, height / 2 + 90);
  text("Pegue 🌟 estrelas para ganhar vidas extras", width / 2, height / 2 + 120);
  textSize(24);
  text("Pressione ESPAÇO ou ENTER para começar", width / 2, height * 0.8);
}

function mostrarGameOver() {
  background(0, 0, 0, 180);
  fill(255, 0, 0);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("💀 GAME OVER 💀", width / 2, height / 2);
  textSize(24);
  text("Pressione 'R' para reiniciar", width / 2, height / 2 + 50);
}

function mostrarVitoria() {
  background(255, 255, 255, 230);
  fill(0, 150, 0);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("🎉 PARABÉNS! 🎉", width / 2, height / 2 - 40);
  textSize(32);
  text("Você chegou à cidade com " + pontuacao + " frutas!", width / 2, height / 2 + 10);
  textSize(24);
  text("Pressione 'R' para jogar novamente", width / 2, height / 2 + 60);
}

// Reiniciar jogo
function reiniciarJogo() {
  plataformasReset();
  frutasReset();
  inimigosReset();
  especiaisReset();
  pontuacao = 0;
  mochila = 0;
  vidas = 3;
  scrollX = 0;
  gameOver = false;
  venceu = false;
  player.reset();
  gameStarted = true;
}

function plataformasReset() {
  platforms = [];
  let levelLength = 3000;
  platforms.push(new Platform(0, groundY, levelLength, 50));
  for (let i = 600; i < levelLength - 200; i += 400) {
    platforms.push(new Platform(i, random(250, 350), 100, 10));
  }
}

function frutasReset() {
  frutas = [];
  let levelLength = 3000;
  for (let i = 300; i < levelLength - 300; i += 600) {
    frutas.push(new Fruta(i, random(180, 300)));
  }
}

function inimigosReset() {
  inimigos = [];
  let levelLength = 3000;
  for (let i = 500; i < levelLength - 500; i += 500) {
    inimigos.push(new Inimigo(i, groundY - 30, 100));
  }
}

function especiaisReset() {
  especiais = [];
  let levelLength = 3000;
  for (let i = 800; i < levelLength - 800; i += 1000) {
    especiais.push(new Estrela(i, random(150, 300)));
  }
}

// ========== CLASSES ==========

class Player {
  constructor() {
    this.reset();
    this.size = createVector(30, 30);
    this.velocity = createVector(0, 0);
    this.onGround = false;
  }

  reset() {
    this.pos = createVector(50, groundY - 30);
    mochila = 0;
    this.velocity = createVector(0, 0);
  }

  update() {
    this.velocity.y += gravity;
    this.pos.add(this.velocity);

    if (keyIsDown(LEFT_ARROW)) this.pos.x -= 5;
    if (keyIsDown(RIGHT_ARROW)) this.pos.x += 5;

    // Limita para não sair do mapa
    this.pos.x = constrain(this.pos.x, 0, 3000 - this.size.x);
  }

  show() {
    textSize(28);
    textAlign(CENTER, CENTER);
    text("🤠", this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
  }

  checkPlatformCollision(platforms) {
    this.onGround = false;
    for (let p of platforms) {
      if (
        this.pos.x + this.size.x > p.x &&
        this.pos.x < p.x + p.w &&
        this.pos.y + this.size.y > p.y &&
        this.pos.y + this.size.y < p.y + 15 &&
        this.velocity.y >= 0
      ) {
        this.pos.y = p.y - this.size.y;
        this.velocity.y = 0;
        this.onGround = true;
      }
    }
  }

  checkFruitCollision(frutas) {
    for (let i = frutas.length - 1; i >= 0; i--) {
      let f = frutas[i];
      if (
        this.pos.x + this.size.x > f.pos.x &&
        this.pos.x < f.pos.x + f.size &&
        this.pos.y + this.size.y > f.pos.y &&
        this.pos.y < f.pos.y + f.size
      ) {
        frutas.splice(i, 1);
        mochila++;
      }
    }
  }

  checkCidadeEntrega(cidade) {
    if (
      this.pos.x + this.size.x > cidade.x &&
      this.pos.x < cidade.x + 50 &&
      this.pos.y + this.size.y > cidade.y &&
      this.pos.y < cidade.y + 70
    ) {
      if (mochila > 0) {
        pontuacao += mochila;
        mochila = 0;
      }
      if (pontuacao >= 10) { // pode ajustar pontuação mínima para vencer
        venceu = true;
      }
    }
  }

  checkEstrela(estrelas) {
    for (let i = estrelas.length - 1; i >= 0; i--) {
      let e = estrelas[i];
      if (
        this.pos.x + this.size.x > e.pos.x &&
        this.pos.x < e.pos.x + e.size &&
        this.pos.y + this.size.y > e.pos.y &&
        this.pos.y < e.pos.y + e.size
      ) {
        estrelas.splice(i, 1);
        vidas++;
      }
    }
  }

  checkEnemyCollision(enemy) {
    return (
      this.pos.x + this.size.x > enemy.pos.x &&
      this.pos.x < enemy.pos.x + enemy.w &&
      this.pos.y + this.size.y > enemy.pos.y &&
      this.pos.y < enemy.pos.y + enemy.h
    );
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  show() {
    fill(100, 200, 100);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Fruta {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 20;
  }
  show() {
    textSize(22);
    textAlign(CENTER, CENTER);
    text("🍎", this.pos.x + this.size/2, this.pos.y + this.size/2);
  }
}

class Inimigo {
  constructor(x, y, range) {
    this.startX = x;
    this.pos = createVector(x, y);
    this.w = 30;
    this.h = 30;
    this.range = range;
    this.dir = 1;
  }

  update() {
    this.pos.x += this.dir * 2;
    if (this.pos.x > this.startX + this.range || this.pos.x < this.startX) {
      this.dir *= -1;
    }
  }

  show() {
    textSize(26);
    textAlign(CENTER, CENTER);
    text("🚜", this.pos.x + this.w/2, this.pos.y + this.h/2);
  }
}

class Estrela {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 20;
  }
  show() {
    textSize(20);
    textAlign(CENTER, CENTER);
    text("🌟", this.pos.x + this.size/2, this.pos.y + this.size/2);
  }
}
