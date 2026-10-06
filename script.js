/* ==========================================================
   EDIT DI SINI: nama, nama pengirim, dan isi surat
   ========================================================== */
const CONFIG = {
  name: "Dea",
  from: "Dirlyyyy",
  letter:
`Dear [NAME],

Hari ini hari spesial kamu, jadi aku mau ikut mendoakan yang baik-baik buat kamu

Semoga di umur yang baru ini kamu selalu dikasih kesehatan, kebahagiaan, dan dimudahkan dalam segala hal yang lagi kamu usahakan. Semoga apa yang kamu cita-citakan satu per satu bisa tercapai, semoga rezekimu lancar, dan semoga kamu selalu dikelilingi orang-orang yang tulus sama kamu.

Kalau nanti ada hari-hari yang bikin kamu capek atau ngerasa semuanya nggak berjalan sesuai keinginanmu, semoga kamu selalu punya kekuatan buat melewatinya, yaa.
Jangan lupa istirahat kalau capek, jangan terlalu keras sama diri sendiri, dan jangan lupa buat bahagia juga.

Walaupun kita baru kenal sebentar, aku senang bisa kenal kamu dan punya kesempatan buat ngobrol sama kamu. Semoga ke depannya kita bisa makin kenal satu sama lain, punya lebih banyak cerita, dan tentunya lebih banyak hal seru buat diceritain. Hehe

Pokoknya, semoga hari ini banyak senyum yang kamu dapatkan, banyak hal kecil yang bikin kamu bahagia, dan semoga kejutan kecil dariku ini bisa jadi salah satu hal yang bikin kamu senyum hari ini.

Once again, happy birthday, Deaaa! 🎂💗

Stay happy, stay healthy, and keep being you, yaa. Semoga semua hal baik selalu menyertai kamu.  

Happy Birthday.

— Dirlyyyy`
};

const $ = (id) => document.getElementById(id);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let currentScreen = 1;
document.body.dataset.scene = 1; // dipakai CSS untuk memindahkan ambient glow
let storyIndex = 0;
let busy = false;
let countTimer = null;

/* ---------- nama & pengirim ---------- */
document.querySelectorAll(".js-name").forEach((e) => (e.textContent = CONFIG.name));
document.querySelectorAll(".js-from").forEach((e) => (e.textContent = CONFIG.from));

/* ---------- gambar yang belum ada tidak merusak tampilan ---------- */
document.addEventListener("error", (e) => {
  if (e.target.tagName === "IMG") e.target.classList.add("missing");
}, true);
function checkImgs() {
  document.querySelectorAll("img").forEach((i) => {
    if (i.complete && i.naturalWidth === 0) i.classList.add("missing");
  });
}
checkImgs();
addEventListener("load", checkImgs);

/* ==========================================================
   MUSIC (volume berubah halus, autoplay diblokir = aman)
   ========================================================== */
const music = $("bgMusic");
const musicBtn = $("musicBtn");
const VOL = { 1: .5, 2: .5, 3: .6, 4: .6, 5: .65, 6: .65, 7: .6, 8: .6, 9: .55, 10: .35, 11: .6, 12: .7 };
let wantMusic = true;
let volTarget = .5;
let volRaf = 0;
music.volume = .5;
playMusic();

function setVol(target, ms) {
  volTarget = target;
  cancelAnimationFrame(volRaf);
  const from = music.volume, t0 = performance.now();
  (function step(t) {
    const k = Math.min(1, (t - t0) / ms);
    music.volume = Math.max(0, Math.min(1, from + (target - from) * k));
    if (k < 1) volRaf = requestAnimationFrame(step);
  })(t0);
}

function playMusic() {
  if (!wantMusic) return;
  const p = music.play();
  if (p && p.catch) p.catch(() => {});
}

music.addEventListener("play", () => musicBtn.classList.add("playing"));
music.addEventListener("pause", () => musicBtn.classList.remove("playing"));
musicBtn.addEventListener("click", () => {
  if (music.paused) { wantMusic = true; playMusic(); }
  else { wantMusic = false; music.pause(); }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) music.pause(); else if (wantMusic && currentScreen > 1) playMusic();
});

/* ==========================================================
   NAVIGASI (fungsi lama goTo tetap dipakai)
   ========================================================== */
