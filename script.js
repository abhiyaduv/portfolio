/* ============================================================
   ABHISHEK YADAV PORTFOLIO — UPGRADED SCRIPT
   Three.js 3D Hero, Loader, Cursor, Interactions
   ============================================================ */

// ===== LOADER WITH THREE.JS PARTICLES =====
(function initLoader() {
  const canvas = document.getElementById('loaderCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 4;

  // Ring of particles
  const geo = new THREE.BufferGeometry();
  const count = 300;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2 + Math.random() * 0.5;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.04, transparent: true, opacity: 0.8 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let t = 0;
  let pct = 0;
  const fillEl = document.getElementById('loaderFill');
  const pctEl = document.getElementById('loaderPct');

  function animateLoader() {
    t += 0.012;
    points.rotation.y = t * 0.5;
    points.rotation.x = Math.sin(t * 0.3) * 0.2;
    renderer.render(scene, camera);
    if (!document.getElementById('loader').classList.contains('hidden')) {
      requestAnimationFrame(animateLoader);
    }
  }
  animateLoader();

  // Progress simulation
  let interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 12, 95);
    fillEl.style.width = pct + '%';
    pctEl.textContent = Math.round(pct) + '%';
  }, 80);

  window.addEventListener('load', () => {
    clearInterval(interval);
    pct = 100;
    fillEl.style.width = '100%';
    pctEl.textContent = '100%';
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      initHero();
    }, 500);
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();

// ===== THREE.JS HERO SCENE =====
function initHero() {
  const canvas = document.getElementById('heroCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 12);

  // ---- Floating geometric shapes ----
  const shapes = [];

  function addShape(geo, color, x, y, z, speed) {
    const mat = new THREE.MeshPhongMaterial({
      color, transparent: true, opacity: 0.18,
      wireframe: false, shininess: 120,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = { speed, phase: Math.random() * Math.PI * 2 };
    scene.add(mesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.12 });
    const wire = new THREE.Mesh(geo, wireMat);
    wire.position.set(x, y, z);
    wire.userData = { speed, phase: mesh.userData.phase, isWire: true, linked: mesh };
    scene.add(wire);

    shapes.push(mesh);
    shapes.push(wire);
    return mesh;
  }

  addShape(new THREE.IcosahedronGeometry(1.8, 1), 0x00d4ff,  6, 2, -4, 0.004);
  addShape(new THREE.OctahedronGeometry(1.2, 0),  0x7c3aed, -7, -1, -2, 0.006);
  addShape(new THREE.TetrahedronGeometry(1.0, 0),  0xf472b6,  4, -3, -3, 0.005);
  addShape(new THREE.DodecahedronGeometry(0.9, 0), 0x00ff88, -5,  3, -5, 0.003);
  addShape(new THREE.IcosahedronGeometry(0.7, 0),  0x00d4ff,  1,  4, -3, 0.007);
  addShape(new THREE.OctahedronGeometry(0.8, 0),   0x7c3aed,  -2, -4, -4, 0.005);

  // ---- Particle field ----
  const particleGeo = new THREE.BufferGeometry();
  const pCount = 600;
  const pPos = new Float32Array(pCount * 3);
  const pAlpha = new Float32Array(pCount);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 40;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 25;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    pAlpha[i] = Math.random();
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00d4ff, size: 0.035, transparent: true, opacity: 0.55
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Connecting lines (DNA-like) ----
  const linePoints = [];
  for (let i = 0; i < 20; i++) {
    const t = i / 20;
    linePoints.push(new THREE.Vector3(
      Math.sin(t * Math.PI * 4) * 3 + 5,
      (t - 0.5) * 20,
      -4
    ));
  }
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.15 });
  scene.add(new THREE.Line(lineGeo, lineMat));

  // ---- Lights ----
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight(0x00d4ff, 2, 20);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x7c3aed, 1.5, 20);
  pointLight2.position.set(-5, -5, 3);
  scene.add(pointLight2);

  // ---- Mouse interaction ----
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ---- Animate ----
  let t = 0;
  function animateHero() {
    requestAnimationFrame(animateHero);
    t += 0.005;

    // Smooth camera to mouse
    targetX += (mouseX * 1.5 - targetX) * 0.04;
    targetY += (mouseY * 1.0 - targetY) * 0.04;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    // Animate shapes
    shapes.forEach(mesh => {
      const { speed, phase, isWire, linked } = mesh.userData;
      mesh.rotation.x += speed;
      mesh.rotation.y += speed * 1.3;
      const float = Math.sin(t * 0.8 + phase) * 0.3;
      mesh.position.y += (mesh.userData.baseY !== undefined ? 0 : 0);
      if (!isWire) {
        mesh.userData.baseY = mesh.userData.baseY || mesh.position.y;
        mesh.position.y = mesh.userData.baseY + float;
      } else if (linked) {
        mesh.position.copy(linked.position);
        mesh.rotation.copy(linked.rotation);
      }
    });

    particles.rotation.y = t * 0.02;
    particles.rotation.x = Math.sin(t * 0.1) * 0.05;

    pointLight1.position.x = Math.sin(t) * 6;
    pointLight1.position.y = Math.cos(t * 0.7) * 4;
    pointLight2.position.x = Math.cos(t * 0.8) * 5;
    pointLight2.position.y = Math.sin(t * 0.6) * 3;

    renderer.render(scene, camera);
  }
  animateHero();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Fade canvas out on scroll
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / window.innerHeight;
    canvas.style.opacity = Math.max(0, 1 - scrolled * 1.5);
  });
}

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
let cx = 0, cy = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  tx = e.clientX; ty = e.clientY;
});

