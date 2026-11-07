const progressText = document.getElementById("progressText");
const barFill = document.getElementById("barFill");
const startScreen = document.getElementById("startScreen");
const questionScreen = document.getElementById("questionScreen");
const startBtn = document.getElementById("startBtn");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const finalScreen = document.getElementById("finalScreen");
const letterBox = document.getElementById("letter");
const lights = document.getElementById("lights");
const bulbColors = ["#ffd23f", "#ff9f1c", "#ffffff", "#ff6fa5"];
const envelope = document.getElementById("envelope");
const tapHint = document.getElementById("tapHint");

const fxCanvas = document.createElement("canvas");
fxCanvas.style.cssText =
"position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;";
document.body.appendChild(fxCanvas);
const fx = fxCanvas.getContext("2d");
let particles = [];
let rockets = [];
const fxColors = ["#ffd23f", "#ff9f1c", "#ffffff", "#ff6fa5", "#7df9ff"];

function resizeFx() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
resizeFx();
window.addEventListener("resize", resizeFx);

function explode(x, y, color) {
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4.5;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: 1.5 + Math.random() * 1.5,
      color: i % 5 === 0 ? "#ffffff" : color
    });
  }
}

function launchFirework(onBurst) {
  const r = {
    x: fxCanvas.width * (0.15 + Math.random() * 0.7),
    y: fxCanvas.height,
    vy: -(8 + Math.random() * 3),
    targetY: fxCanvas.height * (0.15 + Math.random() * 0.3),
    color: fxColors[Math.floor(Math.random() * fxColors.length)],
    onBurst: typeof onBurst === "function" ? onBurst : null
  };
  rockets.push(r);
  return r;
}

let lastFx = performance.now();

function animateFx(now) {
  const dt = Math.min((now - lastFx) / 16.667, 3);
  lastFx = now;

  fx.globalCompositeOperation = "destination-out";
  fx.fillStyle = "rgba(0, 0, 0, " + Math.min(0.25 * dt, 0.6) + ")";
  fx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
  fx.globalCompositeOperation = "lighter";

  rockets = rockets.filter(function (r) {
    r.y += r.vy * dt;
    fx.globalAlpha = 1;
    fx.fillStyle = "#ffffff";
    fx.beginPath();
    fx.arc(r.x, r.y, 2, 0, Math.PI * 2);
    fx.fill();
    if (r.y <= r.targetY) {
      explode(r.x, r.y, r.color);
      if (r.onBurst) r.onBurst();
      return false;
    }
    return true;
  });

  particles.forEach(function (p) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 0.045 * dt;
    const drag = Math.pow(0.985, dt);
    p.vx *= drag;
    p.vy *= drag;
    p.life -= (p.decay || 0.011) * dt;
    const sparkle = Math.random() > 0.35 ? 1 : 0.25;
    fx.globalAlpha = Math.max(p.life, 0) * sparkle;
    fx.fillStyle = p.color;
    fx.beginPath();
    fx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fx.fill();
  });

  fx.globalAlpha = 1;
  particles = particles.filter(function (p) {
    return p.life > 0;
  });
  requestAnimationFrame(animateFx);
}
requestAnimationFrame(animateFx);

launchFirework();
let fireworkTimer = setInterval(launchFirework, 1100);

const floaters = ["🪔", "✨", "🪔", "🎇"];
let floaterTimer;

function spawnFloater() {
  const el = document.createElement("span");
  el.className = "floater";
  el.textContent = floaters[Math.floor(Math.random() * floaters.length)];
  el.style.left = Math.random() * 95 + "vw";
  el.style.fontSize = 18 + Math.random() * 18 + "px";
  el.style.animationDuration = 7 + Math.random() * 5 + "s";
  document.body.appendChild(el);
  setTimeout(function () {
    el.remove();
  }, 13000);
}

function startFloaters() {
  floaterTimer = setInterval(spawnFloater, 1200);
}

function stopFloaters() {
  if (floaterTimer) {
    clearInterval(floaterTimer);
    floaterTimer = undefined;
  }
  document.querySelectorAll(".floater").forEach(function (el) {
    el.remove();
  });
}
startFloaters();

// Configurable feedback messages
const FEEDBACK_WRONG_ANSWER = "Nope, try again!";

