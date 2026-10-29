// Visual effects are independent of sound; keystrokes are never delayed.
(() => {
 const editor=document.getElementById('editor'),toolbar=document.querySelector('.header-right');
 const toggle=document.createElement('button'),preview=document.createElement('button');
 toggle.textContent='✦ 입력 효과 ON';toggle.setAttribute('aria-pressed','true');toggle.title='키캡 눌림 · 입력 위치 파동 · 줄 완성 효과';
 preview.textContent='▷ 효과 체험';preview.title='기록을 바꾸지 않고 효과와 켜진 타건음을 시험합니다';toolbar.append(toggle,preview);
 const meter=document.createElement('div');meter.className='combo-meter';meter.innerHTML='<span>FLOW COMBO</span><b>0</b><small>한 타씩 흐름을 이어가세요</small>';document.querySelector('.keyboard-area').prepend(meter);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let enabled=true,combo=0,best=0;
 const animations=new WeakMap();
 function animate(el,frames,options){if(!el||reduced.matches)return;animations.get(el)?.cancel();const a=el.animate(frames,options);animations.set(el,a);return a;}
 function transient(className,style,frames,duration){
  const active=editor.querySelectorAll('.feedback-transient');if(active.length>=45)active[0].remove();
  const el=document.createElement('i');el.className='feedback-transient '+className;el.style.cssText=style;editor.append(el);
  const a=el.animate(frames,{duration,easing:'cubic-bezier(.12,.7,.3,1)'});a.onfinish=a.oncancel=()=>el.remove();
 }
 function react(target,c,wrong,heavy,milestone=false){
  if(!enabled||!target)return;
  const color=wrong?'#ce695f':heavy?'#aa8b4f':'#4d956e';
  if(reduced.matches){target.classList.add('feedback-static');setTimeout(()=>target.classList.remove('feedback-static'),180);return;}
  const line=target.parentElement;
  animate(target,[
   {color:'#fff',background:color,boxShadow:`0 0 0 3px ${color}22`,transform:'translateY(2px) scale(1.22)'},
   {color,background:color+'22',transform:'translateY(-2px) scale(1.08)',offset:.3},
   {background:'transparent',boxShadow:'0 0 0 0 transparent',transform:'translateY(0) scale(1)'}
  ],{duration:310,easing:'cubic-bezier(.16,1,.3,1)'});
  animate(line,[{background:color+(heavy?'25':'13'),boxShadow:`inset 3px 0 ${color}`},{background:'transparent',boxShadow:'inset 0 0 transparent'}],{duration:heavy?650:280});
  const key=[...document.querySelectorAll('.key')].find(el=>el.dataset.key===baseKey(c));
  animate(key,[
   {transform:'translateY(6px) scale(.93)',background:color,color:'#fff',boxShadow:`0 0 0 5px ${color}25, inset 0 3px 6px #203b2430`,borderBottomWidth:'1px'},
   {transform:'translateY(-2px) scale(1.04)',background:color+'35',offset:.42},
   {transform:'translateY(0) scale(1)'}
  ],{duration:235,easing:'cubic-bezier(.2,.8,.2,1)'});
  animate(document.getElementById('nextKey'),[
   {transform:'rotate(-5deg) translateY(5px) scale(.94)',boxShadow:`0 0 0 7px ${color}15`},
   {transform:'rotate(-5deg) translateY(-2px) scale(1.02)',offset:.45},
   {transform:'rotate(-5deg) translateY(0) scale(1)'}
  ],{duration:240});
  const bounds=target.getBoundingClientRect(),box=editor.getBoundingClientRect();
  const x=bounds.left-box.left+editor.scrollLeft+bounds.width/2,y=bounds.top-box.top+editor.scrollTop+bounds.height/2;
  transient('impact-ring',`left:${x}px;top:${y}px;border-color:${color};`,[
   {transform:'translate(-50%,-50%) scale(.3)',opacity:.8},
   {transform:`translate(-50%,-50%) scale(${heavy?2.9:1.8})`,opacity:0}
  ],heavy?450:330);
  const count=heavy?10:5;
  for(let i=0;i<count;i++){
   const angle=i/count*Math.PI*2,distance=heavy?35+Math.random()*35:15+Math.random()*18;
   transient('impact-spark',`left:${x}px;top:${y}px;background:${color};`,[
    {transform:'translate(-50%,-50%) scale(1)',opacity:.95},
    {transform:`translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px) scale(0)`,opacity:0}
   ],heavy?430:290);
  }
  if(wrong)animate(editor,[{transform:'translateX(0)'},{transform:'translateX(-3px)',offset:.2},{transform:'translateX(3px)',offset:.45},{transform:'translateX(0)'}],{duration:170});
  if(heavy){
   transient('impact-sweep',`top:${bounds.top-box.top+editor.scrollTop}px;height:${bounds.height}px;`,[{transform:'translateX(-100%)',opacity:.8},{transform:'translateX(110%)',opacity:0}],600);
   const stamp=document.createElement('span');stamp.className='flow-stamp';stamp.textContent=milestone?combo+' FLOW':'NICE LINE';line.append(stamp);
   const a=stamp.animate([{opacity:0,transform:'translateY(5px) scale(.85)'},{opacity:1,transform:'translateY(0) scale(1)',offset:.2},{opacity:1,offset:.65},{opacity:0,transform:'translateY(-10px)'}],{duration:850});a.onfinish=()=>stamp.remove();
   animate(meter.querySelector('b'),[{transform:'scale(1.3)',color},{transform:'scale(1)'}],{duration:330});
  }
 }
 function demonstrate(){
  const target=chars[Math.min(position,chars.length-1)];if(sound)window.KeyflowAudio?.play(false,'\n');
  if(!enabled){preview.textContent='✦ 입력 효과를 켜보세요';setTimeout(()=>preview.textContent='▷ 효과 체험',1400);return;}
  react(target,target?.dataset.c,false,true);
 }
 toggle.onclick=()=>{enabled=!enabled;toggle.textContent='✦ 입력 효과 '+(enabled?'ON':'OFF');toggle.setAttribute('aria-pressed',String(enabled));if(enabled)demonstrate()};preview.onclick=demonstrate;
 function resetCombo(){combo=0;meter.querySelector('b').textContent='0';meter.querySelector('small').textContent=best?'이번 방문 최고 '+best+' COMBO':'한 타씩 흐름을 이어가세요';meter.classList.remove('hot');}
 editor.addEventListener('keydown',e=>{
  if(e.key==='Escape'||(ended&&e.key==='Enter'&&!e.repeat)){resetCombo();return;}
  if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing||e.key==='Process'||ended)return;
  const c=e.key==='Enter'?'\n':e.key;if(c.length!==1||!/^[\x00-\x7F]$/.test(c))return;
  const target=chars[position];if(!target)return;const wrong=c!==target.dataset.c;combo=wrong?0:combo+1;best=Math.max(best,combo);
  const milestone=combo>0&&combo%10===0;meter.querySelector('b').textContent=combo;meter.querySelector('small').textContent=wrong?'호흡을 고르고, 다시 한 타.':combo>=20?'좋은 흐름이에요. 그대로 이어가세요':'이번 방문 최고 '+best+' COMBO';meter.classList.toggle('hot',combo>=20);
  react(target,c,wrong,!wrong&&(c==='\n'||milestone),milestone);
 },true);
 document.querySelectorAll('[data-lang], #restart, #next').forEach(el=>el.addEventListener('click',resetCombo));document.getElementById('lesson').addEventListener('change',resetCombo);
 document.addEventListener('keydown',e=>{if(e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&e.key==='ArrowRight'&&!e.isComposing&&!e.repeat)resetCombo()});
})();
