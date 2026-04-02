// ═══════════════════════════════════════════════════
// STM GEORGIA — data.js  v4 · Firebase cache-first
// ═══════════════════════════════════════════════════
// პრინციპი: Firebase real-time listener → localStorage cache
// ყველა getTours()/getBookings() sync-ად კითხულობს cache-ს
// Firebase ყოველ ცვლილებაზე ახლებს cache-ს + broadcast()
// ═══════════════════════════════════════════════════

const USE_FIREBASE = true;

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCN5wkveTDY88WLs5Gwj8yDN_9LtNvUGQg",
  authDomain:        "stmbus-88ea3.firebaseapp.com",
  databaseURL:       "https://stmbus-88ea3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "stmbus-88ea3",
  storageBucket:     "stmbus-88ea3.appspot.com",
  messagingSenderId: "410533677259",
  appId:             "1:410533677259:web:8ac0a20decd46e325af34e"
};

const KEEPZ_CONFIG = {
  identifier:    "8ebd027a-9e6e-4e42-a7be-05f6a450ef9a",
  integratorId:  "8ebd027a-9e6e-4e42-a7be-05f6a450ef9a",
  receiverId:    "5d7d7e78-ccc8-4fd3-8176-57b94bd7b273",
  receiverType:  "BRANCH",
  rsaPublicKey:  "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwvmJrFwQgzoOf0HAuHBu5got/8Ffd9TIJF9ixr/biOv14/hYffjpwIfdENt28V/Ynt9o+ZUqF2aHEAjMM/qGozQkz08z5X2YbJg1RNsZFmXezS90nbhfpLg+yB0AstIL3labK6rUMVF5Ow22qhV5TuzM/4eo7+b8L8Gpn/yywqkMTMoN9uxaByz3Ssh/6OYPycOeGyI10xsFZeGkgYIowBdP39HAiMwJ5mIpS4RaFj8/FKdkpaUsCIToRXe03bYxS3L/GPUh0qyvETrFdikTYLhVTluyNpxs7/vNBFXUvFuCXmI9G+UpwGOiX9ZOt7BI6Mdf55jY1+5L+oFG4wBS/t4PtBs5mNYbRL2+ff1FK7iXaCYwuFW30z28GeQbM4hVMhv0D38uz4KayyyOTHyP/DB6W3HcLSK+Amkbj6BTkqe1BkrKr2XQLsFfWShqkQM45Bp77L0f2RfHtTD+11a9S6xUqSF+98U0vrnRf9JsIVdQUy7X0uhN3JnZxGHa1vaEegzldIcRPzVFuyz0WyXMNWUrKHUtuh2TBR7cc1cJoQ1lUmHVlIai0rN1hZzrGOGLGoTpbWXdhe9g+q2LrvwiSbVsRZE9fwMvRlkjjCTkMe1FBWMan4u+xtMXY286AfXzh+d9ZSOHCocCysoe2Yr/KCu8O5WjBQk4UeQkacStfFsCAwEAAQ==",
  rsaPrivateKey: "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",
  baseUrl:       "https://gateway.keepz.me/ecommerce-service/api/integrator",
  returnUrl:     window.location.origin + "/booking.html",
  cancelUrl:     window.location.origin + "/booking.html"
};
window.KEEPZ_CONFIG = KEEPZ_CONFIG;

const SMS_API_KEY  = "1ebee65be31c48af7e3d9dee780989036926bfbd";
const SMS_BRAND_ID = "1";
const ADMIN_PHONE  = "995591215155";