const questions = [
  {
    question: "Where did our story begin?",
    options: [
      "At a school",
      "On a playground during covid",
      "Online, in a chat"
    ],
    answer: 1,
    note: "Covid took a lot from everyone, but it gave me a friend I'm grateful for. 🌙"
  },
  {
    question: "What was I like when we first met?",
    options: [
      "Super confident",
      "Shy and quiet",
      "Loud and always joking",
      "Always picking fights"
    ],
    answer: 1,
    note: "Shy me never imagined he'd be making you a birthday quiz someday. 😄"
  },
  {
    question: "Our very first conversation: How did it start?",
    options: [
      "A handshake and a 'hello' at volleyball",
      "A fight over who plays better",
      "Or maybe a fight over a serve"
    ],
    answer: 0,
    note: "We started with a handshake, but our first real talk was a fight over who plays better 😂 I was so shy back then, and somehow you made me forget it. Best fight I ever had."
  },
  {
    question: "When I first saw you learn to serve, how did it go?",
    options: [
      "A perfect serve every time",
      "Ball went everywhere except the opposite court 😭",
      "You refused to serve at all"
    ],
    answer: 1,
    serveAfter: true,
    note: "Bounce with the left hand, underhand serve with the right, and the ball flew in every direction except the right one. Then the overhead serve: bounce with the right hand AND serve with the same hand 😂 I was laughing so hard. Best volleyball lesson ever."
  },
  {
    question: "Which of these was NOT a game we played together?",
    options: [
      "Chidiya udh!!",
      "Red hands",
      "Rock paper scissors",
      "Hopscotch"
    ],
    answer: 3,
    note: "Volleyball was just the excuse. The real fun was everything in between: chidiya udh, red hands, rock paper scissors, and talking nonstop."
  },
  {
    question: "Who really won all our games?",
    options: [
      "Me, obviously",
      "Nobody, we always drew ",
      "You... because I let you win 😌"
    ],
    answer: 2,
    note: "Yes, I lost on purpose. Every single time. No, I'm not sorry. Your smile was worth more than any win."
  },
  {
    question: "What happened the day you finally learned to smash the ball?",
    options: [
      "The ball flew out of the ground",
      "A proper smash, and we celebrated like we won the World Cup 🏆",
      "You gave up and went home"
    ],
    answer: 1,
    note: "All those serves that flew everywhere, and then one perfect smash. We really enjoyed that day, and I'm proud I got to see it."
  },
  {
    question: "What do you do when you're annoyed?",
    options: [
      "Make faces 😤",
      "Go completely silent",
      "Throw the ball at me"
    ],
    answer: 0,
    note: "Even your annoyed face is memorable 😂 Please never stop making it."
  },
  {
    question: "Once I tried to stop you from crying. What happened?",
    options: [
      "You cried even harder",
      "You walked away angry",
      "You were crying AND laughing at the same time 😭😂"
    ],
    answer: 2,
    note: "I never found out what it was about, but I'm glad I could make you smile through it. Crying and laughing together was somehow the most you moment ever."
  },
  {
    question: "As the sun set and we walked home, what were you doing on the way?",
    options: [
      "Racing me to the gate",
      "Playing with pebbles and jumping to reach the tree leaves 🌿",
      "Talking about random things and laughing at everything"
    ],
    answer: 2,
    note: "I loved that walk home. The sun was setting, the sky was beautiful, and we were just talking and laughing like nothing else mattered. Those moments are forever in my memory."
  },
  {
    question: "When I started talking to you again, what was your first mood like?",
    options: [
      "Super friendly 😇",
      "Thoda irritated 😒",
      "'WT...🤨",
      "Too busy to reply 😴"
    ],
    answer: 1,
  note: "Your replies were short and reserved at first, but I'm glad I continued. Some conversations are worth the patience. 😊"
  },
  {
    question: "I sent you a photo of a drink and said 'Ao...'. What did you reply?",
    options: [
      "Pehle paise bhejo",
      "😭Block kar diya",
      "Merko bhi aana ha "
    ],
    answer: 2,
    note: "Still laughing at this one 😂 Next time I'll bring the drink to you"
  },
  {
    question: "When I asked for your number, what did you say?",
    options: [
      "Why?",
      "Sure",
      "Ask my sister"
    ],
    answer: 0,
    note: "You said no, and then texted it yourself a little later without me asking again. Best plot twist ever."
  },
  {
    question: "We've met on a few special days over the years. Which one do I keep replaying in my head?",
    options: ["18 Aug, 2023", "Nov 4, 2024", "4th of Feb"],
    answer: 1,
    note: "They're all precious to me, but 4 Nov 2024 is the one I keep replaying: the walk around the bridge,and that sunshine smile when you said bye."
  },
  {
    question: "On the bridge walk, what did you do when I made you laugh?",
    options: [
      "Pushed me towards the railing",
      "Patted my shoulder",
      "Covered your face and looked away",
      "Walked ahead pretending not to hear"
    ],
    answer: 1,
    note: "That little pat on my shoulder is one of the smallest things from that day, and one of my favourites. 😄"
  },
  {
    question: "When we went our separate ways that day, how did you say bye?",
    options: [
      "Waved once without looking back",
      "Tilted your head and said bye with a bright smile",
      "Said 'see you soon' and ran off",
      "Gave me a thumbs up"
    ],
    answer: 1,
    note: "That bye, with that sunshine smile, stayed with me longer than you know. ☀️"
  },
  {
    question: "Now the newest one. When did we last meet?",
    options: ["18 Aug, 2023", "Nov 4, 2024", "4th of Feb", "5 Nov, 2026"],
    answer: 3,
     note: "Out of nowhere, you looked up from your phone with the most shocked eyes, and then that smile came. Best surprised face ever. 😂🏍️"
  },
  {
    question: "If our friendship was a movie, what would we call it?",
    options: [
      "Best Friends Forever",
      "Partners in Crime",
      "Soulmates 🤍",
      "Friends Till the End"
    ],
    answer: 2,
    note: "Best title ever. You said it first, and I'm just keeping it. Some friendships are just written differently, and ours is that one. 🤍"
  },
  {
    question: "What do I admire most about you?",
    options: [
      "Your volleyball skills",
      "Your pure heart",
      "Your Instagram stories"
    ],
    answer: 1,
    note: "Yes, I'm getting emotional over a quiz question. Deal with it 😂 You really do have the purest heart."
  },
  {
    question: "Who is the lucky one in this friendship?",
    options: [
      "You",
      "Me",
      "Both of us",
      "Nobody, it's destiny"
    ],
    answer: 2,
    allCorrect: true,
    note: "Trick question: every answer is right. But if you ask me, I'm the lucky one. One more memory before your letter... 💌"
  }
];

