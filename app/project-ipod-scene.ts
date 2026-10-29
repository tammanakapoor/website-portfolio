import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** A modelled paper-cut iPod and two wired earbuds; no external model or audio. */
export function mountCafeIpod(host: HTMLElement, motion: () => boolean, ready: () => void) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"}); } catch { return () => {}; }
  renderer.setClearColor(0,0); renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.18;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32,1,.1,30); camera.position.set(0,.15,8.4);
  const generator = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
  const environment = generator.fromScene(room,.04); scene.environment = environment.texture;
  room.dispose(); generator.dispose();
  scene.add(new THREE.HemisphereLight(0xfff9e9,0x776c5a,2.1));
  const light = new THREE.DirectionalLight(0xfff1da,3.7); light.position.set(-3,5,7); scene.add(light);
  const fill = new THREE.DirectionalLight(0xc9d9eb,1.8); fill.position.set(4,-1,4); scene.add(fill);
  const white = new THREE.MeshPhysicalMaterial({color:0xf8f5e9,roughness:.25,metalness:.02,clearcoat:.8,clearcoatRoughness:.2});
  const chrome = new THREE.MeshStandardMaterial({color:0xb7b7ac,roughness:.23,metalness:.85});
  const wheel = new THREE.MeshBasicMaterial({color:0xd3d1c5});
  const dark = new THREE.MeshStandardMaterial({color:0x53584c,roughness:.8});
  const paper = new THREE.MeshStandardMaterial({color:0xfffcf0,roughness:1});
  const root = new THREE.Group(); root.rotation.set(-.08,-.24,-.17); root.position.set(-.12,-.15,0); scene.add(root);
  const player = new THREE.Group(); player.position.set(-.16,-.25,.1); root.add(player);
  function box(w:number,h:number,d:number,r:number,material:THREE.Material,parent:THREE.Object3D,x=0,y=0,z=0) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w,h,d,4,r),material); mesh.position.set(x,y,z); parent.add(mesh); return mesh;
  }
  // The off-white border reads as the edge of a cutting laid on the journal.
  box(1.56,2.65,.025,.16,paper,player,0,0,-.11);
  box(1.39,2.48,.18,.13,chrome,player,0,0,0);
  box(1.38,2.47,.12,.12,white,player,0,0,.065);
  box(1.12,.88,.03,.05,dark,player,0,.58,.141);
  const canvas = document.createElement("canvas"); canvas.width=512;canvas.height=384;
  const ctx=canvas.getContext("2d")!;
  const screenTexture=new THREE.CanvasTexture(canvas); screenTexture.colorSpace=THREE.SRGBColorSpace;
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.01,.755),new THREE.MeshBasicMaterial({map:screenTexture}));screen.position.set(0,.58,.166);player.add(screen);
  function drawScreen(t:number) {
    ctx.fillStyle="#bdc8a3";ctx.fillRect(0,0,512,384);ctx.fillStyle="#384833";
    ctx.font="bold 37px Georgia";ctx.fillText("Daily Café",25,51);ctx.strokeStyle="#536247";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(22,68);ctx.lineTo(490,68);ctx.stroke();
    ctx.font="27px Georgia";ctx.fillText("A room for quiet days",25,110);ctx.font="22px monospace";ctx.fillText("01 / 96   ·   stay a while",25,344);
    for(let i=0;i<13;i++){const h=21+(Math.sin(i*1.35+t*2.2)*.5+.5)*90;ctx.fillRect(30+i*35,278-h,20,h);}
    ctx.strokeRect(436,18,47,21);ctx.fillRect(484,24,5,10);ctx.fillRect(441,23,33,11);
    screenTexture.needsUpdate=true;
  }
  function disc(radius:number,depth:number,material:THREE.Material,y:number,z:number) {
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,depth,64),material);mesh.rotation.x=Math.PI/2;mesh.position.set(0,y,z);player.add(mesh);return mesh;
  }
  disc(.485,.012,wheel,-.63,.19);disc(.185,.02,white,-.63,.21);
  const wheelRim=new THREE.Mesh(new THREE.TorusGeometry(.479,.008,8,64),new THREE.MeshBasicMaterial({color:0xb8b8ac}));wheelRim.position.set(0,-.63,.201);player.add(wheelRim);
  const labelCanvas=document.createElement("canvas");labelCanvas.width=512;labelCanvas.height=512;const lc=labelCanvas.getContext("2d")!;
  lc.fillStyle="#96968b";lc.textAlign="center";lc.font="bold 34px Arial";lc.fillText("MENU",256,102);lc.font="42px Arial";lc.fillText("◀◀",82,274);lc.fillText("▶▶",430,274);lc.font="32px Arial";lc.fillText("▶Ⅱ",256,445);
  const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;
  const labelPlane=new THREE.Mesh(new THREE.PlaneGeometry(.94,.94),new THREE.MeshBasicMaterial({map:labelTexture,transparent:true,depthWrite:false}));labelPlane.position.set(0,-.63,.229);player.add(labelPlane);
  box(.26,.055,.06,.018,chrome,player,.28,1.255,0);
  const cordMaterial = new THREE.MeshStandardMaterial({color:0xfaf7e8,roughness:.65});
  function cord(points:number[][]){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p as [number,number,number])));const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,96,.021,8,false),cordMaterial);root.add(tube);return tube;}
  cord([[-.62,1.01,.12],[-1.18,1.38,.12],[-1.35,-.6,.14],[-.95,-1.83,.2],[.9,-1.83,.16],[1.18,-.6,.2],[1.04,.05,.12]]);
  cord([[1.04,.05,.12],[1.36,.75,.12],[1.05,1.65,.15],[.55,1.86,.18]]);
  cord([[1.04,.05,.12],[.48,.65,.13],[.9,1.16,.12],[1.3,1.37,.19]]);
  const buds:THREE.Group[]=[];
  for(const [x,y,rz] of [[.55,1.86,-.28],[1.3,1.37,.35]]){
    const bud=new THREE.Group();bud.position.set(x,y,.18);bud.rotation.z=rz;root.add(bud);buds.push(bud);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.16,32,24),white);head.scale.set(1,.9,.55);bud.add(head);
    box(.075,.41,.075,.03,white,bud,0,-.23,0);
    const grille=new THREE.Mesh(new THREE.CircleGeometry(.106,32),dark);grille.position.z=.081;grille.scale.y=.8;bud.add(grille);
    for(let i=-2;i<=2;i++){const line=new THREE.Mesh(new THREE.BoxGeometry(.13,.008,.004),chrome);line.position.set(0,i*.025,.086);bud.add(line);}
  }
  let disposed=false,frame=0,visible=true,last=0,elapsed=0,dirty=true,wasMoving=true,pointer={x:0,y:0};
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();dirty=true;};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});intersection.observe(host);
  const move=(e:PointerEvent)=>{const r=host.getBoundingClientRect();pointer={x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};};
  const leave=()=>{pointer={x:0,y:0};};host.addEventListener("pointermove",move);host.addEventListener("pointerleave",leave);
  function animate(now:number){if(disposed)return;frame=requestAnimationFrame(animate);const delta=Math.min(.05,(now-last)/1000||0);last=now;if(!visible||document.hidden)return;
    const moving=motion();if(!moving&&!dirty&&!wasMoving)return;
    if(moving){elapsed+=delta;root.rotation.y=-.22+Math.sin(elapsed*.65)*.22+pointer.x*.35;root.rotation.x=-.08+Math.cos(elapsed*.5)*.06+pointer.y*.15;root.position.y=-.15+Math.sin(elapsed*.9)*.045;buds.forEach((bud,i)=>{bud.rotation.z=(i? .35:-.28)+Math.sin(elapsed*.9+i)*.045;});}
    drawScreen(moving?elapsed:0);renderer.render(scene,camera);dirty=false;wasMoving=moving;
  }
  drawScreen(0);renderer.render(scene,camera);ready();frame=requestAnimationFrame(animate);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();host.removeEventListener("pointermove",move);host.removeEventListener("pointerleave",leave);scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const mats=Array.isArray(object.material)?object.material:[object.material];mats.forEach(m=>m.dispose());}});screenTexture.dispose();labelTexture.dispose();environment.dispose();renderer.dispose();renderer.domElement.remove();};
}
