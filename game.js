// Enkel prototyp av et Pokemon-spill i nettleseren.
// Spilleren kan bevege seg rundt og møte tilfeldige Pokemon i gresset.

class Move {
  constructor(navn, kraft) {
    this.navn = navn;
    this.kraft = kraft;
  }
}

class Pokemon {
  constructor(navn, hp, attack, defense, moves, level = 5) {
    this.navn = navn;
    this.maxHp = hp;
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
    this.moves = moves;
    this.level = level;
    this.xp = 0;
  }

  isAlive() {
    return this.hp > 0;
  }

  taSkade(skade) {
    this.hp = Math.max(0, this.hp - skade);
  }

  brukMove(move, motstander) {
    appendText(`${this.navn} bruker ${move.navn}!`);
    const skade = Math.max(1, move.kraft + this.attack - motstander.defense);
    motstander.taSkade(skade);
    appendText(`${motstander.navn} mister ${skade} HP. (${motstander.hp}/${motstander.maxHp})`);
    if (!motstander.isAlive()) {
      appendText(`${motstander.navn} besvimer!`);
      this.faaXp(50);
    }
  }

  faaXp(mengde) {
    this.xp += mengde;
    while (this.xp >= this.level * 20) {
      this.xp -= this.level * 20;
      this.level += 1;
      this.maxHp += 2;
      this.attack += 1;
      this.defense += 1;
      this.hp = this.maxHp;
      appendText(`${this.navn} gikk opp til level ${this.level}!`);
    }
  }
}

// DOM-elementer
const mapEl = document.getElementById('map');
const playerEl = document.getElementById('player');
const battleEl = document.getElementById('battle');
const battleTextEl = document.getElementById('battle-text');
const battleMenuEl = document.getElementById('battle-menu');

let spiller;
let vill;
let iKamp = false;

function appendText(text) {
  const p = document.createElement('p');
  p.textContent = text;
  battleTextEl.appendChild(p);
}

function startKamp() {
  iKamp = true;
  mapEl.classList.add('hidden');
  battleEl.classList.remove('hidden');
  battleTextEl.innerHTML = '';
  vill = new Pokemon('Pikachu', 18, 4, 2, [new Move('Tackle', 5)]);
  appendText(`En vill ${vill.navn} dukker opp!`);
  tegnMeny();
}

function tegnMeny() {
  battleMenuEl.innerHTML = '';
  spiller.moves.forEach((move, idx) => {
    const btn = document.createElement('button');
    btn.textContent = move.navn;
    btn.onclick = () => {
      spiller.brukMove(move, vill);
      if (vill.isAlive()) {
        const villMove = vill.moves[0];
        vill.brukMove(villMove, spiller);
      }
      if (!spiller.isAlive() || !vill.isAlive()) {
        sluttKamp();
      }
    };
    battleMenuEl.appendChild(btn);
  });
}

function sluttKamp() {
  if (spiller.isAlive()) {
    appendText(`Du vant og fanget ${vill.navn}!`);
  } else {
    appendText('Du besvimte...');
  }
  const fortsett = document.createElement('button');
  fortsett.textContent = 'Fortsett';
  fortsett.onclick = () => {
    battleEl.classList.add('hidden');
    mapEl.classList.remove('hidden');
    battleTextEl.innerHTML = '';
    iKamp = false;
  };
  battleMenuEl.appendChild(fortsett);
}

function init() {
  const tackle = new Move('Tackle', 5);
  const ember = new Move('Ember', 6);
  spiller = new Pokemon('Charmander', 20, 5, 3, [tackle, ember]);
  document.addEventListener('keydown', movePlayer);
}

function movePlayer(e) {
  if (iKamp) return;
  const step = 20;
  const pos = playerEl.getBoundingClientRect();
  const mapPos = mapEl.getBoundingClientRect();
  switch (e.key) {
    case 'ArrowUp':
      if (pos.top - step >= mapPos.top) playerEl.style.top = `${pos.top - mapPos.top - step}px`;
      break;
    case 'ArrowDown':
      if (pos.bottom + step <= mapPos.bottom) playerEl.style.top = `${pos.top - mapPos.top + step}px`;
      break;
    case 'ArrowLeft':
      if (pos.left - step >= mapPos.left) playerEl.style.left = `${pos.left - mapPos.left - step}px`;
      break;
    case 'ArrowRight':
      if (pos.right + step <= mapPos.right) playerEl.style.left = `${pos.left - mapPos.left + step}px`;
      break;
  }
  if (Math.random() < 0.1) {
    startKamp();
  }
}

init();