const letterLines = [
  "Dear Nikki, 💌",
  "Happy Birthday! 🎂✨",
  "Ye letter likhna aasaan nahi tha, kyunki jo main feel karta hoon, wo words mein poora nahi aata. But I'm trying, because you deserve to hear it. 🤍",
  "We met, we became friends, and I honestly believe it was meant to happen. I was a shy kid, and without saying a word, you made everything feel lighter. 🌙",
  "Life complicated hai, aur hum roz baat nahi kar paate. But jab bhi baat hoti hai, it feels like no time has passed. I've faith in you. And that's rare. 🫶",
  "When I needed someone the most, you were there. You held me up, and you made me believe I could be okay again. 'Thank you' feels too small. 🙏",
  "Tum mere dil mein ek khaas jagah rakhti ho, and it will always stay yours. 💫",
  "I hope you meet people as kind to you as you are to everyone else. And may every serve of your life land exactly where you aim. 🏐",
  "Never think you are less, because you are so much more. And whenever life gets heavy, I'm one message away. Always. ✨",
  "Happy Birthday once again, Nikki! 🎉🎂\nBorahae 💜",
  "Always your friend,\nAyush 🤍"
];

let currentQuestionIndex = 0;

startBtn.addEventListener("click", function () {
  clearInterval(fireworkTimer);
  rockets = [];
  particles = [];
  fx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  stopFloaters();
  startScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");
  showQuestion();
});

function replay(element, animationClass) {
  element.classList.remove(animationClass);
  void element.offsetWidth;
  element.classList.add(animationClass);
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.textContent = q.question;
  progressText.textContent = "Memory " + (currentQuestionIndex + 1) + " of " + questions.length;
  barFill.style.width = ((currentQuestionIndex + 1) / questions.length * 100) + "%";
  optionsBox.innerHTML = "";
  feedback.textContent = "";
  feedback.className = "";
  feedback.removeAttribute("style");
  nextBtn.classList.add("hidden");

  q.options.forEach(function (text, index) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", () => {
      checkAnswer(index, btn);
    });
    optionsBox.appendChild(btn);
  });
  replay(questionText, "rise");
}

function checkAnswer(index, clicked) {
  const q = questions[currentQuestionIndex];
  if (q.allCorrect || index === q.answer) {
    feedback.textContent = q.note;
    nextBtn.classList.remove("hidden");
    if (clicked) replay(clicked, "pop");
  } else {
    feedback.textContent = FEEDBACK_WRONG_ANSWER;
    if (clicked) replay(clicked, "shake");
    if (navigator.vibrate) navigator.vibrate(150);
  }
  replay(feedback, "rise");
}

nextBtn.addEventListener("click", function () {
  const justDone = questions[currentQuestionIndex];
  currentQuestionIndex++;
  if (justDone.serveAfter) {
    showServeGame();
    return;
  }
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showBridge();
  }
});

function showFinal() {
  stopFloaters();
  questionScreen.classList.add("hidden");
  finalScreen.classList.remove("hidden");
  document.getElementById("sketchWrap").classList.remove("hidden"); 
  letterBox.classList.add("hidden");
  letterBox.innerHTML = "";
  envelope.classList.remove("open", "hidden");
  tapHint.classList.remove("hidden");
}

function openEnvelope() {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  tapHint.classList.add("hidden");
  if (typeof confetti === "function") {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  }
  setTimeout(function () {
    envelope.classList.add("hidden");
    letterBox.classList.remove("hidden");
    letterBox.classList.add("slide-up");
    document.getElementById("sketchWrap").classList.add("hidden");

    letterBox.innerHTML = "";
    const paras = letterLines.map(function () {
      const p = document.createElement("p");
      letterBox.appendChild(p);
      return p;
    });
    decorateLetter();

    let n = 0;
    function nextParagraph() {
      if (n >= paras.length) {
        const seal = document.createElement("div");
        seal.className = "seal";
        seal.textContent = "♥";
        letterBox.appendChild(seal);

        const more = document.createElement("button");
        more.id = "moreBtn";
        more.textContent = "One more thing 🎁";
        more.addEventListener("click", showVouchers);
        finalScreen.appendChild(more);
        setTimeout(function () {
          more.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 400);
        return;
      }
      const k = n;
      n++;
      typeParagraph(letterLines[k], paras[k], function () {
        popSticker(paras[k], k);
        nextParagraph();
      });
    }

    setTimeout(nextParagraph, 800);
  }, 1200);
}

envelope.addEventListener("click", openEnvelope);

function typeParagraph(text, paragraph, done) {
  const characters = Array.from(text);
  let index = 0;
  paragraph.classList.add("show");

  function typeNextCharacter() {
    if (index >= characters.length) {
      done();
      return;
    }
    paragraph.textContent += characters[index];
    index++;
    setTimeout(typeNextCharacter, 55);
  }

  typeNextCharacter();
}

/* ---------- cinematic opening ---------- */
const cinema = document.getElementById("cinema");
const cineLine = document.getElementById("cineLine");
const diya = document.getElementById("diya");

if (cinema && cineLine && diya) {
  const cineLines = [
    "Every story has a beginning...",
    "Ours began on a playground. 🏐",
    "In the coldest, darkest nights, one star shines the brightest. You're that for me."
  ];

  startScreen.classList.add("hidden");

  const beginBtn = document.createElement("button");
  beginBtn.id = "beginBtn";
  beginBtn.textContent = "Tap to begin 🪔";
  cinema.appendChild(beginBtn);

  beginBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    beginBtn.classList.add("gone");
    ensureAudio();
    if (audioCtx) noiseBuffer(audioCtx);

    const st = document.createElement("button");
    st.id = "soundToggle";
    st.textContent = "🔊";
    st.addEventListener("click", function (ev) {
      ev.stopPropagation();
      soundOn = !soundOn;
      st.textContent = soundOn ? "🔊" : "🔇";
    });
    cinema.appendChild(st);

    runIntro();
  });

  function runIntro() {
    let t = 2000;
    cineLines.forEach(function (line) {
      setTimeout(function () {
        inkWrite(cineLine, line);
      }, t);
      setTimeout(function () {
        cineLine.classList.remove("show");
      }, t + 4000);
      t += 5500;
    });

    setTimeout(function () {
      diya.classList.add("lit");
      inkWrite(cineLine, "Shubh Deepawali, Nikki 🪔");
      setTimeout(startCrackers, 800);
    }, t);

    setTimeout(finishCinema, t + 13500);
  }
}

