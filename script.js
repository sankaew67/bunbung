/* =========================================================
   BungBun うさぎ — behaviour
   ========================================================= */

/* ---------- logo bunny run ---------- */
const logoBtn = document.getElementById('logoBtn');
const runnerTrack = document.getElementById('runnerTrack');
function runBunny(){
  const span = document.createElement('span');
  span.className = 'runner-bunny';
  span.textContent = '🐇';
  runnerTrack.appendChild(span);
  requestAnimationFrame(()=> span.classList.add('go'));
  span.addEventListener('animationend', ()=> span.remove());
}
logoBtn.addEventListener('click', runBunny);
logoBtn.addEventListener('mouseenter', runBunny);

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', ()=> mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> mainNav.classList.remove('open')));

/* ---------- menu tabs ---------- */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-'+btn.dataset.tab).classList.add('active');
  });
});

/* ---------- game hub tabs (separate from menu tabs above) ---------- */
document.querySelectorAll('.game-tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.game-tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.game-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-'+btn.dataset.game).classList.add('active');
    /* stop whichever game is now hidden, so no background timers keep running */
    if(btn.dataset.game === 'whack' && window.BungBunRunner) window.BungBunRunner.reset();
    if(btn.dataset.game === 'runner' && window.BungBunWhack) window.BungBunWhack.reset();
  });
});

/* ---------- floating sparkles ---------- */
const sparkleGlyphs = ['✧','♡','✿','⋆'];
document.querySelectorAll('.sparkle-field').forEach(field=>{
  const count = 6;
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = sparkleGlyphs[i % sparkleGlyphs.length];
    s.style.left = (8 + Math.random()*84) + '%';
    s.style.top = (8 + Math.random()*84) + '%';
    s.style.animationDelay = (Math.random()*4) + 's';
    s.style.animationDuration = (5 + Math.random()*3) + 's';
    s.style.fontSize = (0.8 + Math.random()*0.9) + 'rem';
    field.appendChild(s);
  }
});

/* ---------- menu data (shared with the order cart — see menu-data.js) ---------- */
const drinks = window.BUNGBUN_MENU.drinks;
const desserts = window.BUNGBUN_MENU.desserts;
function renderMenu(list, gridId){
  const grid = document.getElementById(gridId);
  grid.innerHTML = list.map(item => `
    <div class="menu-card">
      <div class="menu-card-top">
        <div class="menu-icon" style="color:${item.color}">
          <svg><use href="#${item.icon}"/></svg>
        </div>
        <span class="price-pill">฿${item.price}</span>
      </div>
      <h3>${item.name}</h3>
      <p class="desc">${item.desc}</p>
    </div>
  `).join('');
}
renderMenu(drinks, 'grid-drinks');
renderMenu(desserts, 'grid-desserts');

/* =========================================================
   Rabbit portraits — cute "Lolita" style: big sparkly eyes,
   lash flicks, a ribbon bow, and a lace-scalloped collar.
   ========================================================= */
