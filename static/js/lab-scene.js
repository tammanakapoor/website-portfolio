// Lab page 3D scene: a floating iridescent icosahedron with a thin ring and two small
// satellites, drawn with three.js (vendor/three.module.js). It follows the cursor
// while the pointer is over the canvas. Ported from app/lab/spatial-canvas.tsx.
import * as THREE from "../vendor/three.module.js";

const wrap = document.querySelector(".lab-canvas-wrap");
const canvas = wrap && wrap.querySelector("canvas");
if (canvas) start();

function start() {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1), 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
  camera.position.set(0, 0, 6);

  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const sun = new THREE.DirectionalLight(0xdceaff, 4.2);
  sun.position.set(4, 5, 4);
  scene.add(sun);
  const violet = new THREE.PointLight(0x815cff, 18);
  violet.position.set(-3, -2, 3);
  scene.add(violet);
  const sky = new THREE.PointLight(0x8ddcff, 12);
  sky.position.set(3, 1, 2);
  scene.add(sky);

  const group = new THREE.Group();
  group.rotation.set(0.08, -0.2, 0.08);
  scene.add(group);

  // Same gentle bobbing as the <Float> helper from @react-three/drei.
  const floats = [];
  function float(mesh, speed, rotationIntensity, floatIntensity) {
    const holder = new THREE.Group();
    holder.add(mesh);
    group.add(holder);
    floats.push({ holder, speed: still ? 0 : speed, rotationIntensity: still ? 0 : rotationIntensity, floatIntensity: still ? 0 : floatIntensity, offset: Math.random() * 10000 });
    return mesh;
  }

  const core = float(new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.48, 5),
    new THREE.MeshPhysicalMaterial({
      color: 0x7294ff, emissive: 0x172b78, emissiveIntensity: 0.42,
      roughness: 0.16, metalness: 0.28, clearcoat: 1, clearcoatRoughness: 0.1,
      iridescence: 1, iridescenceIOR: 1.45,
    }),
  ), 1.6, 0.25, 0.65);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.04, 0.025, 16, 160),
    new THREE.MeshStandardMaterial({ color: 0xd4ff55, emissive: 0x7ea420, emissiveIntensity: 0.8 }),
  );
  ring.rotation.set(1.1, 0.2, 0.3);
  float(ring, 1.15, 0.35, 0.35);

  const coral = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff806a, emissive: 0xff5f4a, emissiveIntensity: 0.65 }),
  );
  coral.position.set(1.72, 1.16, 0.7);
  float(coral, 2, 0.5, 0.55);

  const lilac = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.MeshStandardMaterial({ color: 0x9f8cff, emissive: 0x6a57dd, emissiveIntensity: 0.55 }),
  );
  lilac.position.set(-1.8, -1.05, 0.5);
  lilac.rotation.set(0.6, 0.3, 0.1);
  float(lilac, 1.5, 0.4, 0.65);

  // Pointer position over the canvas, from -1 to 1 on each axis.
  const pointer = { x: 0, y: 0 };
  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  function resize() {
    const width = wrap.clientWidth, height = wrap.clientHeight;
    if (!width || !height) return false;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    return true;
  }
  new ResizeObserver(resize).observe(wrap);

  const timer = new THREE.Timer();
  function frame(now) {
    requestAnimationFrame(frame);
    timer.update(now);
    if (!resize()) return;
    const delta = timer.getDelta();
    const elapsed = timer.getElapsed();

    if (!still) {
      const ease = Math.min(delta * 2.8, 1);
      group.rotation.y += (pointer.x * 0.24 - group.rotation.y) * ease;
      group.rotation.x += (-pointer.y * 0.16 - group.rotation.x) * ease;
      core.rotation.z += delta * 0.09;
    }

    for (const f of floats) {
      if (f.speed === 0) continue;
      const t = f.offset + elapsed;
      f.holder.rotation.x = (Math.cos((t / 4) * f.speed) / 8) * f.rotationIntensity;
      f.holder.rotation.y = (Math.sin((t / 4) * f.speed) / 8) * f.rotationIntensity;
      f.holder.rotation.z = (Math.sin((t / 4) * f.speed) / 20) * f.rotationIntensity;
      f.holder.position.y = (Math.sin((t / 4) * f.speed) / 10) * f.floatIntensity;
    }

    renderer.render(scene, camera);
  }
  frame();
}