const STM = (function(){

  function lsGet(k){ try{ return JSON.parse(localStorage.getItem('stm_'+k)||'null'); }catch{ return null; } }
  function lsSet(k,v){ localStorage.setItem('stm_'+k, JSON.stringify(v)); }
  function lsDel(k){ localStorage.removeItem('stm_'+k); }

  // ══ USERS ══
  function getUsers(){
    const stored = lsGet('users');
    if(stored && stored.length) return stored;
    // Default admin user — change password after first login!
    return [
      {id:1, username:'admin', password:'admin123', displayName:'ადმინი', role:'admin', active:true},
      {id:2, username:'cashier1', password:'cashier123', displayName:'მოლარე 1', role:'cashier', active:true}
    ];
  }
  function saveUsers(arr){ lsSet('users', arr); broadcast(); }
  function addUser(u){ const arr=getUsers(); arr.push({...u, id:Date.now()}); saveUsers(arr); }
  function deleteUser(id){ saveUsers(getUsers().filter(u=>u.id!==id)); }
  function updateUser(id, changes){
    const arr=getUsers();
    const i=arr.findIndex(u=>u.id===id);
    if(i>-1){ arr[i]={...arr[i],...changes}; saveUsers(arr); }
  }

  // ══ SESSION ══
  function getSession(){
    try{ return JSON.parse(sessionStorage.getItem('stm_session')||'null'); }catch{ return null; }
  }
  function requireAuth(requiredRole){
    const sess = getSession();
    if(!sess){ window.location.href='login.html'; return null; }
    if(requiredRole==='admin' && sess.role!=='admin'){ window.location.href='login.html'; return null; }
    return sess;
  }
  function logout(){ sessionStorage.removeItem('stm_session'); window.location.href='login.html'; }

  let _bc = null;
  try{ _bc = new BroadcastChannel('stm_sync'); }catch(_){}
  function broadcast(){ if(_bc) _bc.postMessage({ts:Date.now()}); }

  let _db = null;
  function getDb(){
    if(_db) return _db;
    if(!USE_FIREBASE) return null;
    try{
      if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      _db = firebase.database();
    }catch(e){ console.error('[STM] Firebase init:', e); }
    return _db;
  }

  async function fbSet(path, val){
    const db = getDb();
    if(db) await db.ref(path).set(val);
  }
  async function fbRemove(path){
    const db = getDb();
    if(db) await db.ref(path).remove();
  }

  // ── Firebase real-time → cache ──
  function initFirebaseListeners(){
    const db = getDb();
    if(!db){ console.warn('[STM] No Firebase DB'); return; }

    db.ref('tours').on('value', snap => {
      const raw = snap.val();
      lsSet('tours', raw ? Object.values(raw) : []);
      broadcast();
    });

    db.ref('bookings').on('value', snap => {
      const raw = snap.val();
      lsSet('bookings', raw ? Object.values(raw) : []);
      broadcast();
    });

    db.ref('buses').on('value', snap => {
      if(snap.val()) lsSet('buses', snap.val());
      broadcast();
    });

    db.ref('alert').on('value', snap => {
      if(snap.val()) lsSet('alert', snap.val());
      else lsDel('alert');
      broadcast();
    });

    console.log('[STM] Firebase listeners active');
  }

  // ══ TOURS — sync reads from cache ══
  function getTours(){ return lsGet('tours') || []; }

  async function saveTours(arr){
    lsSet('tours', arr); broadcast();
    if(USE_FIREBASE){
      const obj = {}; arr.forEach(t => { obj[String(t.id)] = t; });
      await fbSet('tours', obj);
    }
  }

  async function addTour(t){
    const arr = getTours(); arr.push(t); await saveTours(arr);
  }
  async function deleteTour(id){
    await saveTours(getTours().filter(t => t.id !== id));
  }
  async function updateTour(id, changes){
    const arr = getTours();
    const i = arr.findIndex(t => t.id === id);
    if(i > -1){ arr[i] = {...arr[i], ...changes}; await saveTours(arr); }
  }

  // ══ BOOKINGS — sync reads from cache ══
  function getBookings(){ return lsGet('bookings') || []; }

  async function saveBookings(arr){
    lsSet('bookings', arr); broadcast();
    if(USE_FIREBASE){
      const obj = {}; arr.forEach(b => { obj[b.code] = b; });
      await fbSet('bookings', obj);
    }
  }

  async function addBooking(b){
    const arr = getBookings(); arr.push(b);
    lsSet('bookings', arr); broadcast();
    if(USE_FIREBASE) await fbSet('bookings/'+b.code, b);
  }

  async function deleteBooking(code){
    const b = getBookings().find(b => b.code === code);
    if(b && b.tourId && b.busId){
      const tours = getTours();
      const t = tours.find(t => t.id === b.tourId);
      if(t){
        const key = 'seats_taken_bus'+b.busId;
        if(t[key]) t[key] = t[key].filter(s => !(b.seats||[]).includes(s));
        await saveTours(tours);
      }
    }
    await saveBookings(getBookings().filter(b => b.code !== code));
    if(USE_FIREBASE) await fbRemove('bookings/'+code);
  }

  async function markUsed(code){
    const arr = getBookings();
    const b = arr.find(b => b.code === code);
    if(b){ b.used = true; lsSet('bookings', arr); broadcast(); }
    if(USE_FIREBASE) await fbSet('bookings/'+code+'/used', true);
  }

  // ══ BUSES ══
  function getBuses(){
    return lsGet('buses') || [
      {id:1, name:'ავტობუსი 1', plate:'', active:true},
      {id:2, name:'ავტობუსი 2', plate:'', active:true}
    ];
  }
  async function saveBuses(arr){
    lsSet('buses', arr); broadcast();
    if(USE_FIREBASE) await fbSet('buses', arr);
  }

  // ══ ALERT ══
  function getAlert(){ return lsGet('alert'); }
  async function setAlert(msg){
    lsSet('alert', msg); broadcast();
    if(USE_FIREBASE) await fbSet('alert', msg);
  }
  async function clearAlert(){
    lsDel('alert'); broadcast();
    if(USE_FIREBASE) await fbRemove('alert');
  }

  // ══ SMS LOG ══
  function getSmsLog(){ return lsGet('smslog') || []; }
  function addSmsLog(e){ const a=getSmsLog(); a.push(e); lsSet('smslog',a); }

  // ══ TAKEN SEATS — computed from bookings cache ══
  function getTakenSeats(tourId, busId){
    const taken = new Set();
    getBookings().forEach(b => {
      if(b.tourId === tourId && b.busId === busId && !b.cancelled)
        (b.seats||[]).forEach(s => taken.add(s));
    });
    return [...taken];
  }

  // ══ UTILS ══
  function genCode(){ return 'STM-' + Math.floor(1000+Math.random()*9000); }

  function sendSMS(phone, text, code){
    const clean = String(phone).replace(/[^0-9]/g,'');
    const num = clean.startsWith('995') ? clean : '995'+clean;
    fetch(`https://api.ubill.dev/v1/sms/send?key=${SMS_API_KEY}&brandID=${SMS_BRAND_ID}&numbers=${num}&text=${encodeURIComponent(text)}&stopList=false`).catch(()=>{});
    addSmsLog({time:new Date().toLocaleString('ka-GE'), number:phone, code, text, ok:true});
  }

  function onSync(cb){
    if(_bc) _bc.onmessage = ()=>cb();
    window.addEventListener('storage', ()=>cb());
  }

  // ══ KEEPZ — AES-256-CBC + RSA-OAEP (Web Crypto API) ══

  function keepzConfigured() {
    const c = KEEPZ_CONFIG;
    return c.identifier && !c.identifier.startsWith('KEEPZ') &&
           c.integratorId && !c.integratorId.startsWith('KEEPZ') &&
           c.receiverId && !c.receiverId.startsWith('KEEPZ') &&
           c.rsaPublicKey && c.rsaPublicKey.length > 20;
  }

  function b64ToUint8(b64) {
    // clean PEM-style whitespace/newlines before atob
    const clean = b64.replace(/[\r\n\s]/g, '');
    return Uint8Array.from(atob(clean), c => c.charCodeAt(0));
  }

  async function keepzEncrypt(payload) {
    if (!keepzConfigured()) throw new Error('Keepz config არ არის შევსებული');
    const enc = new TextEncoder();
    const aesKey = await crypto.subtle.generateKey({name:'AES-CBC', length:256}, true, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const cipher = await crypto.subtle.encrypt({name:'AES-CBC', iv}, aesKey,
      enc.encode(JSON.stringify(payload)));
    const encData = btoa(String.fromCharCode(...new Uint8Array(cipher)));
    const rawKey = await crypto.subtle.exportKey('raw', aesKey);
    const keyIvStr = btoa(String.fromCharCode(...new Uint8Array(rawKey))) + '.'
                   + btoa(String.fromCharCode(...iv));
    const pubDer = b64ToUint8(KEEPZ_CONFIG.rsaPublicKey);
    const rsaKey = await crypto.subtle.importKey('spki', pubDer,
      {name:'RSA-OAEP', hash:'SHA-256'}, false, ['encrypt']);
    const encKeysBuf = await crypto.subtle.encrypt({name:'RSA-OAEP'}, rsaKey, enc.encode(keyIvStr));
    const encKeys = btoa(String.fromCharCode(...new Uint8Array(encKeysBuf)));
    return { encryptedData: encData, encryptedKeys: encKeys, aes: true };
  }

  async function keepzDecrypt(resp) {
    if (!resp.encryptedData) return resp;
    if (!KEEPZ_CONFIG.rsaPrivateKey || KEEPZ_CONFIG.rsaPrivateKey.startsWith('KEEPZ')) return resp;
    try {
      const rsaPriv = await crypto.subtle.importKey('pkcs8', b64ToUint8(KEEPZ_CONFIG.rsaPrivateKey),
        {name:'RSA-OAEP', hash:'SHA-256'}, false, ['decrypt']);
      const keyIvRaw = await crypto.subtle.decrypt({name:'RSA-OAEP'}, rsaPriv,
        b64ToUint8(resp.encryptedKeys));
      const [kb64, ivb64] = new TextDecoder().decode(keyIvRaw).split('.');
      const aesKey = await crypto.subtle.importKey('raw', b64ToUint8(kb64),
        {name:'AES-CBC'}, false, ['decrypt']);
      const plain = await crypto.subtle.decrypt({name:'AES-CBC', iv: b64ToUint8(ivb64)},
        aesKey, b64ToUint8(resp.encryptedData));
      return JSON.parse(new TextDecoder().decode(plain));
    } catch(e) { console.warn('[Keepz decrypt]', e); return resp; }
  }

  async function keepzCreateOrder(amount, orderId) {
    if (!keepzConfigured()) throw new Error('Keepz config არ არის შევსებული');
    const payload = {
      amount: amount,
      receiverId: KEEPZ_CONFIG.receiverId,
      receiverType: KEEPZ_CONFIG.receiverType,
      integratorId: KEEPZ_CONFIG.integratorId,
      integratorOrderId: orderId,
      currency: 'GEL',
      successRedirectUri: KEEPZ_CONFIG.returnUrl + '?order=' + orderId + '&status=success',
      failRedirectUri: KEEPZ_CONFIG.cancelUrl + '?order=' + orderId + '&status=cancel'
    };
    const enc = await keepzEncrypt(payload);
    const r = await fetch('/.netlify/functions/keepz-pay', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ identifier: KEEPZ_CONFIG.identifier, ...enc })
    });
    const txt = await r.text();
    let resp = {};
    try { resp = JSON.parse(txt || '{}'); } catch (e) { throw new Error('Keepz ცარიელი ან არასწორი პასუხი'); }
    if (!r.ok) throw new Error(resp.message || resp.error || ('Keepz HTTP ' + r.status));
    if (resp.message) throw new Error('Keepz: ' + resp.message);
    const data = await keepzDecrypt(resp);
    return data;
  }

  async function keepzCheckOrder(orderId) {
    if (!keepzConfigured()) return { status: 'UNKNOWN' };
    const enc = await keepzEncrypt({ integratorOrderId: orderId });
    const r = await fetch('/.netlify/functions/keepz-status', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ identifier: KEEPZ_CONFIG.identifier, ...enc })
    });
    const txt = await r.text();
    let resp = {};
    try { resp = JSON.parse(txt || '{}'); } catch (e) { throw new Error('Keepz status ცარიელი პასუხი'); }
    if (!r.ok) throw new Error(resp.message || resp.error || ('Keepz status ' + r.status));
    return await keepzDecrypt(resp);
  }

  // ══ i18n ══
  const i18n = {
    ka:{ tickets:'ბილეთები', tours:'ტურები', check:'ბილეთის შემოწმება', selectDate:'აირჩიეთ მგზავრობის თარიღი', selectTour:'აირჩიეთ ტური', selectBus:'აირჩიეთ ავტობუსი', ticketType:'ბილეთის ტიპი', selectSeat:'ადგილის არჩევა', passengerInfo:'მგზავრის ინფო', payment:'გადახდა', next:'შემდეგი →', back:'← უკან', standard:'სტანდარტული', child:'ბავშვი', adultDesc:'18+ წელი', childDesc:'18 წლამდე', firstName:'სახელი', lastName:'გვარი', passport:'პასპ. №', phone:'ტელ.', free:'თავისუფალი', selected:'არჩეული', taken:'დაჯავშნული', total:'სულ', pay:'💳 გადახდა', yes:'კი, გადავიხადო', confirmQ:'⚠️ სწორედ აირჩიეთ ადგილები?', changeSeats:'← ადგილები შევცვალო', success:'გადახდა წარმატებულია!', smsSent:'SMS გაიგზავნა', print:'🖨️ ბეჭდვა', newBooking:'+ ახალი', from:'საიდან', to:'სად', date:'თარიღი', seats:'ადგ.', passenger:'მგზავრი', busDisabled:'ავტობუსი გათიშულია', showCode:'წარუდგინეთ კოდი მძღოლს', cardNum:'ბარათის ნომ.', expire:'ვადა', notFound:'ბილეთი ვერ მოიძებნა', used:'გამოყენებული', active:'აქტიური', duration:'ხანგ.', needSeats:'გჭირდებათ {n} ადგილი', onlyN:'მხოლოდ {n} ადგილი', fillPax:'შეავსეთ მგზ. {n}', surnameNoMatch:'გვარი არ ემთხვევა' },
    en:{ tickets:'Tickets', tours:'Tours', check:'Ticket Check', selectDate:'Select Travel Date', selectTour:'Select Tour', selectBus:'Select Bus', ticketType:'Ticket Type', selectSeat:'Select Seat', passengerInfo:'Passenger Info', payment:'Payment', next:'Next →', back:'← Back', standard:'Standard', child:'Child', adultDesc:'18+ years', childDesc:'Under 18', firstName:'First Name', lastName:'Last Name', passport:'Passport No.', phone:'Phone', free:'Available', selected:'Selected', taken:'Booked', total:'Total', pay:'💳 Pay', yes:'Yes, Pay Now', confirmQ:'⚠️ Confirm seats?', changeSeats:'← Change Seats', success:'Payment Successful!', smsSent:'SMS sent', print:'🖨️ Print', newBooking:'+ New', from:'From', to:'To', date:'Date', seats:'Seat(s)', passenger:'Passenger', busDisabled:'Bus disabled', showCode:'Present code to driver', cardNum:'Card Number', expire:'Expiry', notFound:'Ticket not found', used:'Used', active:'Active', duration:'Duration', needSeats:'Need {n} seat(s)', onlyN:'Only {n}', fillPax:'Fill passenger {n}', surnameNoMatch:'Surname mismatch' },
    ru:{ tickets:'Билеты', tours:'Туры', check:'Проверка билета', selectDate:'Выберите дату', selectTour:'Выберите тур', selectBus:'Выберите автобус', ticketType:'Тип билета', selectSeat:'Выбор места', passengerInfo:'Данные пассажира', payment:'Оплата', next:'Далее →', back:'← Назад', standard:'Стандартный', child:'Детский', adultDesc:'18+ лет', childDesc:'До 18 лет', firstName:'Имя', lastName:'Фамилия', passport:'Паспорт', phone:'Телефон', free:'Свободно', selected:'Выбрано', taken:'Занято', total:'Итого', pay:'💳 Оплатить', yes:'Да, оплатить', confirmQ:'⚠️ Подтвердите места?', changeSeats:'← Изменить', success:'Оплата прошла!', smsSent:'SMS отправлено', print:'🖨️ Печать', newBooking:'+ Новое', from:'Откуда', to:'Куда', date:'Дата', seats:'Место(а)', passenger:'Пассажир', busDisabled:'Автобус отключён', showCode:'Предъявите код водителю', cardNum:'Номер карты', expire:'Срок', notFound:'Билет не найден', used:'Использован', active:'Активный', duration:'Длит.', needSeats:'Нужно {n} мест', onlyN:'Только {n}', fillPax:'Заполните пасс. {n}', surnameNoMatch:'Фамилия не совпадает' }
  };

  function t(key, lang, vars){
    lang=lang||'ka';
    let s=(i18n[lang]||i18n.ka)[key]||key;
    if(vars) Object.keys(vars).forEach(k=>{ s=s.replace('{'+k+'}',vars[k]); });
    return s;
  }

  function smsText(booking, lang){
    lang=lang||'ka';
    const p=booking.passengers[0];
    const m={
      ka:`STM GEORGIA — ბილეთი\nკოდი: ${booking.code}\n${booking.tour}\n${booking.from} → ${booking.to}\nთარ: ${booking.date} | ${booking.busName}\nმგზ: ${p.name} ${p.surname}\nადგ: ${(booking.seats||[]).join(', ')}\nსულ: ${booking.total}₾\nწარუდგინეთ კოდი მძღოლს`,
      en:`STM GEORGIA — Ticket\nCode: ${booking.code}\n${booking.tour}\n${booking.from}→${booking.to}\nDate: ${booking.date} | ${booking.busName}\nPax: ${p.name} ${p.surname}\nSeats: ${(booking.seats||[]).join(', ')}\nTotal: ${booking.total}₾\nPresent code to driver`,
      ru:`STM GEORGIA — Билет\nКод: ${booking.code}\n${booking.tour}\n${booking.from}→${booking.to}\nДата: ${booking.date} | ${booking.busName}\nПасс: ${p.name} ${p.surname}\nМеста: ${(booking.seats||[]).join(', ')}\nИтого: ${booking.total}₾\nПредъявите код водителю`
    };
    return m[lang]||m.ka;
  }

  // ── Firebase-ის ჩართვა ──
  if(USE_FIREBASE){
    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded', ()=>setTimeout(initFirebaseListeners, 150));
    } else {
      setTimeout(initFirebaseListeners, 150);
    }
  }

  return {
    getUsers, saveUsers, addUser, deleteUser, updateUser,
    getSession, requireAuth, logout,
    getTours, saveTours, addTour, deleteTour, updateTour,
    getBookings, saveBookings, addBooking, deleteBooking, markUsed,
    getTakenSeats,
    getBuses, saveBuses,
    getAlert, setAlert, clearAlert,
    getSmsLog,
    genCode, sendSMS, onSync, broadcast,
    keepzCreateOrder, keepzCheckOrder,
    t, smsText,
    get useFirebase(){ return USE_FIREBASE; },
    get keepzConfig(){ return KEEPZ_CONFIG; }
  };
})();
window.STM = STM;
