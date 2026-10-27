import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type State = { open: boolean; motion: boolean };
const W = 3.12;
const H = 4.52;
const rootAssets = "/journal-3d/";

function roundedPlate(width: number, height: number, depth: number, radius = .12) {
  const x = -width / 2, y = -height / 2, s = new THREE.Shape();
  s.moveTo(x + radius, y); s.lineTo(x + width - radius, y);
  s.quadraticCurveTo(x + width, y, x + width, y + radius);
  s.lineTo(x + width, y + height - radius); s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  s.lineTo(x + radius, y + height); s.quadraticCurveTo(x, y + height, x, y + height - radius);
  s.lineTo(x, y + radius); s.quadraticCurveTo(x, y, x + radius, y);
  const geometry = new THREE.ExtrudeGeometry(s, { depth, steps: 1, bevelEnabled: true, bevelSegments: 3, bevelSize: .018, bevelThickness: .013, curveSegments: 14 });
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) uv.setXY(i, position.getX(i) / width + .5, position.getY(i) / height + .5);
  return geometry;
}

function textureFromCanvas(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d")!; draw(ctx);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}

function fabricTexture() {
  return textureFromCanvas(1024, 1024, ctx => {
    ctx.fillStyle = "#e9e4d7"; ctx.fillRect(0, 0, 1024, 1024);
    let seed = 35107;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 1024; i += 2) {
      ctx.strokeStyle = `rgba(85,76,52,${.025 + random() * .025})`;
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + .6, 1024); ctx.stroke();
      ctx.strokeStyle = `rgba(255,253,239,${.07 + random() * .05})`;
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i + .4); ctx.stroke();
    }
  });
}

