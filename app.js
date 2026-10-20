(function(){
'use strict';

/* ================= settings ================= */
var CFG=window.IWT_CONFIG||{};
var BASE=String(CFG.SUPABASE_URL||'').trim().replace(/\/+$/,'');
var KEY=String(CFG.SUPABASE_KEY||'').trim();
var CONFIGURED=/^(https:\/\/|http:\/\/(localhost|127\.0\.0\.1))/i.test(BASE)&&BASE.indexOf('PASTE')<0&&KEY.length>20&&KEY.indexOf('PASTE')<0;
var SESSION_KEY='iwt.session.v1',NAME_KEY='iwt.name';
var POLL_MS=20000;

var PALETTE=['#C2364A','#2F7D5B','#2D6CB5','#A5650F','#7A4BB8','#0E7C86'];
var COLOUR_NAMES=['Cranberry','Pine','Blue','Amber','Plum','Teal'];
var ACCENTS=['#3DDC63','#4C9BFF','#FF5C8A','#FFB445','#A77BFF','#35D3E0'],ACC_NAMES=['Green','Blue','Pink','Amber','Purple','Cyan'];
var OCC=[['anytime','Anytime'],['birthday','Birthday'],['christmas','Christmas']];
var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var P={
  tag:'<path d="M9 3h6l3 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7z"/><circle cx="12" cy="8" r="1.4"/>',
  gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/><path d="M7.5 8a2.5 2.5 0 1 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 1 1 0 5"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  family:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.2c2.4.2 4.5 2 4.5 4.8"/>',
  bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  chevron:'<path d="M9 6l6 6-6 6"/>',
  back:'<path d="M15 6l-6 6 6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  external:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  camera:'<path d="M4 8h3l1.6-2.4h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.6"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/>',
  cake:'<path d="M4 20h16M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"/><path d="M5 16c2 1.5 3.5 1.5 5 0s3.5-1.5 5 0 2.5 1.2 4 0M12 12V8M12 5.5v.01"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  user:'<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  big:'<rect x="3" y="3" width="18" height="11" rx="3"/><path d="M3 18h18M3 21h10"/>',
  grid:'<rect x="3" y="3" width="8" height="8" rx="2.2"/><rect x="13" y="3" width="8" height="8" rx="2.2"/><rect x="3" y="13" width="8" height="8" rx="2.2"/><rect x="13" y="13" width="8" height="8" rx="2.2"/>',
  shuffle:'<path d="M3 7h3c5 0 5 10 10 10h5M3 17h3c1.8 0 3-1 4-2.4M14 9c.8-1.2 1.2-2 2-2.4M18 4l3 3-3 3M18 14l3 3-3 3"/>'
};
function ic(n,s){s=s||20;return '<svg class="ic" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+P[n]+'</svg>';}
function $(s){return document.querySelector(s);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}

var S={
  uid:null,members:new Map(),items:[],itemMap:new Map(),claims:new Map(),photos:new Map(),avatars:new Map(),santa:[],
  v2:false,v3:false,rem:null,armClear:false,
  tab:'mine',viewing:null,filter:'all',showReceived:false,
  sheet:null,draft:null,shown:'',lastFocus:null,armDelete:false,armBulk:false,
  avDraft:{data:'',dirty:false},avTarget:null,
  authMode:'signin',sig:'',online:true,loading:false,photoBusy:false,avBusy:false,
  joinCode:null,santaForm:false,santaShow:{},linkOff:false,
  v4:false,holds:new Map(),gp:[],gb:new Map(),gi:[],rn:new Map(),myShare:undefined
};

/* ================= helpers ================= */
var PREF_KEY='iwt.prefs.v1';
function readPrefs(){
  var p={};try{p=JSON.parse(lsGet(PREF_KEY)||'{}')||{};}catch(e){}
  return {theme:['auto','light','dark'].indexOf(p.theme)>=0?p.theme:'dark',accent:(p.accent>=0&&p.accent<6)?(p.accent|0):0,
    size:['n','l','xl'].indexOf(p.size)>=0?p.size:'n',layout:(p.layout==='grid'||p.layout==='list')?p.layout:'big',dense:!!p.dense,hidePrices:!!p.hidePrices,snow:!!p.snow,calm:!!p.calm};
}
var PREF=readPrefs();
function applyPrefs(){
  var de=document.documentElement,mq=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');
  var dark=PREF.theme==='dark'||(PREF.theme==='auto'&&!!(mq&&mq.matches));
  de.dataset.mode=dark?'dark':'light';de.dataset.accent=String(PREF.accent);de.dataset.size=PREF.size;
  var b=document.body;if(!b) return;
  b.classList.toggle('v-big',PREF.layout==='big');b.classList.toggle('v-grid',PREF.layout==='grid');b.classList.toggle('v-list',PREF.layout==='list');b.classList.toggle('dense',PREF.dense);b.classList.toggle('noprice',PREF.hidePrices);
  try{var tc=document.querySelectorAll('meta[name=theme-color]');for(var i=0;i<tc.length;i++) tc[i].setAttribute('content',dark?'#06090B':'#F2F8F4');}catch(e){}
  if(window.iwtSnow) window.iwtSnow(PREF.snow);
}
function setPref(k,v){PREF[k]=v;lsSet(PREF_KEY,JSON.stringify(PREF));applyPrefs();}
try{var _mq=window.matchMedia('(prefers-color-scheme: dark)');if(_mq.addEventListener) _mq.addEventListener('change',applyPrefs);}catch(e){}
applyPrefs();

function nm(m){return String((m&&m.name)||'Someone').slice(0,30);}
function ci(m){var i=PALETTE.indexOf(m&&m.color);return i<0?0:i;}
function okPhoto(p){return typeof p==='string'&&p.length<400000&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(p);}
function avatar(m,size){
  var ch=Array.from(nm(m))[0]||'?',src=m&&m.avatar_hash?S.avatars.get(m.avatar_hash):'';
  return '<span class="av c'+ci(m)+' '+(size||'')+'" aria-hidden="true">'+(okPhoto(src)?'<img src="'+src+'" alt="">':esc(ch.toUpperCase()))+'</span>';
}
function safeUrl(u){
  u=String(u||'').trim(); if(!u) return '';
  try{var x=new URL(/^https?:\/\//i.test(u)?u:'https://'+u);return (x.protocol==='https:'||x.protocol==='http:')&&x.hostname.indexOf('.')>0?x.href:'';}catch(e){return '';}
}
function guessTitle(href){
  try{
    var segs=new URL(href).pathname.split('/').filter(Boolean).map(function(s){try{return decodeURIComponent(s);}catch(e){return s;}});
    var stop={dp:1,gp:1,product:1,products:1,p:1,item:1,itm:1,ip:1,buy:1,pd:1,s:1,sch:1,shop:1,detail:1,details:1,prod:1};
    var best='';
    segs.forEach(function(seg){
      var t=seg.replace(/\.(html?|php|aspx?)$/i,'');
      if(stop[t.toLowerCase()]||/^\d+$/.test(t)) return;
      if(/^[A-Z0-9]{8,14}$/.test(t)&&t.indexOf('-')<0) return;
      var words=t.split(/[-_+]/).filter(function(w){return w&&!/^\d{6,}$/.test(w);});
      if(words.length>=2&&t.length>best.length) best=words.join(' ');
    });
    return best.replace(/\b\w/g,function(c){return c.toUpperCase();}).slice(0,100);
  }catch(e){return '';}
}
function fmtPrice(n){return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',minimumFractionDigits:n%1?2:0,maximumFractionDigits:2}).format(n);}
function hasPrice(i){return typeof i.price==='number'&&isFinite(i.price)&&i.price>=0;}
function occKey(i){return OCC.some(function(o){return o[0]===i.occasion;})?i.occasion:'anytime';}
function occLabel(k){return (OCC.filter(function(o){return o[0]===k;})[0]||OCC[0])[1];}
function byNewest(a,b){return (b.createdAt||0)-(a.createdAt||0);}
function byPick(a,b){return (b.priority||0)-(a.priority||0)||byNewest(a,b);}
function priceDrop(i){return (S.v3&&i.owner!==S.uid&&!i.received_at&&typeof i.price_base==='number'&&typeof i.price_seen==='number'&&i.price_seen<=i.price_base*0.95)?i.price_seen:null;}
function hostOf(u){try{return new URL(u).hostname.replace(/^www\./,'');}catch(e){return '';}}
function getItem(id){return S.itemMap.get(id);}
function photoOf(i){return i&&i.photo_hash?(S.photos.get(i.photo_hash)||''):'';}
function plural(n,w){return n+' '+(n===1?w:(w==='person'?'people':w+'s'));}
function isKid(m){return !!(m&&m.managed_by);}
function canManage(owner){
  if(owner===S.uid) return true;
  var m=S.members.get(owner);return !!(m&&m.managed_by&&m.managed_by===S.uid);
}
function searchLinks(title){
  var q=encodeURIComponent(String(title||'').trim());
  return {
    primary:{name:'Google Shopping',href:'https://www.google.co.uk/search?tbm=shop&q='+q+'&tbs=p_ord:p'},
    compare:[
      {name:'PriceSpy',href:'https://pricespy.co.uk/search?search='+q},
      {name:'idealo',href:'https://www.idealo.co.uk/results.html?q='+q}
    ],
    shops:[
      {name:'Amazon',href:'https://www.amazon.co.uk/s?k='+q+'&s=price-asc-rank'},
      {name:'eBay',href:'https://www.ebay.co.uk/sch/i.html?_nkw='+q+'&_sop=15'},
      {name:'Argos',href:'https://www.argos.co.uk/search/'+q+'/'},
      {name:'Currys',href:'https://www.currys.co.uk/search?q='+q},
      {name:'John Lewis',href:'https://www.johnlewis.com/search?search-term='+q}
    ]
  };
}
var toastTimer;
function toast(m){var t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.hidden=true;},4200);}

var AUTH_ERR={
  wrong_code:"That family code isn't right. Ask whoever set up the app for it.",
  locked:'Too many wrong tries. Please wait about 15 minutes and try again.',
  bad_credentials:'That name and PIN don\'t match. Check them and try again.',
  name_taken:'Someone in the family already has that name. Try adding an initial.',
  invalid_pin:'The PIN needs to be at least 6 characters long.',
  invalid_name:'Please enter a name (up to 30 characters).',
  invalid_birthday:'That birthday isn\'t a real date. Check the day and month.',
  need_three:'A Secret Santa needs at least 3 people.',
  bad_members:'One of those people can\'t take part. Children without a phone can\'t be in the draw.',
  not_signed_in:'Your phone lost its connection to the app. Reload the page and try again.',
  not_allowed:'You\'re not allowed to do that.',
  no_such_member:'That person could not be found.'
};
function authMsg(code){return AUTH_ERR[code]||"That didn't work. Try again.";}

/* ---- dates ---- */
function startOfToday(){var n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate());}
function daysUntil(month,day){
  var t0=startOfToday(),y=t0.getFullYear(),d;
  for(var k=0;k<2;k++){
    d=new Date(y+k,month-1,day);
    if(month===2&&day===29&&d.getMonth()!==1) d=new Date(y+k,1,28);
    var n=Math.round((d-t0)/864e5);
    if(n>=0) return n;
  }
  return 365;
}
function inDays(n){return n===0?'today':n===1?'tomorrow':'in '+n+' days';}

/* ================= server connection (Supabase over plain fetch) ================= */
function readSession(){try{var s=JSON.parse(lsGet(SESSION_KEY)||'null');return s&&s.access_token&&s.refresh_token?s:null;}catch(e){return null;}}
function saveSession(j){
  var now=Math.floor(Date.now()/1000);
  var s={access_token:j.access_token,refresh_token:j.refresh_token,expires_at:j.expires_at||(now+(j.expires_in||3600))};
  lsSet(SESSION_KEY,JSON.stringify(s));S.session=s;return s;
}
function fail(status,body,network){
  var e=new Error((body&&(body.message||body.msg||body.error_description||body.error))||('HTTP '+status));
  e.status=status;e.body=body;e.code=body&&(body.error_code||body.code)||'';e.network=!!network;return e;
}
function rawFetch(path,opts){
  opts=opts||{};
  var h=Object.assign({apikey:KEY,'Content-Type':'application/json'},opts.headers||{});
  return fetch(BASE+path,{method:opts.method||'GET',headers:h,body:opts.body==null?undefined:JSON.stringify(opts.body)})
    .then(function(r){
      return r.text().then(function(t){
        var j=null;if(t){try{j=JSON.parse(t);}catch(e){j=t;}}
        if(!r.ok) throw fail(r.status,j&&typeof j==='object'?j:{message:String(j||'')},false);
        S.online=true;return j;
      });
    },function(){S.online=false;throw fail(0,null,true);});
}
function anonSignIn(){
  return rawFetch('/auth/v1/signup',{method:'POST',body:{data:{},gotrue_meta_security:{}}}).then(function(j){
    if(!j||!j.access_token) throw fail(500,{message:'No session returned'});
    return saveSession(j);
  });
}
function refreshSession(s){
  return rawFetch('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:s.refresh_token}}).then(saveSession);
}
var tokenP=null;
function ensureToken(force){
  if(tokenP) return tokenP;
  var s=S.session||readSession();S.session=s;
  var now=Math.floor(Date.now()/1000);
  if(s&&!force&&s.expires_at-now>60) return Promise.resolve(s);
  tokenP=(s?refreshSession(s).catch(function(e){if(e.network) throw e;return anonSignIn();}):anonSignIn())
    .then(function(r){tokenP=null;return r;},function(e){tokenP=null;throw e;});
  return tokenP;
}
function api(path,opts,retried){
  return ensureToken().then(function(s){
    opts=Object.assign({},opts);
    opts.headers=Object.assign({Authorization:'Bearer '+s.access_token},opts.headers||{});
    return rawFetch(path,opts).catch(function(e){
      if(e.status===401&&!retried) return ensureToken(true).then(function(){return api(path,opts,true);});
      throw e;
    });
  });
}
function rest(method,path,body,prefer){
  return api('/rest/v1/'+path,{method:method,body:body,headers:prefer?{Prefer:prefer}:{}});
}
function rpc(name,args){return api('/rest/v1/rpc/'+name,{method:'POST',body:args||{}});}
function tryGet(a,b){return rest('GET',a).catch(function(e){if(e&&e.status===400&&b) return rest('GET',b);throw e;});}

/* ================= full-screen states ================= */
function gate(html){$('#gate').innerHTML=html;$('#gate').hidden=false;$('#shell').hidden=true;}
function gateMsg(t,b,extra){gate('<div class="gate"><div class="gate-mark">'+ic('tag',28)+'</div><h1>'+esc(t)+'</h1><p>'+esc(b)+'</p>'+(extra||'')+'</div>');}
function gateLoading(){gate('<div class="gate"><div class="gate-mark pulse">'+ic('tag',28)+'</div><h1>Opening the family lists</h1></div>');}
function setupScreen(){
  gateMsg('Nearly there','This app isn\'t connected to its database yet. Open the file called config.js in the app folder and paste in your Supabase project URL and publishable key, then upload the folder again.');
}
function swatchesHTML(idPrefix,cur){
  return '<div class="swatches">'+PALETTE.map(function(c,i){return '<input class="sr-only" type="radio" name="'+idPrefix+'-color" id="'+idPrefix+i+'" value="'+c+'"'+(i===cur?' checked':'')+'><label class="sw c'+i+'" for="'+idPrefix+i+'" aria-label="'+COLOUR_NAMES[i]+'">'+ic('check',20)+'</label>';}).join('')+'</div>';
}
function pinInput(id,extra){return '<input id="'+id+'" type="text" class="pin" inputmode="text" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="64" required autocomplete="off"'+(extra||'')+'>';}

/* ---- picture picker (own profile, join screen, children) ---- */
function avRowHTML(label){
  return '<div class="field"><span class="lbl">'+esc(label||'Your picture')+' <span class="opt">optional</span></span><div class="photo-row"><div id="av-prev"></div><div class="photo-actions">'+
    '<label class="btn ghost small" for="av-cam">'+ic('camera',18)+'<span>Take a selfie</span></label><input id="av-cam" class="sr-only" type="file" accept="image/*" capture="user" data-avin="1">'+
    '<label class="btn ghost small" for="av-pick">'+ic('image',18)+'<span>Choose a photo</span></label><input id="av-pick" class="sr-only" type="file" accept="image/*" data-avin="1">'+
    '<button type="button" id="av-rm" class="btn small linkish" data-act="rm-avatar" hidden>Remove</button></div></div></div>';
}
function syncAvatarUI(){
  var el=$('#av-prev');if(!el) return;
  var d=S.avDraft,m=S.avTarget?S.members.get(S.avTarget):null,has;
  if(d.dirty){
    has=!!d.data;
    el.innerHTML=has?'<span class="av lg"><img src="'+d.data+'" alt="New picture"></span>':(m?'<span class="av lg c'+ci(m)+'">'+esc((Array.from(nm(m))[0]||'?').toUpperCase())+'</span>':'<span class="av lg empty">'+ic('camera',28)+'</span>');
  }else if(m){has=!!m.avatar_hash;el.innerHTML=avatar(m,'lg');}
  else{has=false;el.innerHTML='<span class="av lg empty">'+ic('camera',28)+'</span>';}
  var rm=$('#av-rm');if(rm) rm.hidden=!has;
}
function squareShrink(file,size){
  return new Promise(function(res,rej){
    var url=URL.createObjectURL(file),img=new Image();
    img.onload=function(){
      try{
        var w=img.naturalWidth,h=img.naturalHeight,k=Math.min(w,h);
        var c=document.createElement('canvas');c.width=size;c.height=size;
        var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,size,size);
        x.drawImage(img,(w-k)/2,(h-k)/2,k,k,0,0,size,size);
        var d=c.toDataURL('image/jpeg',0.8);URL.revokeObjectURL(url);res(d);
      }catch(er){URL.revokeObjectURL(url);rej(er);}
    };
    img.onerror=function(){URL.revokeObjectURL(url);rej(new Error('img'));};
    img.src=url;
  });
}

function authHTML(err){
  var join=S.authMode==='join',last=lsGet(NAME_KEY)||'';
  return '<div class="onboard"><div class="gate-mark">'+ic('tag',28)+'</div><h1>'+(join?'Join the family':'Welcome back')+'</h1>'+
    '<p class="lead">'+(join?'Everyone keeps a wish list. Add your name so the family knows whose is whose. Others can tick things on your list as bought, and you never see those ticks.':'Sign in with your name and PIN.')+'</p>'+
    '<div class="segs two" role="group" aria-label="Sign in or join" style="width:100%">'+
    '<button type="button" class="chip" style="min-height:50px;border-radius:999px" data-act="authmode" data-mode="signin" aria-pressed="'+(!join)+'">Sign in</button>'+
    '<button type="button" class="chip" style="min-height:50px;border-radius:999px" data-act="authmode" data-mode="join" aria-pressed="'+join+'">I\'m new</button></div>'+
    '<form id="authForm" class="form" autocomplete="off" data-mode="'+S.authMode+'">'+
    (join?'<div class="field"><label for="a-code">Family code</label><input id="a-code" type="text" autocapitalize="none" autocorrect="off" autocomplete="off" spellcheck="false" required></div>':'')+
    '<div class="field"><label for="a-name">Your name</label><input id="a-name" type="text" maxlength="30" required autocomplete="off" value="'+esc(join?'':last)+'"></div>'+
    '<div class="field"><label for="a-pin">'+(join?'Choose a PIN':'Your PIN')+'</label>'+pinInput('a-pin')+(join?'<span class="hint">At least 6 characters. Numbers are fine. Remember it, you\'ll need it on a new phone.</span>':'')+'</div>'+
    (join?avRowHTML()+'<fieldset class="field"><legend>Your colour</legend>'+swatchesHTML('a-',0)+'</fieldset>':'')+
    (err?'<div class="form-error" role="alert">'+esc(err)+'</div>':'')+
    '<button class="btn primary wide" type="submit">'+(join?'Join the family':'Sign in')+'</button></form></div>';
}
function showAuth(err){S.shown='auth';S.avTarget=null;gate(authHTML(err));syncAvatarUI();
  try{var hm=/[#&]code=([^&]+)/.exec(location.hash||''),ce=$('#a-code');if(hm&&ce&&!ce.value){ce.value=decodeURIComponent(hm[1]);}}catch(e){}
  var f=$('#a-code')||$('#a-name');if(f&&!(f.value))f.focus({preventScroll:true});else{var n0=$('#a-name');if(n0&&!n0.value){n0.focus({preventScroll:true});return;}var p=$('#a-pin');if(p)p.focus({preventScroll:true});}}

/* ================= claims ================= */
function claimsOf(id){return S.claims.get(id)||[];}
function fullClaim(id){return claimsOf(id).filter(function(c){return c.mode!=='share';})[0]||null;}
function shareClaims(id){return claimsOf(id).filter(function(c){return c.mode==='share';});}
function myClaim(id){return claimsOf(id).filter(function(c){return c.buyer===S.uid;})[0]||null;}
function isTaken(id){return claimsOf(id).length>0;}
function buyerNames(list){return list.map(function(c){return nm(S.members.get(c.buyer));}).join(' & ');}
function eachShare(it){var n=shareClaims(it.id).length;return hasPrice(it)&&n>0?it.price/n:null;}

/* ================= rendering ================= */
function render(){
  if(!S.uid) return;
  var me=S.members.get(S.uid);
  if(!me) return;
  S.shown='main';
  $('#gate').hidden=true;$('#shell').hidden=false;
  paintChrome(me);paintMain();syncSheet();
}
function buyingCount(){
  var n=0;S.claims.forEach(function(list,id){if(list.some(function(c){return c.buyer===S.uid;})) n++;});return n;
}
function paintChrome(me){
  $('.brand').innerHTML=ic('tag',22)+'<span>I want <em>this</em></span>';
  $('#me-slot').innerHTML='<button class="me" data-act="tab" data-tab="me" aria-label="Me and settings">'+avatar(me,'sm')+'</button>';
  $('#tab-mine').innerHTML=ic('list',22)+'<span>My list</span>';
  $('#tab-family').innerHTML=ic('family',22)+'<span>Family</span>';
  var n=buyingCount();
  $('#tab-buying').innerHTML=ic('bag',22)+'<span>Buying'+(n?' ('+n+')':'')+'</span>';
  $('#tab-me').innerHTML=ic('user',22)+'<span>Me</span>';
}
function paintMain(){
  ['mine','family','buying','me'].forEach(function(t){$('#tab-'+t).setAttribute('aria-current',S.tab===t?'page':'false');});
  var keep=null,focusId=null;
  if(S.tab==='me'){
    keep={};focusId=document.activeElement&&document.activeElement.id;
    document.querySelectorAll('#app input[id],#app select[id],#app textarea[id]').forEach(function(el){keep[el.id]=el.type==='checkbox'?el.checked:el.value;});
  }
  var h='';
  if(!S.online) h+='<p class="banner offline" role="status">You\'re offline. What you see may be out of date. Changes won\'t save until you\'re back online.</p>';
  if(S.tab==='mine') h+=mineHTML();
  else if(S.tab==='buying') h+=buyingHTML();
  else if(S.tab==='me') h+=meHTML();
  else if(S.viewing&&S.viewing!==S.uid&&S.members.has(S.viewing)) h+=personHTML(S.viewing);
  else {S.viewing=null;h+=familyHTML();}
  $('#app').innerHTML=h;
  if(keep){
    Object.keys(keep).forEach(function(id){var el=document.getElementById(id);if(el&&el.closest('#app')){if(el.type==='checkbox') el.checked=keep[id];else if(keep[id]!=='') el.value=keep[id];}});
    if(focusId){var f=document.getElementById(focusId);if(f&&f.focus) f.focus({preventScroll:true});}
  }
}
function effFilter(list){
  if(S.filter==='all') return 'all';
  return list.some(function(i){return occKey(i)===S.filter;})?S.filter:'all';
}
function filterBar(list){
  var counts={all:list.length};
  OCC.forEach(function(o){counts[o[0]]=list.filter(function(i){return occKey(i)===o[0];}).length;});
  var kinds=OCC.filter(function(o){return counts[o[0]]>0;});
  if(kinds.length<2) return '';
  var f=effFilter(list);
  return '<div class="filters" role="group" aria-label="Filter by occasion">'+[['all','All']].concat(kinds).map(function(k){
    return '<button class="chip" data-act="filter" data-f="'+k[0]+'" aria-pressed="'+(f===k[0])+'">'+k[1]+'<span class="n">'+counts[k[0]]+'</span></button>';
  }).join('')+'</div>';
}
function applyFilter(list){var f=effFilter(list);return f==='all'?list:list.filter(function(i){return occKey(i)===f;});}
function tagHTML(i){return '<span class="tag">'+esc(occLabel(occKey(i)))+'</span>';}
var EMO=[[/head|ear ?bud|airpod|speaker|audio|sound/i,'🎧'],[/lego|brick|block/i,'🧱'],[/game|xbox|playstation|ps5|switch|nintendo|controller|steam/i,'🎮'],[/book|novel|kindle/i,'📚'],[/shoe|trainer|boot|sneaker/i,'👟'],[/coat|jacket|hoodie|jumper|shirt|dress|jeans|top\b|socks/i,'🧥'],[/watch/i,'⌚'],[/phone|iphone|samsung|tablet|ipad/i,'📱'],[/laptop|computer|keyboard|mouse|monitor|pc\b/i,'💻'],[/tv|television/i,'📺'],[/camera|photo/i,'📷'],[/bike|cycle|scooter/i,'🚲'],[/perfume|aftershave|fragrance|candle/i,'🕯️'],[/makeup|lipstick|skin|cream|beauty/i,'💄'],[/ring|necklace|bracelet|earring|jewel/i,'💍'],[/bag|backpack|purse|wallet/i,'👜'],[/toy|doll|teddy|plush|puzzle/i,'🧸'],[/coffee|tea|mug|kettle/i,'☕'],[/wine|beer|gin|whisky|whiskey|prosecco/i,'🍷'],[/choc|sweet|candy|cake|biscuit/i,'🍫'],[/pan|knife|cook|air ?fryer|oven|blender/i,'🍳'],[/plant|garden|flower|seed/i,'🌿'],[/ball|football|golf|tennis|gym|yoga|weights/i,'⚽'],[/guitar|piano|drum|music|vinyl/i,'🎸'],[/paint|art|pencil|craft/i,'🎨'],[/holiday|trip|ticket|voucher|gift card|experience/i,'🎟️']];
function emojiFor(t){t=String(t||'');for(var k=0;k<EMO.length;k++){if(EMO[k][0].test(t)) return EMO[k][1];}return '🎁';}
function hueOf(t){var h=0;t=String(t||'');for(var k=0;k<t.length;k++) h=(h*31+t.charCodeAt(k))%360;return h;}
function thumbHTML(i){var p=photoOf(i);return okPhoto(p)?'<img class="thumb" src="'+p+'" alt="">':'<span class="thumb ph" style="--h:'+hueOf(i.title)+'"><span class="ph-e">'+emojiFor(i.title)+'</span></span>';}
function mediaHTML(i){
  var p=photoOf(i),u=safeUrl(i.link),site=u?(i.link_site||hostOf(u)):'',inner;
  if(okPhoto(p)) inner='<img class="pic" src="'+p+'" alt="" loading="lazy">';
  else if(i.photo_hash) inner='<span class="ph skel" style="--h:'+hueOf(i.title)+'"></span>';
  else inner='<span class="ph" style="--h:'+hueOf(i.title)+'"><span class="ph-e">'+emojiFor(i.title)+'</span></span>';
  return '<span class="media">'+inner+'<span class="mtop">'+tagHTML(i)+(i.priority?'<span class="pickbadge">'+ic('star',13)+' Top pick</span>':'')+'</span>'+(u?'<span class="msite">'+ic('link',13)+'<span>'+esc(site)+'</span></span>':'')+'</span>';
}

function statusHTML(i){
  var cl=claimsOf(i.id),id=esc(i.id),full=fullClaim(i.id),mine=myClaim(i.id);
  if(!cl.length){var lk=S.v4?holdsOf(i.id):[];return (lk.length?'<span class="pill look">\uD83D\uDC40 '+esc(holdNames(lk))+' looking</span>':'<span class="pill open">Still to buy</span>')+'<button class="btn small ghost" data-act="bought" data-id="'+id+'">'+ic('check',16)+" I've bought this</button>";}
  if(false) return '<span class="pill open">Still to buy</span><button class="btn small ghost" data-act="bought" data-id="'+id+'">'+ic('check',16)+" I've bought this</button>";
  if(full){
    if(full.buyer===S.uid) return '<span class="pill bought">'+ic('check',14)+' You bought this</span><button class="btn small linkish" data-act="unbought" data-id="'+id+'">Undo</button>';
    return '<span class="pill bought">'+ic('check',14)+' Bought by '+esc(nm(S.members.get(full.buyer)))+'</span>';
  }
  if(mine) return '<span class="pill bought">'+ic('check',14)+' You\'re going halves</span><button class="btn small linkish" data-act="unbought" data-id="'+id+'">I\'m out</button>';
  return '<span class="pill bought">'+ic('check',14)+' Halves: '+esc(buyerNames(shareClaims(i.id)))+'</span><button class="btn small ghost" data-act="bought-share" data-id="'+id+'">Join in</button>';
}
function cardHTML(i,showStatus){
  var got=!!i.received_at;
  return '<li class="card'+(got?' got':'')+'"><button class="card-main" data-act="open" data-id="'+esc(i.id)+'">'+mediaHTML(i)+
    '<span class="card-body"><span class="card-title">'+esc(i.title)+'</span><span class="card-meta">'+(hasPrice(i)?'<span class="price">about '+fmtPrice(i.price)+'</span>':'')+(priceDrop(i)!=null?'<span class="dropbadge">Now '+fmtPrice(priceDrop(i))+'</span>':'')+(got?'<span class="gotbadge">'+ic('check',13)+' Got it</span>':'')+'</span></span>'+
    '<span class="chev">'+ic('chevron',20)+'</span></button>'+
    (showStatus&&!got?'<div class="card-foot">'+statusHTML(i)+'</div>':'')+'</li>';
}
function viewSwitch(){
  return '<div class="viewsw" role="group" aria-label="How lists look">'+[['big','big','Big cards'],['grid','grid','Photo grid'],['list','list','List']].map(function(v){
    return '<button type="button" class="vbtn" data-act="view" data-v="'+v[0]+'" aria-label="'+v[2]+'" aria-pressed="'+(PREF.layout===v[0])+'">'+ic(v[1],18)+'</button>';}).join('')+'</div>';
}
function greeting(){
  var h=new Date().getHours();
  return h<5?'Late one':h<12?'Morning':h<18?'Afternoon':'Evening';
}
function receivedSection(list,showStatus){
  var got=list.filter(function(i){return !!i.received_at;});
  if(!got.length) return '';
  var owner=got[0].owner;
  return '<button class="chip rec-toggle" data-act="toggle-received" aria-pressed="'+S.showReceived+'">Received ('+got.length+')</button>'+
    (S.showReceived?'<ul class="items rec-list">'+got.map(function(i){return recCardHTML(i);}).join('')+'</ul>'+
      '<button class="btn linkish small" data-act="clear-received" data-owner="'+esc(owner)+'">'+(S.armClear===owner?'Tap again to clear them out':'Clear these out for good')+'</button>':'');
}

function mineHTML(){
  var all=S.items.filter(function(i){return i.owner===S.uid;}).sort(byPick);
  var list=all.filter(function(i){return !i.received_at;});
  var shown=applyFilter(list),f=effFilter(list);
  var nudge=(list.length>0&&list.length<3)?'<div class="nudge"><div><strong>Your list is a bit quiet.</strong> A few more ideas, big and small, means the family always has something to pick from.</div></div>':'';
  var body;
  if(!list.length) body='<div class="empty"><h2>Nothing on your list yet</h2><p>See something you like? Add its name, a link or a photo. Your family will see it and can pick it up for Christmas or your birthday.</p></div>';
  else body='<ul class="items">'+shown.map(function(i){return cardHTML(i,false);}).join('')+'</ul>';
  var bulk=(S.v2&&f!=='all'&&shown.length)?'<button class="btn ghost small bulk" data-act="bulk-received">'+(S.armBulk?'Tap again to confirm':'Mark all '+esc(occLabel(f))+' items as received')+'</button>':'';
  var meM=S.members.get(S.uid);
  nudge+=thanksNudge();
  return '<div class="page-head hello"><h1>'+greeting()+', '+esc(nm(meM))+'</h1><p class="sub">'+(list.length?plural(list.length,'thing')+' on your list. ':'')+"The family can see it. You won't see who has bought what.</p></div>"+
    '<button class="add" data-act="add" data-owner="'+esc(S.uid)+'">'+ic('plus',20)+' Add something you want</button>'+nudge+'<div class="toolbar">'+filterBar(list)+(list.length>1?viewSwitch():'')+'</div>'+bulk+body+(S.v2?receivedSection(all,false):'');
}

/* ---- family ---- */
function openFor(uid,occs){
  return S.items.filter(function(i){return i.owner===uid&&!i.received_at&&!isTaken(i.id)&&(!occs||occs.indexOf(occKey(i))>=0);}).length;
}
function eventsHTML(){
  if(!S.v2) return '';
  var ev=[],me=S.members.get(S.uid);
  S.members.forEach(function(m,id){
    if(m.birth_month&&m.birth_day) ev.push({kind:'bday',uid:id,m:m,days:daysUntil(m.birth_month,m.birth_day)});
  });
  var xd=daysUntil(12,25);
  ev.push({kind:'xmas',days:xd});
  ev.sort(function(a,b){return a.days-b.days;});
  var show=ev.filter(function(e){return e.days<=75||(e.kind==='xmas'&&S.santa.length>0);}).slice(0,4);
  if(!show.some(function(e){return e.kind==='xmas';})&&!show.length) show=[ev.filter(function(e){return e.kind==='xmas';})[0]];
  var rows=show.map(function(e){
    if(e.kind==='xmas'){
      var n=0;S.members.forEach(function(m,id){if(id!==S.uid) n+=openFor(id,['christmas']);});
      var ns=S.santa.length;
      return '<button class="ev" data-act="santa"><span class="ev-ic">'+ic('star',22)+'</span><div class="ev-t"><div class="ev-n">Christmas</div><div class="ev-s">'+(xd===0?'Today!':inDays(xd))+(n?' · '+plural(n,'gift idea')+' still to buy':'')+'</div>'+
        '<div class="ev-s ev-santa">'+ic('gift',14)+' '+(ns?'Secret Santa: you\'re in '+(ns===1?'a draw':ns+' draws')+'. Tap to see':'Secret Santa: set one up')+'</div></div><span class="chev">'+ic('chevron',20)+'</span></button>';
    }
    var mine=e.uid===S.uid,c=mine?0:openFor(e.uid,['birthday','anytime']);
    var tag=mine?'div':'button';
    return '<'+tag+' class="ev"'+(mine?'':' data-act="person" data-uid="'+esc(e.uid)+'"')+'>'+avatar(e.m,'sm')+'<div class="ev-t"><div class="ev-n">'+(mine?'Your birthday':esc(nm(e.m))+'’s birthday')+'</div><div class="ev-s">'+(e.days===0?'Today! 🎉':inDays(e.days))+(c?' · '+plural(c,'idea')+' still to buy':'')+'</div></div>'+(mine?'':'<span class="chev">'+ic('chevron',18)+'</span>')+'</'+tag+'>';
  }).join('');
  var nudge=(me&&!me.birth_month)?'<button class="linkish-row" data-act="profile">'+ic('cake',16)+' Add your birthday so the family gets a countdown</button>':'';
  return '<section class="coming"><h2>Coming up</h2>'+rows+nudge+'</section>';
}
function santaCardHTML(){
  if(!S.v2) return '';
  var n=S.santa.length;
  return '<button class="santa-card" data-act="santa"><span class="ev-ic">'+ic('gift',22)+'</span><div class="ev-t"><div class="ev-n">Secret Santa</div><div class="ev-s">'+(n?'You\'re in '+(n===1?'a draw':n+' draws')+'. Tap to see who you\'re buying for.':'Draw names, nobody knows who has who.')+'</div></div><span class="chev">'+ic('chevron',18)+'</span></button>';
}
function familyHTML(){
  var others=Array.from(S.members.entries()).filter(function(e){return e[0]!==S.uid;}).sort(function(a,b){return nm(a[1]).localeCompare(nm(b[1]));});
  var head='<div class="page-head"><h1>Family</h1><p class="sub">Tap a name to see what they want.</p></div>';
  var kidBtn=S.v2?'<button class="add soft" data-act="child-add">'+ic('plus',20)+' Add a child or someone without a phone</button>':'';
  if(!others.length) return head+eventsHTML()+'<div class="empty"><h2>Nobody else is here yet</h2><p>Send the app link and the family code to your family. They show up here once they join.</p></div>'+kidBtn;
  return head+eventsHTML()+'<ul class="items">'+others.map(function(e){
    var m=e[1],list=S.items.filter(function(i){return i.owner===e[0]&&!i.received_at;});
    var open=list.filter(function(i){return !isTaken(i.id);}).length;
    var ct=list.length?plural(list.length,'wish')+', '+open+' still to buy':'Nothing on their list yet';
    var badge='';
    if(isKid(m)) badge='<span class="kidtag">'+(m.managed_by===S.uid?'You manage this list':'Managed by '+esc(nm(S.members.get(m.managed_by))))+'</span>';
    var bd=(S.v2&&m.birth_month&&m.birth_day)?daysUntil(m.birth_month,m.birth_day):999;
    if(bd<=30) badge+='<span class="bdaytag">'+ic('cake',13)+' '+(bd===0?'Birthday today!':'Birthday '+inDays(bd))+'</span>';
    return '<li><button class="person" data-act="person" data-uid="'+esc(e[0])+'">'+avatar(m)+'<div style="min-width:0"><div class="nm">'+esc(nm(m))+'</div><div class="ct">'+ct+'</div>'+(badge?'<div class="badges">'+badge+'</div>':'')+'</div><span class="chev">'+ic('chevron',20)+'</span></button></li>';
  }).join('')+'</ul>'+kidBtn;
}
function personHTML(uid){
  var m=S.members.get(uid),manage=canManage(uid);
  var all=S.items.filter(function(i){return i.owner===uid;}).sort(byPick);
  var list=all.filter(function(i){return !i.received_at;});
  var open=list.filter(function(i){return !isTaken(i.id);}).length;
  var shown=applyFilter(list);
  var body=list.length?'<ul class="items">'+shown.map(function(i){return cardHTML(i,true);}).join('')+'</ul>':'<div class="empty"><h2>Nothing here yet</h2><p>'+esc(nm(m))+(manage?" has nothing on the list yet. Add something below.":" hasn't added anything. Check back later.")+'</p></div>';
  var kidBar=manage?'<button class="add" data-act="add" data-owner="'+esc(uid)+'">'+ic('plus',20)+' Add to '+esc(nm(m))+'’s list</button>'+
    '<p class="fine kidnote">You manage this list. You can see what others have bought for '+esc(nm(m))+', so you can plan. '+esc(nm(m))+' can\'t sign in.</p>':'';
  return '<button class="back" data-act="back">'+ic('back',18)+' Family</button>'+
    '<div class="person-head">'+avatar(m,'lg')+'<div><h1>'+esc(nm(m))+'’s list</h1><p class="sub">'+(list.length?plural(list.length,'thing')+', '+open+' still to buy':'Nothing on it yet')+'</p>'+(m.bio?'<p class="bio">“'+esc(m.bio)+'”</p>':'')+
    (manage&&isKid(m)?'<button class="btn small ghost editkid" data-act="child-edit" data-id="'+esc(uid)+'">Edit '+esc(nm(m))+'</button>':'')+'</div></div>'+
    kidBar+(open>1?'<button class="btn ghost small surprise" data-act="surprise" data-uid="'+esc(uid)+'">'+ic('shuffle',18)+' Surprise me</button>':'')+'<div class="toolbar">'+filterBar(list)+(list.length>1?viewSwitch():'')+'</div>'+body+(manage&&S.v2?receivedSection(all,true):'');
}

/* ---- what I'm buying ---- */
function buyingHTML(){
  var mineClaims=[];
  S.claims.forEach(function(list,id){
    var it=getItem(id);if(!it) return;
    var c=list.filter(function(x){return x.buyer===S.uid;})[0];
    if(c) mineClaims.push({it:it,c:c});
  });
  var head='<div class="page-head"><h1>What you\'re buying</h1><p class="sub">Everything you\'ve ticked, in one place.</p></div>';
  if(!mineClaims.length) return head+plannerHTML()+'<div class="empty"><h2>Nothing ticked yet</h2><p>When you tap “I\'ve bought this” on someone\'s list, it shows up here with a running total.</p></div>';
  var total=0,noPrice=0,groups={};
  mineClaims.forEach(function(x){
    var share=x.c.mode==='share';
    var cost=hasPrice(x.it)?(share?x.it.price/Math.max(1,shareClaims(x.it.id).length):x.it.price):null;
    x.cost=cost;
    if(cost==null) noPrice++;else total+=cost;
    (groups[x.it.owner]=groups[x.it.owner]||[]).push(x);
  });
  var names=Object.keys(groups).sort(function(a,b){return nm(S.members.get(a)).localeCompare(nm(S.members.get(b)));});
  var summary='<section class="sum"><div class="sum-n">'+plural(mineClaims.length,'thing')+'</div><div class="sum-t">about '+fmtPrice(total)+'</div>'+(noPrice?'<div class="sum-s">'+plural(noPrice,'item')+' with no price not counted</div>':'')+'</section>';
  var html=names.map(function(oid){
    var m=S.members.get(oid),rows=groups[oid].sort(function(a,b){return byNewest(a.it,b.it);});
    var sub=0;rows.forEach(function(x){if(x.cost!=null) sub+=x.cost;});
    return '<section class="bgroup"><div class="bg-head">'+avatar(m,'sm')+'<div class="bg-n">'+esc(nm(m))+'</div><div class="bg-s">'+(sub?'about '+fmtPrice(sub):'')+'</div></div><ul class="items">'+
      rows.map(function(x){
        var it=x.it,share=x.c.mode==='share',got=!!it.received_at;
        var state=got?'<span class="pill bought">'+ic('check',14)+' They\'ve got it</span>':(share?'<span class="pill bought">Halves with '+esc(buyerNames(shareClaims(it.id).filter(function(c){return c.buyer!==S.uid;}))||'you')+'</span>':'<span class="pill bought">'+ic('check',14)+' Bought</span>');
        return '<li class="card row'+(got?' got':'')+'"><button class="card-main" data-act="open" data-id="'+esc(it.id)+'">'+thumbHTML(it)+'<div style="min-width:0"><div class="card-title">'+esc(it.title)+'</div><div class="card-meta">'+state+(x.cost!=null?'<span class="price">'+(share?'your share ':'')+fmtPrice(x.cost)+'</span>':'')+'</div></div><span class="chev">'+ic('chevron',20)+'</span></button></li>';
      }).join('')+'</ul></section>';
  }).join('');
  return head+plannerHTML()+summary+html;
}

/* ================= sheets ================= */
function linkCardHTML(link,photo,site,title,desc){
  var u=safeUrl(link);if(!u) return '';
  return '<a class="linkcard" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+(okPhoto(photo)?'<img src="'+photo+'" alt="">':'')+
    '<div class="lc-t"><div class="lc-site">'+esc(site||hostOf(u))+'</div><div class="lc-title">'+esc(title||hostOf(u))+'</div>'+(desc?'<div class="lc-desc">'+esc(desc)+'</div>':'')+
    '<div class="lc-open">Open page '+ic('external',14)+'</div></div></a>';
}
function detailHTML(it){
  var own=it.owner===S.uid,manage=canManage(it.owner),owner=S.members.get(it.owner),L=searchLinks(it.title),saved=safeUrl(it.link),ph=photoOf(it);
  function ext(u){return 'href="'+esc(u)+'" target="_blank" rel="noopener noreferrer"';}
  var got=!!it.received_at;
  var manageBar='';
  if(manage){
    manageBar='<div class="buy manage">'+((safeUrl(it.link)&&!okPhoto(ph))?'<button class="btn ghost wide" data-act="get-pic" data-id="'+esc(it.id)+'">Try to find a picture</button>':'')+'<button class="btn ghost wide" data-act="edit" data-id="'+esc(it.id)+'">Edit this item</button>'+
      (S.v2?'<button class="btn ghost wide" data-act="'+(got?'unreceived':'received')+'" data-id="'+esc(it.id)+'">'+(got?'Put it back on the list':(own?'I\'ve got this':esc(nm(owner))+' has got this'))+'</button>':'')+'</div>';
  }
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">'+esc(it.title)+'</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
    (okPhoto(ph)&&!safeUrl(it.link)?'<img class="hero" src="'+ph+'" alt="">':'')+
    '<div class="meta">'+(it.priority?'<span class="pickbadge">'+ic('star',13)+' Top pick</span>':'')+tagHTML(it)+(hasPrice(it)?'<span class="price">about '+fmtPrice(it.price)+'</span>':'')+'<span>'+(own?'On your list':'On '+esc(nm(owner))+'’s list')+'</span>'+(got?'<span class="gotbadge">'+ic('check',13)+' Got it</span>':'')+'</div>'+
    (it.note?'<p class="note">'+esc(it.note)+'</p>':'')+
    (priceDrop(it)!=null?'<p class="dropnote">'+ic('check',16)+' Price drop: now about '+fmtPrice(priceDrop(it))+(typeof it.price_base==='number'?' (was '+fmtPrice(it.price_base)+')':'')+'</p>':'')+
    linkCardHTML(it.link,ph,it.link_site,it.link_title||it.title,it.link_desc)+
    '<h3 class="sec">Find the best price</h3>'+
    '<a class="btn primary wide" '+ext(L.primary.href)+'>Compare prices, lowest first '+ic('external',18)+'</a>'+
    '<div class="link-grid">'+L.compare.map(function(c){return '<a class="btn ghost small" '+ext(c.href)+'>'+esc(c.name)+' '+ic('external',16)+'</a>';}).join('')+'</div>'+
    '<p class="sec-sub">Or go straight to a shop</p><div class="chips">'+L.shops.map(function(s){return '<a class="shop" '+ext(s.href)+'>'+esc(s.name)+'</a>';}).join('')+'</div>'+
    '<p class="fine">Each button opens that site’s own results for “'+esc(it.title)+'”, so the prices are always current.</p>'+
    manageBar+(own?'':'<div class="buy" id="buy-slot">'+buyHTML(it)+'</div>');
}
function buyHTML(it){
  var cl=claimsOf(it.id),full=fullClaim(it.id),mine=myClaim(it.id),owner=nm(S.members.get(it.owner)),id=esc(it.id),sh=shareClaims(it.id);
  if(it.received_at) return '<div class="pill bought">'+ic('check',16)+' '+esc(owner)+' has got this</div>';
  if(!cl.length) return '<button class="btn primary wide" data-act="bought" data-id="'+id+'">'+ic('check',18)+" I've bought this</button>"+
    (S.v2?'<button class="btn ghost wide" data-act="bought-share" data-id="'+id+'">Go halves with someone</button>':'')+
    '<p class="fine">'+esc(owner)+" won't see that it's taken. Everyone else will.</p>"+holdUI(it);
  if(full){
    if(full.buyer===S.uid) return '<div class="pill bought">'+ic('check',16)+' You bought this</div><button class="btn ghost wide" data-act="unbought" data-id="'+id+'">Undo</button>';
    return '<div class="pill bought">'+ic('check',16)+' Bought by '+esc(nm(S.members.get(full.buyer)))+'</div><p class="fine">Pick something else from '+esc(owner)+'’s list.</p>';
  }
  var each=eachShare(it);
  var line='<div class="pill bought">'+ic('check',16)+' Going halves: '+esc(buyerNames(sh))+'</div>'+(each!=null?'<p class="fine">About '+fmtPrice(each)+' each at the moment.</p>':'');
  if(mine) return line+'<button class="btn ghost wide" data-act="unbought" data-id="'+id+'">I\'m out</button>';
  return line+'<button class="btn primary wide" data-act="bought-share" data-id="'+id+'">Join in and go halves</button><p class="fine">You can\'t buy it outright while others are going halves.</p>';
}
function bdaySelects(prefix,m,d){
  var days='<option value="">Day</option>';for(var i=1;i<=31;i++) days+='<option value="'+i+'"'+(d===i?' selected':'')+'>'+i+'</option>';
  var mons='<option value="">Month</option>'+MONTHS.map(function(n,i){return '<option value="'+(i+1)+'"'+(m===i+1?' selected':'')+'>'+n+'</option>';}).join('');
  return '<div class="bday"><select id="'+prefix+'-d" aria-label="Day">'+days+'</select><select id="'+prefix+'-m" aria-label="Month">'+mons+'</select></div>';
}
function readBday(prefix){
  var d=parseInt($('#'+prefix+'-d').value,10),m=parseInt($('#'+prefix+'-m').value,10);
  if(!d&&!m) return {m:null,d:null};
  if(!d||!m) return {partial:true};
  return {m:m,d:d};
}
function editHTML(it,ownerId){
  var occ=it?occKey(it):'anytime',oid=it?it.owner:ownerId,who=oid===S.uid?'your list':nm(S.members.get(oid))+'’s list';
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">'+(it?'Edit item':'Add to '+esc(who))+'</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
  '<form id="itemForm" class="form" autocomplete="off" data-id="'+(it?esc(it.id):'')+'" data-owner="'+esc(oid)+'">'+
  '<div class="field"><label for="f-link">Link <span class="opt">optional</span></label><div class="linkrow"><input id="f-link" type="text" inputmode="url" autocapitalize="none" placeholder="Paste a link from any shop" value="'+esc(it&&it.link)+'">'+
    '<button type="button" class="btn ghost small" data-act="paste-link">Paste</button><button type="button" class="btn ghost small" data-act="fill-link">Fill in</button></div><span id="f-linkstat" class="hint" aria-live="polite"></span><div id="f-linkcard"></div></div>'+
  '<div class="field"><label for="f-title">What do you want?</label><input id="f-title" type="text" maxlength="120" required placeholder="Brand, model, colour" value="'+esc(it&&it.title)+'"></div>'+
  '<div class="field"><span class="lbl">Photo <span class="opt">optional</span></span><div class="photo-row"><div id="f-prev" class="prev"></div><div class="photo-actions">'+
    '<label class="btn ghost small" for="f-photo">'+ic('camera',18)+'<span id="f-photo-lbl">Add a photo</span></label><input id="f-photo" class="sr-only" type="file" accept="image/*">'+
    '<button type="button" id="f-rm" class="btn small linkish" data-act="rm-photo" hidden>Remove</button></div></div></div>'+
  '<fieldset class="field"><legend>For</legend><div class="segs">'+OCC.map(function(o){return '<input class="sr-only" type="radio" name="f-occ" id="o-'+o[0]+'" value="'+o[0]+'"'+(o[0]===occ?' checked':'')+'><label class="seg" for="o-'+o[0]+'">'+o[1]+'</label>';}).join('')+'</div></fieldset>'+
  (S.v3?'<label class="check"><input type="checkbox" id="f-pick"'+(it&&it.priority?' checked':'')+'><span><strong>'+ic('star',16)+' Top pick</strong><small>The one you would love most. It goes to the top of your list.</small></span></label>':'')+
  '<div class="field"><label for="f-note">Details <span class="opt">optional</span></label><textarea id="f-note" rows="2" maxlength="240" placeholder="Size, colour, which version">'+esc(it&&it.note)+'</textarea></div>'+
  '<div class="field"><label for="f-price">Roughly how much? <span class="opt">optional</span></label><div class="money"><span aria-hidden="true">£</span><input id="f-price" type="text" inputmode="decimal" placeholder="0" value="'+(it&&hasPrice(it)?esc(String(it.price)):'')+'"></div></div>'+
  '<div class="form-actions"><button class="btn primary grow" type="submit">'+(it?'Save changes':'Add to the list')+'</button>'+(it?'<button class="btn danger" type="button" id="f-del" data-act="delete">Delete</button>':'')+'</div></form>';
}
function profileSheetHTML(){
  var me=S.members.get(S.uid),cur=ci(me);
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">Edit profile</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
    '<form id="profileForm" class="form" autocomplete="off">'+avRowHTML()+
    '<div class="field"><label for="p-name">Your name</label><input id="p-name" type="text" maxlength="30" required value="'+esc(nm(me))+'"></div>'+
    (S.v3?'<div class="field"><label for="p-bio">About me <span class="opt">optional, shown at the top of your list</span></label><textarea id="p-bio" rows="2" maxlength="140" placeholder="Sizes, favourite colours, things to avoid">'+esc(me.bio||'')+'</textarea></div>':'')+
    (S.v2?'<div class="field"><span class="lbl">Your birthday <span class="opt">optional, no year</span></span>'+bdaySelects('p-b',me.birth_month||null,me.birth_day||null)+'</div>':'')+
    '<fieldset class="field"><legend>Your colour</legend>'+swatchesHTML('p-',cur)+'</fieldset>'+
    '<div id="p-msg"></div><button class="btn primary wide" type="submit">Save</button></form>';
}

/* ================= the Me tab ================= */
function blk(title,sub,inner){return '<section class="blk"><h2>'+title+'</h2>'+(sub?'<p class="sub">'+sub+'</p>':'')+inner+'</section>';}
function optRow(k,cur,opts){
  return '<div class="opts" role="group">'+opts.map(function(o){return '<button type="button" class="chip" data-act="pref" data-k="'+k+'" data-v="'+o[0]+'" aria-pressed="'+(String(cur)===String(o[0]))+'">'+o[1]+'</button>';}).join('')+'</div>';
}
function switchRow(label,hint,act,key,on){
  return '<div class="trow"><div><div class="tl">'+label+'</div>'+(hint?'<div class="th">'+hint+'</div>':'')+'</div>'+
    '<button type="button" class="switch" role="switch" aria-checked="'+(!!on)+'" aria-label="'+esc(label)+'" data-act="'+act+'" data-k="'+key+'"><span></span></button></div>';
}
function pushSupport(){
  var ua=navigator.userAgent||'',ios=/iPhone|iPad|iPod/i.test(ua),standalone=(window.navigator.standalone===true)||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches);
  if(!CFG.VAPID_PUBLIC_KEY) return {ok:false,why:'Reminders are not set up yet.'};
  if(ios&&!standalone) return {ok:false,why:'On iPhone, add the app to your Home Screen first (Share, then Add to Home Screen), then open it from there to turn reminders on.'};
  if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)) return {ok:false,why:"This browser can't show reminders. Installing the app from Chrome usually fixes that."};
  return {ok:true};
}
function remindersHTML(){
  var sup=pushSupport(),r=S.rem;
  if(!sup.ok) return blk('Reminders',sup.why,'');
  if(!r) return blk('Reminders','Loading…','');
  var denied=window.Notification&&Notification.permission==='denied';
  var on=r.thisDevice;
  var top=denied?'<p class="form-error">Notifications are blocked for this app. Allow them in your phone settings, then come back.</p>':
    on?'<div class="form-ok">Reminders are on for this phone.</div><div class="btnrow"><button class="btn ghost small" data-act="push-test">Send me a test</button><button class="btn linkish small" data-act="push-off">Turn off on this phone</button></div>'
      :'<button class="btn primary wide" data-act="push-on">Turn on reminders on this phone</button>';
  var p=r.prefs||{};
  return blk('Reminders','A nudge when it matters. You choose which ones.',top+
    '<div class="trows">'+switchRow('Birthdays','A week before, the day before and on the day','rem','birthdays',p.birthdays!==false)+
    switchRow('Christmas','A month, a week and a day before','rem','christmas',p.christmas!==false)+
    switchRow('Price drops','When something on someone\'s list gets cheaper','rem','prices',p.prices!==false)+
    switchRow('A nudge for my list','On Sundays, if my list is a bit quiet','rem','nudges',p.nudges!==false)+'</div>');
}
function meHTML(){
  var me=S.members.get(S.uid);if(!me) return '';
  var isAdmin=!!me.is_admin,kids=Array.from(S.members.entries()).filter(function(e){return e[1].managed_by===S.uid;});
  var others=Array.from(S.members.entries()).filter(function(e){return e[0]!==S.uid&&!isKid(e[1]);});
  var bday=me.birth_month&&me.birth_day?me.birth_day+' '+MONTHS[me.birth_month-1]:'';
  var h='<div class="page-head"><h1>Me</h1></div>'+
    '<section class="me-card">'+avatar(me,'lg')+'<div class="mc-t"><div class="mc-n">'+esc(nm(me))+'</div>'+(bday?'<div class="sub">Birthday '+esc(bday)+'</div>':'')+(me.bio?'<div class="bio">“'+esc(me.bio)+'”</div>':'')+'</div>'+
    '<button class="btn ghost small" data-act="profile">Edit profile</button></section>';
  h+=blk('Make it yours','These only change how the app looks on this phone.',
    '<div class="lbl2">Light or dark</div>'+optRow('theme',PREF.theme,[['auto','Match my phone'],['light','Light'],['dark','Dark']])+
    '<div class="lbl2">Colour</div><div class="accents" role="group">'+ACCENTS.map(function(c,i){return '<button type="button" class="acc" data-act="pref" data-k="accent" data-v="'+i+'" style="--c:'+c+'" aria-label="'+ACC_NAMES[i]+'" aria-pressed="'+(PREF.accent===i)+'"></button>';}).join('')+'</div>'+
    '<div class="lbl2">Text size</div>'+optRow('size',PREF.size,[['n','Normal'],['l','Large'],['xl','Extra large']])+
    '<div class="lbl2">Lists look like</div>'+optRow('layout',PREF.layout,[['big','Big cards'],['grid','Photo grid'],['list','A list']])+
    '<div class="trows">'+switchRow('Compact','Smaller cards, more on screen','prefsw','dense',PREF.dense)+switchRow('Hide prices','Keep the lists simple','prefsw','hidePrices',PREF.hidePrices)+switchRow('Snowfall','Gentle falling snow, for the festive season','prefsw','snow',PREF.snow)+switchRow('Calm mode','No confetti when you tick things off','prefsw','calm',PREF.calm)+'</div>');
  if(S.v3) h+=remindersHTML();
  h+=shareBlockHTML();
  h+=bioBlockHTML();
  var fam='';
  if(isAdmin) fam+='<div class="subblk"><h3>Invite family</h3><p class="hint">Send them the link. The family code is filled in for them.</p><div class="codebox"><code id="join-code">'+esc(S.joinCode||'…')+'</code><button class="btn small ghost" type="button" data-act="copy-code">Copy</button></div><button class="btn primary" type="button" data-act="invite">Share an invite</button></div>';
  if(S.v2){
    fam+='<div class="subblk"><h3>Children and others without a phone</h3>'+(kids.length?'<ul class="mini">'+kids.map(function(e){return '<li><button class="person mini-p" data-act="person" data-uid="'+esc(e[0])+'">'+avatar(e[1],'sm')+'<span>'+esc(nm(e[1]))+'</span></button><button class="btn small ghost" data-act="child-edit" data-id="'+esc(e[0])+'">Edit</button></li>';}).join('')+'</ul>':'<p class="hint">You look after their list. They can\'t sign in.</p>')+
      '<button class="btn ghost" data-act="child-add">'+ic('plus',18)+' Add a child</button></div>';
    fam+='<div class="subblk"><h3>Secret Santa</h3><p class="hint">Draw names. Nobody, not even the organiser, sees who has who.</p><button class="btn ghost" data-act="santa">Open Secret Santa</button></div>';
  }
  h+=blk('My family','',fam);
  if(S.v2){
    var ids=[S.uid].concat(kids.map(function(e){return e[0];}));
    var n=S.items.filter(function(i){return i.received_at&&ids.indexOf(i.owner)>=0;}).length;
    h+=blk('Tidy up','After Christmas or a birthday, clear out what has been received so the lists stay fresh.',
      n?'<button class="btn ghost" data-act="clear-received" data-owner="mine">'+(S.armClear==='mine'?'Tap again to clear '+plural(n,'gift'):'Clear out '+plural(n,'received gift'))+'</button>':'<p class="hint">Nothing received yet, so nothing to clear.</p>');
  }
  if(isAdmin&&others.length) h+=blk('Family admin','',
    '<form id="resetForm" class="form" autocomplete="off"><h3>Someone forgot their PIN?</h3><div class="field"><label for="r-who">Who</label><select id="r-who">'+others.map(function(e){return '<option value="'+esc(e[0])+'">'+esc(nm(e[1]))+'</option>';}).join('')+'</select></div>'+
    '<div class="field"><label for="r-pin">Give them a new PIN</label>'+pinInput('r-pin')+'</div><div id="r-msg"></div><button class="btn ghost" type="submit">Set new PIN</button></form>');
  var ua=navigator.userAgent||'',ios=/iPhone|iPad|iPod/i.test(ua);
  h+=blk('Account','',
    '<form id="pinForm" class="form" autocomplete="off"><h3>Change your PIN</h3><div class="field"><label for="n-pin">New PIN</label>'+pinInput('n-pin')+'<span class="hint">At least 6 characters.</span></div><div id="n-msg"></div><button class="btn ghost" type="submit">Change PIN</button></form>'+
    '<div class="tip"><strong>Put it on your home screen.</strong> '+(ios?'In Safari, tap the Share button, then “Add to Home Screen”.':'In Chrome or Samsung Internet, open the ⋮ menu and choose “Install app”.')+'</div>'+
    '<button class="btn danger wide" type="button" data-act="signout">Sign out on this phone</button>');
  return h;
}
function childSheetHTML(kidId){
  var m=kidId?S.members.get(kidId):null,cur=m?ci(m):0;
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">'+(m?'Edit '+esc(nm(m)):'Add a child')+'</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
    '<p class="hint" style="margin-bottom:14px">For children, or anyone without a phone. You look after their list. They can\'t sign in, and you can see what others have bought for them.</p>'+
    '<form id="childForm" class="form" autocomplete="off" data-id="'+(m?esc(kidId):'')+'">'+avRowHTML('Their picture')+
    '<div class="field"><label for="k-name">Name</label><input id="k-name" type="text" maxlength="30" required value="'+esc(m?nm(m):'')+'"></div>'+
    '<div class="field"><span class="lbl">Birthday <span class="opt">optional, no year</span></span>'+bdaySelects('k-b',m&&m.birth_month||null,m&&m.birth_day||null)+'</div>'+
    (S.v3?'<div class="field"><label for="k-bio">About them <span class="opt">optional</span></label><textarea id="k-bio" rows="2" maxlength="140" placeholder="Sizes, favourite things">'+esc(m&&m.bio||'')+'</textarea></div>':'')+
    '<fieldset class="field"><legend>Colour</legend>'+swatchesHTML('k-',cur)+'</fieldset>'+
    '<div id="k-msg"></div><div class="form-actions"><button class="btn primary grow" type="submit">'+(m?'Save':'Add')+'</button>'+(m?'<button class="btn danger" type="button" id="k-del" data-act="child-del">Delete</button>':'')+'</div></form>';
}
function santaSheetHTML(){
  var year=new Date().getFullYear();
  var draws=S.santa.map(function(d){
    var r=S.members.get(d.receiver),shown=!!S.santaShow[d.id],creator=d.created_by===S.uid||(S.members.get(S.uid)||{}).is_admin;
    var people=(d.participants||[]).map(function(id){return avatar(S.members.get(id),'sm');}).join('');
    return '<section class="box santa"><h3>'+esc(d.name)+'</h3><p class="hint">'+(d.budget?'Budget: '+esc(d.budget)+'. ':'')+plural((d.participants||[]).length,'person')+' taking part.</p><div class="avs">'+people+'</div>'+
      (shown?'<div class="reveal">'+avatar(r,'lg')+'<div><div class="ev-s">You\'re buying for</div><div class="nm">'+esc(nm(r))+'</div></div></div><button class="btn ghost small" data-act="person-from-santa" data-uid="'+esc(d.receiver)+'">See their list</button> <button class="btn linkish small" data-act="santa-hide" data-id="'+esc(d.id)+'">Hide</button>':
        '<button class="btn primary" data-act="santa-reveal" data-id="'+esc(d.id)+'">Show me who I\'m buying for</button>')+
      (creator?'<button class="btn linkish small" data-act="santa-del" data-id="'+esc(d.id)+'">'+(S.armDelete===d.id?'Tap again to delete this draw':'Delete this draw')+'</button>':'')+'</section>';
  }).join('');
  var people=Array.from(S.members.entries()).filter(function(e){return !isKid(e[1]);}).sort(function(a,b){return nm(a[1]).localeCompare(nm(b[1]));});
  var form='<form id="santaForm" class="box" autocomplete="off"><h3>Organise a Secret Santa</h3>'+
    '<div class="field"><label for="s-name">Name</label><input id="s-name" type="text" maxlength="60" required value="Family Christmas '+year+'"></div>'+
    '<div class="field"><label for="s-budget">Budget <span class="opt">optional</span></label><input id="s-budget" type="text" maxlength="40" placeholder="e.g. £15"></div>'+
    '<fieldset class="field"><legend>Who\'s taking part?</legend><div class="checks">'+people.map(function(e){return '<label class="chk"><input type="checkbox" name="s-who" value="'+esc(e[0])+'" checked><span>'+avatar(e[1],'sm')+' '+esc(nm(e[1]))+'</span></label>';}).join('')+'</div></fieldset>'+
    '<div id="s-msg"></div><button class="btn primary wide" type="submit">Draw names</button>'+
    '<p class="hint">Everyone sees who\'s taking part. Each person only sees who they are buying for. Not even you, as organiser, can see everyone else\'s.</p></form>';
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">Secret Santa</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
    (draws||'<p class="hint">No draws yet.</p>')+(S.santaForm||!S.santa.length?form:'<button class="btn ghost wide" data-act="santa-new" style="margin-top:14px">Organise a new Secret Santa</button>');
}
function drawSheet(){
  var sh=$('#sheet'),m=S.sheet;
  if(m.mode==='detail'){var it=getItem(m.id);if(!it){closeSheet();return;}sh.innerHTML=detailHTML(it);var bs=$('#buy-slot');if(bs) bs.dataset.sig=buyHTML(it);}
  else if(m.mode==='edit'){
    var e=m.id?getItem(m.id):null;
    if(m.id&&(!e||!canManage(e.owner))){closeSheet();return;}
    if(!m.id&&!canManage(m.owner)){closeSheet();return;}
    sh.innerHTML=editHTML(e,m.owner);wireEdit(e);
  }
  else if(m.mode==='profile'){S.avTarget=S.uid;S.avDraft={data:'',dirty:false};sh.innerHTML=profileSheetHTML();loadJoinCode();syncAvatarUI();}
  else if(m.mode==='child'){
    var kid=m.id?S.members.get(m.id):null;
    if(m.id&&(!kid||kid.managed_by!==S.uid)){closeSheet();return;}
    S.avTarget=m.id||null;S.avDraft={data:'',dirty:false};sh.innerHTML=childSheetHTML(m.id);syncAvatarUI();
  }
  else if(m.mode==='santa'){sh.innerHTML=santaSheetHTML();}
  else if(m.mode==='planner'){var ph=plannerSheetHTML(m.id);if(!ph){closeSheet();return;}sh.innerHTML=ph;}
  else if(m.mode==='idea'){S.draft={photo:''};sh.innerHTML=ideaSheetHTML(m.id,m.owner);}
  else if(m.mode==='gp'){sh.innerHTML=gpSheetHTML();}
  else if(m.mode==='thanks'){var itn=getItem(m.id);if(!itn||!canManage(itn.owner)){closeSheet();return;}S.draft={photo:'',dirty:false};sh.innerHTML=thanksSheetHTML(itn);}
}
function openSheet(mode,id,owner){
  S.lastFocus=document.activeElement;S.sheet={mode:mode,id:id,owner:owner||S.uid};S.armDelete=false;
  drawSheet();
  if(!S.sheet) return;
  $('#scrim').hidden=false;document.body.classList.add('lock');
  var t=$('#sheet-title');if(t) t.focus({preventScroll:true});
  $('#sheet').scrollTop=0;
}
function closeSheet(){
  S.sheet=null;S.draft=null;S.armDelete=false;
  $('#scrim').hidden=true;$('#sheet').innerHTML='';document.body.classList.remove('lock');
  if(S.lastFocus&&S.lastFocus.isConnected&&S.lastFocus.focus) S.lastFocus.focus({preventScroll:true});
}
function syncSheet(){
  if(!S.sheet) return;
  if(S.sheet.mode==='santa'){return;}
  if(S.sheet.mode!=='detail') return;
  var it=getItem(S.sheet.id);
  if(!it){closeSheet();return;}
  var slot=$('#buy-slot');
  if(slot&&it.owner!==S.uid){
    var next=buyHTML(it);
    if(slot.dataset.sig!==next){
      var had=slot.contains(document.activeElement);
      slot.innerHTML=next;slot.dataset.sig=next;
      if(had){var b=slot.querySelector('button');if(b) b.focus({preventScroll:true});}
    }
  }
  var hero=$('#sheet .hero'),ph=photoOf(it);
  if(!hero&&okPhoto(ph)){
    var img=document.createElement('img');img.className='hero';img.alt='';img.src=ph;
    var meta=$('#sheet .meta');if(meta) meta.parentNode.insertBefore(img,meta);
  }
}
function loadJoinCode(){
  var me=S.members.get(S.uid);if(!me||!me.is_admin) return;
  rpc('get_join_code').then(function(c){
    S.joinCode=typeof c==='string'?c:null;
    var el=$('#join-code');if(el) el.textContent=S.joinCode||'(not available)';
  }).catch(function(){var el=$('#join-code');if(el) el.textContent='(could not load)';});
}

/* ================= item photo + link reading ================= */
function syncPhotoUI(){
  var has=!!S.draft.photo||(S.draft.hasServerPhoto&&!S.draft.dirty);
  var shown=S.draft.photo;
  $('#f-prev').innerHTML=shown?'<img src="'+shown+'" alt="Photo preview">':ic('gift',30);
  $('#f-photo-lbl').textContent=has?'Change photo':'Add a photo';
  $('#f-rm').hidden=!has;
  syncLinkCard();
}
function syncLinkCard(){
  var box=$('#f-linkcard');if(!box||!S.draft) return;
  var u=safeUrl($('#f-link')&&$('#f-link').value),m=S.draft.meta;
  if(!u){box.innerHTML='';return;}
  var ok=m&&m.url===u;
  box.innerHTML=linkCardHTML(u,S.draft.photo,ok?m.site:'',ok&&m.title?m.title:'',ok?m.desc:'');
}
function wireEdit(it){
  var hash=it&&it.photo_hash;
  S.draft={photo:it?photoOf(it):'',dirty:false,hasServerPhoto:!!hash,meta:(it&&safeUrl(it.link))?{url:safeUrl(it.link),title:it.link_title||'',desc:it.link_desc||'',site:it.link_site||''}:null};
  if(hash&&!S.draft.photo){
    fetchPhotos([it.id]).then(function(){
      if(S.sheet&&S.sheet.mode==='edit'&&S.draft&&!S.draft.dirty){S.draft.photo=photoOf(getItem(it.id));syncPhotoUI();}
    });
  }
  syncPhotoUI();
  $('#f-photo').addEventListener('change',onPhoto);
  $('#f-link').addEventListener('change',function(){fillFromLink(true);});
  $('#f-link').addEventListener('input',function(){syncLinkCard();});
}
function shrinkTo(src,max,q){
  return new Promise(function(res,rej){
    var img=new Image();
    img.onload=function(){
      try{
        var k=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
        var w=Math.max(1,Math.round(img.naturalWidth*k)),h=Math.max(1,Math.round(img.naturalHeight*k));
        var c=document.createElement('canvas');c.width=w;c.height=h;
        var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(img,0,0,w,h);
        res(c.toDataURL('image/jpeg',q));
      }catch(er){rej(er);}
    };
    img.onerror=function(){rej(new Error('img'));};
    img.src=src;
  });
}
function shrink(file){
  var url=URL.createObjectURL(file);
  return shrinkTo(url,480,0.72).then(function(d){URL.revokeObjectURL(url);return d;},function(e){URL.revokeObjectURL(url);throw e;});
}
function onPhoto(e){
  var f=e.target.files&&e.target.files[0];if(!f) return;
  shrink(f).then(function(d){if(!S.draft) return;S.draft.photo=d;S.draft.dirty=true;syncPhotoUI();})
  .catch(function(){toast("That photo couldn't be read. Try another one.");});
}
function fillFromLink(auto){
  var u=safeUrl($('#f-link').value),st=$('#f-linkstat');
  if(!u){if(!auto&&st) st.textContent='Paste a link first.';return;}
  if(S.linkOff){var g0=guessTitle(u),t0=$('#f-title');if(g0&&t0&&!t0.value.trim()) t0.value=g0;return;}
  var form=$('#itemForm');
  if(st) st.textContent='Reading the link…';
  api('/functions/v1/link-info',{method:'POST',body:{url:u}}).then(function(r){
    if(!$('#itemForm')||$('#itemForm')!==form) return;
    r=r||{};
    var t=$('#f-title'),pr=$('#f-price'),done=[];
    if(S.draft&&(r.title||r.description||r.site)){S.draft.meta={url:u,title:String(r.title||'').slice(0,200),desc:String(r.description||'').slice(0,400),site:String(r.site||'').slice(0,80)};}
    if(r.title&&!t.value.trim()){t.value=String(r.title).slice(0,120);done.push('name');}
    if(typeof r.price==='number'&&isFinite(r.price)&&r.price>=0&&!pr.value.trim()){pr.value=String(Math.round(r.price*100)/100);done.push('price');}
    var imgP=Promise.resolve();
    if(typeof r.image==='string'&&/^data:image\/(jpeg|png|webp|gif);base64,/.test(r.image)&&r.image.length<3000000&&S.draft&&!S.draft.photo){
      imgP=shrinkTo(r.image,480,0.72).then(function(d){if(S.draft&&!S.draft.photo){S.draft.photo=d;S.draft.dirty=true;syncPhotoUI();done.push('photo');}}).catch(function(){});
    }
    return imgP.then(function(){
      syncLinkCard();
      var s2=$('#f-linkstat');if(!s2) return;
      if(!done.length){var g=guessTitle(u);if(g&&!t.value.trim()){t.value=g;done.push('name');}}
      if(S.draft&&!(S.draft.meta&&S.draft.meta.url===u)){S.draft.meta={url:u,title:'',desc:'',site:hostOf(u)};syncLinkCard();}
      var had=!!(r.title||r.price!=null||r.image||r.description);
      s2.textContent=done.length?'Filled in the '+done.join(', ')+' from the link. Check it looks right.':(had?'Details from the link are in. Check they look right.':'Couldn\'t find details on that page. Fill them in by hand.');
    });
  }).catch(function(e){
    var s2=$('#f-linkstat');
    if(e&&(e.status===404||e.status===401||e.status===403)){S.linkOff=true;if(s2) s2.textContent='Reading links isn\'t switched on yet, so type the name in.';}
    else if(s2) s2.textContent='Couldn\'t read that link. Type the name in instead.';
    var g=guessTitle(u),t=$('#f-title');if(g&&t&&!t.value.trim()) t.value=g;
  });
}


/* ================= gifts: holds, planner, share link, thank-yous ================= */
var HOLD_MS=7*864e5;
function holdsOf(id){var now=Date.now();return (S.holds.get(id)||[]).filter(function(h){return now-Date.parse(h.created_at)<HOLD_MS;});}
function myHold(id){return holdsOf(id).filter(function(h){return h.member_id===S.uid;})[0]||null;}
function otherHolds(id){return holdsOf(id).filter(function(h){return h.member_id!==S.uid;});}
function holdNames(list){return list.map(function(h){return nm(S.members.get(h.member_id));}).join(' & ');}
function untilStr(h){var d=new Date(Date.parse(h.created_at)+HOLD_MS);return d.toLocaleDateString('en-GB',{weekday:'long'});}
function holdUI(it){
  if(!S.v4||it.owner===S.uid||it.received_at) return '';
  var mine=myHold(it.id),o=otherHolds(it.id),id=esc(it.id),h='';
  if(o.length) h+='<div class="pill look">👀 '+esc(holdNames(o))+(o.length>1?' are':' is')+' looking at this</div>';
  if(mine) h+='<div class="pill look">👀 You\'re looking at this until '+esc(untilStr(mine))+'</div><button class="btn ghost wide" data-act="unhold" data-id="'+id+'">Not any more</button>';
  else h+='<button class="btn ghost wide" data-act="hold" data-id="'+id+'">👀 I\'m looking at this</button><p class="fine">Tells the family for a week, so nobody else buys it by accident. '+esc(nm(S.members.get(it.owner)))+' won\'t see it.</p>';
  return h;
}
function holdIt(id,on){
  var it=getItem(id);if(!it) return;
  rpc(on?'hold_item':'release_hold',{p_item:id}).then(function(r){
    if(on&&!(r&&r.ok)){toast(r&&r.error==='taken'?'Someone has already bought this':'That didn\'t work. Try again.');return refresh();}
    toast(on?'Noted. The family can see you\'re looking at it':'Done');
    return refresh();
  }).catch(function(e){toast(offlineMsg(e));});
}

/* ---- planner (private budgets and ideas) ---- */
function plannerPeople(){
  var out=[];
  S.members.forEach(function(m,id){if(id!==S.uid) out.push({id:id,name:nm(m),m:m,kind:'m'});});
  S.gp.forEach(function(g){out.push({id:g.id,name:g.name,m:{name:g.name,color:PALETTE[hueOf(g.name)%PALETTE.length]},kind:'g'});});
  return out.sort(function(a,b){return a.name.localeCompare(b.name);});
}
function budgetOf(pid){var v=S.gb.get(pid);return typeof v==='number'&&isFinite(v)?v:null;}
function ideasFor(pid){return S.gi.filter(function(g){return g.person===pid;});}
function spentOn(pid){
  var t=0;
  S.claims.forEach(function(list,itemId){
    var it=S.itemMap.get(itemId);if(!it||it.owner!==pid||!hasPrice(it)) return;
    var mine=list.filter(function(c){return c.buyer===S.uid;})[0];if(!mine) return;
    t+=mine.mode==='share'?it.price/Math.max(1,list.filter(function(c){return c.mode==='share';}).length):it.price;
  });
  ideasFor(pid).forEach(function(g){if(g.done&&typeof g.price==='number') t+=g.price;});
  return Math.round(t*100)/100;
}
function barHTML(sp,b){
  if(b==null||b<=0) return '';
  var pct=Math.min(100,Math.round(sp/b*100));
  return '<div class="bar'+(sp>b?' over':'')+'" role="img" aria-label="'+fmtPrice(sp)+' of '+fmtPrice(b)+'"><span style="width:'+pct+'%"></span></div>';
}
function plannerHTML(){
  if(!S.v4) return '';
  var rows=plannerPeople().map(function(p){
    var b=budgetOf(p.id),sp=spentOn(p.id),n=ideasFor(p.id).filter(function(g){return !g.done;}).length;
    return '<li><button class="person pl" data-act="planner" data-id="'+esc(p.id)+'">'+avatar(p.m,'sm')+'<div style="min-width:0"><div class="nm">'+esc(p.name)+'</div><div class="ct">'+
      (b!=null?fmtPrice(sp)+' of '+fmtPrice(b):(sp?fmtPrice(sp)+' so far':'No budget yet'))+(n?', '+plural(n,'idea'):'')+'</div>'+barHTML(sp,b)+'</div><span class="chev">'+ic('chevron',20)+'</span></button></li>';
  }).join('');
  return '<section class="blk planner"><h2>Gift planner</h2><p class="sub">Set a budget and keep private ideas for anyone, even people who aren\'t in the app. Only you can see this.</p>'+
    (rows?'<ul class="items">'+rows+'</ul>':'')+'<button class="btn ghost" data-act="gp-add">'+ic('plus',18)+' Add someone, like Mum</button></section>';
}
function showPlanner(pid){
  if(S.sheet&&S.sheet.mode==='planner'){S.sheet.id=pid;drawSheet();$('#sheet').scrollTop=0;return;}
  if(S.sheet) closeSheet();
  openSheet('planner',pid);
}
function ideaThumb(g){
  return okPhoto(g.photo)?'<img class="thumb" src="'+g.photo+'" alt="">':'<span class="thumb ph" style="--h:'+hueOf(g.title)+'"><span class="ph-e">'+emojiFor(g.title)+'</span></span>';
}
function plannerSheetHTML(pid){
  var p=plannerPeople().filter(function(x){return x.id===pid;})[0];if(!p) return '';
  var b=budgetOf(pid),sp=spentOn(pid),ideas=ideasFor(pid);
  var left=(b!=null)?(b-sp>=0?fmtPrice(b-sp)+' left':fmtPrice(sp-b)+' over'):'';
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">'+esc(p.name)+'</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
    '<p class="hint">Only you can see this page.</p>'+
    '<form id="budgetForm" class="box" data-id="'+esc(pid)+'" autocomplete="off"><h3>Budget</h3><div class="money"><span aria-hidden="true">£</span><input id="bg-amt" type="text" inputmode="decimal" placeholder="No budget" value="'+(b!=null?esc(String(b)):'')+'" aria-label="Budget in pounds"><button class="btn small ghost" type="submit">Save</button></div>'+
    '<div class="ct">'+(sp?'Spent so far: '+fmtPrice(sp)+(left?' · '+left:''):'Nothing spent yet')+'</div>'+barHTML(sp,b)+
    (p.kind==='m'?'<p class="fine">Spent includes things you\'ve ticked as bought from their list.</p>':'')+'</form>'+
    '<h3 class="sec">Private ideas</h3>'+
    (ideas.length?'<ul class="items ideas">'+ideas.map(function(g){
      return '<li class="card row'+(g.done?' got':'')+'"><div class="card-main idea">'+ideaThumb(g)+'<div style="min-width:0"><div class="card-title">'+esc(g.title)+'</div><div class="card-meta">'+(typeof g.price==='number'?'<span class="price">about '+fmtPrice(g.price)+'</span>':'')+(g.done?'<span class="gotbadge">'+ic('check',13)+' Bought</span>':'')+(safeUrl(g.link)?'<a class="ilink" href="'+esc(safeUrl(g.link))+'" target="_blank" rel="noopener noreferrer">'+ic('link',14)+' '+esc(hostOf(g.link))+'</a>':'')+'</div>'+(g.note?'<div class="fine" style="margin-top:4px">'+esc(g.note)+'</div>':'')+'</div></div>'+
        '<div class="card-foot"><button class="btn small '+(g.done?'ghost':'primary')+'" data-act="idea-done" data-id="'+esc(g.id)+'">'+(g.done?'Not bought yet':'I\'ve bought this')+'</button><button class="btn small ghost" data-act="idea-edit" data-id="'+esc(g.id)+'" data-person="'+esc(pid)+'">Edit</button></div></li>';
    }).join('')+'</ul>':'<p class="hint">No ideas yet. Jot down anything that would suit them.</p>')+
    '<button class="add" data-act="idea-add" data-person="'+esc(pid)+'">'+ic('plus',20)+' Add an idea</button>'+
    (p.kind==='m'?'<button class="btn ghost wide" data-act="person-from-santa" data-uid="'+esc(pid)+'">See '+esc(p.name)+'’s list</button>':
      '<button class="btn linkish" data-act="gp-del" data-id="'+esc(pid)+'">'+(S.armDelete===pid?'Tap again to remove '+esc(p.name)+' and their ideas':'Remove '+esc(p.name))+'</button>');
}
function saveBudget(f){
  var pid=f.dataset.id,raw=$('#bg-amt').value.trim().replace(',','.'),v=parseFloat(raw);
  var req;
  if(!raw){req=rest('DELETE','gift_budgets?owner=eq.'+encodeURIComponent(S.uid)+'&person=eq.'+encodeURIComponent(pid),null,'return=minimal');}
  else if(isFinite(v)&&v>=0&&v<1e8){req=rest('POST','gift_budgets?on_conflict=owner,person',{owner:S.uid,person:pid,amount:Math.round(v*100)/100},'resolution=merge-duplicates,return=minimal');}
  else {toast('Enter the budget as a number, like 40');return;}
  req.then(function(){toast(raw?'Budget saved':'Budget cleared');return refresh();}).then(function(){if(S.sheet&&S.sheet.mode==='planner') drawSheet();}).catch(function(e){toast(offlineMsg(e));});
}
function gpSheetHTML(){
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">Add someone</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
    '<p class="hint" style="margin-bottom:14px">For people who aren\'t in the app, like Mum or a friend. Only you can see them.</p>'+
    '<form id="gpForm" class="form" autocomplete="off"><div class="field"><label for="gp-name">Name</label><input id="gp-name" type="text" maxlength="30" required></div>'+
    '<div class="field"><label for="gp-bud">Budget <span class="opt">optional</span></label><div class="money"><span aria-hidden="true">£</span><input id="gp-bud" type="text" inputmode="decimal" placeholder="0"></div></div>'+
    '<button class="btn primary wide" type="submit">Add</button></form>';
}
function saveGp(f){
  var name=$('#gp-name').value.trim().slice(0,30);if(!name) return;
  var v=parseFloat($('#gp-bud').value.trim().replace(',','.')),btn=f.querySelector('button[type=submit]');btn.disabled=true;
  rest('POST','gift_people',{owner:S.uid,name:name},'return=representation').then(function(r){
    var row=Array.isArray(r)?r[0]:r;
    if(row&&row.id&&isFinite(v)&&v>=0) return rest('POST','gift_budgets',{owner:S.uid,person:row.id,amount:Math.round(v*100)/100},'return=minimal').then(function(){return row;});
    return row;
  }).then(function(row){closeSheet();return refresh().then(function(){if(row&&row.id) openSheet('planner',row.id);});})
  .catch(function(e){toast(offlineMsg(e));btn.disabled=false;});
}
function delGp(id){
  if(S.armDelete!==id){S.armDelete=id;drawSheet();setTimeout(function(){if(S.armDelete===id){S.armDelete=false;if(S.sheet&&S.sheet.mode==='planner') drawSheet();}},4000);return;}
  S.armDelete=false;
  rpc('delete_gift_person',{p_id:id}).then(function(){closeSheet();toast('Removed');return refresh();}).catch(function(e){toast(offlineMsg(e));});
}
function ideaSheetHTML(id,pid){
  var g=id?S.gi.filter(function(x){return x.id===id;})[0]:null;
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">'+(g?'Edit idea':'New idea')+'</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
    '<form id="ideaForm" class="form" autocomplete="off" data-id="'+(g?esc(g.id):'')+'" data-person="'+esc(pid)+'">'+
    '<div class="field"><label for="i-link">Link <span class="opt">optional</span></label><div class="linkrow"><input id="i-link" type="text" inputmode="url" autocapitalize="none" placeholder="Paste a link from any shop" value="'+esc(g&&g.link)+'"><button type="button" class="btn ghost small" data-act="idea-fill">Fill in</button></div><span id="i-stat" class="hint" aria-live="polite"></span></div>'+
    '<div class="field"><label for="i-title">Idea</label><input id="i-title" type="text" maxlength="120" required placeholder="What would suit them?" value="'+esc(g&&g.title)+'"></div>'+
    '<div class="field"><label for="i-price">Roughly how much? <span class="opt">optional</span></label><div class="money"><span aria-hidden="true">£</span><input id="i-price" type="text" inputmode="decimal" placeholder="0" value="'+(g&&typeof g.price==='number'?esc(String(g.price)):'')+'"></div></div>'+
    '<div class="field"><label for="i-note">Notes <span class="opt">optional</span></label><textarea id="i-note" rows="2" maxlength="240" placeholder="Size, where you saw it">'+esc(g&&g.note)+'</textarea></div>'+
    '<p class="fine">Private. Nobody else can see your ideas.</p>'+
    '<div class="form-actions"><button class="btn primary grow" type="submit">'+(g?'Save changes':'Save idea')+'</button>'+(g?'<button class="btn danger" type="button" data-act="idea-del" data-id="'+esc(g.id)+'">Delete</button>':'')+'<button class="btn ghost" type="button" data-act="planner-back" data-person="'+esc(pid)+'">Back</button></div></form>';
}
function ideaFill(){
  var u=safeUrl($('#i-link').value),st=$('#i-stat');
  if(!u){if(st) st.textContent='Paste a link first.';return;}
  if(S.linkOff){if(st) st.textContent='Reading links isn\'t switched on yet.';return;}
  if(st) st.textContent='Reading the link…';
  var form=$('#ideaForm');
  api('/functions/v1/link-info',{method:'POST',body:{url:u}}).then(function(r){
    if($('#ideaForm')!==form) return;
    r=r||{};var t=$('#i-title'),p=$('#i-price'),done=[];
    if(r.title&&!t.value.trim()){t.value=String(r.title).slice(0,120);done.push('name');}
    if(typeof r.price==='number'&&isFinite(r.price)&&r.price>=0&&!p.value.trim()){p.value=String(Math.round(r.price*100)/100);done.push('price');}
    var imgP=Promise.resolve();
    if(typeof r.image==='string'&&/^data:image\/(jpeg|png|webp|gif);base64,/.test(r.image)&&r.image.length<8000000&&S.draft){
      imgP=shrinkTo(r.image,480,0.72).then(function(d){if(S.draft){S.draft.photo=d;done.push('picture');}}).catch(function(){});
    }
    return imgP.then(function(){var s2=$('#i-stat');if(s2) s2.textContent=done.length?'Filled in the '+done.join(', ')+'.':'Couldn\'t find details on that page.';});
  }).catch(function(e){
    var s2=$('#i-stat');if(e&&(e.status===404||e.status===401||e.status===403)) S.linkOff=true;
    if(s2) s2.textContent=S.linkOff?'Reading links isn\'t switched on yet.':'Couldn\'t read that link.';
  });
}
function saveIdea(f){
  var id=f.dataset.id,pid=f.dataset.person,title=$('#i-title').value.trim();if(!title) return;
  var p=parseFloat($('#i-price').value.replace(',','.')),price=isFinite(p)&&p>=0&&p<1e8?Math.round(p*100)/100:null;
  var body={title:title,link:safeUrl($('#i-link').value)||'',note:$('#i-note').value.trim().slice(0,240),price:price};
  if(S.draft&&S.draft.photo) body.photo=S.draft.photo;
  var btn=f.querySelector('button[type=submit]');btn.disabled=true;
  var req=id?rest('PATCH','gift_ideas?id=eq.'+encodeURIComponent(id),body,'return=minimal'):rest('POST','gift_ideas',Object.assign({owner:S.uid,person:pid},body),'return=minimal');
  req.then(function(){toast('Saved');return refresh();}).then(function(){showPlanner(pid);}).catch(function(e){toast(offlineMsg(e));btn.disabled=false;});
}
function ideaDone(id){
  var g=S.gi.filter(function(x){return x.id===id;})[0];if(!g) return;
  rest('PATCH','gift_ideas?id=eq.'+encodeURIComponent(id),{done:!g.done},'return=minimal').then(function(){if(!g.done) confetti();return refresh();}).then(function(){if(S.sheet&&S.sheet.mode==='planner') drawSheet();}).catch(function(e){toast(offlineMsg(e));});
}
function ideaDel(id){
  var g=S.gi.filter(function(x){return x.id===id;})[0];if(!g) return;
  rest('DELETE','gift_ideas?id=eq.'+encodeURIComponent(id),null,'return=minimal').then(function(){toast('Deleted');return refresh();}).then(function(){showPlanner(g.person);}).catch(function(e){toast(offlineMsg(e));});
}

/* ---- share a list with someone who isn't in the app ---- */
function shareUrl(){return S.myShare?location.origin+location.pathname+'#list='+S.myShare:'';}
function loadShare(){
  if(!S.v4) return;
  rpc('get_list_share',{p_owner:S.uid}).then(function(r){
    var t=r&&r.ok?(r.token||null):null;
    if(t!==S.myShare){S.myShare=t;if(S.tab==='me') paintMain();}
  }).catch(function(){});
}
function shareBlockHTML(){
  if(!S.v4) return '';
  var inner=S.myShare?
    '<div class="codebox"><code>'+esc(shareUrl())+'</code></div><div class="btnrow"><button class="btn primary" data-act="share-send">Send the link</button><button class="btn ghost" data-act="share-copy">Copy</button><button class="btn linkish" data-act="share-stop">Stop sharing</button></div>'+
    '<p class="hint">Anyone with this link can see your list, but not who has bought what, and they can\'t change anything. They can\'t tick things off, so tell the family if someone outside buys something for you.</p>':
    '<button class="btn primary" data-act="share-create">Create a link</button><p class="hint">Good for grandparents or friends. They don\'t need the app or a code.</p>';
  return blk('Share my list','Let someone outside the family see your list.',inner);
}
function shareMake(){rpc('create_list_share',{p_owner:S.uid}).then(function(r){if(r&&r.ok){S.myShare=r.token;paintMain();}else toast('That didn\'t work. Try again.');}).catch(function(e){toast(offlineMsg(e));});}
function shareStop(){rpc('revoke_list_share',{p_owner:S.uid}).then(function(){S.myShare=null;toast('Sharing stopped. The old link no longer works.');paintMain();}).catch(function(e){toast(offlineMsg(e));});}
function showShared(token){
  document.title='A wish list · I Want This';
  gate('<div class="gate"><div class="gate-mark pulse">'+ic('tag',28)+'</div><h1>Opening the list</h1></div>');
  rawFetch('/rest/v1/rpc/get_shared_list',{method:'POST',body:{p_token:token}}).then(function(r){
    if(!r||!r.ok){gateMsg('This link isn\'t working','The list may have been unshared. Ask the person to send you a new link.');return;}
    var items=(r.items||[]).map(function(i,k){var ph=okPhoto(i.photo)?i.photo:'';i.photo_hash=ph?('sh'+k):'';if(ph) S.photos.set(i.photo_hash,ph);i.id='sh'+k;return i;});
    var h='<div class="shared"><div class="brand">'+ic('tag',22)+'<span>I want <em>this</em></span></div><h1>'+esc(r.name)+'’s wish list</h1>'+(r.bio?'<p class="bio">“'+esc(r.bio)+'”</p>':'')+
      '<p class="sub">You can see what '+esc(r.name)+' would like. Tap an item to open the shop page or compare prices.</p>'+
      (items.length?'<ul class="items">'+items.map(function(i){
        var u=safeUrl(i.link),L=searchLinks(i.title);
        return '<li class="card"><div class="card-main">'+mediaHTML(i)+'<span class="card-body"><span class="card-title">'+esc(i.title)+'</span><span class="card-meta">'+(hasPrice(i)?'<span class="price">about '+fmtPrice(Number(i.price))+'</span>':'')+'</span>'+(i.note?'<span class="fine">'+esc(i.note)+'</span>':'')+'</span></div>'+
          '<div class="card-foot">'+(u?'<a class="btn small ghost" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">Open page '+ic('external',16)+'</a>':'')+'<a class="btn small ghost" href="'+esc(L.primary.href)+'" target="_blank" rel="noopener noreferrer">Compare prices '+ic('external',16)+'</a></div></li>';
      }).join('')+'</ul>':'<div class="empty"><h2>Nothing on the list yet</h2><p>Check back soon.</p></div>')+
      '<p class="fine">Tell the family if you buy something so nobody doubles up.</p></div>';
    $('#gate').innerHTML=h;
  }).catch(function(){gateMsg('Can\'t open the list','Check your connection and try again.','<button class="btn primary" data-act="reload">Try again</button>');});
}

/* ---- thank-yous and received gifts ---- */
function thankedOf(id){var n=S.rn.get(id);return !!(n&&n.thanked);}
function thanksNudge(){
  if(!S.v4) return '';
  var cut=Date.now()-60*864e5;
  var n=S.items.filter(function(i){return i.owner===S.uid&&i.received_at&&Date.parse(i.received_at)>cut&&!thankedOf(i.id);}).length;
  if(!n) return '';
  return '<button class="nudge thanknudge" data-act="show-thanks"><span><strong>'+plural(n,'thank-you')+' to send.</strong> Tap to see what you\'ve been given.</span></button>';
}
function recCardHTML(i){
  var base=cardHTML(i,false);
  if(!S.v4||!canManage(i.owner)) return base;
  var n=S.rn.get(i.id),th=!!(n&&n.thanked);
  var foot='<div class="card-foot thanks"><span class="from">'+(n&&n.from_name?'From '+esc(n.from_name):'Who was it from?')+'</span>'+(n&&okPhoto(n.photo)?'<img class="rphoto" src="'+n.photo+'" alt="">':'')+
    '<button class="btn small ghost" data-act="thanks" data-id="'+esc(i.id)+'">Details</button>'+
    '<button class="btn small '+(th?'linkish':'primary')+'" data-act="thank-toggle" data-id="'+esc(i.id)+'">'+(th?'Thank-you sent ✓':'Mark thank-you sent')+'</button></div>';
  return base.replace(/<\/li>$/,foot+'</li>');
}
function thanksSheetHTML(it){
  var n=S.rn.get(it.id)||{};
  return '<div class="grab"></div><div class="sheet-head"><h2 id="sheet-title" tabindex="-1">Got it!</h2><button class="icon-btn" data-act="close" aria-label="Close">'+ic('close')+'</button></div>'+
    '<p class="hint" style="margin-bottom:14px">'+esc(it.title)+'. Note who it was from so you remember to say thanks. Only you can see this.</p>'+
    '<form id="thanksForm" class="form" autocomplete="off" data-id="'+esc(it.id)+'">'+
    '<div class="field"><label for="t-from">Who was it from? <span class="opt">optional</span></label><input id="t-from" type="text" maxlength="60" value="'+esc(n.from_name||'')+'"></div>'+
    '<div class="field"><span class="lbl">Photo <span class="opt">optional</span></span><div class="photo-row"><div id="t-prev" class="prev">'+(okPhoto(n.photo)?'<img src="'+n.photo+'" alt="">':ic('camera',30))+'</div><div class="photo-actions"><label class="btn ghost small" for="t-photo">'+ic('camera',18)+'<span>Add a photo</span></label><input id="t-photo" class="sr-only" type="file" accept="image/*" data-tphoto="1"></div></div></div>'+
    '<label class="check"><input type="checkbox" id="t-done"'+(n.thanked?' checked':'')+'><span><strong>Thank-you sent</strong><small>Tick once you\'ve said thanks.</small></span></label>'+
    '<button class="btn primary wide" type="submit">Save</button></form>';
}
function saveThanks(f){
  var id=f.dataset.id,body={item_id:id,from_name:$('#t-from').value.trim().slice(0,60),thanked:$('#t-done').checked};
  if(S.draft&&S.draft.photo) body.photo=S.draft.photo;
  var btn=f.querySelector('button[type=submit]');btn.disabled=true;
  rest('POST','received_notes?on_conflict=item_id',body,'resolution=merge-duplicates,return=minimal').then(function(){closeSheet();toast('Saved');return refresh();}).catch(function(e){toast(offlineMsg(e));btn.disabled=false;});
}
function thankToggle(id){
  var cur=thankedOf(id);
  rest('POST','received_notes?on_conflict=item_id',{item_id:id,thanked:!cur},'resolution=merge-duplicates,return=minimal').then(function(){if(!cur) confetti();return refresh();}).catch(function(e){toast(offlineMsg(e));});
}
document.addEventListener('change',function(e){
  var t=e.target;if(!(t&&t.matches&&t.matches('input[data-tphoto]'))) return;
  var f=t.files&&t.files[0];if(!f) return;
  shrink(f).then(function(d){if(S.draft){S.draft.photo=d;var p=$('#t-prev');if(p) p.innerHTML='<img src="'+d+'" alt="">';}}).catch(function(){toast("That photo couldn't be read. Try another one.");});
});


/* ================= app lock: face or fingerprint on every fresh open ================= */
var LOCK_KEY='iwt.lock.v1';
function lockInfo(){try{var l=JSON.parse(lsGet(LOCK_KEY)||'null');return l&&l.id?l:null;}catch(e){return null;}}
function bytesToB64u(b){var s='',a=new Uint8Array(b);for(var i=0;i<a.length;i++) s+=String.fromCharCode(a[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function b64uToBytes(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4) t+='=';var s=atob(t),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++) a[i]=s.charCodeAt(i);return a;}
function rand(n){var a=new Uint8Array(n);crypto.getRandomValues(a);return a;}
function bioApi(){return !!(window.PublicKeyCredential&&navigator.credentials&&navigator.credentials.create&&window.isSecureContext);}
S.bioOK=false;
try{if(bioApi()&&PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(function(v){S.bioOK=!!v;if(S.tab==='me'&&S.shown==='main') paintMain();}).catch(function(){});}catch(e){}
function bioEnable(){
  var me=S.members.get(S.uid);
  return navigator.credentials.create({publicKey:{
    challenge:rand(32),rp:{name:'I Want This',id:location.hostname},
    user:{id:rand(16),name:nm(me),displayName:nm(me)},
    pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
    authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required',residentKey:'discouraged'},
    timeout:60000,attestation:'none'}}).then(function(c){
      if(!c||!c.rawId) throw new Error('no credential');
      lsSet(LOCK_KEY,JSON.stringify({id:bytesToB64u(c.rawId),at:Date.now()}));
    });
}
function bioAsk(){
  var l=lockInfo();if(!l) return Promise.resolve();
  return navigator.credentials.get({publicKey:{
    challenge:rand(32),rpId:location.hostname,timeout:60000,userVerification:'required',
    allowCredentials:[{type:'public-key',id:b64uToBytes(l.id),transports:['internal']}]}}).then(function(a){if(!a) throw new Error('cancelled');});
}
function bioToggle(){
  if(lockInfo()){lsSet(LOCK_KEY,'');toast('Unlock is off');paintMain();return;}
  if(!S.bioOK){toast("This phone can't do that from a web app.");return;}
  bioEnable().then(function(){toast("Unlock is on. You'll be asked each time you open the app.");paintMain();})
    .catch(function(e){toast(e&&e.name==='NotAllowedError'?'Cancelled. Nothing changed.':"Couldn't set that up on this phone.");});
}
function bioBlockHTML(){
  var on=!!lockInfo();
  if(!S.bioOK&&!on) return blk('App lock','',"<p class=\"hint\">Face or fingerprint unlock isn't available for web apps on this phone or browser. Your phone's own screen lock still protects the app.</p>");
  return blk('App lock','Ask for your face or fingerprint every time the app is opened.',
    '<div class="trows">'+switchRow('Unlock with face or fingerprint','Uses your phone\'s own Face ID or fingerprint. The app never sees your face.','bio-toggle','lock',on)+'</div>'+
    '<p class="hint">This is a privacy screen for this phone. If your phone can\'t unlock, you can sign in again with your name and PIN.</p>');
}
function showLock(next,msg){
  S.shown='lock';
  gate('<div class="gate"><div class="gate-mark">'+ic('lock',28)+'</div><h1>Welcome back</h1><p>Unlock to see your family lists.</p><div id="lock-msg" role="alert">'+(msg?'<div class="form-error">'+esc(msg)+'</div>':'')+'</div>'+
    '<button class="btn primary" data-act="bio-unlock">'+ic('lock',18)+' Unlock</button><button class="btn linkish" data-act="bio-pin">Use my name and PIN instead</button></div>');
  S.lockNext=next;
}
function tryUnlock(){
  bioAsk().then(function(){var n=S.lockNext;S.lockNext=null;if(n) n();}).catch(function(e){
    var el=$('#lock-msg');if(el) el.innerHTML='<div class="form-error">'+(e&&e.name==='NotAllowedError'?'That didn\'t unlock. Try again.':'Couldn\'t unlock. Try again, or use your PIN.')+'</div>';
  });
}
function bioPin(){lsSet(LOCK_KEY,'');lsSet(SESSION_KEY,'');location.reload();}

/* ================= fun: confetti, snow, surprise, picture backfill ================= */
function reduceMotion(){try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
function confetti(){
  if(PREF.calm||reduceMotion()) return;
  var c=document.createElement('canvas');c.className='fx';c.setAttribute('aria-hidden','true');
  var w=c.width=window.innerWidth,h=c.height=window.innerHeight,x=c.getContext('2d');if(!x) return;
  document.body.appendChild(c);
  var cols=['#FF4F7B','#FFC83D','#2BC48A','#5B7CFF','#B06CFF','#FF8A3D'],ps=[],n=70,k;
  for(k=0;k<n;k++) ps.push({x:w/2+(Math.random()-.5)*60,y:h*0.62,vx:(Math.random()-.5)*11,vy:-(6+Math.random()*9),r:4+Math.random()*5,a:Math.random()*6.28,va:(Math.random()-.5)*.4,c:cols[k%cols.length]});
  var t0=Date.now();
  (function step(){
    var t=Date.now()-t0;x.clearRect(0,0,w,h);
    for(var j=0;j<ps.length;j++){var p=ps[j];p.vy+=.34;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;
      x.save();x.globalAlpha=Math.max(0,1-t/1700);x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r,-p.r/2,p.r*2,p.r);x.restore();}
    if(t<1700) requestAnimationFrame(step);else if(c.parentNode) c.parentNode.removeChild(c);
  })();
}
(function(){
  var cv=null,raf=0,fl=[];
  function stop(){if(raf) cancelAnimationFrame(raf);raf=0;if(cv&&cv.parentNode) cv.parentNode.removeChild(cv);cv=null;}
  window.iwtSnow=function(on){
    if(!on||reduceMotion()){stop();return;}
    if(cv) return;
    cv=document.createElement('canvas');cv.className='fx snow';cv.setAttribute('aria-hidden','true');
    var x=cv.getContext('2d');if(!x){cv=null;return;}
    function size(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
    size();window.addEventListener('resize',size);
    document.body.appendChild(cv);
    fl=[];for(var k=0;k<42;k++) fl.push({x:Math.random()*cv.width,y:Math.random()*cv.height,r:1.4+Math.random()*2.6,v:.4+Math.random()*.9,d:Math.random()*6.28});
    (function tick(){
      if(!cv) return;
      if(!document.hidden){
        x.clearRect(0,0,cv.width,cv.height);var dk=document.documentElement.dataset.mode==='dark';x.fillStyle=dk?'rgba(255,255,255,.9)':'rgba(130,140,225,.75)';x.shadowColor=dk?'rgba(160,170,230,.5)':'rgba(255,255,255,.9)';x.shadowBlur=3;
        for(var j=0;j<fl.length;j++){var f=fl[j];f.d+=.012;f.y+=f.v;f.x+=Math.sin(f.d)*.4;if(f.y>cv.height+6){f.y=-6;f.x=Math.random()*cv.width;}
          x.beginPath();x.arc(f.x,f.y,f.r,0,6.28);x.fill();}
      }
      raf=requestAnimationFrame(tick);
    })();
  };
})();
if(PREF.snow&&window.iwtSnow) window.iwtSnow(true);
function surprise(uid){
  var m=S.members.get(uid);if(!m) return;
  var open=S.items.filter(function(i){return i.owner===uid&&!i.received_at&&!isTaken(i.id);});
  if(!open.length){toast('Everything on this list is already taken');return;}
  var it=open[Math.floor(Math.random()*open.length)];
  toast('How about this for '+nm(m)+'?');
  openSheet('detail',it.id);
}
var PICTRIED_KEY='iwt.pictried.v2';
function fetchPicFor(it){
  return api('/functions/v1/link-info',{method:'POST',body:{url:safeUrl(it.link)}}).then(function(r){
    if(r&&typeof r.image==='string'&&/^data:image\/(jpeg|png|webp|gif);base64,/.test(r.image)&&r.image.length<8000000){
      return shrinkTo(r.image,480,0.72).then(function(d){
        return rest('PATCH','items?id=eq.'+encodeURIComponent(it.id),{photo:d},'return=minimal').then(function(){return true;});
      });
    }
    return false;
  });
}
function backfillPics(){
  if(S.linkOff||S.backfilling) return;
  var tried={};try{tried=JSON.parse(lsGet(PICTRIED_KEY)||'{}')||{};}catch(e){}
  var todo=S.items.filter(function(i){return safeUrl(i.link)&&!i.photo_hash&&!tried[i.id]&&canManage(i.owner);}).slice(0,4);
  if(!todo.length) return;
  S.backfilling=true;var changed=false;
  todo.reduce(function(p,it){
    return p.then(function(){
      if(S.linkOff) return;
      return fetchPicFor(it).then(function(ok){tried[it.id]=1;lsSet(PICTRIED_KEY,JSON.stringify(tried));if(ok) changed=true;})
      .catch(function(e){
        if(e&&(e.status===404||e.status===401||e.status===403)) S.linkOff=true;
        else {tried[it.id]=1;lsSet(PICTRIED_KEY,JSON.stringify(tried));}
      });
    });
  },Promise.resolve()).then(function(){S.backfilling=false;if(changed) refresh();},function(){S.backfilling=false;});
}
function getPic(id){
  var it=getItem(id);if(!it||!safeUrl(it.link)||!canManage(it.owner)) return;
  var b=document.querySelector('[data-act="get-pic"]');if(b){b.disabled=true;b.textContent='Looking for a picture…';}
  fetchPicFor(it).then(function(ok){
    if(ok){toast('Picture added');closeSheet();return refresh();}
    toast("Couldn't find a picture on that page. Use Edit to add your own photo.");if(b){b.disabled=false;b.textContent='Try to find a picture';}
  }).catch(function(e){
    toast(e&&(e.status===404||e.status===401||e.status===403)?'Reading links isn\'t switched on yet.':'Couldn\'t reach that page. Try again later.');
    if(b){b.disabled=false;b.textContent='Try to find a picture';}
  });
}

/* ================= loading data ================= */
function sigOf(){
  var parts=[S.members.size,S.v2,S.v3,startOfToday().getTime()];
  S.members.forEach(function(m,id){parts.push([id,m.name,m.color,m.is_admin,m.avatar_hash||'',S.avatars.has(m.avatar_hash)?1:0,m.birth_month||'',m.birth_day||'',m.managed_by||'',m.bio||''].join('|'));});
  S.items.forEach(function(i){parts.push([i.id,i.title,i.link,i.occasion,i.note,i.price,i.photo_hash,S.photos.has(i.photo_hash)?1:0,i.received_at||'',i.priority||0,i.link_title||'',i.link_desc||'',i.price_seen||'',i.price_base||''].join('|'));});
  S.claims.forEach(function(list,id){parts.push(id+':'+list.map(function(c){return c.buyer+c.mode;}).sort().join(','));});
  parts.push(JSON.stringify(S.santa));
  parts.push(S.v4+JSON.stringify(Array.from(S.holds.entries()))+JSON.stringify(S.gp)+JSON.stringify(Array.from(S.gb.entries())));
  parts.push(S.gi.map(function(g){return [g.id,g.person,g.title,g.link,g.note,g.price,g.done,(g.photo||'').length].join('|');}).join('\n'));
  parts.push(Array.from(S.rn.values()).map(function(n){return [n.item_id,n.from_name,n.thanked,(n.photo||'').length].join('|');}).join('\n'));
  parts.push(S.online);
  return parts.join('\n');
}
function loadMembers(){
  var v3='members?select=id,name,color,is_admin,avatar_hash,birth_month,birth_day,managed_by,bio&order=name.asc';
  var v2='members?select=id,name,color,is_admin,avatar_hash,birth_month,birth_day,managed_by&order=name.asc';
  return rest('GET',v3).then(function(r){S.v2=true;S._m3=true;return r;},function(e){
    if(!(e&&e.status===400)) throw e;
    S._m3=false;
    return rest('GET',v2).then(function(r){S.v2=true;return r;},function(e2){
      if(!(e2&&e2.status===400)) throw e2;
      S.v2=false;
      return tryGet('members?select=id,name,color,is_admin,avatar_hash&order=name.asc','members?select=id,name,color,is_admin&order=name.asc');
    });
  });
}
function loadItems(){
  var base='id,owner,title,link,occasion,note,price,photo_hash,created_at';
  var v3=base+',received_at,link_title,link_desc,link_site,priority,price_base,price_seen';
  return rest('GET','items?select='+v3+'&order=created_at.desc').then(function(r){S._i3=true;return r;},function(e){
    if(!(e&&e.status===400)) throw e;
    S._i3=false;
    return tryGet('items?select='+base+',received_at&order=created_at.desc','items?select='+base+'&order=created_at.desc');
  });
}
function loadAll(){
  if(S.loading||!S.uid) return Promise.resolve();
  S.loading=true;
  var icols='id,owner,title,link,occasion,note,price,photo_hash,created_at';
  return Promise.all([
    rpc('current_member'),
    loadMembers(),
    loadItems(),
    tryGet('claims?select=item_id,buyer,mode','claims?select=item_id,buyer'),
    rpc('santa_overview').catch(function(){return [];}),
    rest('GET','holds?select=item_id,member_id,created_at').catch(function(){return null;}),
    rest('GET','gift_people?select=id,name&order=created_at.asc').catch(function(){return null;}),
    rest('GET','gift_budgets?select=person,amount').catch(function(){return null;}),
    rest('GET','gift_ideas?select=id,person,title,link,note,price,photo,done,created_at&order=created_at.desc').catch(function(){return null;}),
    rest('GET','received_notes?select=item_id,from_name,photo,thanked').catch(function(){return null;})
  ]).then(function(r){
    S.loading=false;
    if(!r[0]){leaveToAuth();return;}
    if(r[0]!==S.uid) S.uid=r[0];
    S.v3=!!(S._m3&&S._i3);
    S.members=new Map(r[1].map(function(m){return [m.id,m];}));
    S.items=r[2].map(function(i){i.createdAt=Date.parse(i.created_at)||0;i.photo_hash=i.photo_hash||'';i.received_at=i.received_at||null;return i;});
    S.itemMap=new Map(S.items.map(function(i){return [i.id,i];}));
    var cm=new Map();
    r[3].forEach(function(c){var a=cm.get(c.item_id)||[];a.push({buyer:c.buyer,mode:c.mode||'full'});cm.set(c.item_id,a);});
    S.claims=cm;
    S.santa=Array.isArray(r[4])?r[4]:[];
    if(Array.isArray(r[5])){
      S.v4=true;
      var hm=new Map();r[5].forEach(function(h){var a=hm.get(h.item_id)||[];a.push(h);hm.set(h.item_id,a);});S.holds=hm;
      S.gp=Array.isArray(r[6])?r[6]:[];
      S.gb=new Map((Array.isArray(r[7])?r[7]:[]).map(function(b){return [b.person,Number(b.amount)];}));
      S.gi=(Array.isArray(r[8])?r[8]:[]).map(function(g){g.price=(g.price==null?null:Number(g.price));g.photo=okPhoto(g.photo)?g.photo:'';return g;});
      S.rn=new Map((Array.isArray(r[9])?r[9]:[]).map(function(n){n.photo=okPhoto(n.photo)?n.photo:'';return [n.item_id,n];}));
    }
    var wasOnline=S.online;S.online=true;
    var s=sigOf();
    if(s!==S.sig||!wasOnline||S.shown!=='main'){S.sig=s;render();}
    consumeShare();
    loadPhotos();loadAvatars();backfillPics();
  }).catch(function(e){
    S.loading=false;
    if(window.console&&!(e&&e.network)) console.error('loadAll failed',e&&e.stack||e);
    if(e&&e.network){if(S.shown==='main'){S.sig='';paintMain();}return;}
    if(S.shown!=='main'){gateMsg('Lists unavailable',friendlyErr(e),'<button class="btn primary" data-act="reload">Try again</button>');S.shown='error';}
  });
}
function friendlyErr(e){
  var c=e&&(e.code||'');
  if(c==='anonymous_provider_disabled'||/anonymous/i.test(String(e&&e.message))) return 'Anonymous sign-ins are switched off in Supabase. In your Supabase project go to Authentication, then Sign In / Providers, and turn on Allow anonymous sign-ins.';
  if(e&&(e.status===401||e.status===403)) return 'The app\'s connection details look wrong. Check the URL and publishable key in config.js.';
  if(e&&e.network) return 'No connection. Check your internet and try again.';
  if(e&&(e.status===404||c==='PGRST202'||c==='42P01'||c==='PGRST205')) return 'The database isn\'t set up yet. Run setup.sql in the Supabase SQL Editor.';
  return 'The family lists could not be loaded. Try again in a moment.';
}
function fetchPhotos(ids){
  if(!ids.length) return Promise.resolve();
  return rest('GET','items?select=id,photo,photo_hash&id=in.('+ids.map(encodeURIComponent).join(',')+')').then(function(rows){
    rows.forEach(function(r){if(r.photo_hash&&okPhoto(r.photo)) S.photos.set(r.photo_hash,r.photo);});
  });
}
function loadAvatars(){
  if(S.avBusy) return;
  var need=[];
  S.members.forEach(function(m,id){if(m.avatar_hash&&!S.avatars.has(m.avatar_hash)) need.push(id);});
  if(!need.length) return;
  S.avBusy=true;
  rest('GET','members?select=id,avatar,avatar_hash&id=in.('+need.map(encodeURIComponent).join(',')+')').then(function(rows){
    rows.forEach(function(r){if(r.avatar_hash&&okPhoto(r.avatar)) S.avatars.set(r.avatar_hash,r.avatar);});
    S.sig=sigOf();if(S.shown==='main') render();
  }).catch(function(){}).then(function(){S.avBusy=false;});
}
function loadPhotos(){
  if(S.photoBusy) return;
  var seen={},need=[];
  S.items.forEach(function(i){
    if(i.photo_hash&&!S.photos.has(i.photo_hash)&&!seen[i.photo_hash]){seen[i.photo_hash]=1;need.push(i.id);}
  });
  if(!need.length) return;
  S.photoBusy=true;
  var batches=[];for(var k=0;k<need.length;k+=8) batches.push(need.slice(k,k+8));
  batches.reduce(function(p,b){return p.then(function(){return fetchPhotos(b).then(function(){S.sig=sigOf();if(S.shown==='main') render();});});},Promise.resolve())
    .catch(function(){}).then(function(){S.photoBusy=false;});
}

/* ================= account actions ================= */
function enter(){
  S.shown='loading';gateLoading();
  S.sig='';
  return rpc('current_member').then(function(id){
    if(!id){leaveToAuth();return;}
    S.uid=id;S.loading=false;
    return loadAll();
  }).catch(function(e){S.shown='error';gateMsg('Lists unavailable',friendlyErr(e),'<button class="btn primary" data-act="reload">Try again</button>');});
}
function leaveToAuth(msg){
  S.avDraft={data:'',dirty:false};S.uid=null;S.tab='mine';S.viewing=null;S.filter='all';S.showReceived=false;S.members=new Map();S.items=[];S.itemMap=new Map();S.claims=new Map();S.santa=[];S.sig='';
  if(S.sheet) closeSheet();
  showAuth(msg||'');
}
function submitAuth(form){
  var join=form.dataset.mode==='join',btn=form.querySelector('button[type=submit]');
  var name=$('#a-name').value.trim(),pin=$('#a-pin').value;
  if(!name||!pin) return;
  btn.disabled=true;
  var p;
  if(join){
    var cEl=form.querySelector('input[name="a--color"]:checked');
    p=rpc('join_family',{p_code:$('#a-code').value.replace(/\s+/g,''),p_name:name,p_pin:pin,p_color:cEl?cEl.value:PALETTE[0]});
  }else p=rpc('sign_in',{p_name:name,p_pin:pin});
  p.then(function(r){
    if(r&&r.ok){
      lsSet(NAME_KEY,name);
      var av=(join&&S.avDraft.dirty&&S.avDraft.data)?rpc('set_avatar',{p_avatar:S.avDraft.data}).catch(function(){}):Promise.resolve();
      return av.then(function(){S.avDraft={data:'',dirty:false};return enter();});
    }
    var code=join?$('#a-code').value:'';
    showAuth(authMsg(r&&r.error));
    var n=$('#a-name');if(n) n.value=name;var c=$('#a-code');if(c) c.value=code;
  }).catch(function(e){
    var msg=e&&e.network?'No connection. Check your internet and try again.':friendlyErr(e);
    showAuth(msg);var n=$('#a-name');if(n) n.value=name;
  });
}
function signOut(){
  lsSet(LOCK_KEY,'');
  rpc('sign_out').catch(function(){}).then(function(){leaveToAuth();S.authMode='signin';showAuth('');});
}

/* ================= writes ================= */
function refresh(){S.sig='';return loadAll();}
function offlineMsg(e,fallback){return e&&e.network?"You're offline. That didn't save.":(fallback||"That didn't save. Try again.");}
function saveItem(form){
  var id=form.dataset.id,title=$('#f-title').value.trim();if(!title) return;
  var cur=id?getItem(id):null,owner=cur?cur.owner:form.dataset.owner;
  if(!canManage(owner)) return;
  var link=safeUrl($('#f-link').value);
  var occEl=form.querySelector('input[name="f-occ"]:checked'),occ=occEl?occEl.value:'anytime';
  var note=$('#f-note').value.trim().slice(0,240);
  var p=parseFloat($('#f-price').value.replace(',','.')),price=isFinite(p)&&p>=0&&p<100000000?Math.round(p*100)/100:null;
  var body={title:title,link:link,occasion:occ,note:note,price:price};
  if(S.v3){
    var mt=S.draft&&S.draft.meta&&link&&S.draft.meta.url===link?S.draft.meta:null,pk=$('#f-pick');
    body.link_title=mt&&mt.title?mt.title:null;body.link_desc=mt&&mt.desc?mt.desc:null;body.link_site=mt&&mt.site?mt.site:(link?hostOf(link):null);
    body.priority=pk&&pk.checked?1:0;
  }
  if(!id){body.owner=owner;body.photo=S.draft.photo||'';}
  else if(S.draft.dirty) body.photo=S.draft.photo||'';
  var btn=form.querySelector('button[type=submit]');btn.disabled=true;
  var req=id?rest('PATCH','items?id=eq.'+encodeURIComponent(id),body,'return=minimal'):rest('POST','items',body,'return=minimal');
  req.then(function(){closeSheet();toast(id?'Saved':'Added to the list');return refresh();})
  .catch(function(e){toast(offlineMsg(e));btn.disabled=false;});
}
function delItem(){
  var form=$('#itemForm'),id=form&&form.dataset.id,b=$('#f-del');if(!id) return;
  var it=getItem(id);if(!it||!canManage(it.owner)) return;
  if(!S.armDelete){
    S.armDelete=true;b.textContent='Tap again to delete';
    setTimeout(function(){if(S.armDelete&&b.isConnected){S.armDelete=false;b.textContent='Delete';}},4000);
    return;
  }
  b.disabled=true;
  rest('DELETE','items?id=eq.'+encodeURIComponent(id),null,'return=minimal')
  .then(function(){closeSheet();toast('Deleted');return refresh();})
  .catch(function(){toast("That didn't delete. Try again.");b.disabled=false;});
}
function setReceived(id,on){
  var it=getItem(id);if(!it||!canManage(it.owner)) return;
  rest('PATCH','items?id=eq.'+encodeURIComponent(id),{received_at:on?new Date().toISOString():null},'return=minimal')
    .then(function(){if(on) confetti();toast(on?'Moved to Received':'Back on the list');return refresh();})
    .then(function(){if(S.sheet&&S.sheet.mode==='detail') closeSheet();if(on&&S.v4&&getItem(id)) openSheet('thanks',id);})
    .catch(function(e){toast(offlineMsg(e));});
}
function bulkReceived(){
  var list=S.items.filter(function(i){return i.owner===S.uid&&!i.received_at;}),f=effFilter(list);
  if(f==='all') return;
  if(!S.armBulk){S.armBulk=true;paintMain();setTimeout(function(){if(S.armBulk){S.armBulk=false;paintMain();}},4000);return;}
  S.armBulk=false;
  rest('PATCH','items?owner=eq.'+encodeURIComponent(S.uid)+'&occasion=eq.'+encodeURIComponent(f)+'&received_at=is.null',{received_at:new Date().toISOString()},'return=minimal')
    .then(function(){toast('Tidied up');S.filter='all';return refresh();})
    .catch(function(e){toast(offlineMsg(e));paintMain();});
}
function msgBox(sel,cls,text){var el=$(sel);if(el) el.innerHTML=text?'<div class="'+cls+'" role="alert">'+esc(text)+'</div>':'';}
function saveProfile(form){
  var name=$('#p-name').value.trim().slice(0,30);if(!name) return;
  var cEl=form.querySelector('input[name="p--color"]:checked'),color=cEl?cEl.value:PALETTE[0];
  var bd=S.v2?readBday('p-b'):{m:null,d:null};
  if(bd.partial){msgBox('#p-msg','form-error','Pick both a day and a month for your birthday, or leave both empty.');return;}
  var btn=form.querySelector('button[type=submit]');btn.disabled=true;
  rpc('update_profile',{p_name:name,p_color:color}).then(function(r){
    if(!(r&&r.ok)){btn.disabled=false;msgBox('#p-msg','form-error',authMsg(r&&r.error));return;}
    lsSet(NAME_KEY,name);
    var bdP=S.v2?rpc('set_birthday',{p_month:bd.m,p_day:bd.d}):Promise.resolve({ok:true});
    var bioP=S.v3&&$('#p-bio')?rpc('set_bio',{p_member:null,p_bio:$('#p-bio').value}):Promise.resolve({ok:true});
    var av=S.avDraft.dirty?rpc('set_avatar',{p_avatar:S.avDraft.data}):Promise.resolve({ok:true});
    return Promise.all([bdP,av,bioP]).then(function(x){
      btn.disabled=false;
      if(x[0]&&x[0].ok===false){msgBox('#p-msg','form-error',authMsg(x[0].error));return;}
      if(x[2]&&x[2].ok===false){msgBox('#p-msg','form-error','Your note is too long. Keep it under 140 characters.');return;}
      if(x[1]&&x[1].ok){closeSheet();toast('Saved');return refresh();}
      msgBox('#p-msg','form-error',"Your name saved, but the picture didn't. Try a different photo.");
    });
  }).catch(function(){btn.disabled=false;msgBox('#p-msg','form-error',"That didn't save. Check your connection.");});
}
function saveChild(form){
  var id=form.dataset.id,name=$('#k-name').value.trim().slice(0,30);if(!name) return;
  var cEl=form.querySelector('input[name="k--color"]:checked'),color=cEl?cEl.value:PALETTE[0];
  var bd=readBday('k-b');
  if(bd.partial){msgBox('#k-msg','form-error','Pick both a day and a month, or leave both empty.');return;}
  var btn=form.querySelector('button[type=submit]');btn.disabled=true;
  var p=id?rpc('update_child',{p_member:id,p_name:name,p_color:color,p_month:bd.m,p_day:bd.d}):rpc('add_child',{p_name:name,p_color:color,p_month:bd.m,p_day:bd.d});
  p.then(function(r){
    if(!(r&&r.ok)){btn.disabled=false;msgBox('#k-msg','form-error',authMsg(r&&r.error));return;}
    var kid=id||r.member;
    var av=S.avDraft.dirty?rpc('set_child_avatar',{p_member:kid,p_avatar:S.avDraft.data}):Promise.resolve({ok:true});
    var bioK=S.v3&&$('#k-bio')?rpc('set_bio',{p_member:kid,p_bio:$('#k-bio').value}).catch(function(){}):Promise.resolve();
    av=av.then(function(a){return bioK.then(function(){return a;});});
    return av.then(function(a){
      btn.disabled=false;
      if(a&&a.ok===false){msgBox('#k-msg','form-error','Saved, but the picture didn\'t. Try a different photo.');return;}
      closeSheet();toast(id?'Saved':name+' added');
      if(!id){S.tab='family';S.viewing=kid;}
      return refresh();
    });
  }).catch(function(e){btn.disabled=false;msgBox('#k-msg','form-error',offlineMsg(e));});
}
function delChild(){
  var form=$('#childForm'),id=form&&form.dataset.id,b=$('#k-del');if(!id) return;
  if(!S.armDelete){
    S.armDelete=true;b.textContent='Tap again to delete';
    setTimeout(function(){if(S.armDelete&&b.isConnected){S.armDelete=false;b.textContent='Delete';}},4000);
    return;
  }
  b.disabled=true;
  rpc('delete_child',{p_member:id}).then(function(r){
    if(!(r&&r.ok)){b.disabled=false;msgBox('#k-msg','form-error',authMsg(r&&r.error));return;}
    closeSheet();S.viewing=null;toast('Deleted');return refresh();
  }).catch(function(e){b.disabled=false;msgBox('#k-msg','form-error',offlineMsg(e));});
}
function savePin(form){
  var pin=$('#n-pin').value;if(!pin) return;
  var btn=form.querySelector('button[type=submit]');btn.disabled=true;
  rpc('change_pin',{p_pin:pin}).then(function(r){
    btn.disabled=false;
    if(r&&r.ok){$('#n-pin').value='';msgBox('#n-msg','form-ok','PIN changed. Use the new one next time you sign in.');}
    else msgBox('#n-msg','form-error',authMsg(r&&r.error));
  }).catch(function(){btn.disabled=false;msgBox('#n-msg','form-error',"That didn't save. Check your connection.");});
}
function resetPin(form){
  var who=$('#r-who').value,pin=$('#r-pin').value;if(!who||!pin) return;
  var btn=form.querySelector('button[type=submit]');btn.disabled=true;
  rpc('admin_reset_pin',{p_member:who,p_pin:pin}).then(function(r){
    btn.disabled=false;
    if(r&&r.ok){$('#r-pin').value='';msgBox('#r-msg','form-ok','Done. Tell them their new PIN.');}
    else msgBox('#r-msg','form-error',authMsg(r&&r.error));
  }).catch(function(){btn.disabled=false;msgBox('#r-msg','form-error',"That didn't save. Check your connection.");});
}
function setBought(id,mode){
  var it=getItem(id);if(!it||it.owner===S.uid) return;
  if(mode==='full'&&claimsOf(id).some(function(c){return c.buyer!==S.uid;})){toast('Someone else has already ticked this');return;}
  var body=S.v2?{item_id:id,buyer:S.uid,mode:mode}:{item_id:id,buyer:S.uid};
  rest('POST','claims',body,'return=minimal').then(function(){
    var a=(S.claims.get(id)||[]).filter(function(c){return c.buyer!==S.uid;});a.push({buyer:S.uid,mode:mode});S.claims.set(id,a);
    S.sig=sigOf();render();
    confetti();toast(mode==='share'?"You're going halves. "+nm(S.members.get(it.owner))+" can't see this.":"Marked as bought. "+nm(S.members.get(it.owner))+" can't see this.");
  }).catch(function(e){
    if(e&&(e.status===409||e.code==='23505')){toast('Someone else got there first. Have a look at the latest.');refresh();}
    else toast(offlineMsg(e));
  });
}
function unBought(id){
  if(!myClaim(id)) return;
  rest('DELETE','claims?item_id=eq.'+encodeURIComponent(id)+'&buyer=eq.'+encodeURIComponent(S.uid),null,'return=minimal').then(function(){
    var a=(S.claims.get(id)||[]).filter(function(c){return c.buyer!==S.uid;});
    if(a.length) S.claims.set(id,a);else S.claims.delete(id);
    S.sig=sigOf();render();toast('Back to still to buy');
  }).catch(function(e){toast(offlineMsg(e));});
}
function runSanta(form){
  var name=$('#s-name').value.trim(),budget=$('#s-budget').value.trim();
  var ids=Array.from(form.querySelectorAll('input[name="s-who"]:checked')).map(function(x){return x.value;});
  if(ids.length<3){msgBox('#s-msg','form-error',authMsg('need_three'));return;}
  var btn=form.querySelector('button[type=submit]');btn.disabled=true;
  rpc('run_secret_santa',{p_name:name,p_budget:budget,p_members:ids}).then(function(r){
    btn.disabled=false;
    if(!(r&&r.ok)){msgBox('#s-msg','form-error',authMsg(r&&r.error));return;}
    S.santaForm=false;toast('Names drawn! Tap to see who you have.');return refresh().then(function(){if(S.sheet&&S.sheet.mode==='santa') drawSheet();});
  }).catch(function(e){btn.disabled=false;msgBox('#s-msg','form-error',offlineMsg(e));});
}
function delSanta(id){
  if(S.armDelete!==id){S.armDelete=id;drawSheet();setTimeout(function(){if(S.armDelete===id){S.armDelete=false;if(S.sheet&&S.sheet.mode==='santa') drawSheet();}},4000);return;}
  rpc('delete_santa',{p_draw:id}).then(function(r){
    S.armDelete=false;
    if(!(r&&r.ok)){toast(authMsg(r&&r.error));drawSheet();return;}
    toast('Draw deleted');return refresh().then(function(){if(S.sheet&&S.sheet.mode==='santa') drawSheet();});
  }).catch(function(e){toast(offlineMsg(e));});
}
function b64uToBytes(b){var p=(b+'===').slice(0,b.length+(4-b.length%4)%4).replace(/-/g,'+').replace(/_/g,'/');var r=atob(p),o=new Uint8Array(r.length);for(var i=0;i<r.length;i++) o[i]=r.charCodeAt(i);return o;}
function loadReminders(){
  if(!S.v3||!pushSupport().ok){S.rem=null;return Promise.resolve();}
  var local=navigator.serviceWorker.ready.then(function(reg){return reg.pushManager.getSubscription();}).then(function(sub){return sub;},function(){return null;});
  return Promise.all([rpc('get_reminders'),local]).then(function(x){
    var r=x[0]||{};S.rem={prefs:r.prefs||{},devices:r.devices||0,thisDevice:!!x[1]};
    if(S.tab==='me'&&S.shown==='main') paintMain();
  }).catch(function(){});
}
function pushOn(){
  var st=$('.blk .btn[data-act=push-on]');if(st) st.disabled=true;
  Notification.requestPermission().then(function(p){
    if(p!=='granted'){toast('Notifications were not allowed.');S.rem=S.rem||{prefs:{},devices:0};paintMain();return;}
    return navigator.serviceWorker.ready.then(function(reg){
      return reg.pushManager.getSubscription().then(function(old){return old||reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64uToBytes(CFG.VAPID_PUBLIC_KEY)});});
    }).then(function(sub){
      var j=sub.toJSON(),k=j.keys||{};
      return rpc('save_push_sub',{p_endpoint:j.endpoint,p_p256dh:k.p256dh,p_auth:k.auth});
    }).then(function(r){
      if(r&&r.ok){toast('Reminders are on');return loadReminders();}
      toast("That didn't work. Try again.");
    });
  }).catch(function(){toast("Couldn't turn reminders on. Check your connection and try again.");paintMain();});
}
function pushOff(){
  navigator.serviceWorker.ready.then(function(reg){return reg.pushManager.getSubscription();}).then(function(sub){
    if(!sub) return;var ep=sub.endpoint;
    return sub.unsubscribe().then(function(){return rpc('delete_push_sub',{p_endpoint:ep});});
  }).then(function(){toast('Reminders are off on this phone');return loadReminders();}).catch(function(){toast("That didn't work.");});
}
function pushTest(){
  navigator.serviceWorker.ready.then(function(reg){return reg.showNotification('I want this',{body:'This is what a reminder looks like.',icon:'icon-192.png',tag:'test'});}).catch(function(){toast("Couldn't show a test.");});
}
function setRem(k){
  var cur=S.rem&&S.rem.prefs?S.rem.prefs[k]!==false:true,o={};o[k]=!cur;
  if(S.rem) S.rem.prefs[k]=!cur;paintMain();
  rpc('set_reminders',{p_prefs:o}).catch(function(){toast("That didn't save.");loadReminders();});
}
function clearReceived(which){
  var kids=Array.from(S.members.entries()).filter(function(e){return e[1].managed_by===S.uid;}).map(function(e){return e[0];});
  var owners=which==='mine'?[S.uid].concat(kids):[which];
  if(which!=='mine'&&!canManage(which)) return;
  if(S.armClear!==which){S.armClear=which;paintMain();setTimeout(function(){if(S.armClear===which){S.armClear=false;paintMain();}},4000);return;}
  S.armClear=false;
  rest('DELETE','items?owner=in.('+owners.map(encodeURIComponent).join(',')+')&received_at=not.is.null',null,'return=minimal')
    .then(function(){toast('Cleared out');return refresh();}).catch(function(e){toast(offlineMsg(e));paintMain();});
}
function inviteText(){
  var url=location.origin+location.pathname+(S.joinCode?'#code='+encodeURIComponent(S.joinCode):'');
  return 'Join our family wish list on I Want This: '+url+'\nThe family code is filled in for you. Just pick your own name and PIN.\nOn Android: Chrome menu, then Install app. On iPhone: Share, then Add to Home Screen.';
}
function copyText(t,ok){
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function(){toast(ok);},function(){toast('Could not copy. Select and copy it by hand.');});
  else toast('Could not copy. Select and copy it by hand.');
}

/* ================= events ================= */
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-act]');if(!el) return;
  var a=el.dataset.act,id=el.dataset.id;
  if(a==='tab'){S.tab=el.dataset.tab;S.viewing=null;S.filter='all';S.armBulk=false;S.armClear=false;paintMain();window.scrollTo(0,0);if(S.tab==='me'){loadReminders();loadJoinCode();loadShare();}}
  else if(a==='pref'){var v=el.dataset.v;setPref(el.dataset.k,el.dataset.k==='accent'?parseInt(v,10):v);paintMain();}
  else if(a==='view'){setPref('layout',el.dataset.v);paintMain();}
  else if(a==='surprise') surprise(el.dataset.uid);
  else if(a==='bio-toggle') bioToggle();
  else if(a==='bio-unlock') tryUnlock();
  else if(a==='bio-pin') bioPin();
  else if(a==='hold') holdIt(id,true);
  else if(a==='unhold') holdIt(id,false);
  else if(a==='planner') showPlanner(id);
  else if(a==='gp-add') openSheet('gp');
  else if(a==='gp-del') delGp(id);
  else if(a==='idea-add') openSheet('idea',null,el.dataset.person);
  else if(a==='idea-edit') openSheet('idea',id,el.dataset.person);
  else if(a==='idea-done') ideaDone(id);
  else if(a==='idea-del') ideaDel(id);
  else if(a==='idea-fill') ideaFill();
  else if(a==='planner-back') showPlanner(el.dataset.person);
  else if(a==='share-create') shareMake();
  else if(a==='share-stop') shareStop();
  else if(a==='share-copy') copyText(shareUrl(),'Link copied');
  else if(a==='share-send'){var su=shareUrl();if(navigator.share) navigator.share({title:'My wish list',text:"Here's my wish list: "+su}).catch(function(){});else copyText(su,'Link copied');}
  else if(a==='thanks') openSheet('thanks',id);
  else if(a==='thank-toggle') thankToggle(id);
  else if(a==='show-thanks'){S.showReceived=true;paintMain();}
  else if(a==='get-pic') getPic(id);
  else if(a==='prefsw'){setPref(el.dataset.k,!PREF[el.dataset.k]);paintMain();}
  else if(a==='rem') setRem(el.dataset.k);
  else if(a==='push-on') pushOn();
  else if(a==='push-off') pushOff();
  else if(a==='push-test') pushTest();
  else if(a==='clear-received') clearReceived(el.dataset.owner);
  else if(a==='person'){S.tab='family';S.viewing=el.dataset.uid;S.filter='all';paintMain();window.scrollTo(0,0);}
  else if(a==='person-from-santa'){closeSheet();S.tab='family';S.viewing=el.dataset.uid;S.filter='all';paintMain();window.scrollTo(0,0);}
  else if(a==='back'){S.viewing=null;S.filter='all';paintMain();window.scrollTo(0,0);}
  else if(a==='filter'){S.filter=el.dataset.f;S.armBulk=false;paintMain();}
  else if(a==='add') openSheet('edit',null,el.dataset.owner||S.uid);
  else if(a==='open') openSheet('detail',id);
  else if(a==='edit') openSheet('edit',id);
  else if(a==='close') closeSheet();
  else if(a==='profile') openSheet('profile');
  else if(a==='bought') setBought(id,'full');
  else if(a==='bought-share') setBought(id,'share');
  else if(a==='unbought') unBought(id);
  else if(a==='received') setReceived(id,true);
  else if(a==='unreceived') setReceived(id,false);
  else if(a==='bulk-received') bulkReceived();
  else if(a==='paste-link') pasteLink();
  else if(a==='toggle-received'){S.showReceived=!S.showReceived;paintMain();}
  else if(a==='rm-photo'){S.draft.photo='';S.draft.dirty=true;S.draft.hasServerPhoto=false;syncPhotoUI();}
  else if(a==='fill-link') fillFromLink(false);
  else if(a==='delete') delItem();
  else if(a==='child-add') openSheet('child',null);
  else if(a==='child-edit') openSheet('child',id);
  else if(a==='child-del') delChild();
  else if(a==='santa'){S.santaForm=false;openSheet('santa');}
  else if(a==='santa-new'){S.santaForm=true;drawSheet();}
  else if(a==='santa-reveal'){S.santaShow[id]=true;drawSheet();}
  else if(a==='santa-hide'){S.santaShow[id]=false;drawSheet();}
  else if(a==='santa-del') delSanta(id);
  else if(a==='authmode'){S.authMode=el.dataset.mode;S.avDraft={data:'',dirty:false};showAuth('');}
  else if(a==='rm-avatar'){S.avDraft={data:'',dirty:true};syncAvatarUI();}
  else if(a==='signout') signOut();
  else if(a==='reload') location.reload();
  else if(a==='copy-code'){if(S.joinCode) copyText(S.joinCode,'Code copied');}
  else if(a==='invite'){
    var t=inviteText();
    if(navigator.share) navigator.share({title:'I Want This',text:t}).catch(function(){});
    else copyText(t,'Invite copied. Paste it into a message.');
  }
});
document.addEventListener('change',function(e){
  var t=e.target;
  if(!(t&&t.matches&&t.matches('input[data-avin]'))) return;
  var f=t.files&&t.files[0];if(!f) return;
  squareShrink(f,192).then(function(d){S.avDraft={data:d,dirty:true};syncAvatarUI();})
    .catch(function(){toast("That photo couldn't be read. Try another one.");});
  t.value='';
});
document.addEventListener('submit',function(e){
  e.preventDefault();var f=e.target;
  if(f.id==='itemForm') saveItem(f);
  else if(f.id==='profileForm') saveProfile(f);
  else if(f.id==='childForm') saveChild(f);
  else if(f.id==='santaForm') runSanta(f);
  else if(f.id==='authForm') submitAuth(f);
  else if(f.id==='pinForm') savePin(f);
  else if(f.id==='resetForm') resetPin(f);
  else if(f.id==='budgetForm') saveBudget(f);
  else if(f.id==='gpForm') saveGp(f);
  else if(f.id==='ideaForm') saveIdea(f);
  else if(f.id==='thanksForm') saveThanks(f);
});
$('#scrim').addEventListener('click',function(e){if(e.target.id==='scrim') closeSheet();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&S.sheet) closeSheet();});
window.addEventListener('online',function(){if(S.uid) loadAll();});
window.addEventListener('offline',function(){S.online=false;if(S.shown==='main'){S.sig='';paintMain();}});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&S.uid) loadAll();});
setInterval(function(){if(!document.hidden&&S.uid) loadAll();},POLL_MS);

