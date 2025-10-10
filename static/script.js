// Effetti: più pipistrelli e zucche senza audio

const fx = document.getElementById('fxLayer');

const BAT_SVG = encodeURIComponent(`<svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path fill="#7a1f3d" d="M32 20c3 0 5 3 5 6 3-2 8-3 12 0 3 2 7 2 11-1-2 6-6 9-11 10 1 3 1 6 0 9-3-4-8-6-12-6s-9 2-12 6c-1-3-1-6 0-9-5-1-9-4-11-10 4 3 8 3 11 1 4-3 9-2 12 0 0-3 2-6 5-6z"/></svg>`);
const PUMPKIN_SVG = encodeURIComponent(`<svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="32" cy="36" rx="18" ry="12" fill="#ff7a00"/><ellipse cx="24" cy="36" rx="10" ry="11" fill="#ff8f1a"/><ellipse cx="40" cy="36" rx="10" ry="11" fill="#ff8f1a"/><rect x="30" y="22" width="4" height="6" rx="1" fill="#3d6b37"/></g></svg>`);

function spawn(kind="bat"){
  const el = document.createElement('div');
  el.className = kind === "bat" ? "bat" : "pumpkin";
  el.style.left = (5 + Math.random()*90) + 'vw';
  el.style.top = (30 + Math.random()*50) + 'vh';
  fx.appendChild(el);
  setTimeout(()=> el.remove(), 2600);
}

function burst(n=20){
  for(let i=0; i<n; i++){
    setTimeout(()=> spawn(Math.random() < 0.6 ? "bat" : "pumpkin"), i * 80);
  }
}

function loopFX(){
  spawn(Math.random()<0.6 ? "bat" : "pumpkin");
  setTimeout(loopFX, 1100 + Math.random()*1400);
}

// Stili runtime per gli elementi volanti
const style = document.createElement('style');
style.textContent = `
  #fxLayer{position:fixed; inset:0; pointer-events:none; z-index:3;}
  .bat,.pumpkin{position:absolute; width:48px; height:48px; background-size:contain; background-repeat:no-repeat; animation: fly 2.5s ease-in-out forwards;}
  .bat{ background-image:url('data:image/svg+xml;utf8,${BAT_SVG}'); }
  .pumpkin{ background-image:url('data:image/svg+xml;utf8,${PUMPKIN_SVG}'); }
  @keyframes fly{
    0%{ transform: translateY(0) translateX(0) rotate(0deg) scale(.98); opacity:0; }
    10%{ opacity:1; }
    55%{ transform: translateY(-40px) translateX(60px) rotate(10deg) scale(1.05); }
    100%{ transform: translateY(-120px) translateX(160px) rotate(-8deg) scale(1); opacity:0; }
  }
`;
document.head.appendChild(style);

// Avvio effetti: burst iniziale + loop leggero
window.addEventListener('load', () => {
  burst(22);      // pioggia iniziale (aumenta/diminuisci a piacere)
  setTimeout(loopFX, 1500); // poi animazione continua più soft
});