function goTo(n) {
  if (busy || n === currentScreen) return;
  busy = true;
  document.body.dataset.scene = n;
  playMusic();
  setVol(VOL[n] || .6, 2000);

  const cur = $("screen" + currentScreen);
  const next = $("screen" + n);
  cur.classList.add("out");

  setTimeout(() => {
    cur.classList.remove("active", "out");
    next.scrollTop = 0;
    next.classList.add("active");
    currentScreen = n;
    busy = false;
    onEnter(n);
  }, 650);
}

function onEnter(n) {
  if (n === 2) startCountdown();
  if (n === 5 || n === 6 || n === 7) setupReveal($("screen" + n));
}

/* ---------- countdown ---------- */
function startCountdown() {
  clearInterval(countTimer);
  let angka = 3;
  const countText = $("countText");
  const show = () => {
    countText.textContent = angka;
    countText.classList.remove("tick");
    void countText.offsetWidth;
    countText.classList.add("tick");
  };
  show();
  countTimer = setInterval(() => {
    angka--;
    if (angka > 0) { show(); return; }
    clearInterval(countTimer);
    goTo(3);
  }, 1100);
}

/* ---------- scroll reveal (per screen, sekali jalan) ---------- */
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: .15 })
  : null;

function setupReveal(screen) {
  screen.querySelectorAll(".rv:not(.in)").forEach((el) => {
    if (io) io.observe(el); else el.classList.add("in");
  });
}

/* ==========================================================
   LITTLE QUESTION
   ========================================================== */
const ANSWERS = {
  yes: "I thought you might know. ✨",
  maybe: "Maybe I should remind you...",
  no: "Then maybe I should tell you..."
};
document.querySelectorAll(".answers button").forEach((b) => {
  b.addEventListener("click", () => {
    const reply = $("qReply");
    reply.textContent = ANSWERS[b.dataset.a];
    reply.classList.add("show");
    document.querySelectorAll(".answers button").forEach((x) => (x.disabled = true));
    b.classList.add("picked");
    setTimeout(() => $("qNext").classList.add("show"), 900);
  });
});

/* ==========================================================
   GALLERY: parallax ringan + lightbox
   ========================================================== */
const pols = $("polaroids");
const gal = $("screen5");
if (matchMedia("(hover: hover)").matches && !reduced) {
  let raf = 0;
  gal.addEventListener("pointermove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      pols.style.setProperty("--mx", (e.clientX / innerWidth - .5) * 2);
      pols.style.setProperty("--my", (e.clientY / innerHeight - .5) * 2);
      raf = 0;
    });
  });
}

const lb = $("lb");
function openLb(fig) {
  const img = fig.querySelector("img");
  $("lbImg").src = img.getAttribute("src");
  $("lbImg").classList.toggle("missing", img.classList.contains("missing"));
  $("lbCap").textContent = fig.dataset.cap;
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
}
function closeLb() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
document.querySelectorAll(".pol").forEach((f) => {
  f.addEventListener("click", () => openLb(f));
  f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(f); } });
});
lb.addEventListener("click", closeLb);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeLb(); closeEgg(); } });

/* ==========================================================
   SLIDER LAMA (words for you)
   ========================================================== */
function updateStory() {
  const slider = $("storySlider");
  slider.scrollTo({ left: storyIndex * slider.clientWidth, behavior: "smooth" });
  document.querySelectorAll(".dot").forEach((dot, i) => dot.classList.toggle("active-dot", i === storyIndex));
}
function nextStory() { storyIndex = (storyIndex + 1) % 4; updateStory(); }
function prevStory() { storyIndex = (storyIndex + 3) % 4; updateStory(); }

let startX = 0;
const slider = $("storySlider");
slider.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
slider.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 45) nextStory();
  if (endX - startX > 45) prevStory();
});
addEventListener("resize", updateStory);

/* ==========================================================
   SECRET DOOR -> LETTER
   ========================================================== */
$("openDoor").addEventListener("click", async function () {
  this.disabled = true;
  const r = this.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 40, "gold");
  $("veil").classList.add("on");
  document.body.classList.add("warm");
  await wait(1000);
  goTo(10);
  await wait(900);
  $("veil").classList.remove("on");
});

