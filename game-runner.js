/* =========================================================
   BungBun うさぎ — mini game 2: วิ่งเก็บแครอท
   ========================================================= */
(function(){
  const GAME_SECONDS = 30;
  const START_LIVES = 3;
  const LANES = [16.6667, 50, 83.3333]; // % left position of each lane centre
  const BEST_KEY = 'bungbun_runner_best';

  const field = document.getElementById('runnerField');
  if(!field) return; // section not on this page
  const overlay = document.getElementById('runnerOverlay');
  const scoreEl = document.getElementById('runnerScore');
  const timeEl = document.getElementById('runnerTime');
  const livesEl = document.getElementById('runnerLives');
  const bestEl = document.getElementById('runnerBest');
  const player = document.getElementById('runnerPlayer');
  const leftBtn = document.getElementById('runnerLeftBtn');
  const rightBtn = document.getElementById('runnerRightBtn');
  const startOverlayHTML = overlay.innerHTML;

  const ROCK_SVG = `<svg viewBox="0 0 40 40"><path d="M4 27c-2-6 3-11 8-10 1-6 9-9 14-4 6-1 11 4 10 10 3 3 2 9-3 10H8c-6 0-7-5-4-6Z" fill="#A6A69C" stroke="#5B3A22" stroke-width="2.2" stroke-linejoin="round"/><path d="M10 25c2-3 6-4 9-2M23 19c2-2 5-2 7 0" stroke="#7C7C70" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
  const CARROT_SVG = `<svg viewBox="0 0 40 40"><path d="M20 4c2 2 1 6-1 7M20 4c-2 2-1 6 1 7M20 4v8" stroke="#7C9473" stroke-width="2.6" stroke-linecap="round"/><path d="M13 16h14l-7 22Z" fill="#F0A868" stroke="#5B3A22" stroke-width="2.2" stroke-linejoin="round"/><path d="M17 20l1 13M23 20l-1 13" stroke="#C97B3D" stroke-width="1.4" stroke-linecap="round" opacity=".6"/></svg>`;

  let memoryBest = 0;
  function getBest(){
    try{ return Number(localStorage.getItem(BEST_KEY)) || memoryBest; }
    catch(e){ return memoryBest; }
  }
  function setBest(v){
    memoryBest = v;
    try{ localStorage.setItem(BEST_KEY, v); }catch(e){ /* ignore */ }
  }
  bestEl.textContent = getBest();

  let lane = 1;
  let score = 0;
  let lives = START_LIVES;
  let timeLeft = GAME_SECONDS;
  let running = false;
  let items = [];
  let rafId = null;
  let timerId = null;
  let lastTs = null;
  let spawnAccum = 0;
  let nextSpawnGap = 700;

  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  function setLane(n){
    lane = Math.max(0, Math.min(2, n));
    player.style.left = LANES[lane] + '%';
  }
  setLane(1);

  function updateLives(){
    livesEl.textContent = '❤'.repeat(lives) + '♡'.repeat(START_LIVES - lives);
  }

  function spawnFloatAt(laneIdx, text, cls){
    const f = document.createElement('span');
    f.className = 'float-pop ' + cls;
    f.textContent = text;
    f.style.left = LANES[laneIdx] + '%';
    f.style.top = '78%';
    field.appendChild(f);
    setTimeout(()=> f.remove(), 700);
  }

  function flashHit(){
    field.classList.add('hit');
    setTimeout(()=> field.classList.remove('hit'), 300);
  }

  function fallSpeed(){ return Math.min(95, 55 + (GAME_SECONDS - timeLeft) * 1.3); }
  function spawnGap(){ return Math.max(420, 950 - (GAME_SECONDS - timeLeft) * 15) + Math.random()*250; }

  function spawnItem(){
    const laneIdx = randInt(0,2);
    const isRock = Math.random() < 0.42;
    const el = document.createElement('div');
    el.className = 'runner-item';
    el.innerHTML = isRock ? ROCK_SVG : CARROT_SVG;
    el.style.left = LANES[laneIdx] + '%';
    el.style.top = '-12%';
    field.insertBefore(el, overlay);
    items.push({ el, lane: laneIdx, type: isRock ? 'rock' : 'carrot', top: -12, resolved: false });
  }

  function updateItems(dt){
    const speed = fallSpeed();
    for(let i = items.length-1; i >= 0; i--){
      const it = items[i];
      it.top += speed * dt;
      it.el.style.top = it.top + '%';
      if(!it.resolved && it.top >= 76 && it.top <= 94 && it.lane === lane){
        it.resolved = true;
        if(it.type === 'carrot'){
          score += 1;
          scoreEl.textContent = score;
          spawnFloatAt(it.lane, '+1 🥕', 'good');
        }else{
          lives = Math.max(0, lives - 1);
          updateLives();
          flashHit();
          spawnFloatAt(it.lane, '-1 ♡', 'bad');
        }
        it.el.remove();
        items.splice(i,1);
        if(lives <= 0){ endGame('lives'); return; }
        continue;
      }
      if(it.top > 102){ it.el.remove(); items.splice(i,1); }
    }
  }

  function loop(ts){
    if(!running) return;
    if(lastTs === null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    spawnAccum += dt * 1000;
    if(spawnAccum >= nextSpawnGap){
      spawnItem();
      spawnAccum = 0;
      nextSpawnGap = spawnGap();
    }
    updateItems(dt);
    if(running) rafId = requestAnimationFrame(loop);
  }

  function tick(){
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if(timeLeft <= 0) endGame('time');
  }

  function clearItems(){
    items.forEach(it => it.el.remove());
    items = [];
  }

  function startGame(){
    clearItems();
    score = 0; lives = START_LIVES; timeLeft = GAME_SECONDS;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    updateLives();
    setLane(1);
    running = true;
    lastTs = null;
    spawnAccum = 0;
    nextSpawnGap = 700;
    overlay.classList.add('hidden');
    rafId = requestAnimationFrame(loop);
    timerId = setInterval(tick, 1000);
  }

  function endGame(reason){
    running = false;
    cancelAnimationFrame(rafId);
    clearInterval(timerId);
    clearItems();

    const best = getBest();
    const isNewBest = score > best;
    if(isNewBest) setBest(score);
    const finalBest = Math.max(score, best);
    bestEl.textContent = finalBest;

    let emoji, msg;
    if(reason === 'lives'){
      emoji = '💥'; msg = 'โดนหินจนวิ่งไม่ไหว! ลองอีกทีนะ';
    }else if(score >= 15){
      emoji = '👑'; msg = 'สุดยอด นักวิ่งมือทอง!';
    }else if(score >= 8){
      emoji = '🌟'; msg = 'เก่งมาก วิ่งดีมาก!';
    }else{
      emoji = '🐇'; msg = 'ดีนะเนี่ย ลองอีกทีสิ อาจทำสถิติใหม่ได้!';
    }

    overlay.innerHTML = `
      <span class="game-overlay-emoji">${emoji}</span>
      <h3>${reason === 'lives' ? 'จบเกม!' : 'หมดเวลา!'}</h3>
      <p class="score-line">เก็บแครอทได้ ${score} ชิ้น</p>
      <p class="best-line">${isNewBest ? '🎉 สถิติใหม่!' : 'สถิติสูงสุด ' + finalBest + ' ชิ้น'}</p>
      <p>${msg}</p>
      <button id="runnerStartBtn" class="btn btn-solid">เล่นอีกครั้ง</button>
    `;
    overlay.classList.remove('hidden');
    document.getElementById('runnerStartBtn').addEventListener('click', startGame);
  }

  document.getElementById('runnerStartBtn').addEventListener('click', startGame);
  leftBtn.addEventListener('click', ()=>{ if(running) setLane(lane-1); });
  rightBtn.addEventListener('click', ()=>{ if(running) setLane(lane+1); });
  field.addEventListener('click', (e)=>{
    if(!running) return;
    const rect = field.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setLane(x < rect.width/2 ? lane-1 : lane+1);
  });
  document.addEventListener('keydown', (e)=>{
    if(!running) return;
    if(e.key === 'ArrowLeft') setLane(lane-1);
    if(e.key === 'ArrowRight') setLane(lane+1);
  });

  function resetToStart(){
    running = false;
    cancelAnimationFrame(rafId);
    clearInterval(timerId);
    clearItems();
    overlay.innerHTML = startOverlayHTML;
    overlay.classList.remove('hidden');
    document.getElementById('runnerStartBtn').addEventListener('click', startGame);
  }
  window.BungBunRunner = { reset: resetToStart };
})();
