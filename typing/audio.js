// Buffered contact/body/release layers; no pitched electronic oscillators.
(function(root){
function makeSample(rate,variant,profile='thock',key='normal'){
 const data=new Float32Array(Math.ceil(rate*.095));let seed=173+variant*317,low=0,deep=0,air=0;
 const alpha=1-Math.exp(-2*Math.PI*(profile==='thock'?760:1450)/rate),slow=1-Math.exp(-2*Math.PI*220/rate),fast=1-Math.exp(-2*Math.PI*3100/rate);
 const releaseAt=key==='enter'?.048:.029+variant*.0015;
 for(let i=0;i<data.length;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const white=seed/2147483648-1,t=i/rate;
  low+=alpha*(white-low);deep+=slow*(white-deep);air+=fast*(white-air);
  const body=(low-deep*.65)*Math.exp(-t/(key==='enter'?.014:.009));
  const contact=(white-air)*Math.exp(-t/.0022);
  const travel=t>.003?low*Math.exp(-(t-.003)/.014)*.16:0;
  const release=t>releaseAt?(low*.7+(white-air)*.14)*Math.min(1,(t-releaseAt)/.0004)*Math.exp(-(t-releaseAt)/.004):0;
  data[i]=Math.min(1,t/.0005)*(body*(profile==='thock'?2.8:1.8)+contact*(profile==='thock'?.24:.44)+travel)+release*.32;
 }
 const mean=data.reduce((n,x)=>n+x,0)/data.length;let peak=0;
 for(let i=0;i<data.length;i++){data[i]-=mean;peak=Math.max(peak,Math.abs(data[i]));}
 for(let i=0;i<data.length;i++)data[i]=data[i]/Math.max(.01,peak)*.78;
 return data;
}
if(typeof module!=='undefined')module.exports={makeSample};
if(!root.document)return;
let ctx,bus,count=0;const cache=new Map(),settings={volume:.35,profile:'thock'};
function play(wrong=false,key=''){
 try{
  if(!ctx){ctx=new(root.AudioContext||root.webkitAudioContext)({latencyHint:'interactive'});bus=ctx.createGain();const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-13;limiter.knee.value=14;limiter.ratio.value=4;limiter.attack.value=.002;limiter.release.value=.06;bus.connect(limiter).connect(ctx.destination);}
  ctx.resume();const type=key==='\n'?'enter':key===' '?'space':'normal',variant=count++%7,id=`${settings.profile}-${type}-${variant}`;
  if(!cache.has(id)){const data=makeSample(ctx.sampleRate,variant,settings.profile,type),buffer=ctx.createBuffer(1,data.length,ctx.sampleRate);buffer.copyToChannel(data,0);cache.set(id,buffer);}
  const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=cache.get(id);source.playbackRate.value=type==='space'?.86:type==='enter'?.82:1;
  gain.gain.value=settings.volume*(wrong?.68:type==='enter'?1.1:.86);source.connect(gain).connect(bus);source.onended=()=>{source.disconnect();gain.disconnect()};source.start();
 }catch{}
}
root.KeyflowAudio={play,settings};
const controls=document.createElement('div');controls.className='sound-controls';
controls.innerHTML='<select aria-label="타건음 종류"><option value="thock">도각 · 낮고 부드럽게</option><option value="soft">사각 · 가볍고 선명하게</option></select><label title="타건음 볼륨">♪ <input type="range" aria-label="타건음 볼륨" min="0" max="100" value="35"></label>';
document.querySelector('.header-right').append(controls);
controls.querySelector('select').onchange=e=>{settings.profile=e.target.value;if(sound)play()};
controls.querySelector('input').oninput=e=>{settings.volume=Number(e.target.value)/100};
controls.querySelector('input').onchange=()=>{if(sound)play()};
})(globalThis);