/* ---------- envelope + typewriter ---------- */
let typing = null;
$("openLetter").addEventListener("click", async function () {
  this.disabled = true;
  this.classList.add("hidden");
  $("letterIntro").style.opacity = 0;
  $("env").classList.add("open");
  await wait(reduced ? 50 : 1900);
  $("env").classList.add("gone");
  await wait(reduced ? 50 : 500);
  $("paper").classList.add("show");
  typeLetter();
});

function typeLetter() {
  const text = CONFIG.letter.replace(/\[NAME\]/g, CONFIG.name).replace(/\[YOUR NAME\]/g, CONFIG.from);
  const ty = $("ty"), rest = $("rest");
  let i = 0;
  const finish = () => {
    clearTimeout(typing);
    ty.textContent = text; rest.textContent = "";
    $("paper").style.cursor = "";
    $("letterNext").classList.add("show");
  };
  if (reduced) return finish();
  $("paper").style.cursor = "pointer";
  $("paper").addEventListener("click", finish, { once: true });
  (function tick() {
    if (i >= text.length) return finish();
    i++;
    ty.textContent = text.slice(0, i);
    rest.textContent = text.slice(i);
    typing = setTimeout(tick, text[i - 1] === "\n" ? 320 : /[.,]/.test(text[i - 1]) ? 140 : 32);
  })();
}

/* ==========================================================
   CAKE
   ========================================================== */
const cake = $("cake");
cake.addEventListener("click", async () => {
  cake.classList.add("out");
  cake.disabled = true;
  $("cakeHint").classList.add("hidden");
  setVol(.2, 500);
  await wait(500);
  const r = cake.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top, 70, "mix");
  await wait(250);
  burst(innerWidth * .2, innerHeight * .75, 40, "mix");
  burst(innerWidth * .8, innerHeight * .75, 40, "mix");
  $("wishTitle").textContent = "Your wish is on its way.";
  setVol(.9, 2500);
  await wait(900);
  $("cakeDone").classList.add("show");
}, { once: true });

/* ==========================================================
   EASTER EGG
   ========================================================== */
const egg = $("egg");
$("secretStar").addEventListener("click", () => {
  $("secretStar").classList.add("found");
  egg.hidden = false;
  egg.classList.remove("show");
  void egg.offsetWidth;
  egg.classList.add("show");
});
function closeEgg() { egg.hidden = true; egg.classList.remove("show"); }
egg.addEventListener("click", closeEgg);

/* ==========================================================
   BINTANG + PARTIKEL LATAR (ringan)
   ========================================================== */
const cv = $("fx"), cx = cv.getContext("2d");
let W = 0, H = 0, stars = [], dust = [], sparkles = [];
const STAR_TINTS = ["#FFFFFF", "#FFE3EE", "#E8D9FF"];
const DUST_TINTS = ["#FFB6C9", "#FF8FAF", "#C98CFF", "#E8D9FF"];

function newSparkle(t0) {
  return { x: Math.random() * W, y: Math.random() * H, s: Math.random() * 5 + 5, t0, dur: 2600 + Math.random() * 2400, c: Math.random() < .5 ? "#FFE3EE" : "#E8D9FF" };
}

function sizeStars() {
  const d = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * d; cv.height = H * d;
  cx.setTransform(d, 0, 0, d, 0, 0);
  const n = Math.min(110, Math.round((W * H) / 11000));
  stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + .3, p: Math.random() * 6.28, s: Math.random() * .0012 + .0005, c: STAR_TINTS[(Math.random() * 3) | 0] }));
  dust = Array.from({ length: W < 700 ? 14 : 26 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .8, v: Math.random() * .16 + .04, a: Math.random() * .3 + .12, p: Math.random() * 6.28, c: DUST_TINTS[(Math.random() * 4) | 0] }));
  sparkles = Array.from({ length: W < 700 ? 4 : 7 }, () => newSparkle(Math.random() * 4000));
}