/* ---------- cinematic upgrade: stars, shooting stars, embers ---------- */
if (cinema && diya) {
  for (let i = 0; i < 60; i++) {
    const s = document.createElement("span");
    s.className = "cstar";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    s.style.animationDuration = 2 + Math.random() * 3 + "s";
    cinema.appendChild(s);
  }

  const shootTimer = setInterval(function () {
    if (!document.body.contains(cinema)) {
      clearInterval(shootTimer);
      return;
    }
    const sh = document.createElement("span");
    sh.className = "cshoot";
    sh.style.left = Math.random() * 60 + "%";
    sh.style.top = Math.random() * 40 + "%";
    cinema.appendChild(sh);
    setTimeout(function () {
      sh.remove();
    }, 1500);
  }, 2200);

  const diyaWatch = setInterval(function () {
    if (!document.body.contains(cinema)) {
      clearInterval(diyaWatch);
      return;
    }
    if (diya.classList.contains("lit")) {
      clearInterval(diyaWatch);
      cinema.classList.add("warm");
      const emberTimer = setInterval(function () {
        if (!document.body.contains(cinema)) {
          clearInterval(emberTimer);
          return;
        }
        const e = document.createElement("span");
        e.className = "ember";
        e.style.left = 35 + Math.random() * 30 + "%";
        e.style.animationDuration = 4 + Math.random() * 3 + "s";
        cinema.appendChild(e);
        setTimeout(function () {
          e.remove();
        }, 7500);
      }, 250);
    }
  }, 200);
}

/* ---------- night sky: moon, planet, galaxy, constellation ---------- */
if (cinema) {
  const sky = document.createElement("div");
  sky.className = "sky";
  sky.innerHTML =
    '<div class="milkyway"></div>' +
    '<div class="moon"></div>' +
    '<div class="planet"></div>' +
    '<svg class="constellation" viewBox="0 0 200 120">' +
      '<polyline points="10,95 45,62 80,72 120,36 160,52 190,16"/>' +
      '<circle cx="10" cy="95" r="0"/>' +
      '<circle cx="45" cy="62" r="0"/>' +
      '<circle cx="80" cy="72" r="0"/>' +
      '<circle cx="120" cy="36" r="0"/>' +
      '<circle cx="160" cy="52" r="0"/>' +
      '<circle cx="190" cy="16" r="0"/>' +
    '</svg>';
  cinema.prepend(sky);
}

/* ---------- Sirius ---------- */
if (cinema) {
  const sirius = document.createElement("div");
  sirius.className = "sirius";
  sirius.innerHTML =
    '<span class="sirius-star"></span><span class="sirius-name">SIRIUS</span>';
  cinema.appendChild(sirius);
}

/* ---------- Gemini ---------- */
if (cinema) {
  const gem = document.createElement("div");
  gem.className = "gemini";
  gem.innerHTML =
    '<svg viewBox="0 0 200 150">' +
      '<polyline points="62,35 58,65 50,95 44,125"/>' +
      '<polyline points="100,38 97,68 95,98 106,128"/>' +
      '<polyline points="62,35 100,38"/>' +
      '<circle class="gstar" style="animation-delay:1s" cx="58" cy="65" r="1.8"/>' +
      '<circle class="gstar" style="animation-delay:1.6s" cx="50" cy="95" r="1.8"/>' +
      '<circle class="gstar" style="animation-delay:2.2s" cx="44" cy="125" r="1.8"/>' +
      '<circle class="gstar" style="animation-delay:1.2s" cx="97" cy="68" r="1.8"/>' +
      '<circle class="gstar" style="animation-delay:1.8s" cx="95" cy="98" r="1.8"/>' +
      '<circle class="gstar" style="animation-delay:2.4s" cx="106" cy="128" r="1.8"/>' +
      '<circle class="gstar gbig" cx="62" cy="35" r="3.6"/>' +
      '<circle class="gstar gbig" style="animation-delay:0.3s" cx="100" cy="38" r="4.2"/>' +
      '<text class="gname" x="52" y="33" text-anchor="end">CASTOR</text>' +
      '<text class="gname" x="110" y="36">POLLUX</text>' +
    '</svg>';
  cinema.appendChild(gem);
}