export async function mountDiaryCover(host: HTMLElement, state: () => State, ready: () => void, failed: () => void) {
  let disposed = false;
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
  catch { failed(); return () => {}; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .94;
  renderer.setClearColor(0x000000, 0); renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4, 4, 3.25, -3.25, .1, 40); camera.position.set(0, 0, 12);
  const textures = new Set<THREE.Texture>();
  const track = <T extends THREE.Texture>(texture: T) => { textures.add(texture); return texture; };
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04); scene.environment = environment.texture; scene.environmentIntensity = .85; room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xfff8e7, 0x867c68, 1.25));
  const sun = new THREE.DirectionalLight(0xfff1d8, 2.5); sun.position.set(-4, 6, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -5; sun.shadow.camera.right = 5; sun.shadow.camera.top = 5; sun.shadow.camera.bottom = -5;
  sun.shadow.camera.near = .5; sun.shadow.camera.far = 20; sun.shadow.bias = -.0005; sun.shadow.normalBias = .014; sun.shadow.radius = 7;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xe8ecf3, .8); fill.position.set(4, -2, 5); scene.add(fill);
  const fabric = track(fabricTexture()); fabric.wrapS = fabric.wrapT = THREE.RepeatWrapping; fabric.repeat.set(3, 3);
  const clothGeometry = new THREE.PlaneGeometry(24, 18, 160, 120);
  const cp = clothGeometry.attributes.position;
  for (let i = 0; i < cp.count; i++) {
    const x = cp.getX(i), y = cp.getY(i);
    const fold = .018 * Math.sin(x * 6 + y * .5) + .04 * Math.sin(y * 1.5 + x * .18) + .07 * Math.exp(-Math.pow((x + 3.4 + y * .28) / .38, 2)) + .045 * Math.exp(-Math.pow((y - 3.2 + x * .17) / .22, 2));
    cp.setZ(i, -.65 + fold);
  }
  clothGeometry.computeVertexNormals();
  const cloth = new THREE.Mesh(clothGeometry, new THREE.MeshStandardMaterial({ map: fabric, bumpMap: fabric, bumpScale: .018, roughness: 1, color: 0xf5f0e7 })); cloth.receiveShadow = true; scene.add(cloth);
  const book = new THREE.Group(); book.rotation.set(.12, -.27, -.075); book.position.y = .17; scene.add(book);
  const metal = new THREE.MeshStandardMaterial({ color: 0xb49860, metalness: .92, roughness: .29 });
  const brightMetal = new THREE.MeshStandardMaterial({ color: 0xd8c690, metalness: .95, roughness: .21 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x77756b, metalness: .95, roughness: .3 });
  const leather = new THREE.MeshPhysicalMaterial({ color: 0xa99382, roughness: .72, metalness: 0, clearcoat: .12, clearcoatRoughness: .5, bumpScale: .018 });
  const leatherEdge = new THREE.MeshStandardMaterial({ color: 0x38241e, roughness: .75 });
  const front = new THREE.Group(); front.position.set(-W / 2, 0, .19); book.add(front);
  const cover = new THREE.Group(); cover.position.x = W / 2; front.add(cover);
  const frontMesh = new THREE.Mesh(roundedPlate(W, H, .07), leather); frontMesh.castShadow = true; frontMesh.receiveShadow = true; cover.add(frontMesh);
  const back = new THREE.Mesh(roundedPlate(W + .015, H + .025, .07), leather); back.position.z = -.24; back.castShadow = true; book.add(back);
  const spine = new THREE.Mesh(new RoundedBoxGeometry(.19, H - .06, .39, 3, .06), leatherEdge); spine.position.set(-W / 2 + .065, 0, -.05); spine.castShadow = true; book.add(spine);
  const pageGeo = new RoundedBoxGeometry(W - .12, H - .16, .008, 2, .035);
  const papers = [0xe4dac2, 0xeee5cf, 0xe9dfc7, 0xf5ecd8].map(color => new THREE.MeshStandardMaterial({ color, roughness: .95 }));
  for (let i = 0; i < 32; i++) {
    const page = new THREE.Mesh(pageGeo, papers[i % 4]); page.position.set(.02 + Math.sin(i * 1.7) * .003, Math.sin(i * 2.3) * .003, -.15 + i * .009);
    page.receiveShadow = true; book.add(page);
  }
  const loader = new THREE.TextureLoader();
  function load(url: string) { return loader.loadAsync(url).then(t => { track(t); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); return t; }); }
  const loadImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = url; });
  // Small hardware uses shared, rounded geometries and physical materials.
  function box(parent: THREE.Group, x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material = metal, r = .025) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), material); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function ring(parent: THREE.Group, x: number, y: number, z: number, radius: number, tube = .012, material: THREE.Material = metal) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 40), material); mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  function wire(parent: THREE.Group, points: number[][], radius: number, material: THREE.Material) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(30, points.length * 7), radius, 8, false), material); mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  function decal(parent: THREE.Group, texture: THREE.Texture, x: number, y: number, z: number, width: number, height: number, angle = 0, transparent = false) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshStandardMaterial({ map: texture, transparent, alphaTest: transparent ? .16 : 0, roughness: .94, side: THREE.DoubleSide, depthWrite: true }));
    mesh.position.set(x, y, z); mesh.rotation.z = angle; mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  // Fine saddle stitching follows the leather instead of forming a flat CSS border.
  const thread = new THREE.MeshStandardMaterial({ color: 0x9d7854, roughness: 1 });
  const stitchGeo = new THREE.CapsuleGeometry(.0032, .031, 2, 4);
  const stitchPoints: { x: number; y: number; a: number }[] = [];
  for (let y = -H / 2 + .2; y < H / 2 - .15; y += .075) { stitchPoints.push({ x: -W / 2 + .1, y, a: 0 }, { x: W / 2 - .1, y, a: 0 }); }
  for (let x = -W / 2 + .2; x < W / 2 - .15; x += .075) { stitchPoints.push({ x, y: -H / 2 + .1, a: Math.PI / 2 }, { x, y: H / 2 - .1, a: Math.PI / 2 }); }
  const stitches = new THREE.InstancedMesh(stitchGeo, thread, stitchPoints.length); const dummy = new THREE.Object3D();
  stitchPoints.forEach((p, i) => { dummy.position.set(p.x, p.y, .087); dummy.rotation.z = p.a; dummy.updateMatrix(); stitches.setMatrixAt(i, dummy.matrix); }); cover.add(stitches);
  // A softly rounded bulldog clip straddles the top edge.
  const clip = new THREE.Group(); clip.position.set(-.67, H / 2 - .01, .16); clip.rotation.z = -.06; cover.add(clip);
  box(clip, 0, -.055, .035, .74, .24, .1, metal, .035);
  box(clip, 0, -.17, .07, .78, .075, .12, brightMetal, .025);
  wire(clip, [[-.22, .015, .05], [-.18, .26, .12], [0, .46, .14], [.18, .26, .12], [.22, .015, .05]], .036, brightMetal);
  box(clip, 0, .27, .12, .24, .22, .055, metal, .06);
  // A real elastic cord wraps over the cover and around its sides.
  const elastic = new THREE.Group(); cover.add(elastic);
  const cord = new THREE.MeshStandardMaterial({ color: 0x28251e, roughness: .96 });
  wire(elastic, [[-1.6, -.55, -.02], [-1.57, -.55, .12], [-.8, -.55, .155], [0, -.56, .16], [.8, -.55, .16], [1.57, -.55, .12], [1.61, -.55, -.02]], .018, cord);
  // An oval amber locket, suspended by actual chain links.
  const locket = new THREE.Group(); locket.position.set(.24, -.55, .19); elastic.add(locket);
  for (let i = 0; i < 4; i++) { const chain = ring(locket, 0, -.06 - i * .064, .025, .037, .009, brightMetal); chain.rotation.y = i % 2 ? .9 : -.1; }
  const bezel = ring(locket, 0, -.5, .045, .18, .027, metal); bezel.scale.set(.84, 1.18, 1);
  const amber = new THREE.Mesh(new THREE.SphereGeometry(.155, 28, 20), new THREE.MeshPhysicalMaterial({ color: 0x99632d, metalness: .08, roughness: .16, clearcoat: 1, clearcoatRoughness: .08, transmission: .2, thickness: .16, ior: 1.5 })); amber.scale.set(.85, 1.22, .38); amber.position.set(0, -.5, .055); amber.castShadow = true; locket.add(amber);
  // A smaller pearl, with an antique wire setting.
  const pearlGroup = new THREE.Group(); pearlGroup.position.set(.75, -.56, .19); elastic.add(pearlGroup);
  ring(pearlGroup, 0, -.05, .025, .055, .01, metal);
  const pearl = new THREE.Mesh(new THREE.SphereGeometry(.11, 28, 18), new THREE.MeshPhysicalMaterial({ color: 0xf0e5cb, roughness: .2, metalness: .08, clearcoat: 1, iridescence: .25, iridescenceIOR: 1.35 })); pearl.position.set(0, -.25, .045); pearl.scale.y = 1.22; pearl.castShadow = true; pearlGroup.add(pearl);
  // Stone and brass beads snake down the spine, like the reference journals.
  const beads = new THREE.Group(); beads.position.set(-1.45, 1.15, .16); cover.add(beads);
  const beadMaterials = [
    new THREE.MeshPhysicalMaterial({ color: 0xb7bea0, roughness: .22, clearcoat: .9, transmission: .12, thickness: .12 }),
    new THREE.MeshPhysicalMaterial({ color: 0xe9dcc0, roughness: .18, clearcoat: 1, iridescence: .2 }),
    new THREE.MeshPhysicalMaterial({ color: 0x72523d, roughness: .22, clearcoat: 1 }),
    new THREE.MeshPhysicalMaterial({ color: 0xc09a92, roughness: .26, clearcoat: .8 }),
  ];
  const strand: number[][] = [];
  for (let i = 0; i < 13; i++) {
    const y = -i * .25, x = -.15 - Math.sin(i * .7) * .17, z = .1 + Math.sin(i * .5) * .025;
    strand.push([x, y, z]);
    const bead = new THREE.Mesh(new THREE.SphereGeometry(i % 3 === 0 ? .1 : .072, 20, 14), beadMaterials[i % 4]);
    bead.position.set(x, y, z); bead.scale.set(1, i % 3 === 0 ? 1.35 : 1.05, .8); bead.rotation.z = Math.sin(i) * .35; bead.castShadow = true; beads.add(bead);
    if (i < 12) { const spacer = ring(beads, x, y - .12, z, .038, .01, metal); spacer.rotation.x = Math.PI / 2; }
  }
  wire(beads, strand, .007, metal);
  const lastBead = strand[strand.length - 1];
  const beadCharm = ring(beads, lastBead[0], lastBead[1] - .2, lastBead[2], .09, .012, brightMetal); beadCharm.scale.set(.8, 1.3, 1);
  // A leather star tag, stitched in cream thread, tucked under the elastic.
  const starShape = new THREE.Shape(); const starPoints: THREE.Vector3[] = [];
  for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .15 : .34; const x = Math.cos(a) * r, y = Math.sin(a) * r; if (!i) starShape.moveTo(x, y); else starShape.lineTo(x, y); starPoints.push(new THREE.Vector3(x * .81, y * .81, .065)); } starShape.closePath();
  const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: .035, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 3, steps: 1 });
  const star = new THREE.Group(); star.position.set(.85, -1.62, .11); star.rotation.z = -.25; cover.add(star);
  const starMesh = new THREE.Mesh(starGeo, new THREE.MeshStandardMaterial({ color: 0x313a3b, roughness: .76 })); starMesh.castShadow = true; star.add(starMesh);
  starPoints.push(starPoints[0]); const outline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(starPoints), new THREE.LineDashedMaterial({ color: 0xd3c8a4, dashSize: .027, gapSize: .017 })); outline.computeLineDistances(); star.add(outline);
  ring(star, 0, .22, .07, .026, .01, metal);
  // A dark fountain pen with a brass clip, slipping out from the fore edge.
  const pen = new THREE.Group(); pen.position.set(1.6, .63, -.03); pen.rotation.z = -.015; book.add(pen);
  const penBody = new THREE.Mesh(new THREE.CylinderGeometry(.062, .073, 2.85, 24), new THREE.MeshPhysicalMaterial({ color: 0x342820, roughness: .24, clearcoat: .9 })); penBody.castShadow = true; pen.add(penBody);
  for (const y of [-1.25, .68, .8, 1.34]) { const band = new THREE.Mesh(new THREE.CylinderGeometry(.077, .077, .045, 24), metal); band.position.y = y; pen.add(band); }
  box(pen, 0, 1.04, .085, .026, .58, .035, brightMetal, .009);
  // A couple of turned brass eyelets on the leather spine.
  for (const y of [1.55, -1.65]) {
    ring(cover, -W / 2 + .12, y, .105, .065, .016, metal);
    const hole = new THREE.Mesh(new THREE.CircleGeometry(.045, 20), new THREE.MeshStandardMaterial({ color: 0x211d18, roughness: 1 })); hole.position.set(-W / 2 + .12, y, .1); cover.add(hole);
  }
  // Resize the camera frustum, never the document. Both mobile and desktop fit.
  let width = 1, height = 1;
  function resize() {
    width = host.clientWidth; height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const visibleHeight = Math.max(6.25, 4.4 / aspect);
    camera.left = -visibleHeight * aspect / 2; camera.right = visibleHeight * aspect / 2; camera.top = visibleHeight / 2; camera.bottom = -visibleHeight / 2;
    camera.updateProjectionMatrix();
    book.updateMatrixWorld(true); camera.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(book);
    let bottom = 0;
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      const point = new THREE.Vector3(x, y, z).project(camera);
      bottom = Math.max(bottom, (1 - point.y) * height / 2);
    }
    const invitationTop = Math.min(bottom + host.offsetTop + 13, height + host.offsetTop - 88);
    host.parentElement?.style.setProperty('--dy-cover-invite-top', `${invitationTop}px`);
  }
  const observer = new ResizeObserver(resize); observer.observe(host); resize();
  const pointer = new THREE.Vector2();
  const move = (event: PointerEvent) => { if (event.pointerType === "touch") return; const rect = host.getBoundingClientRect(); pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1); };
  const leave = () => pointer.set(0, 0);
  // The parent also contains the transparent, keyboard-accessible opening button.
  const pointerSurface = host.parentElement!; pointerSurface.addEventListener("pointermove", move, { passive: true }); pointerSurface.addEventListener("pointerleave", leave);
  const contextLost = (e: Event) => { e.preventDefault(); failed(); }; renderer.domElement.addEventListener("webglcontextlost", contextLost);
  let progress = state().open ? 1 : 0, last = 0, lastDraw = 0;
  function frame(now: number) {
    if (disposed) return;
    const dt = Math.min((now - last) / 1000 || .016, .06); last = now;
    const current = state(); const target = current.open ? 1 : 0;
    progress = current.motion ? THREE.MathUtils.damp(progress, target, 5, dt) : target;
    const hinged = THREE.MathUtils.smoothstep(progress, .12, .98);
    front.rotation.y = -hinged * Math.PI * .92;
    elastic.position.y = -THREE.MathUtils.smoothstep(progress, 0, .24) * .25;
    if (current.open && progress > .999) return;
    const time = now / 1000;
    const tiltX = current.motion && !current.open ? .12 + pointer.y * .06 : .12;
    const tiltY = current.motion && !current.open ? -.27 + pointer.x * .13 : -.27;
    book.rotation.x = THREE.MathUtils.damp(book.rotation.x, tiltX, 5, dt); book.rotation.y = THREE.MathUtils.damp(book.rotation.y, tiltY, 5, dt);
    beads.rotation.z = current.motion ? Math.sin(time * .75) * .025 - pointer.x * .04 : 0;
    locket.rotation.z = current.motion ? Math.sin(time * 1.12) * .055 + pointer.x * .05 : 0;
    pearlGroup.rotation.z = current.motion ? Math.sin(time * 1.25 + .5) * .045 : 0;
    if (!document.hidden && (now - lastDraw > 30 || Math.abs(progress - target) > .002)) { renderer.render(scene, camera); lastDraw = now; }
  }
  renderer.setAnimationLoop(frame);
  let releaseResources: () => void = () => {};
  releaseResources = () => {
    if (disposed) return; disposed = true; renderer.setAnimationLoop(null); observer.disconnect();
    pointerSurface.removeEventListener("pointermove", move); pointerSurface.removeEventListener("pointerleave", leave); renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>();
    scene.traverse(object => { const mesh = object as THREE.Mesh; if (mesh.geometry) geometries.add(mesh.geometry); if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => materials.add(m)); });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); environment.dispose(); sun.shadow.map?.dispose(); renderer.dispose(); renderer.domElement.remove();
  };
  try {
    const [leatherMap, laceMap, images, handwriting] = await Promise.all([
      load(rootAssets + "espresso-leather.jpg"), load(rootAssets + "ivory-lace-bow.png"),
      Promise.all(["regents-canal.jpg", "embroidered-tote.jpg", "scooter-sketch.jpg"].map(file => loadImage("/visual-diary/" + file))),
      load(rootAssets + "handwritten-note.jpg"),
    ]);
    if (disposed) { releaseResources(); return releaseResources; }
    leather.map = leatherMap; leather.bumpMap = leatherMap; leather.needsUpdate = true;
    const photoTexture = track(textureFromCanvas(384, 1080, ctx => {
      ctx.fillStyle = "#d6c9a8"; ctx.fillRect(0, 0, 384, 1080);
      images.forEach((image, i) => { const x = 22, y = 22 + i * 350, w = 340, h = 320; const ratio = Math.max(w / image.width, h / image.height); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.filter = 'sepia(.28) saturate(.64)'; ctx.drawImage(image, x + (w - image.width * ratio) / 2, y + (h - image.height * ratio) / 2, image.width * ratio, image.height * ratio); ctx.restore(); });
    }));
    const strip = decal(cover, photoTexture, .83, .95, .105, .64, 1.81, -.12);
    box(cover, .83, .95, .093, .655, 1.825, .018, new THREE.MeshStandardMaterial({ color: 0xcfbf9a, roughness: .95 }), .008);
    const tape = new THREE.Mesh(new THREE.PlaneGeometry(.76, .15), new THREE.MeshStandardMaterial({ color: 0xc0b28f, transparent: true, opacity: .6, roughness: 1, side: THREE.DoubleSide })); tape.position.set(.82, 1.86, .12); tape.rotation.z = .07; cover.add(tape);
    // Display the original photograph as a paper texture. UV cropping excludes
    // the spiral and blank upper page without recreating any handwriting.
    handwriting.wrapS = handwriting.wrapT = THREE.ClampToEdgeWrapping;
    handwriting.repeat.set(.8004, .5409);
    handwriting.offset.set(.1535, .0132);
    box(cover, .05, .02, .102, 2.5, 1.28, .012, new THREE.MeshStandardMaterial({ color: 0xd6cbb3, roughness: 1 }), .008);
    const note = decal(cover, handwriting, .05, .02, .116, 2.48, 1.26, .025);
    note.material.roughness = 1; note.material.color.set(0xd9d6cc);
    // Raised burgundy X stitches sit on the paper, below the elastic and lace.
    const crossCenters: [number, number][] = [];
    const edgeX = 2.48 / 2 - .045, edgeY = 1.26 / 2 - .045;
    const columns = Math.round(edgeX * 2 / .064), rows = Math.round(edgeY * 2 / .064);
    for (let i = 0; i <= columns; i++) {
      const x = -edgeX + i * edgeX * 2 / columns;
      crossCenters.push([x, -edgeY], [x, edgeY]);
    }
    for (let i = 1; i < rows; i++) {
      const y = -edgeY + i * edgeY * 2 / rows;
      crossCenters.push([-edgeX, y], [edgeX, y]);
    }
    const embroidery = new THREE.InstancedMesh(
      new THREE.CapsuleGeometry(.0033, .043, 2, 5),
      new THREE.MeshStandardMaterial({ color: 0x853e3c, roughness: 1 }),
      crossCenters.length * 2,
    );
    const crossTransform = new THREE.Object3D();
    crossCenters.forEach(([x, y], i) => {
      for (let diagonal = 0; diagonal < 2; diagonal++) {
        crossTransform.position.set(x, y, .006 + diagonal * .006);
        crossTransform.rotation.z = diagonal ? Math.PI / 4 : -Math.PI / 4;
        crossTransform.updateMatrix();
        embroidery.setMatrixAt(i * 2 + diagonal, crossTransform.matrix);
      }
    });
    embroidery.castShadow = true; embroidery.receiveShadow = true;
    note.add(embroidery);

    // A photographic lace cutout supplies the actual thread detail and open holes.
    const lace = decal(cover, laceMap, -1.08, 1.28, .195, 1.34, 1.7, .11, true);
    lace.material.polygonOffset = true; lace.material.polygonOffsetFactor = -1;
    // Small curls in the lace geometry keep it from being a flat card.
    const laceGeometry = new THREE.PlaneGeometry(1.34, 1.7, 14, 20); const lp = laceGeometry.attributes.position;
    for (let i = 0; i < lp.count; i++) lp.setZ(i, .022 * Math.sin(lp.getX(i) * 8) * Math.cos(lp.getY(i) * 5));
    laceGeometry.computeVertexNormals(); lace.geometry.dispose(); lace.geometry = laceGeometry;
    renderer.render(scene, camera); ready();
    void strip;
  } catch { failed(); releaseResources(); }
  return releaseResources;
}