function drawStars(t) {
  cx.clearRect(0, 0, W, H);
  /* bintang kecil */
  for (const s of stars) {
    cx.globalAlpha = .25 + .6 * Math.abs(Math.sin(s.p + t * s.s));
    cx.fillStyle = s.c;
    cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.283); cx.fill();
  }
  /* bokeh / glowing dots (halus, naik pelan) */
  for (const d of dust) {
    d.y -= d.v; d.x += Math.sin(d.p + t * .0004) * .15;
    if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
    cx.fillStyle = d.c;
    cx.globalAlpha = d.a * .12; cx.beginPath(); cx.arc(d.x, d.y, d.r * 6, 0, 6.283); cx.fill();
    cx.globalAlpha = d.a * .28; cx.beginPath(); cx.arc(d.x, d.y, d.r * 2.6, 0, 6.283); cx.fill();
    cx.globalAlpha = d.a;       cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, 6.283); cx.fill();
  }
  /* sparkle sesekali: kilau 4 arah yang muncul-hilang */
  for (let i = 0; i < sparkles.length; i++) {
    let sp = sparkles[i];
    let k = (t - sp.t0) / sp.dur;
    if (k > 1) { sp = sparkles[i] = newSparkle(t + Math.random() * 3500); continue; }
    if (k < 0) continue;
    const a = Math.pow(Math.sin(k * Math.PI), 2);
    const s = sp.s * (.6 + .4 * a);
    cx.globalAlpha = a * .85;
    cx.strokeStyle = sp.c; cx.fillStyle = sp.c; cx.lineWidth = 1;
    cx.beginPath();
    cx.moveTo(sp.x - s, sp.y); cx.lineTo(sp.x + s, sp.y);
    cx.moveTo(sp.x, sp.y - s); cx.lineTo(sp.x, sp.y + s);
    cx.stroke();
    cx.globalAlpha = a * .25;
    cx.beginPath(); cx.arc(sp.x, sp.y, s * .9, 0, 6.283); cx.fill();
  }
  cx.globalAlpha = 1;
}

function loopStars(t) {
  if (!document.hidden) drawStars(t);
  requestAnimationFrame(loopStars);
}

sizeStars();
if (reduced) drawStars(0); else requestAnimationFrame(loopStars);
let lastW = innerWidth;
addEventListener("resize", () => {
  if (innerWidth !== lastW) { lastW = innerWidth; sizeStars(); sizeConfetti(); if (reduced) drawStars(0); }
});

/* ==========================================================
   CONFETTI / SPARKLES
   ========================================================== */
const cc = $("confetti"), cg = cc.getContext("2d");
let parts = [], running = false;
const COLORS = ["#FF8FAF", "#FFB6C9", "#C98CFF", "#E8D9FF", "#FFFFFF"];

function sizeConfetti() {
  const d = Math.min(devicePixelRatio || 1, 2);
  cc.width = innerWidth * d; cc.height = innerHeight * d;
  cg.setTransform(d, 0, 0, d, 0, 0);
}
sizeConfetti();

function burst(x, y, n, mode) {
  if (reduced) n = Math.round(n / 3);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - .5) * (mode === "gold" ? 6.28 : 2.6);
    const sp = Math.random() * (mode === "gold" ? 4 : 9) + 2;
    parts.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      g: mode === "gold" ? .02 : .16, w: Math.random() * 6 + 4, h: Math.random() * 4 + 3,
      rot: Math.random() * 6.28, vr: (Math.random() - .5) * .3,
      c: mode === "gold" ? COLORS[(Math.random() * 2) | 0] : COLORS[(Math.random() * COLORS.length) | 0],
      life: 1, decay: Math.random() * .006 + (mode === "gold" ? .008 : .005), star: Math.random() < .3
    });
  }
  if (!running) { running = true; requestAnimationFrame(tickConfetti); }
}

function tickConfetti() {
  cg.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 20);
  for (const p of parts) {
    p.vx *= .985; p.vy = p.vy * .985 + p.g;
    p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
    cg.save();
    cg.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
    cg.translate(p.x, p.y); cg.rotate(p.rot); cg.fillStyle = p.c;
    if (p.star) { cg.beginPath(); cg.arc(0, 0, 2, 0, 6.283); cg.fill(); }
    else cg.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    cg.restore();
  }
  if (parts.length) requestAnimationFrame(tickConfetti);
  else { running = false; cg.clearRect(0, 0, innerWidth, innerHeight); }
}

/* ---------- akhir ---------- */
function restart() {
  location.reload();
}