/* ---------- ink writing ---------- */
function inkWrite(el, text) {
  el.innerHTML = "";
  const words = text.split(" ");
  const total = Array.from(text).length;
  const per = Math.min(90, 3600 / total);
  let n = 0;
  words.forEach(function (w, wi) {
    const word = document.createElement("span");
    word.className = "inkword";
    Array.from(w).forEach(function (ch) {
      const s = document.createElement("span");
      s.className = "ink";
      s.textContent = ch;
      s.style.animationDelay = n * per + "ms";
      n++;
      word.appendChild(s);
    });
    el.appendChild(word);
    if (wi < words.length - 1) {
      el.appendChild(document.createTextNode(" "));
      n++;
    }
  });
  el.classList.add("show");
}

/* ---------- northern lights v2 ---------- */
if (cinema) {
  const au = document.createElement("div");
  au.className = "aurora";
  const ribbons = [
    { top: "4%",  left: "-12%", w: "70%", h: "20%", rot: "-12deg", c: "rgba(90,255,180,0.5)" },
    { top: "14%", left: "35%",  w: "75%", h: "17%", rot: "9deg",   c: "rgba(150,110,255,0.45)" },
    { top: "30%", left: "-20%", w: "60%", h: "15%", rot: "16deg",  c: "rgba(70,215,230,0.4)" },
    { top: "46%", left: "48%",  w: "62%", h: "16%", rot: "-15deg", c: "rgba(110,255,200,0.38)" },
    { top: "60%", left: "-8%",  w: "58%", h: "14%", rot: "7deg",   c: "rgba(190,120,255,0.35)" },
    { top: "72%", left: "42%",  w: "64%", h: "15%", rot: "-8deg",  c: "rgba(80,230,190,0.3)" },
    { top: "22%", left: "8%",   w: "42%", h: "12%", rot: "20deg",  c: "rgba(120,170,255,0.32)" }
  ];
  ribbons.forEach(function (r, i) {
    const s = document.createElement("span");
    s.style.top = r.top;
    s.style.left = r.left;
    s.style.width = r.w;
    s.style.height = r.h;
    s.style.background = "radial-gradient(ellipse at center, " + r.c + ", transparent 70%)";
    s.style.setProperty("--rot", r.rot);
    s.style.animationDuration = 14 + i * 2.5 + "s";
    s.style.animationDelay = -i * 3 + "s";
    au.appendChild(s);
  });
  const host = cinema.querySelector(".sky") || cinema;
  host.appendChild(au);
}

/* ===== crackers with sound ===== */
clearInterval(fireworkTimer); // no silent fireworks behind the intro

let audioCtx = null;
let masterGain = null;
let soundOn = true;
let crackersShown = false;
let crackersLit = false;
let noiseCache = null;

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5; // overall volume
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function noiseBuffer(ctx) {
  if (!noiseCache || noiseCache.sampleRate !== ctx.sampleRate) {
    const len = ctx.sampleRate * 2;
    noiseCache = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseCache.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseCache;
}

function playWhistle(dur) {
  if (!soundOn) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 18;
  bp.frequency.setValueAtTime(900, now);
  bp.frequency.exponentialRampToValueAtTime(3200, now + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.5, now + dur * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  n.connect(bp);
  bp.connect(g);
  g.connect(masterGain);
  n.start(now, Math.random() * 0.4, dur + 0.05);
}

function playBoom() {
  if (!soundOn) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  const c = ctx.createBufferSource();
  c.buffer = noiseBuffer(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 500;
  const cg = ctx.createGain();
  cg.gain.setValueAtTime(0.9, now);
  cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  c.connect(hp);
  hp.connect(cg);
  cg.connect(masterGain);
  c.start(now, Math.random() * 1.5, 0.3);

  const r = ctx.createBufferSource();
  r.buffer = noiseBuffer(ctx);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(400, now);
  lp.frequency.exponentialRampToValueAtTime(110, now + 1.2);
  const rg = ctx.createGain();
  rg.gain.setValueAtTime(0.55, now);
  rg.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
  const d = ctx.createDelay();
  d.delayTime.value = 0.22;
  const fb = ctx.createGain();
  fb.gain.value = 0.32;
  r.connect(lp);
  lp.connect(rg);
  rg.connect(masterGain);
  rg.connect(d);
  d.connect(fb);
  fb.connect(d);
  d.connect(masterGain);
  r.start(now, Math.random() * 0.5, 1.4);
}

function playCrackle() {
  if (!soundOn) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (let i = 0; i < 14; i++) {
    const t0 = now + 0.15 + Math.random() * 1.1;
    const n = ctx.createBufferSource();
    n.buffer = noiseBuffer(ctx);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2200 + Math.random() * 3000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.06 + Math.random() * 0.14, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04);
    n.connect(hp);
    hp.connect(g);
    g.connect(masterGain);
    n.start(t0, Math.random() * 1.9, 0.04);
  }
}

function launchWithSound() {
  const r = launchFirework(function () {
    playBoom();
    playCrackle();
  });
  const ms = ((r.y - r.targetY) / Math.abs(r.vy)) * (1000 / 60);
  playWhistle(ms / 1000);
}

function finishCinema() {
  if (!document.body.contains(cinema)) return;
  cinema.classList.add("fade-out");
  startScreen.classList.remove("hidden");
  setTimeout(function () {
    cinema.remove();
    fxCanvas.style.zIndex = "5";
    launchFirework();
    setTimeout(launchFirework, 600);
    fireworkTimer = setInterval(launchFirework, 1100);
  }, 1000);
}

function startCrackers() {
  if (crackersLit) return;
  crackersLit = true;
  clearInterval(fireworkTimer);
  cinema.classList.add("cracking");
  fxCanvas.style.zIndex = "150";
  const total = 9;
  for (let i = 0; i < total; i++) {
    setTimeout(launchWithSound, 400 + i * 650 + Math.random() * 250);
  }
  setTimeout(launchLine, 400 + total * 650 + 800);
}

function explodeGold(x, y) {
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 3.2;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.4,
      life: 1,
      decay: 0.006 + Math.random() * 0.003,
      size: 1.2 + Math.random() * 1.3,
      color: i % 4 === 0 ? "#ffffff" : "#ffcf5a"
    });
  }
}

