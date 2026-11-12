import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Reference-led, procedural reconstruction. The unseen rear repeats the printed
// paper panels; it is inferred rather than recovered from the source photograph.
export const POPCORN_SPEC = Object.freeze({
  seed: 4817, bottomWidth: 2.02, topWidth: 2.72, height: 3.58,
  baseY: 0.36, scallopsPerSide: 6, kernelGrid: 13, looseKernels: 30,
});

function randomGenerator(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function paperTexture(side) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f5e7bf';
  ctx.fillRect(0, 0, 1024, 1536);
  ctx.fillStyle = '#b70920';
  for (let x = 20; x < 1024; x += 72) ctx.fillRect(x, 0, 13, 1536);
  if (side % 2 === 0) {
    ctx.save();
    ctx.translate(512, 800);
    ctx.scale(1, 1.12);
    ctx.beginPath();
    ctx.ellipse(0, 0, 402, 405, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f5e7bf';
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#b70920';
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#b70920';
    ctx.font = 'italic bold 94px Georgia, serif';
    ctx.fillText('Delicious', 0, -230);
    ctx.font = 'italic 900 245px Georgia, serif';
    ctx.fillText('POP', -10, -5, 740);
    ctx.font = 'italic 900 217px Georgia, serif';
    ctx.fillText('CORN', -8, 206, 760);
    ctx.font = 'bold 25px Georgia, serif';
    ctx.fillText('FRESHLY POPPED · MADE WITH LOVE', 0, 295, 640);
    ctx.restore();
  } else {
    ctx.fillStyle = '#b70920';
    ctx.fillRect(109, 326, 806, 953);
    ctx.fillStyle = '#f5e7bf';
    ctx.fillRect(129, 346, 766, 913);
    ctx.fillStyle = '#b70920';
    ctx.textAlign = 'center';
    ctx.font = 'italic bold 66px Georgia, serif';
    ctx.fillText('Let’s make', 512, 694);
    ctx.fillText('the next scene.', 512, 788);
    ctx.font = '25px Georgia, serif';
    ctx.fillText('YOO SEUNG HYUN', 512, 915);
  }
  // Paper grain is generated, so there is no lighting baked into the material.
  const random = randomGenerator(184 + side);
  for (let i = 0; i < 26000; i += 1) {
    ctx.fillStyle = random() > 0.5 ? '#fff8e610' : '#6d461408';
    ctx.fillRect(random() * 1024, random() * 1536, 1 + random() * 2, 1 + random() * 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function createPanelGeometry(side = 0) {
  const spec = POPCORN_SPEC;
  const columns = 72;
  const rows = 12;
  const positions = [];
  const uvs = [];
  const indices = [];
  const angle = side * Math.PI / 2;
  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    const half = THREE.MathUtils.lerp(spec.bottomWidth, spec.topWidth, v) / 2;
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns;
      const scallop = 0.11 * (0.5 - 0.5 * Math.cos(u * Math.PI * 2 * spec.scallopsPerSide));
      const x = (u * 2 - 1) * (half - 0.075);
      const z = half;
      positions.push(x * Math.cos(angle) + z * Math.sin(angle), spec.baseY + v * spec.height + scallop * v ** 10, z * Math.cos(angle) - x * Math.sin(angle));
      uvs.push(u, v);
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column;
        const b = a + columns + 1;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function kernelGeometry(variant) {
  const random = randomGenerator(240 + variant * 91);
  const pieces = [];
  const count = 6;
  for (let lobe = 0; lobe < count; lobe += 1) {
    const geometry = new THREE.IcosahedronGeometry(1, 2);
    const positions = geometry.attributes.position;
    for (let vertex = 0; vertex < positions.count; vertex += 1) {
      const x = positions.getX(vertex);
      const y = positions.getY(vertex);
      const z = positions.getZ(vertex);
      const fold = 1 + 0.10 * Math.sin(x * 9 + variant) * Math.cos(z * 8 - y * 5) + 0.055 * Math.sin(y * 14 + z * 4);
      positions.setXYZ(vertex, x * fold, y * fold, z * fold);
    }
    const angle = lobe * Math.PI * 2 / count + variant * 0.3;
    const size = 0.43 + random() * 0.22;
    geometry.scale(size, size * (0.85 + random() * 0.35), size * (0.8 + random() * 0.3));
    geometry.translate(Math.cos(angle) * 0.43, lobe % 2 === 0 ? 0.14 : -0.1, Math.sin(angle) * 0.43);
    geometry.computeVertexNormals();
    pieces.push(geometry);
  }
  const merged = mergeGeometries(pieces);
  pieces.forEach((piece) => piece.dispose());
  return merged;
}

function createCurtain() {
  const geometry = new THREE.PlaneGeometry(18, 12, 240, 1);
  const points = geometry.attributes.position;
  for (let i = 0; i < points.count; i += 1) {
    const x = points.getX(i);
    points.setZ(i, 0.18 * Math.cos(x * 8.2) + 0.055 * Math.cos(x * 16.4));
  }
  geometry.computeVertexNormals();
  const curtain = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#660516', roughness: 0.95 }));
  curtain.position.set(0, 4, -3.2);
  curtain.receiveShadow = true;
  return curtain;
}

export function createPopcornModel() {
  const root = new THREE.Group();
  root.name = 'popcorn-contact';
  const bucket = new THREE.Group();
  bucket.name = 'paper-bucket';
  root.add(bucket);
  const spec = POPCORN_SPEC;
  const random = randomGenerator(spec.seed);
  const paper = new THREE.MeshStandardMaterial({ color: '#f4e4b9', roughness: 0.88, side: THREE.DoubleSide });
  for (let side = 0; side < 4; side += 1) {
    const panel = new THREE.Mesh(createPanelGeometry(side), new THREE.MeshStandardMaterial({ map: paperTexture(side), roughness: 0.87, side: THREE.DoubleSide }));
    panel.name = `printed-panel-${side}`;
    panel.castShadow = true;
    panel.receiveShadow = true;
    bucket.add(panel);
    // Narrow chamfers join the paper panels; the container has actual depth.
    const angle = side * Math.PI / 2;
    const vertices = [];
    for (const [half, y] of [[spec.bottomWidth / 2, spec.baseY], [spec.topWidth / 2, spec.baseY + spec.height]]) {
      for (const [x, z] of [[half - 0.075, half], [half, half - 0.075]]) vertices.push(x * Math.cos(angle) + z * Math.sin(angle), y, z * Math.cos(angle) - x * Math.sin(angle));
    }
    const cornerGeometry = new THREE.BufferGeometry();
    cornerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    cornerGeometry.setIndex([0, 1, 2, 1, 3, 2]);
    cornerGeometry.computeVertexNormals();
    const corner = new THREE.Mesh(cornerGeometry, paper);
    corner.castShadow = true;
    bucket.add(corner);
  }
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(spec.bottomWidth, 0.035, spec.bottomWidth), paper);
  bottom.position.y = spec.baseY;
  bucket.add(bottom);

  const kernels = new THREE.Group();
  kernels.name = 'popcorn-kernels';
  root.add(kernels);
  const homes = [];
  // A staggered lower layer closes the sight lines under the top kernels.
  for (let row = 0; row < 12; row += 1) {
    for (let column = 0; column < 12; column += 1) {
      homes.push({
        x: (column - 5.5) * 0.215 + (row % 2 ? 0.04 : -0.04),
        y: 3.98 + random() * 0.05,
        z: (row - 5.5) * 0.215,
        scale: 0.205 + random() * 0.035,
        loose: false,
      });
    }
  }
  for (let row = 0; row < spec.kernelGrid; row += 1) {
    for (let column = 0; column < spec.kernelGrid; column += 1) {
      const x = (column - (spec.kernelGrid - 1) / 2) * 0.205 + (random() - 0.5) * 0.06;
      const z = (row - (spec.kernelGrid - 1) / 2) * 0.205 + (random() - 0.5) * 0.06;
      const dome = Math.max(0, 1 - (x * x + z * z) / 2.5);
      homes.push({ x, y: 4.08 + dome * 0.42 + random() * 0.11, z, scale: 0.19 + random() * 0.055, loose: false });
    }
  }
  // Tuck a continuous row against each scalloped edge, including the corners.
  for (let side = 0; side < 4; side += 1) {
    const angle = side * Math.PI / 2;
    for (let index = 0; index < 13; index += 1) {
      const x = (index - 6) * 0.207;
      const z = 1.255;
      homes.push({ x: x * Math.cos(angle) + z * Math.sin(angle), y: 4.04 + random() * 0.06, z: z * Math.cos(angle) - x * Math.sin(angle), scale: 0.2 + random() * 0.025, loose: false });
    }
  }
  for (let i = 0; i < spec.looseKernels; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 1.3 + random() * 0.7;
    homes.push({ x: Math.cos(angle) * radius, y: 0.43 + random() * 0.05, z: Math.sin(angle) * radius, scale: 0.16 + random() * 0.07, loose: true });
  }
  const cream = new THREE.MeshStandardMaterial({ color: '#fff0c3', roughness: 0.88 });
  const dummy = new THREE.Object3D();
  const batches = [];
  for (let variant = 0; variant < 3; variant += 1) {
    const members = homes.filter((_, index) => index % 3 === variant).map((home) => ({
      ...home,
      rotation: new THREE.Euler(random() * 6, random() * 6, random() * 6),
      velocity: new THREE.Vector3((random() - 0.5) * 7, 4 + random() * 5, (random() - 0.5) * 6),
    }));
    const mesh = new THREE.InstancedMesh(kernelGeometry(variant), cream, members.length);
    mesh.name = `kernel-batch-${variant}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    members.forEach((home, index) => {
      dummy.position.set(home.x, home.y, home.z);
      dummy.rotation.copy(home.rotation);
      dummy.scale.setScalar(home.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, new THREE.Color().setHSL(0.105 + random() * 0.025, 0.32 + random() * 0.22, 0.74 + random() * 0.18));
    });
    kernels.add(mesh);
    batches.push({ mesh, members });
  }
  // Toasted inner seeds sit inside the folds instead of being painted shadows.
  const seeds = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshStandardMaterial({ color: '#9b521d', roughness: 1 }), 42);
  homes.filter((home) => home.y > 4.2).slice(0, 42).forEach((home, index) => {
    dummy.position.set(home.x, home.y + home.scale * 0.45, home.z + home.scale * 0.22);
    dummy.rotation.copy(new THREE.Euler(0.4, index, 0));
    dummy.scale.set(1, 0.6, 1);
    dummy.updateMatrix();
    seeds.setMatrixAt(index, dummy.matrix);
  });
  kernels.add(seeds);

  // Falling kernels live outside the bucket group, so gravity stays vertical
  // while the user continues turning or rocking the container.
  const spills = new THREE.Group();
  spills.name = 'falling-popcorn';
  const spillCapacity = 72;
  const spillMesh = new THREE.InstancedMesh(batches[0].mesh.geometry, cream, spillCapacity);
  spillMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  spillMesh.frustumCulled = false;
  spillMesh.castShadow = true;
  spillMesh.receiveShadow = true;
  spills.add(spillMesh);
  const particles = Array.from({ length: spillCapacity }, (_, index) => {
    dummy.position.set(0, -5, 0);
    dummy.scale.setScalar(0.001);
    dummy.updateMatrix();
    spillMesh.setMatrixAt(index, dummy.matrix);
    spillMesh.setColorAt(index, new THREE.Color().setHSL(0.12, 0.35, 0.82 + random() * 0.12));
    return { active: false, position: new THREE.Vector3(), velocity: new THREE.Vector3(), rotation: new THREE.Euler(), age: 0, size: 0.18 };
  });
  let nextParticle = 0;
  const worldRotation = new THREE.Quaternion();

  const stage = new THREE.Group();
  stage.name = 'red-velvet-stage';
  const velvet = new THREE.MeshStandardMaterial({ color: '#a00821', roughness: 0.97 });
  for (const [radius, height, y] of [[2.2, 0.32, 0.16], [2.55, 0.2, -0.1]]) {
    const step = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 0.035, height, 96), velvet);
    step.position.y = y;
    step.receiveShadow = true;
    step.castShadow = true;
    stage.add(step);
  }
  const backdrop = createCurtain();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: '#31040e', roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.205;
  floor.receiveShadow = true;

  return {
    root, stage, backdrop, floor, spills,
    spill(strength, direction = 1) {
      root.updateWorldMatrix(true, false);
      root.getWorldQuaternion(worldRotation);
      const amount = Math.min(13, Math.round(4 + strength * 5));
      for (let index = 0; index < amount; index += 1) {
        const particle = particles[nextParticle];
        nextParticle = (nextParticle + 1) % spillCapacity;
        particle.active = true;
        particle.age = 0;
        particle.size = 0.16 + random() * 0.07;
        particle.position.set(direction * (1.19 + random() * 0.12), 4.12 + random() * 0.22, (random() - 0.5) * 2.1).applyMatrix4(root.matrixWorld);
        particle.velocity.set(direction * (1.4 + strength * 0.9 + random()), 1.3 + random() * 2.1, (random() - 0.5) * 2.8).applyQuaternion(worldRotation);
        particle.rotation.set(random() * 6, random() * 6, random() * 6);
      }
    },
    updateSpills(delta) {
      let dirty = false;
      particles.forEach((particle, index) => {
        if (!particle.active) return;
        dirty = true;
        particle.age += delta;
        particle.velocity.y -= 9.8 * delta;
        particle.position.addScaledVector(particle.velocity, delta);
        const radius = Math.hypot(particle.position.x, particle.position.z);
        const surface = radius <= 2.2 ? 0.32 : radius <= 2.58 ? 0 : -0.205;
        const ground = surface + particle.size * 0.72;
        if (particle.position.y < ground) {
          particle.position.y = ground;
          particle.velocity.y = Math.abs(particle.velocity.y) > 0.55 ? Math.abs(particle.velocity.y) * 0.3 : 0;
          particle.velocity.x *= Math.exp(-delta * 12);
          particle.velocity.z *= Math.exp(-delta * 12);
        }
        const rolling = Math.min(1, particle.velocity.length());
        particle.rotation.x += delta * rolling * 3;
        particle.rotation.z += delta * rolling * 2;
        dummy.position.copy(particle.position);
        dummy.rotation.copy(particle.rotation);
        const fade = THREE.MathUtils.clamp((5 - particle.age) / 1.1, 0, 1);
        dummy.scale.setScalar(Math.max(0.001, particle.size * fade));
        if (particle.age >= 5) particle.active = false;
        dummy.updateMatrix();
        spillMesh.setMatrixAt(index, dummy.matrix);
      });
      if (dirty) spillMesh.instanceMatrix.needsUpdate = true;
    },
    updateBurst(seconds) {
      seeds.visible = seconds === null;
      for (const { mesh, members } of batches) {
        members.forEach((home, index) => {
          const t = seconds === null || home.loose ? 0 : Math.max(0, seconds - (index % 5) * 0.025);
          dummy.position.set(home.x + home.velocity.x * t, home.y + home.velocity.y * t - 4.8 * t * t, home.z + home.velocity.z * t);
          dummy.rotation.set(home.rotation.x + t * 2, home.rotation.y + t * 3, home.rotation.z + t);
          dummy.scale.setScalar(home.scale * (t > 1 ? Math.max(0.001, 1 - (t - 1) * 2) : 1));
          dummy.updateMatrix();
          mesh.setMatrixAt(index, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

export function disposeScene(scene) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  scene.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (!material) continue;
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
    if (object.isInstancedMesh) object.dispose();
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}