(function animCursor() {
  cx += (tx - cx) * 0.14;
  cy += (ty - cy) * 0.14;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();

document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

document.querySelectorAll('a, button, .skill-tag, .contact-link, .project-card, .info-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// ===== 3D CARD TILT =====
document.querySelectorAll('.card-3d').forEach(card => {
  const glow = card.querySelector('.card-glow');

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / cy * -8;
    const ry = (x - cx) / cx * 8;

    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;

    if (glow) {
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      glow.style.setProperty('--mx', px + '%');
      glow.style.setProperty('--my', py + '%');
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    card.style.transition = 'transform 0.4s cubic-bezier(.2,0,.2,1)';
    setTimeout(() => card.style.transition = '', 400);
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

// ===== NAV =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  const sections = document.querySelectorAll('section');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 100);
      });
      entry.target.querySelectorAll('.counter').forEach(counter => {
        animCounter(counter);
      });

      // Also reveal section-eyebrow, title, rule within
      ['section-eyebrow', 'section-title', 'section-rule'].forEach(cls => {
        const el = entry.target.querySelector('.' + cls) || (entry.target.classList.contains(cls) ? entry.target : null);
        if (el) el.classList.add('visible');
      });
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.anim-reveal, .section-eyebrow, .section-title, .section-rule').forEach(el => {
  revealObs.observe(el);
});

// Observe skill bars inside visible areas
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.skills-bars').forEach(el => skillObs.observe(el));

// ===== COUNTER =====-
function animCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = true;
  const target = parseInt(el.dataset.target);
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const interval = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + '+';
    if (count >= target) clearInterval(interval);
  }, 35);
}

// Counter on hero section
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(animCounter);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('#home').forEach(el => counterObs.observe(el));

// ===== TYPED EFFECT =====
const roles = ['Full Stack Developer', 'Cybersecurity Enthusiast', 'Python Developer', 'Problem Solver'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const role = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = role.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === role.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = role.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 75);
}
typeLoop();

// ===== ROBOT =====
const msgs = [
  "Hi! I'm Abhi's bot 🤖",
  "Welcome to my portfolio!",
  "Check my projects 🚀",
  "Open to internships! 💼",
  "Download my resume 📄",
  "Let's connect! 😄"
];
let msgIdx = 0;
const bubble = document.getElementById('robotBubble');

setInterval(() => {
  bubble.style.animation = 'none';
  void bubble.offsetHeight;
  msgIdx = (msgIdx + 1) % msgs.length;
  bubble.textContent = msgs[msgIdx];
  bubble.style.animation = 'pop 0.3s ease';
}, 3500);

document.addEventListener('mousemove', e => {
  const eyes = [
    { el: document.getElementById('pupilL'), cx: 35, cy: 33 },
    { el: document.getElementById('pupilR'), cx: 65, cy: 33 }
  ];
  const svg = document.querySelector('.robot-svg');
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  eyes.forEach(({ el, cx, cy }) => {
    if (!el) return;
    const ex = rect.left + cx * rect.width / 100;
    const ey = rect.top + cy * rect.height / 100;
    const angle = Math.atan2(e.clientY - ey, e.clientX - ex);
    const dist = 2;
    el.setAttribute('cx', cx + Math.cos(angle) * dist);
    el.setAttribute('cy', cy + Math.sin(angle) * dist);
  });
});

// ===== AI CONTACT FORM =====
async function sendMessage() {
  const name = document.getElementById('senderName').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const reason = document.getElementById('contactReason').value;
  const message = document.getElementById('messageText').value.trim();

  if (!name || !message) { alert('Please fill in your name and message.'); return; }

  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  const aiDiv = document.getElementById('aiResponse');
  const aiText = document.getElementById('aiText');
  aiDiv.classList.remove('show');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a friendly AI assistant on Abhishek Yadav's portfolio website. Abhishek is a BSc IT student and aspiring Full Stack Developer from Mumbai with skills in Python, ASP.NET, MySQL, and Cybersecurity. When someone sends a contact message, write a warm, professional auto-reply on behalf of Abhishek. Keep it to 3-4 sentences. Be personable and enthusiastic. Mention the specific reason they contacted if provided.`,
        messages: [{ role: 'user', content: `Contact form submission:\nName: ${name}\nEmail: ${email}\nReason: ${reason || 'General inquiry'}\nMessage: ${message}\n\nPlease write a friendly auto-reply.` }]
      })
    });
    const data = await response.json();
    const reply = data.content?.[0]?.text || "Thanks for reaching out! I'll get back to you very soon.";
    aiText.textContent = reply;
    aiDiv.classList.add('show');
    setTimeout(() => {
      document.getElementById('formContent').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('formContent').style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      }, 300);
    }, 2500);
  } catch (e) {
    aiText.textContent = "Thank you for your message! Abhishek will get back to you soon.";
    aiDiv.classList.add('show');
    setTimeout(() => {
      document.getElementById('formContent').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('formContent').style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      }, 300);
    }, 2500);
  }

  btn.classList.remove('loading');
  btn.disabled = false;
}

// ===== SKILL TAG HOVER RIPPLE =====
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect();
    this.style.setProperty('--rx', (e.clientX - rect.left) + 'px');
    this.style.setProperty('--ry', (e.clientY - rect.top) + 'px');
  });
});

// ===== PAGE TRANSITIONS =====
document.querySelectorAll('a[href]').forEach(link => {
  if (
    link.hostname === window.location.hostname &&
    !link.getAttribute('href').startsWith('#') &&
    !link.getAttribute('download') &&
    !link.getAttribute('target')
  ) {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.35s';
      setTimeout(() => window.location = link.href, 350);
    });
  }
});
