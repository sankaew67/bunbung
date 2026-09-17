/* =========================================================
   BungBun うさぎ — shared menu data
   Both script.js (menu showcase) and order.js (ordering cart)
   read from this single source so prices/items never drift apart.
   ========================================================= */
window.BUNGBUN_MENU = {
  drinks: [
    {id:"d1", name:"Honey Bunny Latte", price:95, icon:"ic-mug", color:"var(--peach)", desc:"ลาเต้นุ่มละมุน หวานหอมน้ำผึ้ง"},
    {id:"d2", name:"Bloom Matcha Latte", price:110, icon:"ic-mug", color:"var(--sage)", desc:"มัทฉะหอมเข้ม ผสมนมสดละมุน"},
    {id:"d3", name:"Cocoa Bunny Hug", price:100, icon:"ic-mug", color:"var(--brown-soft)", desc:"โกโก้เข้มข้น ราดวิปครีมนุ่มฟู เหมือนโดนกระต่ายกอด"},
    {id:"d4", name:"Peach Bloom Tea", price:90, icon:"ic-teacup", color:"var(--peach)", desc:"ชาพีชหอมหวาน เสิร์ฟเย็นชื่นใจ"},
    {id:"d5", name:"Caramel Carrot Latte", price:105, icon:"ic-glass", color:"var(--yellow)", desc:"ลาเต้คาราเมลหอมกรุ่น ตัดรสด้วยฟองนมนุ่ม"},
    {id:"d6", name:"Vanilla Cloud Frappe", price:115, icon:"ic-glass", color:"var(--peach-light)", desc:"เฟรปเป้วานิลลาเนียนนุ่ม ราดครีมฟูเหมือนก้อนเมฆ"},
    {id:"d7", name:"Lavender Milk Bun", price:100, icon:"ic-mug", color:"var(--lavender)", desc:"นมสดกลิ่นลาเวนเดอร์ หอมผ่อนคลาย"},
    {id:"d8", name:"Blueberry Bunny Soda", price:95, icon:"ic-soda", color:"var(--sky)", desc:"โซดาบลูเบอร์รี่สดชื่น สีสวยละมุนตา"},
    {id:"d9", name:"Rose Milk Tea", price:100, icon:"ic-teacup", color:"var(--pink)", desc:"ชานมกลิ่นกุหลาบ หอมนุ่มละมุน"},
    {id:"d10", name:"Hazelnut Bloom Mocha", price:115, icon:"ic-mug", color:"var(--brown-soft)", desc:"มอคค่าเฮเซลนัทเข้มข้น กลมกล่อมทุกอึก"},
    {id:"d11", name:"Coconut Matcha Cooler", price:110, icon:"ic-jar", color:"var(--sage)", desc:"มัทฉะเย็นตัดกับความมันหอมของกะทิ"},
    {id:"d12", name:"Butterfly Pea Bun Fizz", price:90, icon:"ic-soda", color:"var(--lavender)", desc:"โซดาอัญชันสีฟ้าสวย เปลี่ยนสีเมื่อบีบมะนาว"},
  ],
  desserts: [
    {id:"s1", name:"Strawberry Cloud Cake", price:145, icon:"ic-cake", color:"var(--pink)", desc:"เค้กเนื้อนุ่ม ครีมสดและสตรอว์เบอร์รี"},
    {id:"s2", name:"Carrot Bunny Cake", price:130, icon:"ic-cake", color:"var(--peach)", desc:"เค้กแครอทเนื้อนุ่ม หน้าครีมชีสแต่งลายหูกระต่าย"},
    {id:"s3", name:"Mochi Cloud Puff", price:85, icon:"ic-dango", color:"var(--peach-light)", desc:"โมจินุ่มไส้ครีมสด กัดแล้วฟูละลายปาก"},
    {id:"s4", name:"Matcha Bunny Roll", price:120, icon:"ic-roll", color:"var(--sage)", desc:"เค้กโรลมัทฉะ ไส้ครีมสดหอมนุ่ม"},
    {id:"s5", name:"Honey Bloom Cookies", price:70, icon:"ic-cookie", color:"var(--yellow)", desc:"คุกกี้เนยหอมน้ำผึ้ง กรอบนอกนุ่มใน"},
    {id:"s6", name:"Berry Bunny Tart", price:135, icon:"ic-tart", color:"var(--pink-deep)", desc:"ทาร์ตครีมสดหน้าเบอร์รี่รวม เปรี้ยวหวานกำลังดี"},
  ],
};