function eyes(){
  return `
    <g>
      <path d="M46 54q4-4 9-2" stroke="#3A2A20" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M82 54q-4-4-9-2" stroke="#3A2A20" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <ellipse cx="52" cy="61" rx="4.6" ry="6.4" fill="#3A2A20"/>
      <ellipse cx="76" cy="61" rx="4.6" ry="6.4" fill="#3A2A20"/>
      <circle cx="53.8" cy="57.5" r="1.7" fill="#fff"/>
      <circle cx="77.8" cy="57.5" r="1.7" fill="#fff"/>
      <circle cx="50.5" cy="63.5" r="1" fill="#fff" opacity=".8"/>
      <circle cx="74.5" cy="63.5" r="1" fill="#fff" opacity=".8"/>
    </g>`;
}
function lace(cy){
  let dots = '';
  for(let x=38; x<=90; x+=8.6){
    dots += `<circle cx="${x}" cy="${cy}" r="4.4" fill="#fff" stroke="#5B3A22" stroke-width="1.1"/>`;
  }
  return `<g opacity=".95">${dots}</g>`;
}
function bow(x, y, color, scale){
  scale = scale || 1;
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <path d="M-13 0 C-13 -7 -3 -7 0 0 C-3 7 -13 7 -13 0Z" fill="${color}" stroke="#5B3A22" stroke-width="1.6"/>
      <path d="M13 0 C13 -7 3 -7 0 0 C3 7 13 7 13 0Z" fill="${color}" stroke="#5B3A22" stroke-width="1.6"/>
      <circle cx="0" cy="0" r="3.4" fill="${color}" stroke="#5B3A22" stroke-width="1.4"/>
    </g>`;
}
function blush(){
  return `<circle cx="45" cy="72" r="6.5" fill="#F3A0AC" opacity=".6"/><circle cx="83" cy="72" r="6.5" fill="#F3A0AC" opacity=".6"/>`;
}
function mouth(){
  return `<path d="M64 68v3.5" stroke="#5B3A22" stroke-width="2" stroke-linecap="round"/>
    <path d="M64 71.5q-4.5 4.5-9 .8M64 71.5q4.5 4.5 9 .8" stroke="#5B3A22" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}
function badge(bg){
  return `<circle cx="64" cy="64" r="62" fill="${bg}" opacity=".45"/><circle cx="64" cy="64" r="56" fill="${bg}"/>`;
}

function bunnyUpright(bg, fur, ear, patch, bowColor){
  return `<svg viewBox="0 0 128 128">
    ${badge(bg)}
    <ellipse cx="42" cy="26" rx="10.5" ry="28" fill="${fur}" stroke="#5B3A22" stroke-width="3" transform="rotate(-16 42 26)"/>
    <ellipse cx="42" cy="28" rx="4.4" ry="18" fill="${ear}" transform="rotate(-16 42 26)"/>
    <ellipse cx="86" cy="26" rx="10.5" ry="28" fill="${fur}" stroke="#5B3A22" stroke-width="3" transform="rotate(16 86 26)"/>
    <ellipse cx="86" cy="28" rx="4.4" ry="18" fill="${ear}" transform="rotate(16 86 26)"/>
    <circle cx="64" cy="72" r="33" fill="${fur}" stroke="#5B3A22" stroke-width="3"/>
    ${patch || ''}
    ${lace(100)}
    ${blush()}
    ${eyes()}
    ${mouth()}
    ${bow(64, 34, bowColor, 1)}
  </svg>`;
}
function bunnyLop(bg, fur, ear, patch, bowColor){
  return `<svg viewBox="0 0 128 128">
    ${badge(bg)}
    <ellipse cx="36" cy="54" rx="9.5" ry="27" fill="${fur}" stroke="#5B3A22" stroke-width="3" transform="rotate(58 36 54)"/>
    <ellipse cx="36" cy="54" rx="3.8" ry="17" fill="${ear}" transform="rotate(58 36 54)"/>
    <ellipse cx="92" cy="54" rx="9.5" ry="27" fill="${fur}" stroke="#5B3A22" stroke-width="3" transform="rotate(-58 92 54)"/>
    <ellipse cx="92" cy="54" rx="3.8" ry="17" fill="${ear}" transform="rotate(-58 92 54)"/>
    <circle cx="64" cy="72" r="33" fill="${fur}" stroke="#5B3A22" stroke-width="3"/>
    ${patch || ''}
    ${lace(100)}
    ${blush()}
    ${eyes()}
    ${mouth()}
    ${bow(46, 42, bowColor, .85)}
  </svg>`;
}

