import { stories } from './oval-home.js';
import { createTypewriterScene } from './typewriter-scene.js';
export { stories };

export function initWhimsyHome(container) {
  const root=container.querySelector('[data-whimsy-home]');if(!root)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const host=root.querySelector('[data-typewriter-scene]');
  const toggle=root.querySelector('[data-motion-toggle]');
  const status=root.querySelector('[data-typing-status]');
  const readable=root.querySelector('[data-readable]');
  const buttons=[...root.querySelectorAll('[data-story]')];
  const removers=[];let current=0,position=0,timer,paused=false,destroyed=false,scene;
  const text=()=>stories[current].title+'\n\n'+stories[current].paragraphs.join('\n\n');
  const on=(node,event,fn)=>{node.addEventListener(event,fn);removers.push(()=>node.removeEventListener(event,fn));};
  const fail=()=>{root.dataset.sceneReady='false';clearTimeout(timer);status.textContent='A letter, just for you.';scene?.dispose();scene=null;};
  try{scene=createTypewriterScene(host,fail);}catch{scene?.dispose();scene=null;}
  function paint(){scene?.type(position,text()[position-1]);status.textContent=position>=text().length?'A letter, just for you.':paused?'A little pause. Take your time.':'A thought taking shape...';}
  function tick(){if(destroyed||paused||position>=text().length)return;position++;paint();const char=text()[position-1];timer=setTimeout(tick,char==='\n'?115:/[.,?]/.test(char)?100:22);}
  function finish(){clearTimeout(timer);position=text().length;paint();}
  function load(index){clearTimeout(timer);current=index;position=0;const story=stories[index];
    readable.replaceChildren();const label=document.createElement('p');label.className='whimsy-letter-label';label.textContent=`0${index+1} / ${story.label}`;const heading=document.createElement('h2');heading.textContent=story.title;readable.append(label,heading);story.paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;readable.append(p);});const signature=document.createElement('span');signature.textContent='with curiosity, Tammana';readable.append(signature);
    const link=root.querySelector('[data-story-link]');link.textContent=story.link+' ↗';link.href=story.href.startsWith('mailto:')?story.href:(root.dataset.static==='true'?'':'/')+story.href;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.story===story.id)));
    scene?.setStory(story,index+1);paint();if(motion.matches||!scene)finish();else if(!paused)timer=setTimeout(tick,450);
  }
  on(toggle,'click',()=>{paused=!paused;scene?.setPaused(paused);toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Resume typewriter animation':'Pause typewriter animation');toggle.replaceChildren(document.createTextNode(paused?'▷ ':'Ⅱ '));const span=document.createElement('span');span.textContent=paused?'Resume':'Pause';toggle.append(span);clearTimeout(timer);paint();if(!paused)tick();});
  on(root.querySelector('[data-finish-letter]'),'click',finish);
  on(motion,'change',()=>{scene?.setReduced(motion.matches);toggle.hidden=motion.matches;if(motion.matches)finish();});
  buttons.forEach(b=>on(b,'click',()=>load(stories.findIndex(s=>s.id===b.dataset.story))));
  scene?.setReduced(motion.matches);toggle.hidden=motion.matches;root.dataset.sceneReady=String(Boolean(scene));load(0);
  return()=>{destroyed=true;clearTimeout(timer);removers.forEach(f=>f());scene?.dispose();};
}