function playBigBoom() {
  playBoom();
  setTimeout(playBoom, 70);
  playCrackle();
  setTimeout(playCrackle, 350);
}

function launchLine() {
  const count = 7;
  const w = fxCanvas.width;
  const h = fxCanvas.height;
  const vy = -10;
  const targetY = h * 0.3;
  const ms = ((h - targetY) / Math.abs(vy)) * (1000 / 60);

  playWhistle(ms / 1000);
  playWhistle(ms / 1000);

  for (let i = 0; i < count; i++) {
    const x = w * (0.12 + (0.76 * i) / (count - 1));
    rockets.push({
      x: x,
      y: h,
      vy: vy,
      targetY: targetY,
      color: fxColors[i % fxColors.length],
      onBurst: function () {
        explodeGold(x, targetY);
        if (i === Math.floor(count / 2)) playBigBoom();
      }
    });
  }
}

/* ---------- bridge sketch scene ---------- */
const bridgeScene = document.getElementById("bridgeScene");
const bridgeNext = document.getElementById("bridgeNext");

function showBridge() {
  stopFloaters();
  questionScreen.classList.add("hidden");
  bridgeScene.classList.remove("hidden");
  setTimeout(function () {
    bridgeNext.classList.remove("hidden");
  }, 11000);
}

if (bridgeNext) {
  bridgeNext.addEventListener("click", function () {
    bridgeScene.classList.add("hidden");
    showFinal();
  });
}

/* ---------- serve game ---------- */
const serveGame = document.getElementById("serveGame");
const serveCanvas = document.getElementById("serveCanvas");
const serveHint = document.getElementById("serveHint");
const serveMsg = document.getElementById("serveMsg");
const serveBtn = document.getElementById("serveBtn");
const serveNext = document.getElementById("serveNext");

const SG = { W: 340, H: 220, ground: 185, netX: 170, netTop: 135, g: 0.18, startX: 75, startY: 140 };
const serveShots = [
  { vx: -2.2, vy: -5.5, msg: "Wrong court... that's not behind you 😭" },
  { vx: 0.3,  vy: -8,   msg: "Straight up. Gravity says hi 😂" },
  { vx: 3.2,  vy: -2.5, msg: "Net! So close... 😅" },
  { vx: 4,    vy: -6.4, msg: "Out of the ground again 😂" },
  { vx: 2.7,  vy: -6.2, msg: "WoooHoooo! 🏆 Finally!", win: true }
];

let serveAttempt = 0;
let serveBall = null;
let serveWon = false;
let serveLoop = false;
let sctx = null;

if (serveCanvas) {
  const dpr = window.devicePixelRatio || 1;
  serveCanvas.width = SG.W * dpr;
  serveCanvas.height = SG.H * dpr;
  sctx = serveCanvas.getContext("2d");
  sctx.scale(dpr, dpr);
}

function drawServe() {
  if (!sctx) return;
  sctx.clearRect(0, 0, SG.W, SG.H);

  // ground
  sctx.strokeStyle = "#ffe27a";
  sctx.lineWidth = 2;
  sctx.beginPath();
  sctx.moveTo(10, SG.ground);
  sctx.lineTo(SG.W - 10, SG.ground);
  sctx.stroke();

  // net
  sctx.strokeStyle = "rgba(255,255,255,0.85)";
  sctx.lineWidth = 2;
  sctx.beginPath();
  sctx.moveTo(SG.netX, SG.netTop - 4);
  sctx.lineTo(SG.netX, SG.ground);
  sctx.stroke();
  sctx.lineWidth = 1;
  for (let y = SG.netTop + 4; y < SG.ground; y += 8) {
    sctx.beginPath();
    sctx.moveTo(SG.netX - 5, y);
    sctx.lineTo(SG.netX + 5, y);
    sctx.stroke();
  }

  // her, ready to serve
  sctx.strokeStyle = "#ffffff";
  sctx.lineWidth = 2;
  sctx.lineCap = "round";
  sctx.beginPath();
  sctx.arc(50, 137, 5, 0, Math.PI * 2);
  sctx.moveTo(50, 142); sctx.lineTo(50, 163);
  sctx.moveTo(50, 163); sctx.lineTo(44, SG.ground);
  sctx.moveTo(50, 163); sctx.lineTo(56, SG.ground);
  sctx.moveTo(50, 148); sctx.lineTo(70, 142);
  sctx.stroke();

  // ball
  const bx = serveBall ? serveBall.x : SG.startX;
  const by = serveBall ? serveBall.y : SG.startY;
  sctx.font = "22px serif";
  sctx.textAlign = "center";
  sctx.textBaseline = "middle";
  sctx.fillText("🏐", bx, by);
}