const rabbits = [
  {
    name:"Snow Ice", breed:"เนเธอร์แลนด์ดวอฟ (ND) · สีขาว",
    art: bunnyUpright('#FBE0BC', '#FFFDF8', '#F3A0AC', '', '#F3A0AC'),
    desc:"หวงตัว รักความสะอาด แต่ฮีลใจเก่งแบบเชิดๆ"
  },
  {
    name:"Mochi", breed:"ดัตช์ · สีน้ำตาล-ขาว",
    art: bunnyUpright('#CFDCC6', '#FFFDF8', '#F3A0AC',
      `<path d="M32 78a32 30 0 0 0 64 0Z" fill="#B98756"/>`, '#B39DDB'),
    desc:"ใจดี ขี้อ้อน ติดคนมาก"
  },
  {
    name:"TreeMo", breed:"มินิลอป · สามสี น้ำตาล-ดำ-น้ำตาลแดง",
    art: bunnyLop('#F3A0AC', '#B98756', '#F3A0AC',
      `<path d="M38 54c8-6 17-2 15 8-2 8-15 10-19 2-2-4-1-7 4-10Z" fill="#3A2A20"/>
       <path d="M80 90c10 2 17-6 13-13-4-6-15-4-17 2-2 5 0 9 4 11Z" fill="#A0472E"/>`, '#F0BE4B'),
    desc:"ขี้เล่น ซุกซน ชอบกระโดดวิ่งเล่นทั้งวัน"
  },
  {
    name:"Coco", breed:"ฮอลแลนด์ลอป · สีน้ำตาลช็อกโกแลต",
    art: bunnyLop('#FBE0BC', '#7A4B2E', '#F3A0AC', '', '#FBE0BC'),
    desc:"ขี้อายตอนแรก แต่พอสนิทแล้วน่ารักติดคนสุดๆ"
  },
  {
    name:"Latte", breed:"ไลอ้อนเฮด · สีครีมทอง มีขนฟูรอบคอ",
    art: bunnyUpright('#F0BE4B', '#FCEEDA', '#F3A0AC',
      `<g fill="#FCEEDA" stroke="#5B3A22" stroke-width="1.6">
        <ellipse cx="38" cy="92" rx="8" ry="5.5" transform="rotate(-20 38 92)"/>
        <ellipse cx="49" cy="101" rx="8" ry="5.5" transform="rotate(-8 49 101)"/>
        <ellipse cx="64" cy="104" rx="8" ry="5.5"/>
        <ellipse cx="79" cy="101" rx="8" ry="5.5" transform="rotate(8 79 101)"/>
        <ellipse cx="90" cy="92" rx="8" ry="5.5" transform="rotate(20 90 92)"/>
      </g>`, '#E8687A'),
    desc:"ตื่นเต้นง่าย ชอบวิ่งวนไปมาอย่างร่าเริง"
  },
  {
    name:"Cotton", breed:"อิงลิชแองโกร่า · สีขาวขนฟูยาว",
    art: bunnyUpright('#FCEEDA', '#FFFDF8', '#F3A0AC',
      `<g fill="none" stroke="#EADFCB" stroke-width="2.4" stroke-linecap="round">
        <path d="M33 58q-7 2-7 9"/><path d="M95 58q7 2 7 9"/>
        <path d="M38 96q-5 4-3 10"/><path d="M90 96q5 4 3 10"/>
        <path d="M64 102v10"/>
      </g>`, '#9BC4D6'),
    desc:"นิ่งๆ ขี้เกียจนิดหน่อย ชอบนอนอาบแดดทั้งวัน"
  },
  {
    name:"Choco", breed:"เร็กซ์ · สีน้ำตาลเข้มขนกำมะหยี่",
    art: bunnyUpright('#B39DDB', '#5B3A22', '#8A5A36',
      `<ellipse cx="50" cy="58" rx="6" ry="3" fill="#8A5A36" opacity=".5"/>`, '#F0BE4B'),
    desc:"ฉลาด ขี้สงสัย ชอบสำรวจไปทั่วร้าน"
  },
];
document.getElementById('rabbitGrid').innerHTML = rabbits.map(r => `
  <div class="rabbit-card">
    ${r.art}
    <h3>${r.name}</h3>
    <span class="rabbit-breed">${r.breed}</span>
    <p>${r.desc}</p>
  </div>
`).join('');
