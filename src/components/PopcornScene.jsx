import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPopcornModel, disposeScene } from './popcorn/createPopcornModel.js';
import { createShakeTracker } from './popcorn/shakeTracker.js';
import fallbackPoster from '../assets/popcorn-contact.png';
import shakeCursor from '../assets/shake-it-cursor.svg';

export default function PopcornScene({ phase }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const hitTestRef = useRef(() => false);
  const phaseRef = useRef(phase);
  const inputRef = useRef({ x: 0, y: 0, spin: 0, kick: 0, spills: [], dragging: false, moved: false });
  const shakeRef = useRef(createShakeTracker());
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  const hideCursor = () => {
    hostRef.current?.classList.remove('is-shake-target');
    if (cursorRef.current) cursorRef.current.dataset.visible = 'false';
  };
  useEffect(() => {
    if (phase !== 'idle') hideCursor();
  }, [phase]);

  useEffect(() => {
    const host = hostRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setUnavailable(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#26040b');
    scene.fog = new THREE.Fog('#26040b', 18, 34);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 45);
    camera.position.set(5.3, 4.5, 9.6);
    camera.lookAt(0, 2.4, 0);
    const model = createPopcornModel();
    scene.add(model.root, model.stage, model.backdrop, model.floor, model.spills);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const topHitArea = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), new THREE.MeshBasicMaterial());
    topHitArea.position.y = 4.25;
    topHitArea.scale.set(1.5, 0.65, 1.5);
    topHitArea.visible = false;
    model.root.add(topHitArea);
    const hitObjects = [...model.root.getObjectByName('paper-bucket').children, topHitArea];
    hitTestRef.current = (x, y) => {
      const bounds = host.getBoundingClientRect();
      pointer.set((x - bounds.left) / bounds.width * 2 - 1, 1 - (y - bounds.top) / bounds.height * 2);
      model.root.updateWorldMatrix(true, true);
      camera.updateMatrixWorld();
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(hitObjects, false).length > 0;
    };
    scene.add(new THREE.HemisphereLight('#ffedcc', '#4c1725', 2.1));
    const key = new THREE.DirectionalLight('#fff0cf', 3.8);
    key.position.set(-3, 7, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -5, right: 5, top: 7, bottom: -3, near: 0.1, far: 22 });
    key.shadow.bias = -0.0003;
    key.shadow.normalBias = 0.025;
    key.shadow.radius = 3;
    scene.add(key);
    const rim = new THREE.DirectionalLight('#ffb66e', 2.8);
    rim.position.set(4, 5, -2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight('#fff4e2', 1.1);
    fill.position.set(3, 3, 7);
    scene.add(fill);
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = width / height < 0.7 ? 43 : 36;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lastTime = performance.now();
    let burstAt = null;
    let lastPhase = 'idle';
    let frame;
    let visible = true;
    const animate = (now) => {
      frame = window.requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!visible) return;
      const currentPhase = phaseRef.current;
      if (currentPhase === 'popping' && lastPhase !== 'popping') burstAt = now;
      if (currentPhase === 'idle' && lastPhase !== 'idle') { burstAt = null; model.updateBurst(null); }
      lastPhase = currentPhase;
      const input = inputRef.current;
      const damping = 1 - Math.exp(-delta * 5);
      const idle = reducedMotion.matches ? 0 : Math.sin(now * 0.00035) * 0.045;
      model.root.rotation.y += (input.spin + input.x * 0.17 + idle - model.root.rotation.y) * damping;
      model.root.rotation.x += (input.y * 0.035 - model.root.rotation.x) * damping;
      input.kick *= Math.exp(-delta * 6);
      model.root.rotation.z += ((reducedMotion.matches ? 0 : input.kick) - model.root.rotation.z) * (1 - Math.exp(-delta * 12));
      for (const shake of input.spills.splice(0)) {
        if (currentPhase === 'idle' && !reducedMotion.matches) model.spill(shake.strength, shake.direction);
      }
      model.updateSpills(delta);
      if (burstAt !== null && !reducedMotion.matches) model.updateBurst(Math.min(1.6, (now - burstAt) / 1000));
      renderer.render(scene, camera);
    };
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);
    const onContextLost = (event) => { event.preventDefault(); setUnavailable(true); };
    const canvas = canvasRef.current;
    canvas.addEventListener('webglcontextlost', onContextLost);
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      hitTestRef.current = () => false;
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      disposeScene(scene);
      key.shadow.dispose();
      renderer.dispose();
    };
  }, []);

  if (unavailable) return <img className="popcorn-contact__poster" src={fallbackPoster} alt="CONTACT ME 팝콘 상자" />;
  return <div
    ref={hostRef}
    className="popcorn-contact__scene"
    onPointerDown={(event) => {
      if (event.button !== 0 || phaseRef.current !== 'idle' || !hitTestRef.current(event.clientX, event.clientY)) return;
      const input = inputRef.current;
      input.dragging = true;
      input.moved = false;
      input.startX = event.clientX;
      input.startY = event.clientY;
      input.startSpin = input.spin;
      shakeRef.current.start(event.clientX, event.clientY, performance.now());
    }}
    onPointerMove={(event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const input = inputRef.current;
      input.x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      input.y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
      const overPopcorn = phaseRef.current === 'idle' && (input.dragging || hitTestRef.current(event.clientX, event.clientY));
      const showCursor = event.pointerType === 'mouse' && overPopcorn;
      event.currentTarget.classList.toggle('is-shake-target', showCursor);
      if (cursorRef.current) {
        cursorRef.current.dataset.visible = String(showCursor);
        const x = Math.max(0, Math.min(event.clientX - bounds.left + 10, bounds.width - 145));
        const y = Math.max(0, Math.min(event.clientY - bounds.top + 8, bounds.height - 95));
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (input.dragging && Math.hypot(event.clientX - input.startX, event.clientY - input.startY) > 6) {
        input.moved = true;
        input.spin = input.startSpin + (event.clientX - input.startX) * 0.007;
        event.currentTarget.setPointerCapture(event.pointerId);
        const shake = shakeRef.current.move(event.clientX, event.clientY, performance.now());
        if (shake) {
          input.spills.push(shake);
          input.kick = -shake.direction * shake.strength * 0.1;
        }
      }
    }}
    onPointerUp={(event) => {
      inputRef.current.dragging = false;
      shakeRef.current.stop();
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }}
    onPointerCancel={() => { inputRef.current.dragging = false; shakeRef.current.stop(); hideCursor(); }}
    onPointerLeave={() => { inputRef.current.x = 0; inputRef.current.y = 0; hideCursor(); if (!inputRef.current.moved) inputRef.current.dragging = false; }}
    onClickCapture={(event) => { if (inputRef.current.moved) { event.stopPropagation(); inputRef.current.moved = false; } }}
  >
    <canvas ref={canvasRef} aria-hidden="true" />
    <img ref={cursorRef} className="popcorn-contact__shake-cursor" src={shakeCursor} alt="" aria-hidden="true" data-visible="false" draggable="false" />
  </div>;
}
