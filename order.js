/* =========================================================
   BungBun うさぎ — customer ordering (writes to Firestore)
   ========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const menu = window.BUNGBUN_MENU;
const cart = {}; // id -> qty

function findItem(id){
  return menu.drinks.find(i=>i.id===id) || menu.desserts.find(i=>i.id===id);
}

function renderOrderList(list, panelId){
  const panel = document.getElementById(panelId);
  panel.innerHTML = list.map(item => `
    <div class="order-row" data-id="${item.id}">
      <div class="order-row-icon" style="color:${item.color}"><svg><use href="#${item.icon}"/></svg></div>
      <div class="order-row-info">
        <h4>${item.name}</h4>
        <span class="order-row-price">฿${item.price}</span>
      </div>
      <div class="order-row-qty">
        <button class="qty-btn" type="button" data-action="dec" aria-label="ลดจำนวน">−</button>
        <span class="qty-count" data-qty="${item.id}">0</span>
        <button class="qty-btn" type="button" data-action="inc" aria-label="เพิ่มจำนวน">+</button>
      </div>
    </div>
  `).join('');
}
renderOrderList(menu.drinks, 'order-panel-drinks');
renderOrderList(menu.desserts, 'order-panel-desserts');

const cartItemsEl = document.getElementById('orderCartItems');
const cartTotalEl = document.getElementById('orderCartTotal');
const submitBtn = document.getElementById('orderSubmitBtn');
const statusMsg = document.getElementById('orderStatusMsg');
const noteInput = document.getElementById('orderNote');

function renderCart(){
  const entries = Object.entries(cart).filter(([,qty]) => qty > 0);
  if(entries.length === 0){
    cartItemsEl.innerHTML = '<p class="order-cart-empty">ยังไม่ได้เลือกเมนูเลยนะ</p>';
    cartTotalEl.textContent = '฿0';
    submitBtn.disabled = true;
    return;
  }
  let total = 0;
  cartItemsEl.innerHTML = entries.map(([id, qty]) => {
    const item = findItem(id);
    const lineTotal = item.price * qty;
    total += lineTotal;
    return `<div class="order-cart-row"><span>${item.name} ×${qty}</span><span>฿${lineTotal}</span></div>`;
  }).join('');
  cartTotalEl.textContent = '฿' + total;
  submitBtn.disabled = false;
}

document.querySelectorAll('.order-row').forEach(row => {
  const id = row.dataset.id;
  row.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = cart[id] || 0;
      const next = btn.dataset.action === 'inc' ? cur + 1 : Math.max(0, cur - 1);
      cart[id] = next;
      row.querySelector('.qty-count').textContent = next;
      statusMsg.textContent = '';
      renderCart();
    });
  });
});

submitBtn.addEventListener('click', async () => {
  const entries = Object.entries(cart).filter(([,qty]) => qty > 0);
  if(entries.length === 0) return;
  submitBtn.disabled = true;
  submitBtn.textContent = 'กำลังส่งออเดอร์...';
  const items = entries.map(([id, qty]) => {
    const item = findItem(id);
    return { name: item.name, qty, price: item.price, lineTotal: item.price * qty };
  });
  const total = items.reduce((s, i) => s + i.lineTotal, 0);
  try{
    await addDoc(collection(db, 'orders'), {
      items, total,
      note: noteInput.value.trim(),
      status: 'new',
      createdAt: serverTimestamp(),
    });
    statusMsg.textContent = '✓ ส่งออเดอร์เรียบร้อย! รอรับที่เคาน์เตอร์ได้เลยนะ';
    statusMsg.className = 'order-status ok';
    Object.keys(cart).forEach(k => cart[k] = 0);
    document.querySelectorAll('.qty-count').forEach(el => el.textContent = '0');
    noteInput.value = '';
    renderCart();
  }catch(err){
    console.error(err);
    statusMsg.textContent = '✗ ส่งออเดอร์ไม่สำเร็จ ลองใหม่อีกครั้งนะ (เช็คว่าตั้งค่า firebase-config.js และ Security Rules เรียบร้อยหรือยัง)';
    statusMsg.className = 'order-status err';
  }
  submitBtn.disabled = false;
  submitBtn.textContent = 'ยืนยันสั่งอาหาร';
});

/* order tabs — kept separate from the menu-showcase tabs and game tabs */
document.querySelectorAll('.order-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.order-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('order-panel-' + btn.dataset.orderTab).classList.add('active');
  });
});
