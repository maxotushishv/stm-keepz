// ═══════════════════════════════════════════════════
// STM GEORGIA — print.js
// Bixolon canvas→bitmap ბეჭდვა
// realizacia.html-დან ამოღებული და STM-ისთვის ადაპტირებული
// საჭირო ფაილები: js/bxlcommon.js, js/bxlpos.js
// ═══════════════════════════════════════════════════

var STM_PRINT = (function(){

  var GEO_FONT = "'Noto Sans Georgian', Arial, sans-serif";
  var _issueId = 1;

  function getPrinterName(){
    return localStorage.getItem('bxl_printer') || 'Printer1';
  }
  function setPrinterName(name){
    localStorage.setItem('bxl_printer', name);
  }

  // ── wrap helper ──
  function wrapLines(ctx, text, maxW){
    var words = String(text).split(' ');
    var lines = [], cur = '';
    for(var i=0;i<words.length;i++){
      var t2 = cur ? cur+' '+words[i] : words[i];
      if(ctx.measureText(t2).width > maxW && cur){ lines.push(cur); cur=words[i]; }
      else cur = t2;
    }
    if(cur) lines.push(cur);
    return lines.length ? lines : [String(text)];
  }

  // ════════════════════════════════════════
  // TICKET CANVAS — ბილეთის ქვითარი
  // ════════════════════════════════════════
  function buildTicketCanvas(booking, lang){
    var W = 530; // 80mm Bixolon printable area
    var PAD = 10;
    lang = lang||'ka';

    var labels = {
      ka:{ co:'შპს სტმ ჯორჯია', sn:'ს/ნ: 405003302', tit:'სტმ ჯორჯია', sub:'STM Georgia', ticket:'მგზავრობის ბილეთი', from:'საიდან', to:'სად', date:'თარიღი', bus:'ავტობუსი', seat:'ადგილ(ები)', pass:'პასპ. №', phone:'ტელ.', total:'სულ', note:'ბილეთის კოდი წარუდგინეთ მძღოლს', pax:'მგზავრი', site:'stm-bus.ge' },
      en:{ co:'STM Georgia LLC', sn:'ID: 405003302', tit:'STM GEORGIA', sub:'Bus Ticket', ticket:'Bus Travel Ticket', from:'From', to:'To', date:'Date', bus:'Bus', seat:'Seat(s)', pass:'Passport', phone:'Phone', total:'Total', note:'Present code to driver', pax:'Passenger', site:'stm-bus.ge' },
      ru:{ co:'ООО СТМ Джорджия', sn:'ID: 405003302', tit:'СТМ ДЖОРДЖИЯ', sub:'STM Georgia', ticket:'Билет на автобус', from:'Откуда', to:'Куда', date:'Дата', bus:'Автобус', seat:'Место(а)', pass:'Паспорт', phone:'Тел.', total:'Итого', note:'Предъявите код водителю', pax:'Пассажир', site:'stm-bus.ge' }
    };
    var L = labels[lang]||labels.ka;

    // ── measure pass ──
    var tmpC = document.createElement('canvas');
    tmpC.width = W; tmpC.height = 4000;
    var tmpX = tmpC.getContext('2d');

    function draw(ctx, doRender){
      if(doRender){
        ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,ctx.canvas.height);
        ctx.fillStyle='#000';
      }
      var y = 20;
      function sf(size,bold){ ctx.font=(bold?'900 ':'400 ')+size+'px '+GEO_FONT; }
      function txt(text,size,bold,align){
        sf(size,bold);
        var lines = wrapLines(ctx,String(text),W-PAD*2);
        var x = align==='center'?W/2 : align==='right'?W-PAD : PAD;
        ctx.textAlign = align||'left';
        for(var li=0;li<lines.length;li++){
          if(doRender) ctx.fillText(lines[li],x,y+size);
          y += size+8;
        }
        y += 4;
      }
      function sep(dashed){
        if(doRender){
          if(dashed){
            ctx.save(); ctx.setLineDash([5,4]);
            ctx.beginPath(); ctx.moveTo(PAD,y+2); ctx.lineTo(W-PAD,y+2);
            ctx.strokeStyle='#000'; ctx.lineWidth=1.5; ctx.stroke(); ctx.restore();
          } else {
            ctx.fillStyle='#000'; ctx.fillRect(PAD,y,W-PAD*2,2); ctx.fillStyle='#000';
          }
        }
        y += 12;
      }
      function row(left,right,size,bold){
        sf(size,bold);
        var rw = ctx.measureText(String(right)).width + PAD+8;
        var ll = wrapLines(ctx,String(left),W-PAD*2-rw-4);
        if(doRender){
          ctx.textAlign='left';  ctx.fillText(ll[0],PAD,y+size);
          ctx.textAlign='right'; ctx.fillText(String(right),W-PAD-4,y+size);
        }
        y += size+8; y += 4;
        for(var li=1;li<ll.length;li++){
          if(doRender){ ctx.textAlign='left'; ctx.fillText('  '+ll[li],PAD,y+size); }
          y += size+8;
        }
      }

      // ── HEADER ──
      txt(L.tit, 30, true, 'center');
      txt(L.sub, 22, false, 'center');
      sep(false);

      // ── TICKET CODE ──
      txt(booking.code, 44, true, 'center');
      sep(false);

      // ── COMPANY ──
      txt(L.co, 20, true, 'left');
      txt(L.sn, 18, false, 'left');
      sep(true);

      // ── PASSENGERS ──
      booking.passengers.forEach(function(p,i){
        txt(L.pax+' '+(i+1)+': '+p.name+' '+p.surname, 19, true, 'left');
        row(L.pass+':', p.passport||p.pid||'-', 18, false);
        row(L.phone+':', p.phone, 18, false);
        row(L.seat+':', p.seat, 18, true);
        if(i < booking.passengers.length-1) sep(true);
      });
      sep(false);

      // ── ROUTE ──
      row(L.from+':', booking.from, 18, false);
      row(L.to+':', booking.to, 18, false);
      row(L.date+':', booking.date, 18, false);
      row(L.bus+':', booking.busName||'-', 18, false);
      row((booking.seats||[]).join(', ')!==''?L.seat+':':'', (booking.seats||[]).join(', '), 20, false);
      sep(true);

      // ── TOTAL ──
      row(L.total+':', booking.total+' ₾', 26, true);
      sep(true);

      // ── FOOTER ──
      txt(L.note, 16, false, 'center');
      txt(L.site, 15, false, 'center');
      y += 20;
      return y;
    }

    var h = draw(tmpX, false);
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = h + 40;
    var ctx = canvas.getContext('2d');
    draw(ctx, true);
    return canvas;
  }

  // ════════════════════════════════════════
  // PASSENGER LIST CANVAS — მგზავრთა სია
  // ════════════════════════════════════════
  function buildPaxListCanvas(tour, bookings, busId, driver, plate){
    // A4-like wide canvas for full list
    var W = 530;
    var PAD = 8;

    var tmpC = document.createElement('canvas');
    tmpC.width = W; tmpC.height = 8000;
    var tmpX = tmpC.getContext('2d');

    // collect passengers
    var allPax = [];
    bookings.forEach(function(b){
      if(b.tourId !== tour.id) return;
      if(busId > 0 && b.busId !== busId) return;
      (b.passengers||[]).forEach(function(p){
        allPax.push({
          name: p.name, surname: p.surname,
          passport: p.passport||p.pid||'',
          seat: p.seat, code: b.code,
          dest: b.to
        });
      });
    });
    allPax.sort(function(a,b){ return (a.seat||0)-(b.seat||0); });

    function draw(ctx, doRender){
      if(doRender){
        ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,ctx.canvas.height);
        ctx.fillStyle='#000';
      }
      var y = 20;
      function sf(sz,bold){ ctx.font=(bold?'900 ':'400 ')+sz+'px '+GEO_FONT; }
      function txt(t,sz,bold,align){
        sf(sz,bold);
        var x = align==='center'?W/2 : align==='right'?W-PAD : PAD;
        ctx.textAlign=align||'left';
        if(doRender) ctx.fillText(String(t),x,y+sz);
        y+=sz+8;
      }
      function sep(){
        if(doRender){ ctx.fillStyle='#000'; ctx.fillRect(PAD,y,W-PAD*2,1.5); ctx.fillStyle='#000'; }
        y+=10;
      }
      function dsep(){
        if(doRender){
          ctx.save(); ctx.setLineDash([4,4]);
          ctx.beginPath(); ctx.moveTo(PAD,y+1); ctx.lineTo(W-PAD,y+1);
          ctx.strokeStyle='#000'; ctx.lineWidth=1; ctx.stroke(); ctx.restore();
        }
        y+=8;
      }

      // HEADER
      txt('СПИСОК ПАССАЖИРОВ / მგზავრთა სია', 26, true, 'center');
      txt('STM GEORGIA / შპს სტმ გრუპი', 20, false, 'center');
      txt('ს/ნ 405003302', 18, false, 'center');
      sep();

      var now = new Date();
      var ds = now.getDate().toString().padStart(2,'0')+'.'+(now.getMonth()+1).toString().padStart(2,'0')+'.'+now.getFullYear().toString().slice(-2);
      txt('Маршрут / ტური: '+tour.name, 20, true, 'left');
      txt('Дата / თარ: '+ds+'  |  Авт: '+(plate||'____________'), 19, false, 'left');
      txt('Водитель 1 / მძღ: '+(driver||'____________________'), 19, false, 'left');
      txt('Водитель 2: ____________________', 19, false, 'left');
      sep();

      // TABLE HEADER
      sf(17,true);
      ctx.textAlign='left';
      if(doRender){
        ctx.fillText('№', PAD, y+17);
        ctx.fillText('Имя, Фамилия / სახ., გვ.', PAD+30, y+17);
        ctx.fillText('Паспорт', PAD+290, y+17);
        ctx.fillText('Место', PAD+430, y+17);
        ctx.fillText('Билет', PAD+490, y+17);
      }
      y+=17+8; sep();

      // ROWS
      var totalRows = Math.max(allPax.length, 30);
      for(var i=0;i<totalRows;i++){
        var p = allPax[i]||null;
        sf(16,false);
        ctx.textAlign='left';
        if(doRender){
          ctx.fillText(String(i+1), PAD, y+16);
          if(p){
            ctx.fillText(p.surname+' '+p.name, PAD+30, y+16);
            ctx.fillText(p.passport, PAD+290, y+16);
            ctx.fillText(String(p.seat||''), PAD+430, y+16);
            sf(14,false); ctx.fillText(p.code, PAD+490, y+16);
          }
        }
        y += 16+8;
        dsep();
      }

      sep();
      txt('Пассажир / მგზ: ____________________', 18, false, 'left');
      txt('Водитель / მძღ: ____________________', 18, false, 'left');
      txt('Печать / ბეჭ: ___________', 18, false, 'left');
      y += 20;
      return y;
    }

    var h = draw(tmpX, false);
    var canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = h + 40;
    draw(canvas.getContext('2d'), true);
    return canvas;
  }

  // ════════════════════════════════════════
  // SEND TO BIXOLON
  // ════════════════════════════════════════
  function bixolonSendCanvas(canvas){
    return new Promise(function(resolve, reject){
      try {
        var imgData = canvas.toDataURL();
        setPosId(_issueId);
        checkPrinterStatus();
        printBitmap(imgData, -2, 1, false);
        printText('\n\n\n', 0,0,false,false,false,0,1);
        cutPaper(1);
        var strSubmit = getPosData();
        _issueId++;
        requestPrint(getPrinterName(), strSubmit, function(result){
          var resultStr = String(result||'');
          console.log('[STM Print]', resultStr);
          if(resultStr.indexOf('ERROR')!==-1) reject(new Error(resultStr));
          else resolve(resultStr);
        });
      } catch(e){
        console.error('[STM Print Error]', e);
        reject(e);
      }
    });
  }

  // ════════════════════════════════════════
  // PUBLIC API
  // ════════════════════════════════════════

  // ბილეთის ბეჭდვა Bixolon-ით
  async function printTicketBixolon(booking, lang){
    await Promise.all([
      document.fonts.load('900 40px "Noto Sans Georgian"').catch(()=>{}),
      document.fonts.load('400 24px "Noto Sans Georgian"').catch(()=>{})
    ]);
    var canvas = buildTicketCanvas(booking, lang||'ka');
    return await bixolonSendCanvas(canvas);
  }

  // ბილეთის browser print (fallback)
  function printTicketBrowser(booking, lang){
    var canvas = buildTicketCanvas(booking, lang||'ka');
    var win = window.open('', '_blank', 'width=700,height=900');
    win.document.write('<html><body style="margin:0;background:#fff;">');
    win.document.write('<img src="'+canvas.toDataURL()+'" style="max-width:100%;display:block;">');
    win.document.write('<script>window.onload=function(){window.print();}<\/script>');
    win.document.write('</body></html>');
    win.document.close();
  }

  // სიის ბეჭდვა Bixolon-ით
  async function printPaxListBixolon(tour, bookings, busId, driver, plate){
    await Promise.all([
      document.fonts.load('900 30px "Noto Sans Georgian"').catch(()=>{}),
      document.fonts.load('400 20px "Noto Sans Georgian"').catch(()=>{})
    ]);
    var canvas = buildPaxListCanvas(tour, bookings, busId, driver, plate);
    return await bixolonSendCanvas(canvas);
  }

  // სიის browser print (fallback A4)
  function printPaxListBrowser(tour, bookings, busId, driver, plate){
    var canvas = buildPaxListCanvas(tour, bookings, busId, driver, plate);
    var win = window.open('', '_blank', 'width=900,height=1200');
    win.document.write('<html><body style="margin:0;background:#fff;">');
    win.document.write('<img src="'+canvas.toDataURL()+'" style="width:100%;display:block;">');
    win.document.write('<script>window.onload=function(){window.print();}<\/script>');
    win.document.write('</body></html>');
    win.document.close();
  }

  // ზოგადი smart print — ჯერ Bixolon, fallback browser
  async function smartPrint(type, ...args){
    try {
      if(type==='ticket') return await printTicketBixolon(...args);
      if(type==='paxlist') return await printPaxListBixolon(...args);
    } catch(e){
      console.warn('Bixolon failed, fallback to browser print:', e);
      if(type==='ticket') printTicketBrowser(...args);
      else if(type==='paxlist') printPaxListBrowser(...args);
    }
  }

  return {
    getPrinterName, setPrinterName,
    buildTicketCanvas, buildPaxListCanvas,
    printTicketBixolon, printTicketBrowser,
    printPaxListBixolon, printPaxListBrowser,
    smartPrint
  };
})();
