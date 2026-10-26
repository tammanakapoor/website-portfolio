import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Everything in the scene is built locally: no model, font or texture requests.
export function createTypewriterScene(host, onFailure) {
  const scene = new THREE.Scene();
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.prepend(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 80);
  const world = new THREE.Group(); scene.add(world);
  const green = new THREE.MeshStandardMaterial({color:'#7d9563',roughness:.29,metalness:.15});
  const greenDark = new THREE.MeshStandardMaterial({color:'#485c39',roughness:.38,metalness:.22});
  const cream = new THREE.MeshStandardMaterial({color:'#e6ddbf',roughness:.42,metalness:.13});
  const black = new THREE.MeshStandardMaterial({color:'#282c25',roughness:.45,metalness:.2});
  const chrome = new THREE.MeshStandardMaterial({color:'#a5aa95',roughness:.24,metalness:.8});
  const gold = new THREE.MeshStandardMaterial({color:'#ba9553',roughness:.35,metalness:.68});
  const textures = [];
  function mesh(geometry, material, parent, position, rotation) {
    const m = new THREE.Mesh(geometry,material); m.position.set(...position);
    if(rotation)m.rotation.set(...rotation); m.castShadow=true; m.receiveShadow=true; parent.add(m);return m;
  }
  function box(w,h,d,r,mat,parent,pos,rot) {return mesh(new RoundedBoxGeometry(w,h,d,3,r),mat,parent,pos,rot);}
  function cylinder(r,length,mat,parent,pos,rot) {return mesh(new THREE.CylinderGeometry(r,r,length,32),mat,parent,pos,rot);}
  function labelTexture(text, bg, color, size=256) {
    const c=document.createElement('canvas');c.width=size;c.height=size;const ctx=c.getContext('2d');
    ctx.fillStyle=bg;ctx.fillRect(0,0,size,size);ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${text.length>2?48:104}px Courier New`;ctx.fillText(text,size/2,size/2+5);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;textures.push(t);return t;
  }
  scene.add(new THREE.HemisphereLight('#fff9e9','#b3baa1',3));
  const sun=new THREE.DirectionalLight('#fff1cf',5);sun.position.set(-4,9,6);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.5,far:25});sun.shadow.bias=-.0005;sun.shadow.normalBias=.025;sun.shadow.radius=4;scene.add(sun);
  const fill=new THREE.DirectionalLight('#dfead3',2);fill.position.set(5,4,-2);scene.add(fill);
  const floor=mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}),scene,[0,-.08,0],[-Math.PI/2,0,0]);floor.castShadow=false;
  const machine=new THREE.Group();world.add(machine);
  box(4.8,.42,3.15,.2,greenDark,machine,[0,.24,.3]);
  box(4.88,.35,3.22,.2,green,machine,[0,.48,.3]);
  // Sloped keyboard deck and rounded enamel back, with an open mechanism well.
  box(4.58,.16,2.2,.12,cream,machine,[0,.65,.81],[.13,0,0]);
  box(4.8,.7,1.1,.22,green,machine,[0,.94,-.73]);
  box(4.27,.12,.72,.15,black,machine,[0,1.28,-.65]);
  box(.28,.56,1.48,.12,green,machine,[-2.27,.98,-.37]);box(.28,.56,1.48,.12,green,machine,[2.27,.98,-.37]);
  // The exposed type bars converge on the ribbon guide.
  for(let i=0;i<23;i++) {
    const a=(i-11)*.09;
    box(.026,.034,.72,.008,chrome,machine,[Math.sin(a)*.87,1.34,-.62+Math.cos(a)*.25],[0,a,0]);
  }
  [-1.35,1.35].forEach(x=>{cylinder(.38,.04,black,machine,[x,1.37,-.59]);cylinder(.08,.05,gold,machine,[x,1.41,-.59]);});
  box(2.8,.075,.075,.025,black,machine,[0,1.41,-.23]);
  const hammer=box(.17,.35,.05,.02,chrome,machine,[0,1.5,-.48]);
  // Carriage carries the platen, knobs and paper together.
  const carriage=new THREE.Group();machine.add(carriage);
  cylinder(.16,4.94,chrome,carriage,[0,1.5,-.99],[0,0,Math.PI/2]);
  cylinder(.22,4.23,black,carriage,[0,1.55,-.87],[0,0,Math.PI/2]);
  [-2.59,2.59].forEach(x=>{cylinder(.25,.26,greenDark,carriage,[x,1.54,-.95],[0,0,Math.PI/2]);cylinder(.1,.28,cream,carriage,[x,1.54,-.95],[0,0,Math.PI/2]);});
  box(.055,.065,.85,.02,chrome,carriage,[-2.55,1.76,-1.08]);box(.6,.055,.09,.03,chrome,carriage,[-2.3,1.76,-1.49]);
  const paperCanvas=document.createElement('canvas');paperCanvas.width=1024;paperCanvas.height=1080;
  const ctx=paperCanvas.getContext('2d');const paperTexture=new THREE.CanvasTexture(paperCanvas);paperTexture.colorSpace=THREE.SRGBColorSpace;paperTexture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(paperTexture);
  const paperGeo=new THREE.PlaneGeometry(3.9,3.71,16,24);const vertices=paperGeo.attributes.position;
  for(let i=0;i<vertices.count;i++){const y=vertices.getY(i);vertices.setZ(i,.035*Math.pow(y/1.855,2)+.025*Math.sin(vertices.getX(i)*1.5));}paperGeo.computeVertexNormals();
  const paper=mesh(paperGeo,new THREE.MeshBasicMaterial({map:paperTexture,toneMapped:false,side:THREE.DoubleSide}),carriage,[0,3.22,-1.02],[-.12,0,0]);paper.castShadow=true;
  box(4.05,.055,.045,.02,chrome,carriage,[0,1.7,-.56]);
  [-1.43,1.43].forEach(x=>box(.1,.19,.08,.02,chrome,carriage,[x,1.78,-.57]));
  const keys=[];const keyLookup=new Map();
  ['1234567890','QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].forEach((row,r)=>{
    [...row].forEach((char,i)=>{
      const x=(i-(row.length-1)/2)*.405+(r===2?.06:0),z=.05+r*.43;
      const y=.86-r*.066;
      cylinder(.045,.21,chrome,machine,[x,y-.12,z]);
      const group=new THREE.Group();group.position.set(x,y,z);machine.add(group);
      cylinder(.172,.105,black,group,[0,0,0]);
      const face=mesh(new THREE.CircleGeometry(.145,32),new THREE.MeshStandardMaterial({map:labelTexture(char,'#31352d','#ece4ca'),roughness:.66}),group,[0,.054,0],[-Math.PI/2,0,0]);
      const key={group,face,rest:y,pressed:0};keys.push(key);keyLookup.set(char,key);
    });
  });
  const space=box(2.4,.13,.29,.09,black,machine,[0,.57,1.8]);
  const badge=mesh(new THREE.PlaneGeometry(1.13,.21),new THREE.MeshStandardMaterial({map:labelTexture('CURIOSITY','#485c39','#ece4ca',512),roughness:.5}),machine,[0,.53,1.924]);
  badge.material.map.repeat.set(1,.28);badge.material.map.offset.set(0,.36);
  [-1.92,1.92].forEach(x=>cylinder(.06,.025,chrome,machine,[x,.48,1.925],[Math.PI/2,0,0]));
  for(const x of [-1.8,1.8])for(const z of [-.7,1.35])box(.38,.16,.38,.07,black,machine,[x,.02,z]);
  // Handmade daisies and leaves, built from simple curved meshes.
  const stemMat=new THREE.MeshStandardMaterial({color:'#617849',roughness:.9});
  const leafMat=new THREE.MeshStandardMaterial({color:'#81945c',roughness:.8,side:THREE.DoubleSide});
  const petalMat=new THREE.MeshStandardMaterial({color:'#f4ebd7',roughness:.8});
  const heartMat=new THREE.MeshStandardMaterial({color:'#d5a345',roughness:.85});
  const flowerHeads=[];
  function daisy(x,y,z,size,bend) {
    const base=new THREE.Vector3(x*.86,0,z-.1),top=new THREE.Vector3(x,y,z);
    const curve=new THREE.QuadraticBezierCurve3(base,new THREE.Vector3(x+bend,y*.55,z),top);
    mesh(new THREE.TubeGeometry(curve,12,.025,6,false),stemMat,world,[0,0,0]);
    const head=new THREE.Group();head.position.copy(top);head.rotation.set(-.25,bend*.3,bend*.2);world.add(head);flowerHeads.push({head,rest:head.rotation.z,phase:x*2});
    for(let p=0;p<13;p++) {const a=p/13*Math.PI*2;const petal=mesh(new THREE.SphereGeometry(1,10,6),petalMat,head,[Math.sin(a)*size*.57,Math.cos(a)*size*.57,0]);petal.scale.set(size*.15,size*.45,size*.045);petal.rotation.z=-a;}
    const heart=mesh(new THREE.SphereGeometry(1,20,10),heartMat,head,[0,0,.065]);heart.scale.set(size*.27,size*.27,size*.12);
    for(let j=0;j<2;j++) {const leaf=mesh(new THREE.SphereGeometry(1,12,8),leafMat,world,[x+(j?-.18:.12),y*(.3+j*.2),z]);leaf.scale.set(.11,y*.17,.04);leaf.rotation.z=j?-.7:.7;}
  }
  daisy(-2.55,2.2,-.6,.58,-.5);daisy(-3.05,1.24,.1,.48,.35);daisy(2.75,2.53,-1.1,.55,.3);daisy(3.18,1.5,-.1,.46,-.3);daisy(2.72,.55,1.45,.32,.1);
  // A few fallen petals anchor the small scene to its tabletop.
  [[-2.8,.7,.1],[2.15,2.4,.6],[-3.1,1.6,-.4]].forEach(([x,z,a])=>{const p=mesh(new THREE.SphereGeometry(1,10,6),petalMat,world,[x,0,z],[0,a,.15]);p.scale.set(.09,.025,.24);});
  let story,lines=[],position=0,targetCarriage=0,feed=0,paused=false,reduced=false,disposed=false,visible=true;
  let frame=0,last=0,time=0,pointerX=0,pointerY=0;
  function layout(s) {
    lines=[];let index=0,y=205;
    s.title.split('\n').forEach(text=>{lines.push({text,start:index,y,font:'bold 66px Courier New'});index+=text.length+1;y+=76;});
    index++;y+=38;
    s.paragraphs.forEach(text=>{
      ctx.font='bold 48px Courier New';const words=text.split(' ');let line='',start=index;
      words.forEach(word=>{if(line&&ctx.measureText(line+' '+word).width>840){lines.push({text:line,start,y,font:'bold 48px Courier New'});y+=60;start+=line.length+1;line=word;}else line+=(line?' ':'')+word;});
      lines.push({text:line,start,y,font:'bold 48px Courier New'});y+=82;index+=text.length+2;
    });
  }
  function draw() {
    ctx.fillStyle='#fffced';ctx.fillRect(0,0,1024,1080);
    // Faint fibres give the paper a tactile surface without external assets.
    ctx.fillStyle='#e5ddc2';for(let i=0;i<380;i++){const x=(i*173)%1024,y=(i*97)%1080;ctx.fillRect(x,y,1,2);}
    ctx.fillStyle='#8a9179';ctx.font='bold 22px Courier New';ctx.fillText(`0${story.number} / ${story.label}`,86,90);
    ctx.fillStyle='#424d3c';for(const l of lines){ctx.font=l.font;ctx.fillText(l.text.slice(0,Math.max(0,position-l.start)),86,l.y);}
    if(position>=story.length){ctx.fillStyle='#929a7c';ctx.font='italic 34px Georgia';ctx.fillText('with curiosity, Tammana',86,975);}
    paperTexture.needsUpdate=true;
  }
  function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.position.set(0,6.3,12.4);camera.lookAt(0,2.15,0);camera.zoom=width<560?width/400:1.1;camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const move=e=>{const r=host.getBoundingClientRect();pointerX=((e.clientX-r.left)/r.width-.5)*2;pointerY=((e.clientY-r.top)/r.height-.5)*2;};
  const leave=()=>{pointerX=0;pointerY=0;};
  const raycaster=new THREE.Raycaster();
  const press=e=>{const r=host.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const hit=raycaster.intersectObjects(keys.map(k=>k.face))[0];if(hit&&!reduced){const key=keys.find(k=>k.face===hit.object);key.pressed=.15;}};
  host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);renderer.domElement.addEventListener('pointerdown',press);
  const visibility=()=>{visible=!document.hidden;last=0;};document.addEventListener('visibilitychange',visibility);
  const lost=e=>{e.preventDefault();onFailure?.();};renderer.domElement.addEventListener('webglcontextlost',lost);
  function render(stamp){if(disposed)return;frame=requestAnimationFrame(render);if(!visible)return;const dt=last?Math.min((stamp-last)/1000,.05):0;last=stamp;if(!paused&&!reduced)time+=dt;
    const ease=Math.min(dt*8,1);
    world.rotation.y+=((reduced?0:pointerX*.075)-world.rotation.y)*ease;world.rotation.x+=((reduced?0:pointerY*.02)-world.rotation.x)*ease;
    if(!paused&&!reduced){carriage.position.x+=(targetCarriage-carriage.position.x)*Math.min(dt*15,1);feed*=Math.max(0,1-dt*4);flowerHeads.forEach(({head,rest,phase})=>head.rotation.z=rest+Math.sin(time*.8+phase)*.022);}
    paper.position.y=3.22-feed;
    keys.forEach(k=>{if(!paused)k.pressed=Math.max(0,k.pressed-dt);k.group.position.y=k.rest-(reduced?0:Math.sin(k.pressed/.15*Math.PI)*.075);});
    hammer.rotation.x=reduced?0:Math.sin(time*4)*.015;space.position.y=.57;
    renderer.render(scene,camera);
  }
  frame=requestAnimationFrame(render);
  return {
    setStory(s,number){story={...s,number,length:(s.title+'\n\n'+s.paragraphs.join('\n\n')).length};position=0;layout(story);feed=reduced?0:.6;targetCarriage=0;draw();},
    type(next,char){position=next;draw();if(!paused&&!reduced){const key=keyLookup.get(char?.toUpperCase());if(key)key.pressed=.15;targetCarriage=-.26*((next%43)/43);}},
    setPaused(value){paused=value;},setReduced(value){reduced=value;if(value){feed=0;targetCarriage=0;carriage.position.x=0;keys.forEach(k=>k.pressed=0);}},
    dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('pointerdown',press);renderer.domElement.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();},
  };
}