function endShot(shot) {
  serveMsg.textContent = shot.msg;
  replay(serveMsg, "rise");
  if (shot.win) {
    serveWon = true;
    serveHint.textContent = "You did it! 🤍";
    serveBtn.classList.add("hidden");
    celebrateWin();
    setTimeout(function () {
      serveNext.classList.remove("hidden");
    }, 3500);
  }else {
    setTimeout(function () {
      serveBall = null;
      serveHint.textContent = "Try again!";
    }, 900);
  }
}

function serveTick() {
  if (serveGame.classList.contains("hidden")) {
    serveLoop = false;
    return;
  }
  const b = serveBall;
  if (b && b.flying) {
    b.vy += SG.g;
    b.x += b.vx;
    b.y += b.vy;

    if (!b.hitNet && b.x > SG.netX - 4 && b.x < SG.netX + 4 &&
        b.y > SG.netTop && b.y < SG.ground) {
      b.hitNet = true;
      b.vx = -0.8;
      b.vy = 0;
    }
    if (b.y >= SG.ground) {
      b.y = SG.ground;
      if (b.bounces < 1) {
        b.vy = -b.vy * 0.35;
        b.vx *= 0.6;
        b.bounces++;
      } else {
        b.flying = false;
        endShot(b.shot);
      }
    } else if (b.x < -20 || b.x > SG.W + 20) {
      b.flying = false;
      endShot(b.shot);
    }
  }
  drawServe();
  requestAnimationFrame(serveTick);
}

function doServe() {
  if (serveWon || (serveBall && serveBall.flying) || serveBall) return;
  const shot = serveShots[Math.min(serveAttempt, serveShots.length - 1)];
  serveAttempt++;
  serveMsg.textContent = "";
  serveHint.textContent = "Serve " + serveAttempt + "...";
  serveBall = {
    x: SG.startX, y: SG.startY,
    vx: shot.vx, vy: shot.vy,
    bounces: 0, hitNet: false, flying: true, shot: shot
  };
}

function showServeGame() {
  stopFloaters();
  questionScreen.classList.add("hidden");
  serveGame.classList.remove("hidden");
  serveAttempt = 0;
  serveBall = null;
  serveWon = false;
  serveMsg.textContent = "";
  serveHint.textContent = "Send it over the net!";
  serveBtn.classList.remove("hidden");
  serveNext.classList.add("hidden");
  if (!serveLoop) {
    serveLoop = true;
    requestAnimationFrame(serveTick);
  }
}

if (serveBtn) serveBtn.addEventListener("click", doServe);
if (serveCanvas) serveCanvas.addEventListener("pointerdown", doServe);
if (serveNext) {
  serveNext.addEventListener("click", function () {
    serveGame.classList.add("hidden");
    questionScreen.classList.remove("hidden");
    showQuestion();
  });
}

/* ---------- scratch vouchers ---------- */
const voucherScreen = document.getElementById("voucherScreen");
const voucherList = document.getElementById("voucherList");
const voucherFoot = document.getElementById("voucherFoot");

const vouchers = [
  { icon: "🥤", title: "One drink, on me", text: "Redeemable the moment you say 'Merko bhi aana hai' 😭" },
  { icon: "📞", title: "One long chit-chat", text: "No excuses, no 'busy'. You pick the time." },
  { icon: "🎬", title: "One watch party", text: "Pick any video or show. We press play together on a call, from wherever we are." },
  { icon: "🚨", title: "CODE RED", text: "Say 'code red' any time, and I drop everything to cheer you up. No questions asked." },
];

let revealedCount = 0;

function buildVouchers() {
  voucherList.innerHTML = "";
  vouchers.forEach(function (v) {
    const card = document.createElement("div");
    card.className = "voucher";
    card.innerHTML =
      '<div class="v-icon">' + v.icon + '</div>' +
      '<div><div class="v-title">' + v.title + '</div>' +
      '<div class="v-text">' + v.text + '</div></div>';
    const c = document.createElement("canvas");
    c.className = "v-scratch";
    card.appendChild(c);
    voucherList.appendChild(card);
  });
}

function setupScratch(canvas) {
  const w = canvas.parentElement.offsetWidth;
  const h = canvas.parentElement.offsetHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const foil = ctx.createLinearGradient(0, 0, w, h);
  foil.addColorStop(0, "#d9dde3");
  foil.addColorStop(0.5, "#9aa1ad");
  foil.addColorStop(1, "#cfd4db");
  ctx.fillStyle = foil;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#5b6270";
  ctx.font = "600 16px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✨ Scratch here ✨", w / 2, h / 2);

  let drawing = false;
  let done = false;

  function scratch(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  function cleared() {
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < d.length; i += 64) {
      total++;
      if (d[i] === 0) clear++;
    }
    return clear / total;
  }

  function finish() {
    if (cleared() > 0.5 && !done) {
      done = true;
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
      revealedCount++;
      if (revealedCount === vouchers.length) {
        showEndButton();
        voucherFoot.textContent = "All unlocked. Valid forever. 🤍";
        if (typeof confetti === "function") {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
        }
      }
    }
  }

  canvas.addEventListener("pointerdown", function (e) {
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    scratch(e);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (drawing) scratch(e);
  });
  canvas.addEventListener("pointerup", function () {
    drawing = false;
    finish();
  });
  canvas.addEventListener("pointercancel", function () {
    drawing = false;
    finish();
  });
}

function showVouchers() {
  finalScreen.classList.add("hidden");
  voucherScreen.classList.remove("hidden");
  revealedCount = 0;
  voucherFoot.textContent = "Scratch each one to reveal";
  buildVouchers();
  setTimeout(function () {
    voucherList.querySelectorAll(".v-scratch").forEach(setupScratch);
  }, 100);
}