/* ================= boot ================= */
function findUrl(t){var m=/https?:\/\/[^\s<>"']+/i.exec(String(t||''));return m?m[0].replace(/[).,;]+$/,''):'';}
function readShare(){
  try{
    var q=new URLSearchParams(location.search),u=findUrl(q.get('url'))||findUrl(q.get('text'))||findUrl(q.get('title'));
    if(!u) return;
    var t=(q.get('title')||'').replace(findUrl(q.get('title')),'').trim();
    if(!t) t=String(q.get('text')||'').replace(findUrl(q.get('text')),'').replace(/\s+/g,' ').trim();
    S.pendingShare={url:u,title:t.slice(0,120)};
    history.replaceState(null,'',location.pathname+location.hash);
  }catch(e){}
}
function consumeShare(){
  var p=S.pendingShare;if(!p||S.shown!=='main'||S.sheet) return;
  S.pendingShare=null;S.tab='mine';S.viewing=null;render();
  openSheet('edit',null,S.uid);
  var l=$('#f-link'),t=$('#f-title');if(!l) return;
  l.value=p.url;if(t&&p.title) t.value=p.title;
  fillFromLink(true);
}
function pasteLink(){
  var st=$('#f-linkstat');
  if(!navigator.clipboard||!navigator.clipboard.readText){if(st) st.textContent='Press and hold in the box, then tap Paste.';return;}
  navigator.clipboard.readText().then(function(v){
    var u=findUrl(v);if(!u){if(st) st.textContent="There's no link copied yet.";return;}
    $('#f-link').value=u;fillFromLink(true);
  }).catch(function(){if(st) st.textContent='Press and hold in the box, then tap Paste.';});
}
function startApp(){
  S.shown='loading';gateLoading();
  S.session=readSession();
  if(!lsGet(NAME_KEY)) S.authMode='join';
  ensureToken().then(function(){return enter();}).catch(function(e){
    S.shown='error';
    gateMsg('Can\'t connect',friendlyErr(e),'<button class="btn primary" data-act="reload">Try again</button>');
  });
}
function boot(){
  var sm=/^#list=([A-Za-z0-9_-]{16,64})$/.exec(location.hash||'');
  if(sm&&CONFIGURED){showShared(sm[1]);return;}
  readShare();
  if('serviceWorker' in navigator){try{navigator.serviceWorker.register('sw.js').catch(function(){});}catch(e){}}
  if(!CONFIGURED){setupScreen();return;}
  if(lockInfo()&&bioApi()&&readSession()){showLock(startApp);return;}
  startApp();
}
boot();
})();
