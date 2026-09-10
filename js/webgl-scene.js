/**
 * ORBITAL VAULT - Three.js WebGL Accretion Disk & 3D Holographic Scene
 * Deep obsidian, titanium refractive crystal nodes, and subtle Robinhood emerald photon halo.
 */

class WebGLAccretionScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = 0;
    this.targetScrollY = 0;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, starting 2D fallback');
      this.init2DFallback();
      return;
    }

    try {
      // 1. Scene & Camera
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x030508, 0.002);

      this.camera = new THREE.PerspectiveCamera(
        52,
        this.container.clientWidth / this.container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 3.5, 22);

      // 2. Renderer
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.container.appendChild(this.renderer.domElement);

      // 3. Lighting
      const ambientLight = new THREE.AmbientLight(0x0a0e17, 2.0);
      this.scene.add(ambientLight);

      const greenPoint = new THREE.PointLight(0x00d95a, 3.5, 45);
      greenPoint.position.set(-10, 8, 10);
      this.scene.add(greenPoint);

      const bluePoint = new THREE.PointLight(0x3b82f6, 2.8, 45);
      bluePoint.position.set(12, -6, 8);
      this.scene.add(bluePoint);

      const titaniumPoint = new THREE.PointLight(0xffffff, 1.8, 35);
      titaniumPoint.position.set(0, 10, -5);
      this.scene.add(titaniumPoint);

      // 4. Objects
      this.createAccretionRings();
      this.createCentralCore();
      this.createOrbitingAssetCrystals();
      this.createStarfieldParticles();

      // 5. Events
      this.attachEvents();

      // 6. Animation Loop
      this.clock = new THREE.Clock();
      this.animate();
    } catch (e) {
      console.error('WebGL init error, falling back to 2D:', e);
      this.init2DFallback();
    }
  }

  createAccretionRings() {
    this.ringsGroup = new THREE.Group();

    const ringConfigs = [
      { radius: 6.8, tube: 0.04, radialSegments: 16, tubularSegments: 120, color: 0x00d95a, rotX: Math.PI / 2.3, rotY: 0.15 },
      { radius: 8.5, tube: 0.025, radialSegments: 16, tubularSegments: 140, color: 0x3b82f6, rotX: Math.PI / 2.2, rotY: -0.1 },
      { radius: 10.4, tube: 0.015, radialSegments: 16, tubularSegments: 160, color: 0x94a3b8, rotX: Math.PI / 2.4, rotY: 0.08 }
    ];

    this.torusMeshes = [];
    ringConfigs.forEach((cfg) => {
      const geom = new THREE.TorusGeometry(cfg.radius, cfg.tube, cfg.radialSegments, cfg.tubularSegments);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = cfg.rotX;
      mesh.rotation.y = cfg.rotY;
      this.ringsGroup.add(mesh);
      this.torusMeshes.push(mesh);
    });

    // Outer particle accretion disk
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cGreen = new THREE.Color(0x00d95a);
    const cBlue = new THREE.Color(0x3b82f6);
    const cTitanium = new THREE.Color(0xe2e8f0);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4.8 + Math.pow(Math.random(), 0.6) * 10.5;
      const yOffset = (Math.random() - 0.5) * (0.6 + (radius - 4.8) * 0.12);

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = yOffset;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      let col = cGreen.clone();
      if (radius > 10) col.lerp(cBlue, (radius - 10) / 5);
      else if (radius < 7) col.lerp(cTitanium, (7 - radius) / 3);

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.accretionParticles = new THREE.Points(geometry, pMaterial);
    this.accretionParticles.rotation.x = Math.PI / 2.3;
    this.ringsGroup.add(this.accretionParticles);

    this.scene.add(this.ringsGroup);
  }

  createCentralCore() {
    const coreGeom = new THREE.SphereGeometry(2.3, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x010204
    });
    this.blackHoleCore = new THREE.Mesh(coreGeom, coreMat);
    this.scene.add(this.blackHoleCore);

    // Inner Halo
    const haloGeom = new THREE.RingGeometry(2.35, 2.65, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00d95a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.innerHalo = new THREE.Mesh(haloGeom, haloMat);
    this.innerHalo.rotation.x = Math.PI / 2.3;
    this.scene.add(this.innerHalo);

    // Subtle lattice wireframe
    const latticeGeom = new THREE.IcosahedronGeometry(2.9, 2);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      roughness: 0.2,
      metalness: 0.9
    });
    this.latticeMesh = new THREE.Mesh(latticeGeom, latticeMat);
    this.scene.add(this.latticeMesh);
  }

  createOrbitingAssetCrystals() {
    this.crystalsGroup = new THREE.Group();
    const crystalColors = [0xf7931a, 0x627eea, 0x00d95a, 0x3b82f6, 0xe2e8f0, 0x10b981];
    this.crystalNodes = [];

    crystalColors.forEach((color, idx) => {
      const group = new THREE.Group();
      
      const geom = new THREE.OctahedronGeometry(0.5, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.15,
        metalness: 0.85,
        emissive: color,
        emissiveIntensity: 0.3
      });
      const mesh = new THREE.Mesh(geom, mat);
      group.add(mesh);

      const wireGeom = new THREE.OctahedronGeometry(0.68, 0);
      const wireMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const wireMesh = new THREE.Mesh(wireGeom, wireMat);
      group.add(wireMesh);

      const angle = (idx / crystalColors.length) * Math.PI * 2;
      const dist = 7.2 + (idx % 2) * 2.0;
      group.position.set(Math.cos(angle) * dist, (Math.sin(angle * 2) * 1.1), Math.sin(angle) * dist);

      this.crystalsGroup.add(group);
      this.crystalNodes.push({ group, angle, dist, speed: 0.004 + (idx * 0.0008) });
    });

    this.scene.add(this.crystalsGroup);
  }

  createStarfieldParticles() {
    const starCount = 1400;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xcbd5e1,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.starfield = new THREE.Points(geom, mat);
    this.scene.add(this.starfield);
  }

  attachEvents() {
    window.addEventListener('resize', () => {
      if (!this.container || !this.camera || !this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY || window.pageYOffset;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;

    if (this.accretionParticles) {
      this.accretionParticles.rotation.z += 0.0025;
    }

    if (this.torusMeshes) {
      this.torusMeshes.forEach((mesh, idx) => {
        mesh.rotation.z += 0.0018 * (idx % 2 === 0 ? 1 : -1);
      });
    }

    if (this.latticeMesh) {
      this.latticeMesh.rotation.x = elapsedTime * 0.12;
      this.latticeMesh.rotation.y = elapsedTime * 0.18;
    }

    if (this.crystalNodes) {
      this.crystalNodes.forEach((node) => {
        node.angle += node.speed;
        node.group.position.x = Math.cos(node.angle) * node.dist;
        node.group.position.z = Math.sin(node.angle) * node.dist;
        node.group.position.y = Math.sin(elapsedTime * 1.3 + node.angle) * 1.2;
        node.group.rotation.x += 0.015;
        node.group.rotation.y += 0.02;
      });
    }

    this.camera.position.x = this.mouse.x * 2.0;
    this.camera.position.y = 3.5 - this.mouse.y * 1.6 - (this.scrollY * 0.007);
    this.camera.position.z = 22 - (this.scrollY * 0.004);
    this.camera.lookAt(0, - (this.scrollY * 0.005), 0);

    this.renderer.render(this.scene, this.camera);
  }

  init2DFallback() {
    const canvas = document.createElement('canvas');
    canvas.className = 'canvas-fallback';
    this.container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = this.container.clientWidth;
      canvas.height = this.container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: Math.random() > 0.5 ? '#00d95a' : '#3b82f6'
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(3, 5, 8, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    };
    render();
  }
}

window.WebGLAccretionScene = WebGLAccretionScene;
