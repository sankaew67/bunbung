/* =========================================================
   BungBun うさぎ — mini game: ตีกระต่ายคาบแครอท
   ========================================================= */
(function(){
  const HOLE_COUNT = 9;
  const GAME_SECONDS = 30;
  const DOG_CHANCE = 0.22;
  const BEST_KEY = 'bungbun_whack_best';
  const REWARD_THRESHOLD = 20;
  const BUNNY_SRC = 'assets/game-bunny1.png';
  const BUNNY2_SRC = 'assets/game-bunny2.png';
  const DOG_SRC = 'assets/game-dog.png';

  const field = document.getElementById('gameField');
  const overlay = document.getElementById('gameOverlay');
  const scoreEl = document.getElementById('gameScore');
  const timeEl = document.getElementById('gameTime');
  const bestEl = document.getElementById('gameBest');
  if(!field) return; // game section not on this page
  const startOverlayHTML = overlay.innerHTML;

  /* localStorage can be blocked on some setups (e.g. file:// in some
     browsers) — fall back to an in-memory value so the game still works. */
  let memoryBest = 0;
  function getBest(){
    try{ return Number(localStorage.getItem(BEST_KEY)) || memoryBest; }
    catch(e){ return memoryBest; }
  }
  function setBest(v){
    memoryBest = v;
    try{ localStorage.setItem(BEST_KEY, v); }catch(e){ /* ignore */ }
  }

  let holes = [];
  let hideTimers = {};
  let popTimeoutId = null;
  let timerIntervalId = null;
  let running = false;
  let score = 0;
  let timeLeft = GAME_SECONDS;

  function buildHoles(){
    for(let i=0;i<HOLE_COUNT;i++){
      const hole = document.createElement('div');
      hole.className = 'hole';
      const critter = document.createElement('div');
      critter.className = 'critter';
      hole.appendChild(critter);
      field.insertBefore(hole, overlay);
      critter.addEventListener('click', ()=> handleHit(i));
      critter.addEventListener('touchstart', (e)=>{ e.preventDefault(); handleHit(i); }, {passive:false});
      holes.push(hole);
    }
  }
  buildHoles();
  bestEl.textContent = getBest();

  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  function spawnFloat(hole, text, cls){
    const f = document.createElement('span');
    f.className = 'float-pop ' + cls;
    f.textContent = text;
    f.style.left = '50%';
    f.style.bottom = '55%';
    hole.appendChild(f);
    setTimeout(()=> f.remove(), 700);
  }

  function handleHit(idx){
    if(!running) return;
    const hole = holes[idx];
    const critter = hole.querySelector('.critter');
    if(!critter.classList.contains('up')) return;
    const isDog = critter.classList.contains('dog');
    critter.classList.remove('up');
    clearTimeout(hideTimers[idx]);
    if(isDog){
      score = Math.max(0, score - 2);
      spawnFloat(hole, '-2', 'bad');
    }else{
      score += 1;
      spawnFloat(hole, '+1 🥕', 'good');
    }
    scoreEl.textContent = score;
  }

  function popOnce(){
    const candidates = holes.filter(h => !h.querySelector('.critter').classList.contains('up'));
    if(candidates.length === 0) return;
    const hole = candidates[randInt(0, candidates.length-1)];
    const idx = holes.indexOf(hole);
    const critter = hole.querySelector('.critter');
    const isDog = Math.random() < DOG_CHANCE;
    const bunnySrc = Math.random() < 0.5 ? BUNNY_SRC : BUNNY2_SRC;
    critter.innerHTML = `<img src="${isDog ? DOG_SRC : bunnySrc}" alt="">`;
    critter.classList.toggle('dog', isDog);
    critter.classList.add('up');
    const visible = Math.max(600, 1200 - (GAME_SECONDS - timeLeft) * 18);
    hideTimers[idx] = setTimeout(()=> critter.classList.remove('up'), visible);
  }

  function popLoop(){
    if(!running) return;
    popOnce();
    popTimeoutId = setTimeout(popLoop, randInt(420, 760));
  }

  function tick(){
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if(timeLeft <= 0) endGame();
  }

  function resetField(){
    holes.forEach((hole, idx)=>{
      const critter = hole.querySelector('.critter');
      critter.classList.remove('up','dog');
      clearTimeout(hideTimers[idx]);
    });
  }

  function startGame(){
    resetField();
    score = 0; timeLeft = GAME_SECONDS;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    running = true;
    overlay.classList.add('hidden');
    popLoop();
    timerIntervalId = setInterval(tick, 1000);
  }

  function endGame(){
    running = false;
    clearTimeout(popTimeoutId);
    clearInterval(timerIntervalId);
    resetField();
    const best = getBest();
    const isNewBest = score > best;
    if(isNewBest) setBest(score);
    const finalBest = Math.max(score, best);
    bestEl.textContent = finalBest;

    let emoji = '🥕', msg = 'ลองอีกครั้งนะ เดี๋ยวก็จับกระต่ายได้เก่งขึ้น!';
    if(score >= 20){ emoji = '👑'; msg = 'สุดยอด! คุณคือเจ้าแม่/เจ้าพ่อจับกระต่ายตัวจริง'; }
    else if(score >= 12){ emoji = '🌟'; msg = 'เก่งมาก! มือไวสุด ๆ'; }
    else if(score >= 6){ emoji = '🐇'; msg = 'ดีนะเนี่ย ลองอีกทีสิ อาจทำสถิติใหม่ได้!'; }

    const earnedReward = score >= REWARD_THRESHOLD;
    const rewardHtml = earnedReward
      ? `<div class="game-reward">🎁<strong>ปลดล็อกรางวัลแล้ว!</strong><span>นำหน้าจอนี้ไปยื่นพนักงานหน้าเคาน์เตอร์ เพื่อรับเครื่องดื่มฟรี 1 แก้ว</span></div>`
      : `<div class="game-promo">🎁 ตีให้ได้ ${REWARD_THRESHOLD} ตัวขึ้นไปในครั้งต่อไป รับเครื่องดื่มฟรี 1 แก้ว!</div>`;

    overlay.innerHTML = `
      <span class="game-overlay-emoji">${emoji}</span>
      <h3>หมดเวลา!</h3>
      <p class="score-line">ได้ ${score} แต้ม</p>
      <p class="best-line">${isNewBest ? '🎉 สถิติใหม่!' : 'สถิติสูงสุด ' + finalBest + ' แต้ม'}</p>
      <p>${msg}</p>
      ${rewardHtml}
      <button id="gameStartBtn" class="btn btn-solid">เล่นอีกครั้ง</button>
    `;
    overlay.classList.remove('hidden');
    document.getElementById('gameStartBtn').addEventListener('click', startGame);
  }

  document.getElementById('gameStartBtn').addEventListener('click', startGame);

  function resetToStart(){
    running = false;
    clearTimeout(popTimeoutId);
    clearInterval(timerIntervalId);
    resetField();
    overlay.innerHTML = startOverlayHTML;
    overlay.classList.remove('hidden');
    document.getElementById('gameStartBtn').addEventListener('click', startGame);
  }
  window.BungBunWhack = { reset: resetToStart };
})();