/* ----------- the ending --------*/
const endScreen = document.getElementById("endScreen");
const endLine = document.getElementById("endLine");
const endSub = document.getElementById("endSub");
const replayBtn = document.getElementById("replayBtn");

function showEndButton() {
  if (document.getElementById("endBtn")) return;
  const b = document.createElement("button");
  b.id = "endBtn";
  b.textContent = "One last thing 🤍";
  b.addEventListener("click", showEnding);
  voucherScreen.appendChild(b);
  setTimeout(function () {
    b.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
}


function showEnding() {
  voucherScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");;
  fxCanvas.style.zIndex = "5";
  endLine.classList.remove("show");
  endSub.classList.remove("show");
  endLine.textContent = "";

  setTimeout(function () {
    inkWrite(endLine, "And that's our story, so far.....");
  }, 1200);
  setTimeout(function () {
    endLine.classList.remove("show");
  }, 5600);
  setTimeout(function() {
    inkWrite(endLine, "Happy Birthday, Nikki 🎂");
  }, 6600);

  for (let i = 0; i < 5; i++) {
    setTimeout(launchWithSound, 7400 + i * 700 + Math.random() * 200);
  }
  setTimeout(function () {
    if (typeof launchLine === "function") launchLine();
  }, 11500);
  setTimeout(function () {
    endSub.innerHTML = "The End 🤍<small>made with love, by Ayush</small>";
    endSub.classList.add("show");
  }, 15500);
  settimeout(function () {
    replayBtn.classList.remove("hidden");
  }, 19000);
}

if (replayBtn) {
  replayBtn.addEventListener("click", function () {
    location.reload();
  });
}

/* ---------- letter makeover: tape, stamp, stickers, auto-scroll ---------- */
const stickerSet = ["", "🎂", "🪔", "🌙", "✨", "🌱", "💫", "🏐", "🌸", "🎉", ""];
let userScrolledAt = 0;
window.addEventListener("touchmove", function () { userScrolledAt = Date.now(); }, { passive: true });
window.addEventListener("wheel", function () { userScrolledAt = Date.now(); }, { passive: true });

function decorateLetter() {
  const ta = document.createElement("div");
  ta.className = "l-tape a";
  const tb = document.createElement("div");
  tb.className = "l-tape b";
  const st = document.createElement("div");
  st.className = "l-stamp";
  st.innerHTML = "<b>🪔</b>NOV 8";
  letterBox.appendChild(ta);
  letterBox.appendChild(tb);
  letterBox.appendChild(st);

  const timer = setInterval(function () {
    if (document.querySelector(".seal") || letterBox.classList.contains("hidden")) {
      clearInterval(timer);
      return;
    }
    if (Date.now() - userScrolledAt < 3500) return;
    let last = null;
    letterBox.querySelectorAll("p").forEach(function (p) {
      if (p.textContent) last = p;
    });
    if (last) last.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 600);
}

function popSticker(p, k) {
  const e = stickerSet[k];
  if (!e) return;
  const s = document.createElement("span");
  s.className = "sticker";
  s.textContent = e;
  s.style.bottom = "-8px";
  if (k % 2) {
    s.style.right = "-26px";
  } else {
    s.style.left = "-46px";
  }
  s.style.setProperty("--tilt", (k % 2 ? 12 : -12) + "deg");
  p.appendChild(s);
}
/* ---------- win celebration ---------- */
function playCheer() {
  if (!soundOn) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1100;
  bp.Q.value = 0.8;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.35, now + 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
  n.connect(bp);
  bp.connect(g);
  g.connect(masterGain);
  n.start(now, Math.random() * 0.1, 1.9);
}

function playChime() {
  if (!soundOn) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
    const t0 = ctx.currentTime + i * 0.13;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
    o.connect(g);
    g.connect(masterGain);
    o.start(t0);
    o.stop(t0 + 1);
  });
}

function celebrateWin() {
  let pop = document.getElementById("smashPop");
  if (!pop) {
    pop = document.createElement("div");
    pop.id = "smashPop";
    pop.textContent = "SMASH! 🏆";
    document.body.appendChild(pop);
  }
  pop.classList.remove("go");
  void pop.offsetWidth;
  pop.classList.add("go");

  serveGame.classList.add("shake-screen");
  setTimeout(function () {
    serveGame.classList.remove("shake-screen");
  }, 600);

  playChime();
  playCheer();

  if (typeof confetti === "function") {
    const end = Date.now() + 2200;
    (function side() {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } });
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } });
      if (Date.now() < end) requestAnimationFrame(side);
    })();
  }

  for (let i = 0; i < 3; i++) {
    setTimeout(launchWithSound, 500 + i * 600);
  }

  const rainEmoji = ["🏐", "🏆", "✨", "🎉", "🏐"];
  for (let i = 0; i < 22; i++) {
    setTimeout(function () {
      const r = document.createElement("span");
      r.className = "rain";
      r.textContent = rainEmoji[Math.floor(Math.random() * rainEmoji.length)];
      r.style.left = Math.random() * 95 + "vw";
      r.style.fontSize = 20 + Math.random() * 20 + "px";
      r.style.animationDuration = 2.5 + Math.random() * 2 + "s";
      document.body.appendChild(r);
      setTimeout(function () {
        r.remove();
      }, 5200);
    }, i * 140);
  }
}