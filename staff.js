/* =========================================================
   BungBun うさぎ — staff order dashboard
   ========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const STATUS_FLOW = { new: 'making', making: 'done' };
const STATUS_LABEL = { new: 'ออเดอร์ใหม่', making: 'กำลังทำ', done: 'เสร็จแล้ว' };
const STATUS_NEXT_LABEL = { new: 'เริ่มทำ', making: 'ทำเสร็จแล้ว' };

const listEl = document.getElementById('staffOrderList');
const emptyEl = document.getElementById('staffEmpty');
let ordersCache = [];

function fmtTime(ts){
  if(!ts || !ts.toDate) return '--:--';
  return ts.toDate().toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'});
}
function elapsedMinutes(ts){
  if(!ts || !ts.toDate) return 0;
  return Math.max(0, Math.floor((Date.now() - ts.toDate().getTime()) / 60000));
}
function elapsedClass(min){
  if(min >= 10) return 'late';
  if(min >= 5) return 'warn';
  return 'ok';
}

function render(){
  const active = ordersCache.filter(o => o.status !== 'done');
  const done = ordersCache.filter(o => o.status === 'done').slice(0, 10);
  const all = [...active, ...done];

  if(all.length === 0){
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
    emptyEl.textContent = 'ยังไม่มีออเดอร์เข้ามาตอนนี้';
    return;
  }
  emptyEl.style.display = 'none';

  listEl.innerHTML = all.map(o => {
    const min = elapsedMinutes(o.createdAt);
    const itemsHtml = (o.items || []).map(i => `<li>${i.name} ×${i.qty}</li>`).join('');
    const nextLabel = STATUS_NEXT_LABEL[o.status];
    return `
      <div class="staff-order-card status-${o.status}">
        <div class="staff-order-top">
          <span class="staff-order-time">${fmtTime(o.createdAt)} น.</span>
          <span class="staff-elapsed ${elapsedClass(min)}">รอมาแล้ว ${min} นาที</span>
        </div>
        ${o.note ? `<div class="staff-order-note">📝 ${o.note}</div>` : ''}
        <ul class="staff-order-items">${itemsHtml}</ul>
        <div class="staff-order-bottom">
          <span class="staff-order-total">฿${o.total}</span>
          <span class="staff-status-badge">${STATUS_LABEL[o.status] || o.status}</span>
        </div>
        ${nextLabel ? `<button class="btn btn-solid staff-advance-btn" data-id="${o.id}" data-next="${STATUS_FLOW[o.status]}">${nextLabel}</button>` : ''}
        <button class="staff-delete-btn" data-id="${o.id}" type="button">🗑 ลบออเดอร์นี้ (สั่งผิด)</button>
      </div>
    `;
  }).join('');

  listEl.querySelectorAll('.staff-advance-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      try{
        await updateDoc(doc(db, 'orders', btn.dataset.id), { status: btn.dataset.next });
      }catch(err){
        console.error(err);
        btn.disabled = false;
      }
    });
  });

  listEl.querySelectorAll('.staff-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if(!confirm('ลบออเดอร์นี้ทิ้งเลยใช่ไหม? กู้คืนไม่ได้นะ')) return;
      btn.disabled = true;
      try{
        await deleteDoc(doc(db, 'orders', btn.dataset.id));
      }catch(err){
        console.error(err);
        btn.disabled = false;
      }
    });
  });
}

const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
onSnapshot(q, (snap) => {
  ordersCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  render();
}, (err) => {
  console.error(err);
  emptyEl.style.display = 'block';
  emptyEl.textContent = 'เชื่อมต่อฐานข้อมูลไม่สำเร็จ เช็คไฟล์ firebase-config.js และ Security Rules ให้เรียบร้อยก่อนนะ';
});

setInterval(render, 15000); // keep "รอมาแล้ว x นาที" badges fresh

/* ---------- simple PIN gate ----------
   นี่เป็นแค่ตัวกันคนเดินผ่านมากดมั่ว ไม่ใช่ระบบความปลอดภัยจริง
   (รหัสอยู่ในไฟล์นี้ซึ่งใครก็ดูซอร์สโค้ดเห็นได้ อย่าใช้เก็บข้อมูลสำคัญ) */
const STAFF_PIN = '2025'; // เปลี่ยนรหัสตรงนี้ได้เลย
const gate = document.getElementById('staffGate');
const pinInput = document.getElementById('staffPinInput');
const pinBtn = document.getElementById('staffPinBtn');
const pinError = document.getElementById('staffPinError');

function tryUnlock(){
  if(pinInput.value.trim() === STAFF_PIN){
    gate.classList.add('hidden');
    try{ sessionStorage.setItem('bungbun_staff_ok', '1'); }catch(e){}
  }else{
    pinError.textContent = 'รหัสไม่ถูกต้อง ลองใหม่อีกครั้ง';
  }
}
pinBtn.addEventListener('click', tryUnlock);
pinInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') tryUnlock(); });
try{
  if(sessionStorage.getItem('bungbun_staff_ok') === '1') gate.classList.add('hidden');
}catch(e){}
