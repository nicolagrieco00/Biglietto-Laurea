// Share + countdown
(function(){
  const startISO = "{{ start.isoformat() if false else '' }}"; // will be ignored in static file; handled inline earlier if needed
})();

// FX Layer and audio
const fx = document.getElementById('fxLayer');

const BAT_SVG = encodeURIComponent(`<svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path fill="#7a1f3d" d="M32 20c3 0 5 3 5 6 3-2 8-3 12 0 3 2 7 2 11-1-2 6-6 9-11 10 1 3 1 6 0 9-3-4-8-6-12-6s-9 2-12 6c-1-3-1-6 0-9-5-1-9-4-11-10 4 3 8 3 11 1 4-3 9-2 12 0 0-3 2-6 5-6z"/></svg>`);
const PUMPKIN_SVG = encodeURIComponent(`<svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="32" cy="36" rx="18" ry="12" fill="#ff7a00"/><ellipse cx="24" cy="36" rx="10" ry="11" fill="#ff8f1a"/><ellipse cx="40" cy="36" rx="10" ry="11" fill="#ff8f1a"/><rect x="30" y="22" width="4" height="6" rx="1" fill="#3d6b37"/></g></svg>`);

function spawn(kind="bat"){
  const el = document.createElement('div');
  el.className = (kind === "bat") ? "bat" : "pumpkin";
  el.style.left = (5 + Math.random()*90) + 'vw';
  el.style.top = (30 + Math.random()*50) + 'vh';
  fx.appendChild(el);
  setTimeout(()=> el.remove(), 2500);
  ping();
}
function loopFX(){
  spawn(Math.random()<0.6 ? "bat" : "pumpkin");
  setTimeout(loopFX, 1200 + Math.random()*1400);
}

// WebAudio
let audioCtx;
function beep(freq=880, dur=0.12, type='sine', gain=0.08){
  if(!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g); g.connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  o.start(t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.stop(t + dur + 0.02);
}
function ping(){
  beep(1200, 0.05, 'triangle', 0.05);
  setTimeout(()=>beep(1600,0.05,'triangle',0.04), 40);
}
function boo(){
  if(!audioCtx) return;
  const g = audioCtx.createGain(); g.gain.value = 0.10;
  const o = audioCtx.createOscillator(); o.type='sawtooth'; o.frequency.value = 220;
  const f = audioCtx.createBiquadFilter(); f.type='lowpass'; f.frequency.value = 800;
  const lfo = audioCtx.createOscillator(); lfo.type='sine'; lfo.frequency.value=2;
  const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 20;
  lfo.connect(lfoGain); lfoGain.connect(o.frequency);
  o.connect(f); f.connect(g); g.connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  o.start(t); lfo.start(t);
  g.gain.exponentialRampToValueAtTime(0.0001, t+0.6);
  o.stop(t+0.62); lfo.stop(t+0.62);
}

// Activate button
const soundBtn = document.getElementById('soundBtn');
if (soundBtn){
  soundBtn.addEventListener('click', ()=>{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    ping(); setTimeout(boo, 400);
    loopFX();
    soundBtn.remove();
  });
}

// Inject styles for flying items
const style = document.createElement('style');
style.textContent = `
  #fxLayer{position:fixed; inset:0; pointer-events:none; z-index:3;}
  .bat,.pumpkin{position:absolute; width:48px; height:48px; background-size:contain; background-repeat:no-repeat; animation: fly 2.4s ease-in-out forwards;}
  .bat{ background-image: url('data:image/svg+xml;utf8,${BAT_SVG}'); }
  .pumpkin{ background-image: url('data:image/svg+xml;utf8,${PUMPKIN_SVG}'); }
  @keyframes fly{
    0%{ transform: translateY(0) translateX(0) rotate(0deg) scale(.98); opacity:0; }
    10%{ opacity:1; }
    50%{ transform: translateY(-40px) translateX(60px) rotate(10deg) scale(1.05); }
    100%{ transform: translateY(-120px) translateX(160px) rotate(-8deg) scale(1); opacity:0; }
  }
`;
document.head.appendChild(style);
