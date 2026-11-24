/* ==========================================================================
   SWEET CHEF 🍓 — GIRLS COOKING GAME WEBSITE JAVASCRIPT
   Architecture: Clean Modular Design with Web Audio API, LocalStorage,
   Confetti Engine, 22 Fully Interactive Games, Recipe System & Achievements.
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     1. SOUND & MUSIC ENGINE (Web Audio API - Zero External Files)
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.soundEnabled = true;
      this.bgmEnabled = false;
      this.bgmOscillators = [];
      this.bgmInterval = null;
      this.initContextOnInteraction = this.initContextOnInteraction.bind(this);

      window.addEventListener('click', this.initContextOnInteraction, { once: true });
      window.addEventListener('keydown', this.initContextOnInteraction, { once: true });
    }

    initContextOnInteraction() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    }

    playSuccess() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    }

    playWrong() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    }

    playSizzle() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    }

    playWinFanfare() {
      if (!this.soundEnabled) return;
      this.ensureContext();
      if (!this.ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    }

    startAmbientBgm() {
      this.bgmEnabled = true;
      this.ensureContext();
      if (!this.ctx) return;

      this.stopAmbientBgm();

      // Gentle, cozy cafe chords progression (Cmaj7 -> Am7 -> Dm7 -> G7)
      const chordProgression = [
        [261.63, 329.63, 392.00, 493.88], // C, E, G, B
        [220.00, 261.63, 329.63, 392.00], // A, C, E, G
        [293.66, 349.23, 440.00, 523.25], // D, F, A, C
        [196.00, 246.94, 293.66, 349.23]  // G, B, D, F
      ];
      let step = 0;

      const playChord = () => {
        if (!this.bgmEnabled || !this.ctx) return;
        const currentChord = chordProgression[step % chordProgression.length];
        step++;
        const now = this.ctx.currentTime;

        currentChord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = now + idx * 0.12;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.025, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.0005, noteTime + 2.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 2.3);
        });
      };

      playChord();
      this.bgmInterval = setInterval(playChord, 3200);
    }

    stopAmbientBgm() {
      this.bgmEnabled = false;
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
    }
  }

  const sound = new SoundEngine();

  /* ==========================================================================
     2. CONFETTI PARTICLE SYSTEM (Canvas 60fps Explosion)
     ========================================================================== */
  class ConfettiEngine {
    constructor() {
      this.canvas = document.getElementById('confetti-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.animationId = null;
      this.resize();

      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 3, count = 120) {
      if (!this.canvas || !this.ctx) return;
      const colors = ['#FF5E8E', '#FFAE34', '#FF9E80', '#5CD0B3', '#9D7BFC', '#FF3366', '#FFE7F0'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: Math.random() * 9 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01,
          shape: Math.random() > 0.4 ? 'rect' : 'circle'
        });
      }

      if (!this.animationId) {
        this.loop();
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.98; // air resistance
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animationId = requestAnimationFrame(() => this.loop());
      } else {
        this.animationId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  const confetti = new ConfettiEngine();

  /* ==========================================================================
     3. DATA & STATE MANAGEMENT (LocalStorage)
     ========================================================================== */
  const STORAGE_KEY = 'sweet_chef_v1_data';

  const defaultState = {
    username: '',
    ageCategory: 'junior', // 'little' | 'junior' | 'creative' | 'master'
    avatar: '👩🍳',
    score: 0,
    gamesPlayed: 0,
    dishesCooked: 0,
    bestScore: 0,
    unlockedAchievements: ['first_cooking'],
    savedRecipes: [],
    lastDailyClaimDate: '',
    soundEnabled: true,
    bgmEnabled: false,
    theme: 'light'
  };

  let appState = { ...defaultState };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        appState = { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.warn('LocalStorage error, using defaults', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }

  /* ==========================================================================
     4. DATABASE: CATEGORIES, 22 GAMES, 10 RECIPES, 10 ACHIEVEMENTS
     ========================================================================== */
  const CATEGORIES = {
    little: {
      key: 'little',
      title: 'Little Chef',
      range: '3–5 yosh',
      badge: '🧁 Little Chef (3–5 yosh)',
      icon: '🧁',
      desc: 'Ranglar, mevalar, shakllar va oddiy xavfsiz oshxona o‘yinlari.'
    },
    junior: {
      key: 'junior',
      title: 'Junior Chef',
      range: '6–9 yosh',
      badge: '🍓 Junior Chef (6–9 yosh)',
      icon: '🍓',
      desc: 'Pitsa, cupcake, mevali salat, sendvich va qiziqarli oshxona retseptlari.'
    },
    creative: {
      key: 'creative',
      title: 'Creative Chef',
      range: '10–15 yosh',
      badge: '🍰 Creative Chef (10–15 yosh)',
      icon: '🍰',
      desc: 'Retseptlar, ingredientlar, tort dizayni, challenge va restoran boshqaruvi.'
    },
    master: {
      key: 'master',
      title: 'Master Chef',
      range: '16–20 yosh',
      badge: '👩🍳 Master Chef (16–20 yosh)',
      icon: '👩🍳',
      desc: 'Murakkab retseptlar, taom dizayni, sirli ingredientlar va oshxona simulyatsiyasi.'
    }
  };

  const DYNAMIC_GREETINGS = [
    'Bugun yangi retseptlar, mazali o‘yinlar va oshxona sarguzashtlari seni kutmoqda!',
    'bugun o‘zining eng sevimli shirinligini tayyorlashga tayyormisan?',
    'oshxonada sehrli hidlar taralmoqda! Nima pishiramiz?',
    'sen haqiqiy pazandachilik malikasisan!',
    'har bir taoming san’at asari kabi chiroyli bo‘lsin!'
  ];

  const CHEF_TIPS = [
    'Cupcake pishirishda barcha masalliqlar (tuxum, sut, sariyog\') xona haroratida bo‘lsa, xamir juda yumshoq va havodor chiqadi!',
    'Pitsa qarsildoq bo‘lishi uchun pech tagiga qalin qizdirilgan tosh yoki list qo‘yib pishiring.',
    'Mevali salat qorayib qolmasligi uchun unga bir necha tomchi limon sharbati seping.',
    'Krem quyuq va chiroyli turishi uchun qaymoqni ko‘pirtirishdan oldin 2 soat muzlatgichda sovuting.',
    'Shokoladni eritayotganda suv tomchilari tegib ketmasin, aks holda shokolad donador bo‘lib qoladi.'
  ];

  const GAMES_CATALOG = [
    // --- 3–5 yosh (Little Chef) ---
    {
      id: 'fruit_basket',
      category: 'little',
      title: 'Fruit Basket 🍎',
      emoji: '🍎',
      bannerClass: 'banner-little',
      diff: 'Oson',
      diffClass: 'diff-easy',
      ageLabel: '3–5 yosh',
      desc: 'Mevalarni ranglariga qarab mos qizil, sariq va binafsha savatchalarga joylashtiring.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'cake_decoration',
      category: 'little',
      title: 'Cake Decoration 🎂',
      emoji: '🎂',
      bannerClass: 'banner-little',
      diff: 'Oson',
      diffClass: 'diff-easy',
      ageLabel: '3–5 yosh',
      desc: 'Tort ustiga qulupnay, gilos, qaymoq, shokolad va shamchalarni terib shirin tort yarating.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'kitchen_shapes',
      category: 'little',
      title: 'Kitchen Shapes 🍪',
      emoji: '🍪',
      bannerClass: 'banner-little',
      diff: 'Oson',
      diffClass: 'diff-easy',
      ageLabel: '3–5 yosh',
      desc: 'Yulduzcha, yurakcha, doira va kvadrat shaklidagi pechenyelarni mos o‘rniga qo‘ying.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'match_food',
      category: 'little',
      title: 'Match the Food 🥛',
      emoji: '🥛',
      bannerClass: 'banner-little',
      diff: 'Oson',
      diffClass: 'diff-easy',
      ageLabel: '3–5 yosh',
      desc: 'Kartalarni ochib, bir xil oziq-ovqatlarning juftligini toping va xotirangizni sinang.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'color_cupcake',
      category: 'little',
      title: 'Color the Cupcake 🧁',
      emoji: '🧁',
      bannerClass: 'banner-little',
      diff: 'Oson',
      diffClass: 'diff-easy',
      ageLabel: '3–5 yosh',
      desc: 'Cupcake ning qismlarini eng yoqimli pastel va mevali ranglarga bo‘yab bezating.',
      rating: '⭐⭐⭐⭐⭐'
    },

    // --- 6–9 yosh (Junior Chef) ---
    {
      id: 'make_pizza',
      category: 'junior',
      title: 'Make Your Pizza 🍕',
      emoji: '🍕',
      bannerClass: 'banner-junior',
      diff: 'O\'rtacha',
      diffClass: 'diff-medium',
      ageLabel: '6–9 yosh',
      desc: 'Xamirni yoying, sous, pishloq, qo‘ziqorin, zaytun va kolbasa solib pechda pishiring.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'cupcake_bakery',
      category: 'junior',
      title: 'Cupcake Bakery 🧁',
      emoji: '🧁',
      bannerClass: 'banner-junior',
      diff: 'O\'rtacha',
      diffClass: 'diff-medium',
      ageLabel: '6–9 yosh',
      desc: 'Xamir asosi, krem shakli, rang va topinglarni tanlab to‘liq cupcake yarating.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'fruit_salad',
      category: 'junior',
      title: 'Fruit Salad 🍓',
      emoji: '🍓',
      bannerClass: 'banner-junior',
      diff: 'O\'rtacha',
      diffClass: 'diff-medium',
      ageLabel: '6–9 yosh',
      desc: 'Retseptdagi mevalarni to‘g‘rang, billur idishga soling va asal quyib aralashtiring.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'sandwich_maker',
      category: 'junior',
      title: 'Sandwich Maker 🥪',
      emoji: '🥪',
      bannerClass: 'banner-junior',
      diff: 'O\'rtacha',
      diffClass: 'diff-medium',
      ageLabel: '6–9 yosh',
      desc: 'Non, salat bargi, pomidor, pishloq va kotletni tartib bilan ustma-ust terib sendvich tayyorlang.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'kitchen_memory',
      category: 'junior',
      title: 'Kitchen Memory 🧠',
      emoji: '🧠',
      bannerClass: 'banner-junior',
      diff: 'O\'rtacha',
      diffClass: 'diff-medium',
      ageLabel: '6–9 yosh',
      desc: 'Oshxona anjomlarini 4 soniya ichida eslab qoling va qopqoq ostidan to‘g‘ri toping.',
      rating: '⭐⭐⭐⭐⭐'
    },

    // --- 10–15 yosh (Creative Chef) ---
    {
      id: 'cake_designer',
      category: 'creative',
      title: 'Cake Designer 🎂',
      emoji: '🎂',
      bannerClass: 'banner-creative',
      diff: 'Ijodiy',
      diffClass: 'diff-hard',
      ageLabel: '10–15 yosh',
      desc: '1, 2 yoki 3 qavatli hashamatli bayram torti yarating: shakl, krem to‘lqinlari va oltin gul bezaklari.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'recipe_challenge',
      category: 'creative',
      title: 'Recipe Challenge 🍝',
      emoji: '🍝',
      bannerClass: 'banner-creative',
      diff: 'Qiyin',
      diffClass: 'diff-hard',
      ageLabel: '10–15 yosh',
      desc: 'Pazandachilik sirlari: berilgan taom uchun haqiqiy ingredientlarni tanlang va xatolardan saqlaning.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'food_quiz',
      category: 'creative',
      title: 'Food Quiz 🥑',
      emoji: '🥑',
      bannerClass: 'banner-creative',
      diff: 'Bilmondon',
      diffClass: 'diff-hard',
      ageLabel: '10–15 yosh',
      desc: 'Pazandachilik, mevalar va shirinliklar sirlari bo‘yicha 5 ta qiziqarli savolga to‘g‘ri javob bering.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'restaurant_kitchen',
      category: 'creative',
      title: 'Restaurant Kitchen 🍽️',
      emoji: '🍽️',
      bannerClass: 'banner-creative',
      diff: 'Tezkor',
      diffClass: 'diff-hard',
      ageLabel: '10–15 yosh',
      desc: 'Mijozlar buyurtmalari keladi! Vaqt tugamasdan oldin masalliqlarni terib taomlarni tayyorlab bering.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'smoothie_master',
      category: 'creative',
      title: 'Smoothie Master 🍹',
      emoji: '🍹',
      bannerClass: 'banner-creative',
      diff: 'Ijodiy',
      diffClass: 'diff-hard',
      ageLabel: '10–15 yosh',
      desc: 'Sut, mevalar va chia urug‘ini blenderda aralashtiring, mevali stakanga quyib bezang.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'bakery_manager',
      category: 'creative',
      title: 'Bakery Manager 🥐',
      emoji: '🥐',
      bannerClass: 'banner-creative',
      diff: 'Boshqaruv',
      diffClass: 'diff-hard',
      ageLabel: '10–15 yosh',
      desc: 'Shirinlik do‘koni: kruassan va donutlarni pishiring, xaridorlarga xizmat qilib tangalar to‘plang.',
      rating: '⭐⭐⭐⭐⭐'
    },

    // --- 16–20 yosh (Master Chef) ---
    {
      id: 'master_recipe_challenge',
      category: 'master',
      title: 'Master Recipe Challenge 🏆',
      emoji: '🏆',
      bannerClass: 'banner-master',
      diff: 'Professional',
      diffClass: 'diff-pro',
      ageLabel: '16–20 yosh',
      desc: 'Fransuzcha Makaronlar pishirishning murakkab pazandachilik bosqichlarini to‘g‘ri tartibga tering.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'restaurant_manager',
      category: 'master',
      title: 'Restaurant Manager 💼',
      emoji: '💼',
      bannerClass: 'banner-master',
      diff: 'Strategiya',
      diffClass: 'diff-pro',
      ageLabel: '16–20 yosh',
      desc: 'Shaxsiy Sweet Bistro restoraningizni boshqaring: narxlar, mahsulot sifati va Michelin reytingi!',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'ingredient_mystery',
      category: 'master',
      title: 'Ingredient Mystery 🕵️‍♀️',
      emoji: '🕵️‍♀️',
      bannerClass: 'banner-master',
      diff: 'Deduktsiya',
      diffClass: 'diff-pro',
      ageLabel: '16–20 yosh',
      desc: 'Oshxona detektivi: sirli taom haqidagi ma\'lumotlar asosida taom va uning 4 ta asosiy ingredientini toping.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'food_styling_studio',
      category: 'master',
      title: 'Food Styling Studio 📸',
      emoji: '📸',
      bannerClass: 'banner-master',
      diff: 'Estetika',
      diffClass: 'diff-pro',
      ageLabel: '16–20 yosh',
      desc: 'Michelin uslubidagi tarelka dizayni: tosh taxta, sous to‘lqinlari, mikro-ko‘katlar va suratga olish!',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'recipe_creator',
      category: 'master',
      title: 'Recipe Creator 📝',
      emoji: '📝',
      bannerClass: 'banner-master',
      diff: 'Mualliflik',
      diffClass: 'diff-pro',
      ageLabel: '16–20 yosh',
      desc: 'O‘z mualliflik retseptingizni yarating: masalliqlar, tayyorlash siri va shaxsiy oshxonangizga saqlang.',
      rating: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'cooking_strategy',
      category: 'master',
      title: 'Cooking Strategy ⚡',
      emoji: '⚡',
      bannerClass: 'banner-master',
      diff: 'Multitasking',
      diffClass: 'diff-pro',
      ageLabel: '16–20 yosh',
      desc: 'Bir vaqtning o‘zida tova, pech va stol ustida taomlarni kuydirmasdan pishirish strategiyasi.',
      rating: '⭐⭐⭐⭐⭐'
    }
  ];

  const RECIPES_CATALOG = [
    {
      id: 'rc_cupcake',
      title: 'Mevali Cupcake',
      emoji: '🧁',
      type: 'dessert',
      typeName: 'Shirinlik',
      time: '25 daqiqa',
      diff: 'Oson',
      desc: 'Yumshoq vanilli xamir va yangi qulupnayli qaymoqli krem bilan tayyorlanadigan shohona desert.',
      ingredients: [
        '200g Un',
        '100g Sariyog\' (xona haroratida)',
        '120g Shakar',
        '2 dona Tuxum',
        '1 choy qoshiq Qabartma (razrixlitel)',
        '80ml Sut',
        '150ml Muzday Qaymoq (krem uchun)',
        'Yangi Qulupnaylar (bezatish uchun)'
      ],
      steps: [
        'Sariyog\' va shakarni mikser yordamida oqarib, kremsimon bo‘lguncha ko‘pirtiring.',
        'Birma-bir tuxumlarni qo‘shib aralashtirishda davom eting.',
        'Elangan un va qabartmani sut bilan navbatma-navbat qo‘shib, muloyim xamir hosil qiling.',
        'Kekschalar qolipiga 2/3 qilib quying va 180°C pechda 20 daqiqa pishiring.',
        'Sovigan cupcake larni qaymoqli krem va qulupnaylar bilan bezating.'
      ],
      tip: 'Krem quyuq bo‘lishi uchun qaymoqni ko‘pirtirishdan oldin idish va venchikni 15 daqiqa muzlatgichga qo‘ying.',
      gameMatchId: 'cupcake_bakery'
    },
    {
      id: 'rc_fruit_salad',
      title: 'Yangi Mevali Salat',
      emoji: '🍓',
      type: 'dessert',
      typeName: 'Salat & Desert',
      time: '15 daqiqa',
      diff: 'Juda Oson',
      desc: 'Qulupnay, kivi, banan va apelsindan tayyorlangan vitaminlarga boy, tetiklantiruvchi mevali salat.',
      ingredients: [
        '150g Yangi Qulupnay',
        '2 dona Kivi',
        '1 dona Banan',
        '1 dona Shirin Apelsin',
        '2 osh qoshiq Asal yoki Yunon yogurti',
        'Yalpiz barglari'
      ],
      steps: [
        'Barcha mevalarni toza yuvib, po‘stini arching.',
        'Mevalarni bir xil o‘lchamdagi chiroyli bo‘laklarga bo‘ling.',
        'Shisha salat idishiga barcha mevalarni ehtiyotkorlik bilan soling.',
        'Ustidan tabiiy asal yoki qalin yogurt quying.',
        'Yalpiz barglari bilan bezatib darhol dasturxonga torting.'
      ],
      tip: 'Bananlar qorayib qolmasligi uchun unga bir oz yangi siqilgan apelsin yoki limon sharbati seping.',
      gameMatchId: 'fruit_salad'
    },
    {
      id: 'rc_pizza',
      title: 'Qarsildoq Margarita Pitsasi',
      emoji: '🍕',
      type: 'snack',
      typeName: 'Pitsa & Fastfood',
      time: '35 daqiqa',
      diff: 'O\'rtacha',
      desc: 'Haqiqiy italyancha yupqa qarsildoq xamir, boy pomidor sousi va eruvchan motsarella pishlog‘i.',
      ingredients: [
        '250g Pitsa uni',
        '150ml Iliq suv',
        '1 choy qoshiq Xamirturush',
        '1 osh qoshiq Zaytun moyi',
        '100g Pomidor sousi (marinara)',
        '150g Motsarella pishlog‘i',
        'Yangi Rayhon (bazilik) barglari'
      ],
      steps: [
        'Suv, xamirturush va unni aralashtirib elastik xamir qoring va 30 daqiqa tindiring.',
        'Xamirni yupqa qilib doira shaklida qo‘lda yoying.',
        'Yuzasiga pomidor sousini bir tekis surting.',
        'Motsarella pishlog‘ini parchalab ustiga seping.',
        '220°C eng qizigan pechda 10-12 daqiqa qarsildoq bo‘lguncha pishiring.',
        'Pechdan olingach ustiga yangi rayhon barglarini qo‘ying.'
      ],
      tip: 'Pitsa pastki qismi yumshab qolmasligi uchun uni pechning eng quyi qismida pishiring.',
      gameMatchId: 'make_pizza'
    },
    {
      id: 'rc_sandwich',
      title: 'Klub Sendvichi',
      emoji: '🥪',
      type: 'snack',
      typeName: 'Pitsa & Fastfood',
      time: '15 daqiqa',
      diff: 'Oson',
      desc: 'Qovurilgan tost nonlari orasida suvli pomidor, qarsildoq salat bargi, tovuq go‘shti va pishloq.',
      ingredients: [
        '3 bo‘lak Tost noni',
        '2 bo‘lak Pishloq (Chedder)',
        '50g Pishirilgan tovuq filesi',
        '1 dona Pomidor',
        '2 dona Yangi aysberg salat bargi',
        '1 osh qoshiq Shirin xantal va mayonez sousi'
      ],
      steps: [
        'Tost nonlarini tosterda yoki quruq tovada oltin rangga kirguncha qizartiring.',
        'Birinchi nonga sous surtib, salat bargi va pomidor qo‘ying.',
        'Ikkinchi nonni qo‘yib, ustiga tovuq go‘shti va pishloq joylang.',
        'Uchinchi non bilan yopib, uchburchak shaklida ikkiga bo‘ling.',
        'Zaytun sanchilgan yog‘och tayoqcha bilan mahkamlang.'
      ],
      tip: 'Sendvich qarsillab turishi uchun pomidor bo‘laklarini oldin qog‘oz sochiq ustida quritib oling.',
      gameMatchId: 'sandwich_maker'
    },
    {
      id: 'rc_cookies',
      title: 'Shokoladli Pechenye (Cookies)',
      emoji: '🍪',
      type: 'dessert',
      typeName: 'Shirinlik',
      time: '20 daqiqa',
      diff: 'Oson',
      desc: 'Amerikancha uslubdagi chetlari qarsildoq, ichi esa yumshoq eruvchan shokolad donachali pechenye.',
      ingredients: [
        '180g Un',
        '100g Sariyog\'',
        '80g Jigarrang shakar',
        '1 dona Tuxum',
        '1 choy qoshiq Vanil ekstrakti',
        '1/2 choy qoshiq Iste\'mol sodasi',
        '120g Shokolad tomchilari'
      ],
      steps: [
        'Eritilgan sariyog\'ni shakar bilan yaxshilab aralashtiring.',
        'Tuxum va vanil qo‘shib silliq massa hosil qiling.',
        'Un va sodani qo‘shib, xamir qoring, so‘ngra shokolad tomchilarini aralashtiring.',
        'Dumaloq koptokchalar yasab, oralarini ochiq qoldirib listga tering.',
        '180°C pechda 10-12 daqiqa chetlari qizarguncha pishiring.'
      ],
      tip: 'Pechenyelar ichi yumshoq bo‘lishi uchun ularni pechda uzoq ushlab quritib yubormang.',
      gameMatchId: 'kitchen_shapes'
    },
    {
      id: 'rc_pancakes',
      title: 'Yumshoq Pankeyklar',
      emoji: '🥞',
      type: 'breakfast',
      typeName: 'Nonushta',
      time: '20 daqiqa',
      diff: 'Oson',
      desc: 'Tonggi nonushta uchun eng ajoyib, bulutdek yumshoq, asal va rezavor mevalar bilan tortiladigan quymoqlar.',
      ingredients: [
        '200g Un',
        '250ml Sut',
        '1 dona Tuxum',
        '2 osh qoshiq Shakar',
        '1 choy qoshiq Qabartma',
        '30g Eritilgan sariyog\'',
        'Asal va rezavor mevalar'
      ],
      steps: [
        'Quruq masalliqlar (un, shakar, qabartma)ni bir idishda aralashtiring.',
        'Sut, tuxum va eritilgan sariyog‘ni alohida idishda ko‘pirtiring.',
        'Ikki massani birlashtirib, pufakchali xamir hosil qiling.',
        'Qizigan quruq tovaga cho‘michda quyib, pufakchalar chiqqanda ikkinchi tomoniga o‘giring.',
        'Ustma-ust terib, asal va mevalar bilan dasturxonga torting.'
      ],
      tip: 'Xamirni juda ko‘p aralashtirib yubormang, aks holda pankeyklar qattiq bo‘lib qolishi mumkin.',
      gameMatchId: 'restaurant_kitchen'
    },
    {
      id: 'rc_smoothie',
      title: 'Tropik Smuzi',
      emoji: '🍹',
      type: 'drink',
      typeName: 'Ichimlik',
      time: '10 daqiqa',
      diff: 'Juda Oson',
      desc: 'Mango, banan, chia urug‘lari va kokos suti bilan tayyorlangan salomatlik va go‘zallik eliksiri.',
      ingredients: [
        '1 dona Pishgan Mango',
        '1 dona Muzlatilgan Banan',
        '150ml Kokos yoki Bodom suti',
        '1 osh qoshiq Chia urug‘i',
        '1 osh qoshiq Tabiiy asal',
        'Muz bo‘laklari'
      ],
      steps: [
        'Mangoni tozalab bo‘laklang.',
        'Blender idishiga barcha mevalarni, chia urug‘i va sutni quying.',
        'Maksimal tezlikda 1 daqiqa kremsimon bo‘lguncha maydalang.',
        'Baland stakanga quyib, kokos qirindisi va meva bo‘laklari bilan bezating.'
      ],
      tip: 'Muzlatilgan banan smuziga xuddi muzqaymoq kabi mayin va qalin tekstura beradi.',
      gameMatchId: 'smoothie_master'
    },
    {
      id: 'rc_lava_cake',
      title: 'Shokoladli Fondon (Lava Cake)',
      emoji: '🍫',
      type: 'dessert',
      typeName: 'Shirinlik',
      time: '25 daqiqa',
      diff: 'O\'rtacha',
      desc: 'Ustki qismi pishgan pirojnoe, ichidan esa issiq shokoladli lava oqib chiqadigan restoronona desert.',
      ingredients: [
        '100g Qora achchiq shokolad',
        '80g Sariyog\'',
        '2 dona Tuxum + 1 dona Tuxum sarig\'i',
        '50g Shakar',
        '35g Un',
        'Vanil muzqaymog‘i'
      ],
      steps: [
        'Shokolad va sariyog‘ni suv hammomida birga eriting.',
        'Tuxumlar va shakarni mikserda yengil ko‘pirtiring.',
        'Eritilgan iliq shokoladni tuxumli massaga qo‘shing.',
        'Elangan unni solib bir xil bo‘lguncha qorishtiring.',
        'Sariyog‘ surtilgan qolipchalarga quyib, 200°C da aniq 8-9 daqiqa pishiring.',
        'Qolipdan chiqarib issiq holda muzqaymoq bilan torting.'
      ],
      tip: 'Pishirish vaqtiga qat\'iy amal qiling! 1 daqiqa ko‘p tursa, ichidagi suyuq lava pishib ketadi.',
      gameMatchId: 'food_styling_studio'
    },
    {
      id: 'rc_pasta',
      title: 'Qaymoqli Italiyancha Pasta',
      emoji: '🍝',
      type: 'snack',
      typeName: 'Pitsa & Fastfood',
      time: '25 daqiqa',
      diff: 'O\'rtacha',
      desc: 'Al dente pishirilgan pasta, sarimsoqli xushbo‘y qaymoq va parmezan pishlog‘i sousi.',
      ingredients: [
        '250g Fettuchine yoki Penne pastasi',
        '200ml Quyuq qaymoq (20-30%)',
        '2 tish Sarimsoq',
        '30g Sariyog\'',
        '50g Qirilgan Parmezan pishlog‘i',
        'Yangi tuyilgan qora murch va maydanoz'
      ],
      steps: [
        'Pastani mo‘l tuzli suvda qadoqdagi vaqtdan 1 daqiqa kamroq (al dente) qaynatib oling.',
        'Tovada sariyog‘ni eritib, maydalangan sarimsoqni 30 soniya qovuring.',
        'Qaymoqni quyib, past olovda 3 daqiqa qaynatib quyultiring.',
        'Pishgan pastani sousga solib, parmezan pishlog‘i bilan aralashtiring.',
        'Ustiga qora murch va yangi maydanoz seping.'
      ],
      tip: 'Sous silliq bo‘lishi uchun pastadan qolgan qaynoq suvdan 2-3 qoshiq sousga qo‘shing.',
      gameMatchId: 'recipe_challenge'
    },
    {
      id: 'rc_donuts',
      title: 'Pushti Glazurlangan Donutlar',
      emoji: '🍩',
      type: 'dessert',
      typeName: 'Shirinlik',
      time: '40 daqiqa',
      diff: 'O\'rtacha',
      desc: 'Havo kabi yengil, oltin rangda qovurilgan va pushti qulupnayli shakarli glazur bilan qoplangan pontchiklar.',
      ingredients: [
        '300g Un',
        '120ml Iliq sut',
        '1 dona Tuxum',
        '40g Sariyog\'',
        '40g Shakar',
        '1 choy qoshiq Xamirturush',
        'Pushti shakarli glazur va rangli sepilmalar'
      ],
      steps: [
        'Sut, shakar va xamirturushdan oparani qorib 15 daqiqa qoldiring.',
        'Un, tuxum va sariyog‘ qo‘shib yumshoq xamir qoring va 40 daqiqa ko‘partiring.',
        'Xamirni 1 sm qalinlikda yoyib, halqa shakllari kesib oling.',
        'O‘rtacha qizigan o‘simlik yog‘ida har ikki tomonini 2 daqiqadan qovuring.',
        'Sovigan pontchiklarni pushti glazurga botirib, rangli donachalar bilan bezating.'
      ],
      tip: 'Yog‘ juda qizib ketmasin, aks holda pontchik sirti kuyib, ichi xom bo‘lib qolishi mumkin.',
      gameMatchId: 'bakery_manager'
    }
  ];

  const ACHIEVEMENTS_LIST = [
    {
      id: 'first_cooking',
      title: 'First Cooking',
      icon: '🥄',
      desc: 'Birinchi pazandachilik o‘yiningizni muvaffaqiyatli yakunlang.',
      reward: 30
    },
    {
      id: 'fruit_lover',
      title: 'Fruit Lover',
      icon: '🍓',
      desc: 'Mevali salat yoki meva saralash o‘yinlarida 3 marta g‘olib bo‘ling.',
      reward: 50
    },
    {
      id: 'cupcake_artist',
      title: 'Cupcake Artist',
      icon: '🧁',
      desc: 'Cupcake Bakery o‘yinida o‘ziga xos desert yarating.',
      reward: 50
    },
    {
      id: 'pizza_master',
      title: 'Pizza Master',
      icon: '🍕',
      desc: 'Tosh pechda mukammal pitsa tayyorlab yuqori ball to‘plang.',
      reward: 60
    },
    {
      id: 'cake_designer',
      title: 'Cake Designer',
      icon: '🎂',
      desc: 'Hashamatli ko‘p qavatli bayram tortini loyihalashtiring.',
      reward: 70
    },
    {
      id: 'master_chef',
      title: 'Master Chef',
      icon: '👩🍳',
      desc: 'Master Chef toifasidagi professional o‘yinni bajaring.',
      reward: 100
    },
    {
      id: 'speed_baker',
      title: 'Speed Baker',
      icon: '⚡',
      desc: 'Restoran oshxonasida tezkor buyurtmalarni o‘z vaqtida topshiring.',
      reward: 80
    },
    {
      id: 'recipe_explorer',
      title: 'Recipe Explorer',
      icon: '📖',
      desc: 'Retseptlar kitobidan kamida 3 ta retseptni o‘rganib chiqing.',
      reward: 40
    },
    {
      id: 'smoothie_guru',
      title: 'Smoothie Guru',
      icon: '🍹',
      desc: 'Superfoodlar va mevalar bilan sehrli smuzini blend qiling.',
      reward: 50
    },
    {
      id: 'bakery_tycoon',
      title: 'Bakery Tycoon',
      icon: '🥐',
      desc: 'Shirinlik do‘konida barcha xaridorlarga xizmat ko‘rsating.',
      reward: 80
    }
  ];

  /* ==========================================================================
     5. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message, type = 'info', icon = '✨') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  /* ==========================================================================
     6. ACHIEVEMENT UNLOCK SYSTEM
     ========================================================================== */
  function unlockAchievement(achievementId) {
    if (!appState.unlockedAchievements.includes(achievementId)) {
      appState.unlockedAchievements.push(achievementId);
      const ach = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
      if (ach) {
        appState.score += ach.reward;
        saveState();
        renderHeaderStats();
        sound.playWinFanfare();
        confetti.burst(window.innerWidth / 2, window.innerHeight / 3, 100);
        showToast(`Yutuq ochildi: ${ach.title}! (+${ach.reward} ball)`, 'reward', ach.icon);
        renderAchievements();
        renderKitchenStats();
      }
    }
  }

  /* ==========================================================================
     7. APP NAVIGATION & SCREEN MANAGER
     ========================================================================== */
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    username: document.getElementById('screen-username'),
    dashboard: document.getElementById('screen-dashboard')
  };

  let selectedAgeGroup = 'junior';
  let selectedAvatar = '👩🍳';

  function switchScreen(screenName) {
    Object.values(screens).forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (screens[screenName]) {
      screens[screenName].classList.add('active');
      window.scrollTo(0, 0);
    }
  }

  function switchView(viewName) {
    const views = document.querySelectorAll('.dashboard-view');
    views.forEach(v => v.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) targetView.classList.add('active');

    const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
    navLinks.forEach(link => {
      if (link.dataset.view === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ==========================================================================
     8. UI RENDERERS (Cards, Stats, Profile, Greetings)
     ========================================================================== */
  function renderHeaderStats() {
    const scoreVal = document.getElementById('nav-score-display');
    const userName = document.getElementById('nav-user-name');
    const userAvatar = document.getElementById('nav-user-avatar');

    if (scoreVal) scoreVal.textContent = appState.score;
    if (userName) userName.textContent = appState.username || 'Malika';
    if (userAvatar) userAvatar.textContent = appState.avatar || '👩🍳';

    // Mobile drawer info
    const drawerName = document.getElementById('drawer-user-name');
    const drawerRole = document.getElementById('drawer-user-role');
    const drawerAvatar = document.getElementById('drawer-user-avatar');
    if (drawerName) drawerName.textContent = appState.username || 'Malika';
    if (drawerRole) drawerRole.textContent = CATEGORIES[appState.ageCategory]?.title || 'Junior Chef';
    if (drawerAvatar) drawerAvatar.textContent = appState.avatar || '👩🍳';
  }

  function renderHeroGreetings() {
    const heroName = document.getElementById('hero-username');
    const heroBadgeText = document.getElementById('hero-badge-text');
    const heroBadgeIcon = document.getElementById('hero-badge-icon');
    const heroQuote = document.getElementById('hero-dynamic-quote');

    const name = appState.username || 'Malika';
    const cat = CATEGORIES[appState.ageCategory] || CATEGORIES.junior;

    if (heroName) heroName.textContent = name;
    if (heroBadgeText) heroBadgeText.textContent = `${cat.title} oshxonasi`;
    if (heroBadgeIcon) heroBadgeIcon.textContent = cat.icon;

    if (heroQuote) {
      const randQuote = DYNAMIC_GREETINGS[Math.floor(Math.random() * DYNAMIC_GREETINGS.length)];
      heroQuote.textContent = `"${name}, ${randQuote}"`;
    }
  }

  function renderFeaturedGames(filterMode = 'recommended') {
    const container = document.getElementById('home-featured-games-grid');
    if (!container) return;

    let games = [];
    if (filterMode === 'recommended') {
      games = GAMES_CATALOG.filter(g => g.category === appState.ageCategory);
      if (games.length === 0) games = GAMES_CATALOG.slice(0, 4);
    } else {
      games = GAMES_CATALOG.slice(0, 6);
    }

    container.innerHTML = games.map(game => createGameCardHTML(game)).join('');
    attachGameCardEvents(container);
  }

  function renderCatalogGames(categoryFilter = 'all', searchQuery = '') {
    const container = document.getElementById('catalog-games-grid');
    if (!container) return;

    let games = GAMES_CATALOG;

    if (categoryFilter !== 'all') {
      games = games.filter(g => g.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      games = games.filter(g => g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q));
    }

    if (games.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon">🔍🧁</div>
          <h3>Hech qanday o‘yin topilmadi</h3>
          <p>Boshqa qidiruv so‘zini kiriting yoki filtrni tozalang.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = games.map(game => createGameCardHTML(game)).join('');
    attachGameCardEvents(container);
  }

  function createGameCardHTML(game) {
    return `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-card-banner ${game.bannerClass}">
          <span class="game-age-tag">${game.ageLabel}</span>
          <span class="game-diff-tag ${game.diffClass}">${game.diff}</span>
          <span class="game-card-emoji">${game.emoji}</span>
        </div>
        <div class="game-card-body">
          <h3 class="game-card-title">${game.title}</h3>
          <p class="game-card-desc">${game.desc}</p>
          <div class="game-card-footer">
            <span class="game-rating">${game.rating}</span>
            <button class="btn-play-game" data-game-id="${game.id}">
              <span>O‘ynash</span>
              <i class="fa-solid fa-play"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function attachGameCardEvents(parentContainer) {
    const buttons = parentContainer.querySelectorAll('.btn-play-game, .game-card');
    buttons.forEach(el => {
      el.addEventListener('click', (e) => {
        const gameId = el.dataset.gameId || el.closest('.game-card')?.dataset.gameId;
        if (gameId) {
          sound.playClick();
          launchGame(gameId);
        }
      });
    });
  }

  function renderRecipes(filterType = 'all', searchQuery = '') {
    const container = document.getElementById('recipes-catalog-grid');
    if (!container) return;

    let recipes = RECIPES_CATALOG;

    if (filterType !== 'all') {
      recipes = recipes.filter(r => r.type === filterType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      recipes = recipes.filter(r => r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
    }

    container.innerHTML = recipes.map(recipe => `
      <div class="recipe-card" data-recipe-id="${recipe.id}">
        <div class="recipe-card-img-wrap">
          <span class="recipe-card-badge">${recipe.typeName}</span>
          <span class="recipe-card-emoji">${recipe.emoji}</span>
        </div>
        <div class="recipe-card-body">
          <h3 class="recipe-card-title">${recipe.title}</h3>
          <p class="recipe-card-desc">${recipe.desc}</p>
          <div class="recipe-meta-row">
            <span><i class="fa-regular fa-clock"></i> ${recipe.time}</span>
            <span><i class="fa-solid fa-chart-simple"></i> ${recipe.diff}</span>
          </div>
          <button class="btn-view-recipe">
            <i class="fa-solid fa-book-open"></i> Retseptni ko‘rish
          </button>
        </div>
      </div>
    `).join('');

    const cards = container.querySelectorAll('.recipe-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const rid = card.dataset.recipeId;
        sound.playClick();
        openRecipeModal(rid);
      });
    });
  }

  function renderAchievements() {
    const container = document.getElementById('achievements-list-grid');
    const label = document.getElementById('achievements-progress-label');
    if (!container) return;

    const unlockedCount = appState.unlockedAchievements.length;
    if (label) label.textContent = `${unlockedCount} / ${ACHIEVEMENTS_LIST.length}`;

    container.innerHTML = ACHIEVEMENTS_LIST.map(ach => {
      const isUnlocked = appState.unlockedAchievements.includes(ach.id);
      return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="ach-icon-box">${ach.icon}</div>
          <div class="ach-info">
            <h4 class="ach-title">${ach.title}</h4>
            <p class="ach-desc">${ach.desc}</p>
            <span class="ach-reward-pill"><i class="fa-solid fa-star"></i> +${ach.reward} ball</span>
          </div>
          <div class="ach-status-badge ${isUnlocked ? 'unlocked' : 'locked'}">
            <i class="fa-solid ${isUnlocked ? 'fa-circle-check' : 'fa-lock'}"></i>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderKitchenStats() {
    const avatar = document.getElementById('kitchen-user-avatar');
    const badge = document.getElementById('kitchen-category-badge');
    const name = document.getElementById('kitchen-display-name');

    const score = document.getElementById('stat-total-score');
    const games = document.getElementById('stat-games-played');
    const dishes = document.getElementById('stat-dishes-cooked');
    const achs = document.getElementById('stat-achievements-unlocked');
    const best = document.getElementById('stat-best-score');

    const cat = CATEGORIES[appState.ageCategory] || CATEGORIES.junior;

    if (avatar) avatar.textContent = appState.avatar || '👩🍳';
    if (badge) badge.textContent = `${cat.title} (${cat.range})`;
    if (name) name.textContent = appState.username || 'Malika';

    if (score) score.textContent = appState.score;
    if (games) games.textContent = appState.gamesPlayed;
    if (dishes) dishes.textContent = appState.dishesCooked;
    if (achs) achs.textContent = `${appState.unlockedAchievements.length}/${ACHIEVEMENTS_LIST.length}`;
    if (best) best.textContent = appState.bestScore;

    // Rank calculation
    const rankTitle = document.getElementById('kitchen-rank-title');
    const rankFill = document.getElementById('kitchen-rank-fill');
    const rankStatus = document.getElementById('kitchen-rank-status');

    let rank = 'Yangi Oshpaz Qiz';
    let progress = Math.min(100, Math.floor((appState.score / 500) * 100));

    if (appState.score >= 500) { rank = 'Oltin Oshpaz Qiz 👑'; progress = 100; }
    else if (appState.score >= 250) { rank = 'Mohir Qandolatchi 🍰'; }
    else if (appState.score >= 100) { rank = 'Ijodkor Pazanda 🍓'; }

    if (rankTitle) rankTitle.textContent = rank;
    if (rankFill) rankFill.style.width = `${progress}%`;
    if (rankStatus) rankStatus.textContent = appState.score >= 500 ? 'Maksimal daraja erishildi!' : `Keyingi unvongacha: ${Math.max(0, 500 - appState.score)} ball`;

    // Trophies row
    const trophyRow = document.getElementById('kitchen-trophies-row');
    if (trophyRow) {
      trophyRow.innerHTML = ACHIEVEMENTS_LIST.slice(0, 6).map(ach => {
        const isUnlocked = appState.unlockedAchievements.includes(ach.id);
        return `
          <div class="trophy-badge-item ${isUnlocked ? 'unlocked' : 'locked'}">
            <span class="trophy-badge-emoji">${ach.icon}</span>
            <span class="trophy-badge-name">${ach.title}</span>
            <span class="trophy-badge-status">${isUnlocked ? '✅ Ochilgan' : '🔒 Qulflangan'}</span>
          </div>
        `;
      }).join('');
    }

    renderSavedRecipes();
  }

  function renderSavedRecipes() {
    const container = document.getElementById('kitchen-saved-recipes-grid');
    if (!container) return;

    if (!appState.savedRecipes || appState.savedRecipes.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon">📝✨</div>
          <h3>Hozircha saqlangan maxsus retseptlar yo‘q</h3>
          <p>O‘zingizning birinchi mualliflik retseptingizni yarating va shaxsiy oshxona kitobingizni boyiting!</p>
          <button class="btn-accent" id="btn-empty-create-recipe">
            <i class="fa-solid fa-plus"></i> Retsept Yaratish
          </button>
        </div>
      `;
      const btn = document.getElementById('btn-empty-create-recipe');
      if (btn) {
        btn.addEventListener('click', () => openRecipeCreatorModal());
      }
      return;
    }

    container.innerHTML = appState.savedRecipes.map((r, idx) => `
      <div class="recipe-card" data-custom-idx="${idx}">
        <div class="recipe-card-img-wrap">
          <span class="recipe-card-badge">Mualliflik</span>
          <span class="recipe-card-emoji">${r.emoji || '🍰'}</span>
        </div>
        <div class="recipe-card-body">
          <h3 class="recipe-card-title">${r.name}</h3>
          <p class="recipe-card-desc">${r.desc || 'Shaxsiy maxsus retsept'}</p>
          <div class="recipe-meta-row">
            <span><i class="fa-regular fa-clock"></i> ${r.time || '20 daqiqa'}</span>
            <span><i class="fa-solid fa-chart-simple"></i> ${r.diff || 'Oson'}</span>
          </div>
          <button class="btn-view-recipe btn-view-custom" data-custom-idx="${idx}">
            <i class="fa-solid fa-book-open"></i> O‘qish
          </button>
        </div>
      </div>
    `).join('');

    const viewBtns = container.querySelectorAll('.btn-view-custom');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.customIdx;
        const custom = appState.savedRecipes[idx];
        if (custom) {
          openCustomRecipeModal(custom);
        }
      });
    });
  }

  /* ==========================================================================
     9. DAILY COOKING CHALLENGE
     ========================================================================== */
  const DAILY_CHALLENGES = {
    little: { title: 'Bugun 5 ta mevani savatga joyla!', icon: '🍎', desc: 'Fruit Basket o‘yiniga kirib barcha mevalarni ranglariga mos savatga ajrat!', gameId: 'fruit_basket' },
    junior: { title: 'Bugun mazali pitsa tayyorla!', icon: '🍕', desc: 'Make Your Pizza o‘yinida yangi masalliqlar bilan qarsildoq pitsa pishir!', gameId: 'make_pizza' },
    creative: { title: 'Bugun 3 qavatli bayram tortini loyihala!', icon: '🎂', desc: 'Cake Designer studiyasida eng chiroyli ranglar bilan tort bezat!', gameId: 'cake_designer' },
    master: { title: 'Bugun Michelin uslubida taom bezat!', icon: '📸', desc: 'Food Styling Studio o‘yinida o‘z pazandachilik asaringni yarat!', gameId: 'food_styling_studio' }
  };

  function updateDailyChallengeBanner() {
    const cat = appState.ageCategory || 'junior';
    const challenge = DAILY_CHALLENGES[cat] || DAILY_CHALLENGES.junior;

    const titleEl = document.getElementById('daily-challenge-title');
    const descEl = document.getElementById('daily-challenge-desc');
    const iconEl = document.getElementById('daily-challenge-icon');
    const btnPlay = document.getElementById('btn-play-daily');

    if (titleEl) titleEl.textContent = challenge.title;
    if (descEl) descEl.textContent = challenge.desc;
    if (iconEl) iconEl.textContent = challenge.icon;

    const todayStr = new Date().toISOString().slice(0, 10);
    const isClaimed = appState.lastDailyClaimDate === todayStr;

    if (btnPlay) {
      if (isClaimed) {
        btnPlay.innerHTML = '<i class="fa-solid fa-check"></i> ✅ Bajarildi (+100 ball)';
        btnPlay.disabled = true;
        btnPlay.style.opacity = '0.7';
      } else {
        btnPlay.innerHTML = '<i class="fa-solid fa-play"></i> Bajarish';
        btnPlay.disabled = false;
        btnPlay.style.opacity = '1';
        btnPlay.onclick = () => {
          sound.playClick();
          launchGame(challenge.gameId);
        };
      }
    }
  }

  function completeDailyChallenge() {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (appState.lastDailyClaimDate !== todayStr) {
      appState.lastDailyClaimDate = todayStr;
      appState.score += 100;
      saveState();
      renderHeaderStats();
      updateDailyChallengeBanner();
      confetti.burst(window.innerWidth / 2, window.innerHeight / 3, 120);
      showToast('Kunlik Challenge bajarildi! +100 ball qo‘shildi! 🎉', 'reward', '⭐');
    }
  }

  /* ==========================================================================
     10. RECIPE MODALS & DETAIL POPUPS
     ========================================================================== */
  const recipeModal = document.getElementById('modal-recipe-detail');

  function openRecipeModal(recipeId) {
    const recipe = RECIPES_CATALOG.find(r => r.id === recipeId);
    if (!recipe || !recipeModal) return;

    unlockAchievement('recipe_explorer');

    document.getElementById('rm-emoji').textContent = recipe.emoji;
    document.getElementById('rm-title').textContent = recipe.title;
    document.getElementById('rm-type').textContent = recipe.typeName;
    document.getElementById('rm-time').innerHTML = `<i class="fa-regular fa-clock"></i> ${recipe.time}`;
    document.getElementById('rm-diff').textContent = recipe.diff;
    document.getElementById('rm-desc').textContent = recipe.desc;
    document.getElementById('rm-tip').textContent = recipe.tip;

    const ingList = document.getElementById('rm-ingredients-list');
    ingList.innerHTML = recipe.ingredients.map(ing => `
      <li class="ing-item"><i class="fa-regular fa-square-check text-pink"></i> ${ing}</li>
    `).join('');

    const stepsList = document.getElementById('rm-steps-list');
    stepsList.innerHTML = recipe.steps.map(step => `
      <li>${step}</li>
    `).join('');

    // Toggle checklist items
    ingList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        sound.playClick();
        li.classList.toggle('checked');
      });
    });

    // Cook in game action
    const btnCook = document.getElementById('rm-btn-cook-in-game');
    btnCook.onclick = () => {
      recipeModal.classList.remove('active');
      launchGame(recipe.gameMatchId || 'make_pizza');
    };

    recipeModal.classList.add('active');
  }

  function openCustomRecipeModal(custom) {
    if (!recipeModal) return;

    document.getElementById('rm-emoji').textContent = custom.emoji || '📝';
    document.getElementById('rm-title').textContent = custom.name;
    document.getElementById('rm-type').textContent = 'Mualliflik Retsepti';
    document.getElementById('rm-time').innerHTML = `<i class="fa-regular fa-clock"></i> ${custom.time || '30 daqiqa'}`;
    document.getElementById('rm-diff').textContent = custom.diff || 'O\'rtacha';
    document.getElementById('rm-desc').textContent = custom.desc || 'Shaxsiy oshxona durdonasi.';
    document.getElementById('rm-tip').textContent = custom.tip || 'Sevish va ehtirom bilan pishiring!';

    const ingList = document.getElementById('rm-ingredients-list');
    ingList.innerHTML = (custom.ingredients || []).map(ing => `
      <li class="ing-item"><i class="fa-regular fa-square-check text-pink"></i> ${ing}</li>
    `).join('');

    const stepsList = document.getElementById('rm-steps-list');
    stepsList.innerHTML = (custom.steps || []).map(step => `
      <li>${step}</li>
    `).join('');

    const btnCook = document.getElementById('rm-btn-cook-in-game');
    btnCook.onclick = () => {
      recipeModal.classList.remove('active');
      launchGame('cake_designer');
    };

    recipeModal.classList.add('active');
  }

  /* ==========================================================================
     11. RECIPE CREATOR STUDIO MODAL
     ========================================================================== */
  const creatorModal = document.getElementById('modal-recipe-creator');

  function openRecipeCreatorModal() {
    if (!creatorModal) return;
    creatorModal.classList.add('active');
  }

  function initRecipeCreator() {
    const addIngBtn = document.getElementById('btn-add-ingredient-row');
    const ingList = document.getElementById('rc-ingredients-list');
    const addStepBtn = document.getElementById('btn-add-step-row');
    const stepList = document.getElementById('rc-steps-list');
    const form = document.getElementById('form-recipe-creator');

    if (addIngBtn && ingList) {
      addIngBtn.addEventListener('click', () => {
        sound.playClick();
        const row = document.createElement('div');
        row.className = 'dynamic-row';
        row.innerHTML = `
          <input type="text" class="input-field rc-ing-input" placeholder="Yangi ingredient..." required />
          <button type="button" class="btn-remove-row" title="O‘chirish"><i class="fa-solid fa-trash-can"></i></button>
        `;
        ingList.appendChild(row);
        row.querySelector('.btn-remove-row').onclick = () => row.remove();
      });
    }

    if (addStepBtn && stepList) {
      addStepBtn.addEventListener('click', () => {
        sound.playClick();
        const count = stepList.children.length + 1;
        const row = document.createElement('div');
        row.className = 'dynamic-row';
        row.innerHTML = `
          <input type="text" class="input-field rc-step-input" placeholder="${count}-bosqich..." required />
          <button type="button" class="btn-remove-row" title="O‘chirish"><i class="fa-solid fa-trash-can"></i></button>
        `;
        stepList.appendChild(row);
        row.querySelector('.btn-remove-row').onclick = () => row.remove();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('rc-name').value.trim();
        const category = document.getElementById('rc-category').value;
        const time = document.getElementById('rc-time').value.trim() || '25 daqiqa';
        const diff = document.getElementById('rc-diff').value;
        const emoji = document.getElementById('rc-emoji').value;
        const desc = document.getElementById('rc-desc').value.trim();
        const tip = document.getElementById('rc-tip').value.trim() || 'Haroratni to‘g‘ri saqlang!';

        const ingInputs = form.querySelectorAll('.rc-ing-input');
        const ingredients = Array.from(ingInputs).map(inp => inp.value.trim()).filter(Boolean);

        const stepInputs = form.querySelectorAll('.rc-step-input');
        const steps = Array.from(stepInputs).map(inp => inp.value.trim()).filter(Boolean);

        if (!name || ingredients.length === 0 || steps.length === 0) {
          showToast('Iltimos, retsept nomi, kamida bitta ingredient va bosqich kiriting!', 'info');
          return;
        }

        const newRecipe = {
          name, category, time, diff, emoji, desc, tip, ingredients, steps,
          createdAt: new Date().toLocaleDateString('uz-UZ')
        };

        appState.savedRecipes.unshift(newRecipe);
        appState.score += 50;
        saveState();

        sound.playSuccess();
        confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
        showToast('Ajoyib! Retsept saqlandi va 50 ball qo‘shildi! 🎉', 'reward', '📝');

        form.reset();
        creatorModal.classList.remove('active');
        renderKitchenStats();
        renderHeaderStats();
      });
    }
  }

  /* ==========================================================================
     12. SETTINGS & CONFIRMATION MODALS
     ========================================================================== */
  const settingsModal = document.getElementById('modal-settings');
  const confirmModal = document.getElementById('modal-confirm');

  function openSettingsModal() {
    if (!settingsModal) return;

    const soundToggle = document.getElementById('setting-sound-toggle');
    const bgmToggle = document.getElementById('setting-bgm-toggle');
    const themeToggle = document.getElementById('setting-theme-toggle');
    const currentName = document.getElementById('setting-current-username');
    const currentCat = document.getElementById('setting-current-category');

    if (soundToggle) soundToggle.checked = appState.soundEnabled;
    if (bgmToggle) bgmToggle.checked = appState.bgmEnabled;
    if (themeToggle) themeToggle.checked = appState.theme === 'dark';
    if (currentName) currentName.textContent = appState.username || 'Malika';
    if (currentCat) currentCat.textContent = CATEGORIES[appState.ageCategory]?.title || 'Junior Chef';

    settingsModal.classList.add('active');
  }

  function initSettingsListeners() {
    const soundToggle = document.getElementById('setting-sound-toggle');
    const bgmToggle = document.getElementById('setting-bgm-toggle');
    const themeToggle = document.getElementById('setting-theme-toggle');

    if (soundToggle) {
      soundToggle.addEventListener('change', () => {
        appState.soundEnabled = soundToggle.checked;
        sound.soundEnabled = appState.soundEnabled;
        saveState();
        updateSoundButtonIcons();
      });
    }

    if (bgmToggle) {
      bgmToggle.addEventListener('change', () => {
        appState.bgmEnabled = bgmToggle.checked;
        saveState();
        if (appState.bgmEnabled) sound.startAmbientBgm();
        else sound.stopAmbientBgm();
        updateBgmButtonIcons();
      });
    }

    if (themeToggle) {
      themeToggle.addEventListener('change', () => {
        appState.theme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(appState.theme);
        saveState();
      });
    }

    const btnChangeName = document.getElementById('setting-btn-change-name');
    if (btnChangeName) {
      btnChangeName.addEventListener('click', () => {
        settingsModal.classList.remove('active');
        switchScreen('username');
      });
    }

    const btnSwitchAge = document.getElementById('setting-btn-switch-age');
    if (btnSwitchAge) {
      btnSwitchAge.addEventListener('click', () => {
        settingsModal.classList.remove('active');
        switchScreen('welcome');
      });
    }

    const btnReset = document.getElementById('setting-btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        settingsModal.classList.remove('active');
        openConfirmModal(
          'Haqiqatan ham barcha natijalarni tozalaysizmi?',
          'Barcha ballar, ochilgan yutuqlar va shaxsiy retseptlaringiz qaytarib bo‘lmaydigan tarzda o‘chiriladi.',
          () => {
            localStorage.removeItem(STORAGE_KEY);
            appState = { ...defaultState };
            applyTheme('light');
            sound.stopAmbientBgm();
            switchScreen('welcome');
            showToast('Barcha natijalar tozalandi!', 'info');
          }
        );
      });
    }
  }

  let onConfirmCallback = null;

  function openConfirmModal(title, desc, onConfirm) {
    if (!confirmModal) return;
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-desc').textContent = desc;
    onConfirmCallback = onConfirm;
    confirmModal.classList.add('active');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
  }

  function updateSoundButtonIcons() {
    const btn = document.getElementById('btn-toggle-sound');
    if (btn) {
      btn.innerHTML = appState.soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
      btn.classList.toggle('muted', !appState.soundEnabled);
    }
  }

  function updateBgmButtonIcons() {
    const btn = document.getElementById('btn-toggle-bgm');
    if (btn) {
      btn.innerHTML = appState.bgmEnabled ? '<i class="fa-solid fa-music"></i>' : '<i class="fa-solid fa-music text-muted"></i>';
      btn.classList.toggle('muted', !appState.bgmEnabled);
    }
  }

  /* ==========================================================================
     13. GAME ARENA CONTROLLER & 22 FULLY PLAYABLE GAMES
     ========================================================================== */
  const arenaModal = document.getElementById('modal-game-arena');
  const arenaStage = document.getElementById('arena-game-stage');
  const victoryOverlay = document.getElementById('arena-victory-overlay');

  let currentGameInstance = null;

  function launchGame(gameId) {
    const gameMeta = GAMES_CATALOG.find(g => g.id === gameId);
    if (!gameMeta || !arenaModal || !arenaStage) return;

    sound.playClick();

    document.getElementById('arena-game-title').textContent = gameMeta.title;
    document.getElementById('arena-game-icon').textContent = gameMeta.emoji;
    document.getElementById('arena-game-badge').textContent = `${CATEGORIES[gameMeta.category]?.title || 'Chef'} (${gameMeta.ageLabel})`;
    document.getElementById('arena-current-score').textContent = '0';
    document.getElementById('arena-step-label').textContent = 'O‘yin boshlandi!';

    victoryOverlay.classList.remove('active');
    arenaModal.classList.add('active');

    // Mount game logic
    if (currentGameInstance && typeof currentGameInstance.destroy === 'function') {
      currentGameInstance.destroy();
    }

    currentGameInstance = createGameEngine(gameId, gameMeta);
    if (currentGameInstance && typeof currentGameInstance.init === 'function') {
      currentGameInstance.init();
    }
  }

  function finishGame(earnedPoints = 50, customMessage = '') {
    appState.score += earnedPoints;
    appState.gamesPlayed += 1;
    appState.dishesCooked += 1;
    if (earnedPoints > appState.bestScore) appState.bestScore = earnedPoints;

    saveState();
    renderHeaderStats();
    renderKitchenStats();

    // Check achievements
    unlockAchievement('first_cooking');
    if (currentGameInstance && currentGameInstance.meta.category === 'master') {
      unlockAchievement('master_chef');
    }

    // Daily challenge check
    const currentCatDaily = DAILY_CHALLENGES[appState.ageCategory];
    if (currentCatDaily && currentCatDaily.gameId === currentGameInstance?.meta.id) {
      completeDailyChallenge();
    }

    // Victory celebration
    sound.playWinFanfare();
    confetti.burst(window.innerWidth / 2, window.innerHeight / 3, 150);

    const titleEl = document.getElementById('victory-title-text');
    const descEl = document.getElementById('victory-desc-text');
    const ptsEl = document.getElementById('victory-earned-points');

    const name = appState.username || 'Malika';
    if (titleEl) titleEl.textContent = `Ajoyib, ${name}! Taoming juda chiroyli! 🎉`;
    if (descEl) descEl.textContent = customMessage || `Sen haqiqiy pazandasan, ${name}! Retsept ajoyib tarzda bajarildi!`;
    if (ptsEl) ptsEl.textContent = earnedPoints;

    victoryOverlay.classList.add('active');
  }

  /* ==========================================================================
     14. INDIVIDUAL GAME ENGINES (All 22 Games Implemented)
     ========================================================================== */
  function createGameEngine(gameId, meta) {
    const stage = arenaStage;

    switch (gameId) {
      // ----------------------------------------------------
      // 1. Fruit Basket (3–5 yosh)
      // ----------------------------------------------------
      case 'fruit_basket': {
        const fruits = [
          { name: 'Olma', emoji: '🍎', color: 'red' },
          { name: 'Qulupnay', emoji: '🍓', color: 'red' },
          { name: 'Banan', emoji: '🍌', color: 'yellow' },
          { name: 'Limon', emoji: '🍋', color: 'yellow' },
          { name: 'Uzum', emoji: '🍇', color: 'purple' },
          { name: 'Olxo‘ri', emoji: '🫐', color: 'purple' }
        ];
        let remaining = [...fruits];
        let selectedFruit = null;
        let sortedCount = 0;

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🍎 Mevalarni mos rangdagi savatga joylashtiring! (Meva ustiga bosing, so‘ng savatni tanlang)
                </div>
                <div class="fruit-basket-stage">
                  <div class="fruit-spawn-tray" id="fb-tray">
                    ${remaining.map((f, i) => `
                      <div class="fruit-drag-item ${selectedFruit === i ? 'selected' : ''}" data-idx="${i}">
                        ${f.emoji}
                      </div>
                    `).join('')}
                  </div>
                  <div class="baskets-grid">
                    <div class="basket-drop-target basket-red" data-color="red">
                      <span class="basket-icon">🧺</span>
                      <span class="basket-title">Qizil Savat</span>
                      <span class="basket-count" id="count-red">Qizil mevalar</span>
                    </div>
                    <div class="basket-drop-target basket-yellow" data-color="yellow">
                      <span class="basket-icon">🧺</span>
                      <span class="basket-title">Sariq Savat</span>
                      <span class="basket-count" id="count-yellow">Sariq mevalar</span>
                    </div>
                    <div class="basket-drop-target basket-purple" data-color="purple">
                      <span class="basket-icon">🧺</span>
                      <span class="basket-title">Binafsha Savat</span>
                      <span class="basket-count" id="count-purple">Binafsha mevalar</span>
                    </div>
                  </div>
                </div>
              </div>
            `;

            // Fruit clicks
            stage.querySelectorAll('.fruit-drag-item').forEach(el => {
              el.addEventListener('click', () => {
                sound.playClick();
                selectedFruit = parseInt(el.dataset.idx);
                this.render();
              });
            });

            // Basket clicks
            stage.querySelectorAll('.basket-drop-target').forEach(basket => {
              basket.addEventListener('click', () => {
                if (selectedFruit === null) {
                  showToast('Avval mevani tanlang!', 'info');
                  return;
                }
                const fruit = remaining[selectedFruit];
                const basketColor = basket.dataset.color;

                if (fruit.color === basketColor) {
                  sound.playSuccess();
                  showToast(`Barakalla! ${fruit.emoji} to‘g‘ri savatga tushdi!`, 'success');
                  remaining.splice(selectedFruit, 1);
                  selectedFruit = null;
                  sortedCount++;
                  document.getElementById('arena-current-score').textContent = sortedCount * 10;
                  document.getElementById('arena-step-label').textContent = `Joylashtirildi: ${sortedCount} / 6`;

                  if (remaining.length === 0) {
                    unlockAchievement('fruit_lover');
                    finishGame(60, 'Barcha mevalar to‘g‘ri saralandi! Sen juda zukko Little Chefsan!');
                  } else {
                    this.render();
                  }
                } else {
                  sound.playWrong();
                  showToast(`Bu meva bu savatga mos kelmaydi. Rangiga qara!`, 'info');
                }
              });
            });
          }
        };
      }

      // ----------------------------------------------------
      // 2. Cake Decoration (3–5 yosh)
      // ----------------------------------------------------
      case 'cake_decoration': {
        const toppings = ['🍓', '🍒', '🍦', '🍫', '🍬', '🕯️', '⭐', '🫐'];
        let selectedTopping = '🍓';
        let placedItems = [];
        let cakeColor = '#FFB7C5';

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🎂 Tort ustiga bosib bezaklarni joylang va o‘z bayram tortingizni yarating!
                </div>
                <div class="cake-deco-container">
                  <div class="cake-canvas-plate" id="cake-plate">
                    <div class="cake-base-round" id="cake-base" style="background: ${cakeColor};">
                      ${placedItems.map(item => `
                        <span class="placed-topping" style="left:${item.x}px; top:${item.y}px;">${item.emoji}</span>
                      `).join('')}
                    </div>
                  </div>
                  <div class="cake-toolbox">
                    <h4>Bezakni tanlang:</h4>
                    <div class="toppings-picker-grid">
                      ${toppings.map(t => `
                        <button class="topping-tool-btn ${selectedTopping === t ? 'active' : ''}" data-topping="${t}">${t}</button>
                      `).join('')}
                    </div>
                    <h4>Krem rangi:</h4>
                    <div style="display:flex; gap:8px;">
                      <button class="palette-swatch" style="background:#FFB7C5;" data-color="#FFB7C5"></button>
                      <button class="palette-swatch" style="background:#FFE4B5;" data-color="#FFE4B5"></button>
                      <button class="palette-swatch" style="background:#B8E0D2;" data-color="#B8E0D2"></button>
                      <button class="palette-swatch" style="background:#6B4423;" data-color="#6B4423"></button>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
                      <button class="btn-sm btn-outline" id="btn-clear-cake"><i class="fa-solid fa-trash-can"></i> Tozalash</button>
                      <button class="btn-primary-glow" id="btn-finish-cake"><i class="fa-solid fa-camera"></i> Tayyor!</button>
                    </div>
                  </div>
                </div>
              </div>
            `;

            // Topping selector
            stage.querySelectorAll('.topping-tool-btn').forEach(btn => {
              btn.addEventListener('click', () => {
                sound.playClick();
                selectedTopping = btn.dataset.topping;
                this.render();
              });
            });

            // Color swatch
            stage.querySelectorAll('.palette-swatch').forEach(btn => {
              btn.addEventListener('click', () => {
                sound.playClick();
                cakeColor = btn.dataset.color;
                this.render();
              });
            });

            // Click cake to place topping
            const cakeBase = stage.querySelector('#cake-base');
            if (cakeBase) {
              cakeBase.addEventListener('click', (e) => {
                sound.playClick();
                const rect = cakeBase.getBoundingClientRect();
                const x = e.clientX - rect.left - 16;
                const y = e.clientY - rect.top - 16;
                placedItems.push({ emoji: selectedTopping, x, y });
                document.getElementById('arena-current-score').textContent = placedItems.length * 5;
                this.render();
              });
            }

            // Clear
            stage.querySelector('#btn-clear-cake').onclick = () => {
              placedItems = [];
              this.render();
            };

            // Finish
            stage.querySelector('#btn-finish-cake').onclick = () => {
              if (placedItems.length < 3) {
                showToast('Kamida 3 ta bezak qo‘shing!', 'info');
                return;
              }
              unlockAchievement('cake_designer');
              finishGame(50, 'Ajoyib bayramona tort! Har bir meva va bezak o‘z o‘rnida juda chiroyli turibdi!');
            };
          }
        };
      }

      // ----------------------------------------------------
      // 3. Kitchen Shapes (3–5 yosh)
      // ----------------------------------------------------
      case 'kitchen_shapes': {
        const shapes = [
          { name: 'Doira', icon: '⚪', shapeClass: 'circle' },
          { name: 'Yulduz', icon: '⭐', shapeClass: 'star' },
          { name: 'Yurak', icon: '❤️', shapeClass: 'heart' },
          { name: 'Kvadrat', icon: '⬛', shapeClass: 'square' }
        ];
        let matched = [];
        let selectedShape = null;

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🍪 Pechenyeni tanlang va mos keluvchi shakl qolipiga bosing!
                </div>
                <div class="shapes-game-stage">
                  <div class="shape-cutouts-tray">
                    ${shapes.map(s => `
                      <div class="shape-slot ${matched.includes(s.name) ? 'matched' : ''}" data-name="${s.name}">
                        ${matched.includes(s.name) ? s.icon : s.icon}
                      </div>
                    `).join('')}
                  </div>
                  <div class="cookies-tray">
                    ${shapes.filter(s => !matched.includes(s.name)).map(s => `
                      <div class="shape-cookie ${selectedShape === s.name ? 'selected' : ''}" data-name="${s.name}">
                        ${s.icon}
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('.shape-cookie').forEach(c => {
              c.addEventListener('click', () => {
                sound.playClick();
                selectedShape = c.dataset.name;
                this.render();
              });
            });

            stage.querySelectorAll('.shape-slot').forEach(slot => {
              slot.addEventListener('click', () => {
                if (!selectedShape) {
                  showToast('Avval pechenyeni bosing!', 'info');
                  return;
                }
                if (slot.dataset.name === selectedShape) {
                  sound.playSuccess();
                  matched.push(selectedShape);
                  selectedShape = null;
                  document.getElementById('arena-current-score').textContent = matched.length * 15;
                  document.getElementById('arena-step-label').textContent = `Topildi: ${matched.length} / 4`;

                  if (matched.length === shapes.length) {
                    finishGame(50, 'Qoyilmaqom! Barcha shakllar to‘g‘ri joylashtirildi!');
                  } else {
                    this.render();
                  }
                } else {
                  sound.playWrong();
                  showToast('Shakl mos kelmadi, yana bir bor urinib ko‘ring!', 'info');
                }
              });
            });
          }
        };
      }

      // ----------------------------------------------------
      // 4. Match the Food (3–5 yosh)
      // ----------------------------------------------------
      case 'match_food': {
        const pairs = ['🥛', '🧁', '🍎', '🍪'];
        let deck = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
        let flippedIndices = [];
        let matchedIndices = [];
        let canFlip = true;

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🥛 Kartalarni bosing va bir xil oziq-ovqatlarni juftlang!
                </div>
                <div class="memory-game-board">
                  ${deck.map((item, idx) => {
                    const isFlipped = flippedIndices.includes(idx) || matchedIndices.includes(idx);
                    return `
                      <div class="memory-card ${isFlipped ? 'flipped' : ''}" data-idx="${idx}">
                        <div class="card-face card-front">🍓</div>
                        <div class="card-face card-back">${item}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;

            stage.querySelectorAll('.memory-card').forEach(card => {
              card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.idx);
                if (!canFlip || flippedIndices.includes(idx) || matchedIndices.includes(idx)) return;

                sound.playClick();
                flippedIndices.push(idx);
                this.render();

                if (flippedIndices.length === 2) {
                  canFlip = false;
                  const [i1, i2] = flippedIndices;

                  if (deck[i1] === deck[i2]) {
                    sound.playSuccess();
                    matchedIndices.push(i1, i2);
                    flippedIndices = [];
                    canFlip = true;
                    document.getElementById('arena-current-score').textContent = matchedIndices.length * 10;

                    if (matchedIndices.length === deck.length) {
                      finishGame(50, 'Ajoyib xotira! Barcha mazali juftliklar topildi!');
                    } else {
                      this.render();
                    }
                  } else {
                    sound.playWrong();
                    setTimeout(() => {
                      flippedIndices = [];
                      canFlip = true;
                      this.render();
                    }, 900);
                  }
                }
              });
            });
          }
        };
      }

      // ----------------------------------------------------
      // 5. Color the Cupcake (3–5 yosh)
      // ----------------------------------------------------
      case 'color_cupcake': {
        const palette = ['#FF6B8B', '#70D6BC', '#FFE5B4', '#9D7BFC', '#87CEEB', '#FFB347', '#5A3831', '#FF3366'];
        let activeColor = '#FF6B8B';
        let colors = {
          cup: '#FFD1DC',
          bottomCream: '#FFE4E1',
          topCream: '#FFF0F5',
          cherry: '#FF0055'
        };

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🎨 Rangni tanlang, so‘ng cupcake bo‘lagiga bosib uni bo‘yang!
                </div>
                <div class="coloring-stage">
                  <div class="cupcake-svg-wrapper">
                    <svg viewBox="0 0 300 320" width="100%" height="100%">
                      <!-- Cupcake liner base -->
                      <polygon class="cupcake-part" id="part-cup" points="80,180 100,290 200,290 220,180" fill="${colors.cup}" stroke="#4A2E2B" stroke-width="4" />
                      <!-- Liner stripes -->
                      <line x1="110" y1="180" x2="125" y2="290" stroke="#4A2E2B" stroke-width="2" opacity="0.3" />
                      <line x1="150" y1="180" x2="150" y2="290" stroke="#4A2E2B" stroke-width="2" opacity="0.3" />
                      <line x1="190" y1="180" x2="175" y2="290" stroke="#4A2E2B" stroke-width="2" opacity="0.3" />
                      <!-- Frosting bottom swirl -->
                      <path class="cupcake-part" id="part-bottomCream" d="M65,185 C65,150 100,140 150,140 C200,140 235,150 235,185 C235,200 65,200 65,185 Z" fill="${colors.bottomCream}" stroke="#4A2E2B" stroke-width="4" />
                      <!-- Frosting top swirl -->
                      <path class="cupcake-part" id="part-topCream" d="M95,145 C95,95 130,70 150,70 C170,70 205,95 205,145 Z" fill="${colors.topCream}" stroke="#4A2E2B" stroke-width="4" />
                      <!-- Cherry on top -->
                      <circle class="cupcake-part" id="part-cherry" cx="150" cy="55" r="22" fill="${colors.cherry}" stroke="#4A2E2B" stroke-width="3" />
                      <path d="M152,35 Q165,15 180,22" fill="none" stroke="#2E5A27" stroke-width="4" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div class="cake-toolbox">
                    <h4>Ranglar palitrasi:</h4>
                    <div class="palette-swatches">
                      ${palette.map(c => `
                        <button class="palette-swatch ${activeColor === c ? 'active' : ''}" style="background:${c};" data-color="${c}"></button>
                      `).join('')}
                    </div>
                    <button class="btn-primary-glow" id="btn-save-cupcake-art" style="margin-top:20px;">
                      <i class="fa-solid fa-palette"></i> Tayyor!
                    </button>
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('.palette-swatch').forEach(btn => {
              btn.addEventListener('click', () => {
                sound.playClick();
                activeColor = btn.dataset.color;
                this.render();
              });
            });

            stage.querySelectorAll('.cupcake-part').forEach(part => {
              part.addEventListener('click', () => {
                sound.playClick();
                const id = part.id.replace('part-', '');
                if (colors[id] !== undefined) {
                  colors[id] = activeColor;
                  this.render();
                }
              });
            });

            stage.querySelector('#btn-save-cupcake-art').onclick = () => {
              unlockAchievement('cupcake_artist');
              finishGame(50, 'Siz haqiqiy rassom-qandolatchisiz! Cupcake ajoyib ranglar bilan bezatildi!');
            };
          }
        };
      }

      // ----------------------------------------------------
      // 6. Make Your Pizza (6–9 yosh)
      // ----------------------------------------------------
      case 'make_pizza': {
        let step = 1; // 1: stretch, 2: sauce, 3: cheese, 4: toppings, 5: bake
        let stretchClicks = 0;
        let hasSauce = false;
        let hasCheese = false;
        let toppingsOnPizza = [];
        let currentTopping = '🍅';
        const toppingOptions = [
          { name: 'Pomidor', icon: '🍅' },
          { name: 'Qo‘ziqorin', icon: '🍄' },
          { name: 'Zaytun', icon: '🫒' },
          { name: 'Qalampir', icon: '🫑' },
          { name: 'Kolbasa', icon: '🥩' }
        ];

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            let instructionText = '';
            if (step === 1) instructionText = '1-bosqich: Xamirni yoyish uchun xamir ustiga 3 marta bosing!';
            else if (step === 2) instructionText = '2-bosqich: Xamirga mazali pomidor sousini surting!';
            else if (step === 3) instructionText = '3-bosqich: Motsarella pishlog‘ini seping!';
            else if (step === 4) instructionText = '4-bosqich: Masalliqlarni tanlang va pitsa ustiga bosing!';
            else if (step === 5) instructionText = '5-bosqich: Tosh pechda pishirish!';

            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">${instructionText}</div>
                <div class="pizza-stage">
                  ${step < 5 ? `
                    <div class="pizza-board" id="pizza-board" style="transform: scale(${0.75 + stretchClicks * 0.08});">
                      <div class="pizza-sauce-layer ${hasSauce ? 'sauce-applied' : ''}"></div>
                      <div class="pizza-cheese-layer ${hasCheese ? 'cheese-applied' : ''}"></div>
                      ${toppingsOnPizza.map(t => `
                        <span style="position:absolute; left:${t.x}px; top:${t.y}px; font-size:2.2rem; pointer-events:none;">${t.icon}</span>
                      `).join('')}
                    </div>
                    ${step === 4 ? `
                      <div class="pizza-toppings-bar">
                        ${toppingOptions.map(t => `
                          <button class="topping-btn ${currentTopping === t.icon ? 'active' : ''}" data-icon="${t.icon}">
                            <span>${t.icon}</span>
                            <span>${t.name}</span>
                          </button>
                        `).join('')}
                        <button class="btn-accent" id="btn-go-bake"><i class="fa-solid fa-fire"></i> Pechga qo‘yish</button>
                      </div>
                    ` : ''}
                    ${step === 2 ? `<button class="btn-primary-glow" id="btn-apply-sauce">🥫 Sous surtish</button>` : ''}
                    ${step === 3 ? `<button class="btn-primary-glow" id="btn-apply-cheese">🧀 Pishloq sepish</button>` : ''}
                  ` : `
                    <div class="stone-oven-wrapper">
                      <div class="oven-glow"></div>
                      <div style="font-size:5.5rem; z-index:2; animation:bounceSoft 2s infinite ease-in-out;">🍕</div>
                    </div>
                    <button class="btn-primary-glow" id="btn-start-baking"><i class="fa-solid fa-fire-burner"></i> Pechni yoqish!</button>
                  `}
                </div>
              </div>
            `;

            // Step 1: stretch dough
            if (step === 1) {
              const board = stage.querySelector('#pizza-board');
              if (board) {
                board.addEventListener('click', () => {
                  sound.playClick();
                  stretchClicks++;
                  if (stretchClicks >= 3) {
                    step = 2;
                    sound.playSuccess();
                  }
                  this.render();
                });
              }
            }

            // Step 2: sauce
            if (step === 2) {
              const btn = stage.querySelector('#btn-apply-sauce');
              if (btn) {
                btn.onclick = () => {
                  sound.playSuccess();
                  hasSauce = true;
                  step = 3;
                  this.render();
                };
              }
            }

            // Step 3: cheese
            if (step === 3) {
              const btn = stage.querySelector('#btn-apply-cheese');
              if (btn) {
                btn.onclick = () => {
                  sound.playSuccess();
                  hasCheese = true;
                  step = 4;
                  this.render();
                };
              }
            }

            // Step 4: toppings
            if (step === 4) {
              stage.querySelectorAll('.topping-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                  sound.playClick();
                  currentTopping = btn.dataset.icon;
                  this.render();
                });
              });

              const board = stage.querySelector('#pizza-board');
              if (board) {
                board.addEventListener('click', (e) => {
                  sound.playClick();
                  const rect = board.getBoundingClientRect();
                  const x = e.clientX - rect.left - 16;
                  const y = e.clientY - rect.top - 16;
                  toppingsOnPizza.push({ icon: currentTopping, x, y });
                  this.render();
                });
              }

              const goBake = stage.querySelector('#btn-go-bake');
              if (goBake) {
                goBake.onclick = () => {
                  if (toppingsOnPizza.length < 4) {
                    showToast('Kamida 4 ta masalliq seping!', 'info');
                    return;
                  }
                  step = 5;
                  this.render();
                };
              }
            }

            // Step 5: bake in stone oven
            if (step === 5) {
              const btnBake = stage.querySelector('#btn-start-baking');
              if (btnBake) {
                btnBake.onclick = () => {
                  sound.playSizzle();
                  btnBake.disabled = true;
                  btnBake.innerHTML = '<i class="fa-solid fa-clock"></i> Pishmoqda... 3s';

                  let countdown = 3;
                  const interval = setInterval(() => {
                    countdown--;
                    if (countdown > 0) {
                      btnBake.innerHTML = `<i class="fa-solid fa-clock"></i> Pishmoqda... ${countdown}s`;
                    } else {
                      clearInterval(interval);
                      unlockAchievement('pizza_master');
                      finishGame(70, 'Qarsildoq, issiq va juda mazali pitsa tayyor bo‘ldi!');
                    }
                  }, 900);
                };
              }
            }
          }
        };
      }

      // ----------------------------------------------------
      // 7. Cupcake Bakery (6–9 yosh)
      // ----------------------------------------------------
      case 'cupcake_bakery': {
        let base = 'Vanilla';
        let creamStyle = 'Swirl';
        let creamColor = '#FF6B8B';
        let topping = '🍓';

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🧁 Cupcake Bakery: 5 bosqichda shaxsiy brendingizdagi cupcake ni yarating!
                </div>
                <div style="display:flex; gap:30px; align-items:center; justify-content:center; flex-wrap:wrap;">
                  <!-- Live Preview -->
                  <div style="width:260px; height:280px; background:var(--surface-card); border-radius:var(--radius-lg); border:2px solid var(--border-color); display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative;">
                    <div style="position:relative; font-size:4.5rem; text-align:center;">
                      <span style="position:absolute; top:-25px; left:50%; transform:translateX(-50%); font-size:2.8rem;">${topping}</span>
                      <span style="display:block; color:${creamColor}; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.1));">🧁</span>
                    </div>
                    <span style="margin-top:14px; font-weight:700; font-family:var(--font-heading); color:var(--primary);">Asosi: ${base}</span>
                  </div>
                  <!-- Controls -->
                  <div class="cake-toolbox" style="width:300px;">
                    <h4>1. Xamir turi:</h4>
                    <div style="display:flex; gap:6px;">
                      <button class="btn-sm ${base === 'Vanilla' ? 'btn-primary-glow' : 'btn-outline'}" data-base="Vanilla">Vanil</button>
                      <button class="btn-sm ${base === 'Choco' ? 'btn-primary-glow' : 'btn-outline'}" data-base="Choco">Shokolad</button>
                      <button class="btn-sm ${base === 'Matcha' ? 'btn-primary-glow' : 'btn-outline'}" data-base="Matcha">Matcha</button>
                    </div>
                    <h4>2. Krem rangi:</h4>
                    <div style="display:flex; gap:8px;">
                      <button class="palette-swatch" style="background:#FF6B8B;" data-color="#FF6B8B"></button>
                      <button class="palette-swatch" style="background:#5CD0B3;" data-color="#5CD0B3"></button>
                      <button class="palette-swatch" style="background:#9D7BFC;" data-color="#9D7BFC"></button>
                      <button class="palette-swatch" style="background:#FFB066;" data-color="#FFB066"></button>
                    </div>
                    <h4>3. Toping:</h4>
                    <div style="display:flex; gap:8px;">
                      <button class="topping-tool-btn" data-top="🍓">🍓</button>
                      <button class="topping-tool-btn" data-top="🍒">🍒</button>
                      <button class="topping-tool-btn" data-top="🍫">🍫</button>
                      <button class="topping-tool-btn" data-top="✨">✨</button>
                    </div>
                    <button class="btn-primary-glow" id="btn-finish-bakery" style="margin-top:14px;">
                      <i class="fa-solid fa-gift"></i> Qutiga solish va topshirish
                    </button>
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-base]').forEach(b => {
              b.onclick = () => { sound.playClick(); base = b.dataset.base; this.render(); };
            });
            stage.querySelectorAll('[data-color]').forEach(b => {
              b.onclick = () => { sound.playClick(); creamColor = b.dataset.color; this.render(); };
            });
            stage.querySelectorAll('[data-top]').forEach(b => {
              b.onclick = () => { sound.playClick(); topping = b.dataset.top; this.render(); };
            });

            stage.querySelector('#btn-finish-bakery').onclick = () => {
              unlockAchievement('cupcake_artist');
              finishGame(60, 'Siz tayyorlagan cupcake barcha xaridorlarga juda yoqdi!');
            };
          }
        };
      }

      // ----------------------------------------------------
      // 8. Fruit Salad (6–9 yosh)
      // ----------------------------------------------------
      case 'fruit_salad': {
        const required = [
          { name: 'Qulupnay', icon: '🍓', count: 2, current: 0 },
          { name: 'Kivi', icon: '🥝', count: 2, current: 0 },
          { name: 'Banan', icon: '🍌', count: 1, current: 0 }
        ];
        let hasHoney = false;

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            const allSliced = required.every(r => r.current >= r.count);

            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🍓 Mevalarni to‘g‘rang, idishga soling va asal quyib aralashtiring!
                </div>
                <div style="display:flex; gap:24px; align-items:center; justify-content:center; flex-wrap:wrap;">
                  <div style="width:260px; padding:20px; background:var(--surface-card); border-radius:var(--radius-lg); border:1px solid var(--border-color);">
                    <h4>Taom talabi:</h4>
                    <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; margin-top:10px;">
                      ${required.map(r => `
                        <li>${r.icon} ${r.name}: ${r.current} / ${r.count} ${r.current >= r.count ? '✅' : ''}</li>
                      `).join('')}
                      <li>🍯 Asal qo‘shildi: ${hasHoney ? '✅' : '❌'}</li>
                    </ul>
                  </div>
                  <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
                    <div style="display:flex; gap:12px;">
                      ${required.map((r, idx) => `
                        <button class="btn-secondary" style="font-size:1.8rem; padding:12px 18px;" data-slice-idx="${idx}">
                          ${r.icon} To‘g‘rash
                        </button>
                      `).join('')}
                    </div>
                    <button class="btn-primary-glow" id="btn-add-honey" ${allSliced && !hasHoney ? '' : 'disabled'}>
                      🍯 Asal quyish
                    </button>
                    <button class="btn-accent" id="btn-mix-salad" ${allSliced && hasHoney ? '' : 'disabled'}>
                      🥣 Aralashtirish va tayyorlash!
                    </button>
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-slice-idx]').forEach(btn => {
              btn.onclick = () => {
                const idx = parseInt(btn.dataset.sliceIdx);
                if (required[idx].current < required[idx].count) {
                  sound.playClick();
                  required[idx].current++;
                  this.render();
                } else {
                  showToast(`${required[idx].name} yetarli darajada to‘g‘ralgan!`, 'info');
                }
              };
            });

            const honeyBtn = stage.querySelector('#btn-add-honey');
            if (honeyBtn) {
              honeyBtn.onclick = () => {
                sound.playSuccess();
                hasHoney = true;
                this.render();
              };
            }

            const mixBtn = stage.querySelector('#btn-mix-salad');
            if (mixBtn) {
              mixBtn.onclick = () => {
                unlockAchievement('fruit_lover');
                finishGame(50, 'Yangi mevali salat juda xushbo‘y va vitaminlarga boy chiqdi!');
              };
            }
          }
        };
      }

      // ----------------------------------------------------
      // 9. Sandwich Maker (6–9 yosh)
      // ----------------------------------------------------
      case 'sandwich_maker': {
        const order = ['Non', 'Salat', 'Pishloq', 'Kotlet', 'Pomidor', 'Sous', 'Non'];
        let currentStack = [];

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🥪 Sendvich qatlamlarini tartib bilan to‘g‘ri tering!
                </div>
                <div class="sandwich-stage">
                  <div class="sandwich-stack-area">
                    ${currentStack.map(item => `
                      <div class="sandwich-layer ${this.getLayerClass(item)}">${item}</div>
                    `).join('')}
                  </div>
                  <div class="cake-toolbox">
                    <h4>Retsept tartibi:</h4>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">
                      ${order.join(' &rarr; ')}
                    </p>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                      <button class="btn-sm btn-outline" data-ing="Non">🍞 Non</button>
                      <button class="btn-sm btn-outline" data-ing="Salat">🥬 Salat</button>
                      <button class="btn-sm btn-outline" data-ing="Pishloq">🧀 Pishloq</button>
                      <button class="btn-sm btn-outline" data-ing="Kotlet">🥩 Kotlet</button>
                      <button class="btn-sm btn-outline" data-ing="Pomidor">🍅 Pomidor</button>
                      <button class="btn-sm btn-outline" data-ing="Sous">🥫 Sous</button>
                    </div>
                    <button class="btn-sm btn-danger" id="btn-reset-sandwich" style="margin-top:10px;">Qaytadan</button>
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-ing]').forEach(btn => {
              btn.onclick = () => {
                const ing = btn.dataset.ing;
                const nextRequired = order[currentStack.length];

                if (ing === nextRequired) {
                  sound.playClick();
                  currentStack.push(ing);
                  document.getElementById('arena-current-score').textContent = currentStack.length * 10;

                  if (currentStack.length === order.length) {
                    finishGame(60, 'Shohona baland sendvich muvaffaqiyatli tayyorlandi!');
                  } else {
                    this.render();
                  }
                } else {
                  sound.playWrong();
                  showToast(`Xato qatlam! Hozir: "${nextRequired}" kerak.`, 'info');
                }
              };
            });

            stage.querySelector('#btn-reset-sandwich').onclick = () => {
              currentStack = [];
              this.render();
            };
          },
          getLayerClass(name) {
            switch (name) {
              case 'Non': return 'layer-bread';
              case 'Salat': return 'layer-lettuce';
              case 'Pishloq': return 'layer-cheese';
              case 'Kotlet': return 'layer-meat';
              case 'Pomidor': return 'layer-tomato';
              case 'Sous': return 'layer-sauce';
              default: return '';
            }
          }
        };
      }

      // ----------------------------------------------------
      // 10. Kitchen Memory (6–9 yosh)
      // ----------------------------------------------------
      case 'kitchen_memory': {
        const pool = ['🥄 Qoshiq', '🥣 Idish', '🥚 Tuxum', '🥛 Sut', '🍓 Qulupnay', '🍫 Shokolad', '🧈 Sariyog\'', '🔪 Pichoq'];
        let chosen = [];
        let phase = 'memorize'; // 'memorize' | 'guess'
        let selectedAnswers = [];

        return {
          meta,
          init() {
            chosen = pool.sort(() => Math.random() - 0.5).slice(0, 4);
            setTimeout(() => {
              if (phase === 'memorize') {
                phase = 'guess';
                this.render();
              }
            }, 4000);
            this.render();
          },
          render() {
            if (phase === 'memorize') {
              stage.innerHTML = `
                <div class="game-workspace">
                  <div class="game-instructions">
                    🧠 Ushbu 4 ta oshxona mahsulotini eslab qoling! (4 soniya)
                  </div>
                  <div style="display:flex; gap:20px; font-size:3rem; padding:40px; background:var(--surface-card); border-radius:var(--radius-xl); border:2px dashed var(--border-color);">
                    ${chosen.map(item => `<div>${item}</div>`).join('')}
                  </div>
                </div>
              `;
            } else {
              stage.innerHTML = `
                <div class="game-workspace">
                  <div class="game-instructions">
                    🧠 Qaysi mahsulotlar bor edi? 4 tasini tanlang!
                  </div>
                  <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; max-width:600px;">
                    ${pool.map(item => `
                      <button class="quiz-option-btn ${selectedAnswers.includes(item) ? 'correct' : ''}" data-ans="${item}">
                        ${item}
                      </button>
                    `).join('')}
                  </div>
                  <button class="btn-primary-glow" id="btn-submit-memory" style="margin-top:20px;">
                    Tekshirish (${selectedAnswers.length}/4)
                  </button>
                </div>
              `;

              stage.querySelectorAll('[data-ans]').forEach(btn => {
                btn.onclick = () => {
                  sound.playClick();
                  const val = btn.dataset.ans;
                  if (selectedAnswers.includes(val)) {
                    selectedAnswers = selectedAnswers.filter(a => a !== val);
                  } else {
                    if (selectedAnswers.length < 4) selectedAnswers.push(val);
                  }
                  this.render();
                };
              });

              stage.querySelector('#btn-submit-memory').onclick = () => {
                if (selectedAnswers.length !== 4) {
                  showToast('Iltimos, roppa-rosa 4 ta javob tanlang!', 'info');
                  return;
                }
                const isCorrect = selectedAnswers.every(a => chosen.includes(a));
                if (isCorrect) {
                  finishGame(60, 'Qoyil! Siz barcha 4 ta ingredientni bekamu-ko‘st eslab qoldingiz!');
                } else {
                  sound.playWrong();
                  showToast('Afsuski, xatolik bor. Qaytadan urinib ko‘ring!', 'info');
                }
              };
            }
          }
        };
      }

      // ----------------------------------------------------
      // 11. Cake Designer (10–15 yosh)
      // ----------------------------------------------------
      case 'cake_designer': {
        let tiers = 2; // 1, 2, or 3
        let tierColors = ['#FF6B8B', '#FFE5B4', '#5CD0B3'];
        let decor = 'Oltin Gullar';

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🎂 Cake Designer Studio: Ko‘p qavatli hashamatli bayram tortini yarating!
                </div>
                <div style="display:flex; gap:36px; align-items:center; justify-content:center; flex-wrap:wrap;">
                  <!-- Cake Multi-tier Visual -->
                  <div style="width:300px; height:340px; background:var(--surface-card); border-radius:var(--radius-xl); border:1px solid var(--border-color); display:flex; flex-direction:column-reverse; align-items:center; justify-content:flex-start; padding-bottom:30px; box-shadow:var(--shadow-md);">
                    <div style="width:220px; height:60px; background:${tierColors[0]}; border-radius:12px; box-shadow:0 4px 10px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff;">1-Qavat</div>
                    ${tiers >= 2 ? `
                      <div style="width:160px; height:55px; background:${tierColors[1]}; border-radius:10px; margin-top:-6px; box-shadow:0 4px 8px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff;">2-Qavat</div>
                    ` : ''}
                    ${tiers >= 3 ? `
                      <div style="width:110px; height:50px; background:${tierColors[2]}; border-radius:8px; margin-top:-6px; box-shadow:0 4px 6px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff;">3-Qavat</div>
                    ` : ''}
                    <div style="font-size:2rem; margin-bottom:6px;">👑</div>
                  </div>
                  <!-- Controls -->
                  <div class="cake-toolbox" style="width:300px;">
                    <h4>Qavatlar soni:</h4>
                    <div style="display:flex; gap:8px;">
                      <button class="btn-sm ${tiers === 1 ? 'btn-primary-glow' : 'btn-outline'}" data-tier="1">1 Qavat</button>
                      <button class="btn-sm ${tiers === 2 ? 'btn-primary-glow' : 'btn-outline'}" data-tier="2">2 Qavat</button>
                      <button class="btn-sm ${tiers === 3 ? 'btn-primary-glow' : 'btn-outline'}" data-tier="3">3 Qavat</button>
                    </div>
                    <h4>1-Qavat Rangi:</h4>
                    <div style="display:flex; gap:6px;">
                      <button class="palette-swatch" style="background:#FF6B8B;" data-tc="0,#FF6B8B"></button>
                      <button class="palette-swatch" style="background:#4A2E2B;" data-tc="0,#4A2E2B"></button>
                      <button class="palette-swatch" style="background:#5CD0B3;" data-tc="0,#5CD0B3"></button>
                    </div>
                    <h4>Bezatish uslubi:</h4>
                    <select id="select-cake-decor" class="input-field" style="padding:8px;">
                      <option value="Oltin Gullar">🌸 Shakar Gullar Kaskadi</option>
                      <option value="Shokolad Tomchilari">🍫 Shokoladli Drip</option>
                      <option value="Oltin Barglar">✨ 24K Oltin Folga</option>
                    </select>
                    <button class="btn-primary-glow" id="btn-finish-designer" style="margin-top:14px;">
                      <i class="fa-solid fa-gem"></i> Dizaynni yakunlash
                    </button>
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-tier]').forEach(b => {
              b.onclick = () => { sound.playClick(); tiers = parseInt(b.dataset.tier); this.render(); };
            });
            stage.querySelectorAll('[data-tc]').forEach(b => {
              b.onclick = () => {
                sound.playClick();
                const [idx, col] = b.dataset.tc.split(',');
                tierColors[parseInt(idx)] = col;
                this.render();
              };
            });

            stage.querySelector('#btn-finish-designer').onclick = () => {
              unlockAchievement('cake_designer');
              finishGame(70, 'Ushbu ko‘p qavatli tort haqiqiy to‘y yoki bayramning eng ko‘rkam bezagi bo‘ladi!');
            };
          }
        };
      }

      // ----------------------------------------------------
      // 12. Recipe Challenge (10–15 yosh)
      // ----------------------------------------------------
      case 'recipe_challenge': {
        const dish = 'Klassik Italiyancha Pitsa';
        const pantry = [
          { name: 'Pitsa uni', isCorrect: true },
          { name: 'Xamirturush', isCorrect: true },
          { name: 'Pomidor sousi', isCorrect: true },
          { name: 'Motsarella', isCorrect: true },
          { name: 'Zaytun moyi', isCorrect: true },
          { name: 'Shakar qiyomi', isCorrect: false },
          { name: 'Mayonez', isCorrect: false },
          { name: 'Kofe donalari', isCorrect: false }
        ];
        let selected = [];

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🍝 Vazifa: "${dish}" uchun zarur bo‘lgan to‘g‘ri ingredientlarni tanlang!
                </div>
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; max-width:650px;">
                  ${pantry.map(item => `
                    <button class="quiz-option-btn ${selected.includes(item.name) ? 'correct' : ''}" data-pname="${item.name}">
                      ${item.name}
                    </button>
                  `).join('')}
                </div>
                <button class="btn-primary-glow" id="btn-submit-challenge" style="margin-top:20px;">
                  Retseptni tasdiqlash
                </button>
              </div>
            `;

            stage.querySelectorAll('[data-pname]').forEach(btn => {
              btn.onclick = () => {
                sound.playClick();
                const name = btn.dataset.pname;
                if (selected.includes(name)) selected = selected.filter(n => n !== name);
                else selected.push(name);
                this.render();
              };
            });

            stage.querySelector('#btn-submit-challenge').onclick = () => {
              const correctNames = pantry.filter(p => p.isCorrect).map(p => p.name);
              const hasAllCorrect = correctNames.every(cn => selected.includes(cn));
              const hasNoDecoys = selected.every(sn => correctNames.includes(sn));

              if (hasAllCorrect && hasNoDecoys) {
                finishGame(70, 'Mukammal! Haqiqiy pitsa uchun kerakli barcha ingredientlarni xatosiz topdingiz!');
              } else {
                sound.playWrong();
                showToast('Noto‘g‘ri yoki ortiqcha masalliqlar bor. Qaytadan tekshiring!', 'info');
              }
            };
          }
        };
      }

      // ----------------------------------------------------
      // 13. Food Quiz (10–15 yosh)
      // ----------------------------------------------------
      case 'food_quiz': {
        const questions = [
          {
            q: 'Cupcake xamiri mayin va yumshoq chiqishi uchun sariyog‘ qanday haroratda bo‘lishi kerak?',
            options: ['Muzlatilgan', 'Xona haroratida', 'Qaynoq darajada', 'Farqi yo‘q'],
            correct: 1
          },
          {
            q: 'Pitsaning vatani qaysi mamlakat hisoblanadi?',
            options: ['Fransiya', 'Turkiya', 'Italiya', 'Ispaniya'],
            correct: 2
          },
          {
            q: 'Shokolad qaysi o‘simlik mevasidan tayyorlanadi?',
            options: ['Kofe', 'Kakao', 'Vanil', 'Dolchin'],
            correct: 1
          }
        ];
        let currentQ = 0;
        let scoreCount = 0;

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            const qObj = questions[currentQ];
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="quiz-container">
                  <div class="quiz-progress-bar">
                    <div class="quiz-fill" style="width:${((currentQ + 1) / questions.length) * 100}%"></div>
                  </div>
                  <h3 class="quiz-question">${currentQ + 1}-savol: ${qObj.q}</h3>
                  <div class="quiz-options-list">
                    ${qObj.options.map((opt, i) => `
                      <button class="quiz-option-btn" data-opt-idx="${i}">${opt}</button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-opt-idx]').forEach(btn => {
              btn.onclick = () => {
                const idx = parseInt(btn.dataset.optIdx);
                if (idx === qObj.correct) {
                  sound.playSuccess();
                  btn.classList.add('correct');
                  scoreCount += 25;
                } else {
                  sound.playWrong();
                  btn.classList.add('wrong');
                }

                setTimeout(() => {
                  currentQ++;
                  if (currentQ < questions.length) {
                    this.render();
                  } else {
                    finishGame(scoreCount, `Pazandachilik viktorinasida ajoyib bilim ko‘rsatdingiz! Natija: ${scoreCount} ball!`);
                  }
                }, 800);
              };
            });
          }
        };
      }

      // ----------------------------------------------------
      // 14. Restaurant Kitchen (10–15 yosh)
      // ----------------------------------------------------
      case 'restaurant_kitchen': {
        const orders = [
          { name: 'Pankeyk', need: ['🥞', '🍯', '🍓'] },
          { name: 'Meva Salati', need: ['🥝', '🍌', '🍓'] },
          { name: 'Burger', need: ['🍞', '🥩', '🧀'] }
        ];
        let orderIdx = 0;
        let assembled = [];

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            const cur = orders[orderIdx];
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🍽️ Restoran Oshxonasi: Buyurtmadagi 3 ta masalliqni terib taomni topshiring!
                </div>
                <div style="background:var(--surface-card); padding:24px; border-radius:var(--radius-xl); border:1px solid var(--border-color); text-align:center;">
                  <h3>Buyurtma #${orderIdx + 1}: ${cur.name}</h3>
                  <p style="color:var(--text-muted); margin-bottom:14px;">Kerakli masalliqlar: ${cur.need.join(' + ')}</p>
                  <div style="font-size:2.5rem; min-height:50px;">
                    ${assembled.join(' ')}
                  </div>
                  <div style="display:flex; gap:10px; justify-content:center; margin-top:20px; flex-wrap:wrap;">
                    ${['🥞', '🍯', '🍓', '🥝', '🍌', '🍞', '🥩', '🧀'].map(item => `
                      <button class="btn-secondary" style="font-size:1.8rem; padding:10px 16px;" data-item="${item}">${item}</button>
                    `).join('')}
                  </div>
                  <div style="display:flex; justify-content:center; gap:12px; margin-top:18px;">
                    <button class="btn-primary-glow" id="btn-serve-dish">Taomni topshirish</button>
                    <button class="btn-outline" id="btn-clear-dish">Tozalash</button>
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-item]').forEach(btn => {
              btn.onclick = () => {
                sound.playClick();
                assembled.push(btn.dataset.item);
                this.render();
              };
            });

            stage.querySelector('#btn-clear-dish').onclick = () => {
              assembled = [];
              this.render();
            };

            stage.querySelector('#btn-serve-dish').onclick = () => {
              const curNeed = cur.need;
              const isMatch = curNeed.every(n => assembled.includes(n)) && assembled.length === curNeed.length;

              if (isMatch) {
                sound.playSuccess();
                orderIdx++;
                assembled = [];
                if (orderIdx >= orders.length) {
                  unlockAchievement('speed_baker');
                  finishGame(80, 'Barcha mijozlarning buyurtmalari o‘z vaqtida va mazali tayyorlandi!');
                } else {
                  this.render();
                }
              } else {
                sound.playWrong();
                showToast('Masalliqlar mos kelmadi, qaytadan tering!', 'info');
              }
            };
          }
        };
      }

      // ----------------------------------------------------
      // 15. Smoothie Master (10–15 yosh)
      // ----------------------------------------------------
      case 'smoothie_master': {
        let baseLiquid = 'Kokos suti';
        let fruits = [];
        let isBlended = false;

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🍹 Smoothie Master: 1 ta suyuqlik va 3 ta meva tanlab sehrli smuzi blend qiling!
                </div>
                <div class="blender-stage">
                  <div class="blender-jar ${isBlended ? 'blending' : ''}">
                    <div class="blender-liquid" style="height:${(fruits.length + 1) * 22}%;"></div>
                  </div>
                  <div class="cake-toolbox" style="width:300px;">
                    <h4>Suyuqlik asosi:</h4>
                    <select id="select-liquid" class="input-field" style="padding:8px;">
                      <option value="Kokos suti">🥥 Kokos suti</option>
                      <option value="Bodom suti">🥛 Bodom suti</option>
                      <option value="Apelsin sharbati">🍊 Apelsin sharbati</option>
                    </select>
                    <h4>Mevalar (${fruits.length}/3):</h4>
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                      ${['🍓 Qulupnay', '🥭 Mango', '🍌 Banan', '🫐 Qorag‘at', '🥝 Kivi', '🌱 Chia'].map(item => `
                        <button class="btn-sm ${fruits.includes(item) ? 'btn-primary-glow' : 'btn-outline'}" data-sfruit="${item}">${item}</button>
                      `).join('')}
                    </div>
                    <button class="btn-accent" id="btn-blend-smoothie" style="margin-top:14px;" ${fruits.length === 3 ? '' : 'disabled'}>
                      🌪️ Blend qilish!
                    </button>
                  </div>
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-sfruit]').forEach(b => {
              b.onclick = () => {
                sound.playClick();
                const f = b.dataset.sfruit;
                if (fruits.includes(f)) fruits = fruits.filter(item => item !== f);
                else if (fruits.length < 3) fruits.push(f);
                this.render();
              };
            });

            const blendBtn = stage.querySelector('#btn-blend-smoothie');
            if (blendBtn) {
              blendBtn.onclick = () => {
                sound.playSizzle();
                isBlended = true;
                this.render();
                setTimeout(() => {
                  unlockAchievement('smoothie_guru');
                  finishGame(60, 'Siz tayyorlagan smuzi nihoyatda tetiklantiruvchi va xushbo‘y bo‘lib chiqdi!');
                }, 1800);
              };
            }
          }
        };
      }

      // ----------------------------------------------------
      // 16. Bakery Manager (10–15 yosh)
      // ----------------------------------------------------
      case 'bakery_manager': {
        let stock = { croissant: 2, donut: 2, cupcake: 2 };
        let customers = [
          { want: 'croissant', name: 'Zahro', icon: '🥐' },
          { want: 'donut', name: 'Laylo', icon: '🍩' },
          { name: 'Madina', want: 'cupcake', icon: '🧁' }
        ];
        let served = 0;

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🥐 Mini Nonvoyxona Boshqaruvi: Xaridorlar talab qilgan shirinliklarni bering!
                </div>
                <div style="display:flex; gap:30px; align-items:center; justify-content:center; flex-wrap:wrap;">
                  <div style="background:var(--surface-card); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--border-color); width:260px;">
                    <h4>Vitrina zaxirasi:</h4>
                    <p>🥐 Kruassan: ${stock.croissant}</p>
                    <p>🍩 Donut: ${stock.donut}</p>
                    <p>🧁 Cupcake: ${stock.cupcake}</p>
                    <button class="btn-sm btn-outline" id="btn-bake-more" style="margin-top:10px;">
                      <i class="fa-solid fa-fire"></i> Yangi pishirish (+1 har biridan)
                    </button>
                  </div>
                  <div style="display:flex; flex-direction:column; gap:12px;">
                    ${customers.map((c, i) => `
                      <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; background:var(--surface-card); padding:12px 20px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
                        <span>👧 ${c.name}: "${c.icon} berolasizmi?"</span>
                        <button class="btn-sm btn-primary-glow" data-serve-idx="${i}">Topshirish</button>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;

            stage.querySelector('#btn-bake-more').onclick = () => {
              sound.playSizzle();
              stock.croissant++;
              stock.donut++;
              stock.cupcake++;
              this.render();
            };

            stage.querySelectorAll('[data-serve-idx]').forEach(btn => {
              btn.onclick = () => {
                const idx = parseInt(btn.dataset.serveIdx);
                const c = customers[idx];
                if (stock[c.want] > 0) {
                  sound.playSuccess();
                  stock[c.want]--;
                  customers.splice(idx, 1);
                  served++;
                  if (customers.length === 0) {
                    unlockAchievement('bakery_tycoon');
                    finishGame(75, 'Barcha xaridorlar xursand bo‘lib do‘koningizdan ketishdi!');
                  } else {
                    this.render();
                  }
                } else {
                  showToast('Zaxirada bu shirinlik qolmadi, avval pishiring!', 'info');
                }
              };
            });
          }
        };
      }

      // ----------------------------------------------------
      // 17. Master Recipe Challenge (16–20 yosh)
      // ----------------------------------------------------
      case 'master_recipe_challenge': {
        const correctSteps = [
          'Tuxum oqini shakar bilan qattiq cho‘qqilar hosil bo‘lguncha ko‘pirtiring',
          'Bodom uni va shakar kukunini bir necha bor elakdan o‘tkazing',
          'Makaronaj: quruq masalliqlarni beze bilan muloyimlik bilan aralashtiring',
          'Pishiriq qopchasida listga bir xil doirachalar qilib quying va 30 daqiqa quritib qo‘ying',
          '150°C da 14 daqiqa yubkasi (collerette) hosil bo‘lguncha pishiring'
        ];
        let userSteps = [...correctSteps].sort(() => Math.random() - 0.5);

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🏆 Master Chef: "Fransuzcha Makaronlar" pishirish bosqichlarini to‘g‘ri tartibga tering!
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; max-width:680px; width:100%;">
                  ${userSteps.map((step, idx) => `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 18px; background:var(--surface-card); border-radius:var(--radius-md); border:1px solid var(--border-color);">
                      <span style="font-size:0.95rem;"><strong>${idx + 1}.</strong> ${step}</span>
                      <div style="display:flex; gap:6px;">
                        <button class="btn-ctrl-sm" data-move-up="${idx}" ${idx === 0 ? 'disabled' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                        <button class="btn-ctrl-sm" data-move-down="${idx}" ${idx === userSteps.length - 1 ? 'disabled' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <button class="btn-primary-glow" id="btn-check-master-steps" style="margin-top:20px;">
                  <i class="fa-solid fa-check"></i> Bosqichlarni tekshirish
                </button>
              </div>
            `;

            stage.querySelectorAll('[data-move-up]').forEach(b => {
              b.onclick = () => {
                sound.playClick();
                const idx = parseInt(b.dataset.moveUp);
                const temp = userSteps[idx];
                userSteps[idx] = userSteps[idx - 1];
                userSteps[idx - 1] = temp;
                this.render();
              };
            });

            stage.querySelectorAll('[data-move-down]').forEach(b => {
              b.onclick = () => {
                sound.playClick();
                const idx = parseInt(b.dataset.moveDown);
                const temp = userSteps[idx];
                userSteps[idx] = userSteps[idx + 1];
                userSteps[idx + 1] = temp;
                this.render();
              };
            });

            stage.querySelector('#btn-check-master-steps').onclick = () => {
              const isPerfect = userSteps.every((s, i) => s === correctSteps[i]);
              if (isPerfect) {
                finishGame(80, 'Mukammal oshpazlik mahorati! Siz nozik fransuz qandolatchiligi texnologiyasini to‘liq bilasiz!');
              } else {
                sound.playWrong();
                showToast('Bosqichlar tartibida xatolik bor. Yana bir bor mulohaza qiling!', 'info');
              }
            };
          }
        };
      }

      // ----------------------------------------------------
      // 18. Restaurant Manager (16–20 yosh)
      // ----------------------------------------------------
      case 'restaurant_manager': {
        let price = 25;
        let quality = 'Organic';
        let simulated = false;

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  💼 Sweet Bistro Virtual Restoran Boshqaruvi: Menyu narxi va sifatini sozlang!
                </div>
                <div style="background:var(--surface-card); padding:28px; border-radius:var(--radius-xl); border:1px solid var(--border-color); max-width:550px; width:100%;">
                  <h4>O‘rtacha taom narxi ($): <span id="val-price">${price}</span>$</h4>
                  <input type="range" id="range-price" min="10" max="60" value="${price}" style="width:100%; margin:10px 0 20px;" />
                  <h4>Masalliqlar sifati:</h4>
                  <select id="select-quality" class="input-field" style="padding:10px; margin-bottom:20px;">
                    <option value="Organic" ${quality === 'Organic' ? 'selected' : ''}>🌿 Premium Organic (Eng yuqori)</option>
                    <option value="Standard" ${quality === 'Standard' ? 'selected' : ''}>🛒 Standard Bozor (O‘rtacha)</option>
                  </select>
                  <button class="btn-primary-glow" id="btn-simulate-day" style="width:100%;">
                    <i class="fa-solid fa-play"></i> 1 Kunlik Savdoni Simulyatsiya Qilish
                  </button>
                  ${simulated ? `
                    <div style="margin-top:20px; padding:16px; background:var(--primary-light); border-radius:var(--radius-md);">
                      <p>👥 Kelgan mehmonlar: 84 nafar</p>
                      <p>💰 Sof foyda: $${price * 65 - (quality === 'Organic' ? 450 : 250)}</p>
                      <p>⭐ Michelin Tavsiyasi: 4.8 / 5.0 (Ajoyib)</p>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;

            const range = stage.querySelector('#range-price');
            if (range) {
              range.oninput = () => {
                price = range.value;
                stage.querySelector('#val-price').textContent = price;
              };
            }

            const qSel = stage.querySelector('#select-quality');
            if (qSel) {
              qSel.onchange = () => { quality = qSel.value; };
            }

            stage.querySelector('#btn-simulate-day').onclick = () => {
              sound.playSuccess();
              simulated = true;
              this.render();
              setTimeout(() => {
                finishGame(80, 'Bistro kuni ajoyib foyda va mijozlar olqishi bilan yakunlandi!');
              }, 1800);
            };
          }
        };
      }

      // ----------------------------------------------------
      // 19. Ingredient Mystery (16–20 yosh)
      // ----------------------------------------------------
      case 'ingredient_mystery': {
        const mystery = {
          clues: [
            'Bu desert Fransiyada paydo bo‘lgan mashhur noz-ne\'mat.',
            'Yumshoq vanilli krem va ustida olov bilan karamellangan qarsildoq shakar qobig‘i bor.',
            'Taom nomi "Kuydirilgan qaymoq" ma\'nosini bildiradi.'
          ],
          dishName: 'Krem-bryule (Crème Brûlée)',
          needed: ['Qaymoq', 'Tuxum sarig‘i', 'Shakar', 'Vanil']
        };
        const candidates = ['Qaymoq', 'Tuxum sarig‘i', 'Shakar', 'Vanil', 'Shokolad', 'Un', 'Qalampir', 'Xamirturush'];
        let picked = [];

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  🕵️‍♀️ Oshxona Detektivi: Belgilar asosida sirli taom va uning 4 ta asosiy masallig‘ini toping!
                </div>
                <div style="background:var(--surface-card); padding:24px; border-radius:var(--radius-xl); border:1px solid var(--border-color); max-width:620px;">
                  <h4>Taom belgilari:</h4>
                  <ul style="margin:10px 0 16px 20px; font-size:0.95rem; color:var(--text-muted);">
                    ${mystery.clues.map(c => `<li>${c}</li>`).join('')}
                  </ul>
                  <h4>Kerakli 4 ta masalliqni belgilang:</h4>
                  <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin:14px 0;">
                    ${candidates.map(item => `
                      <button class="quiz-option-btn ${picked.includes(item) ? 'correct' : ''}" data-pick="${item}">${item}</button>
                    `).join('')}
                  </div>
                  <button class="btn-primary-glow" id="btn-submit-mystery" style="width:100%; margin-top:10px;">
                    Javobni topshirish (${picked.length}/4)
                  </button>
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-pick]').forEach(b => {
              b.onclick = () => {
                sound.playClick();
                const item = b.dataset.pick;
                if (picked.includes(item)) picked = picked.filter(p => p !== item);
                else if (picked.length < 4) picked.push(item);
                this.render();
              };
            });

            stage.querySelector('#btn-submit-mystery').onclick = () => {
              if (picked.length !== 4) {
                showToast('Iltimos, 4 ta ingredient tanlang!', 'info');
                return;
              }
              const isAll = mystery.needed.every(n => picked.includes(n));
              if (isAll) {
                finishGame(75, `Qoyil! Bu haqiqatan ham mashhur "${mystery.dishName}" edi!`);
              } else {
                sound.playWrong();
                showToast('Ingredientlar to‘liq to‘g‘ri kelmadi. Beligilarini yana o‘qing!', 'info');
              }
            };
          }
        };
      }

      // ----------------------------------------------------
      // 20. Food Styling Studio (16–20 yosh)
      // ----------------------------------------------------
      case 'food_styling_studio': {
        let plate = 'slate';
        let protein = '🐟 Qovurilgan Losos';
        let garnish = '🌱 Mikroko‘katlar';

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  📸 Food Styling Studio: Michelin uslubidagi eng estetik tarelka kompozitsiyasini yarating!
                </div>
                <div style="display:flex; gap:30px; align-items:center; justify-content:center; flex-wrap:wrap;">
                  <div style="width:300px; height:300px; background:${plate === 'slate' ? '#2A2A2A' : '#FFFFFF'}; border-radius:var(--radius-full); border:8px solid ${plate === 'slate' ? '#1A1A1A' : '#E0E0E0'}; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; box-shadow:var(--shadow-lg);">
                    <span style="font-size:3.5rem;">${protein.split(' ')[0]}</span>
                    <span style="font-size:1.8rem; margin-top:-10px;">${garnish.split(' ')[0]}</span>
                    <span style="position:absolute; bottom:20px; font-size:0.75rem; color:${plate === 'slate' ? '#aaa' : '#666'};">Styled by Chef ${appState.username || 'Malika'}</span>
                  </div>
                  <div class="cake-toolbox" style="width:280px;">
                    <h4>Tarelka turi:</h4>
                    <select id="sel-plate" class="input-field" style="padding:8px;">
                      <option value="slate" ${plate === 'slate' ? 'selected' : ''}>🖤 Qora Tosh (Dark Slate)</option>
                      <option value="white" ${plate === 'white' ? 'selected' : ''}>🤍 Oq Chinni (White Porcelain)</option>
                    </select>
                    <h4>Asosiy taom:</h4>
                    <select id="sel-protein" class="input-field" style="padding:8px;">
                      <option value="🐟 Qovurilgan Losos">🐟 Qovurilgan Losos</option>
                      <option value="🍰 Shokoladli Fondon">🍰 Shokoladli Fondon</option>
                      <option value="🥩 Medalyon Bifshteks">🥩 Medalyon Bifshteks</option>
                    </select>
                    <h4>Garnish bezagi:</h4>
                    <select id="sel-garnish" class="input-field" style="padding:8px;">
                      <option value="🌱 Mikroko‘katlar">🌱 Mikroko‘katlar</option>
                      <option value="🌸 Quturgan Gullar">🌸 Yeyiladigan Gullar</option>
                      <option value="✨ Oltin Folga">✨ Oltin Folga</option>
                    </select>
                    <button class="btn-primary-glow" id="btn-snap-photo" style="margin-top:14px;">
                      <i class="fa-solid fa-camera"></i> Suratga olish (Portfolio)
                    </button>
                  </div>
                </div>
              </div>
            `;

            stage.querySelector('#sel-plate').onchange = (e) => { plate = e.target.value; this.render(); };
            stage.querySelector('#sel-protein').onchange = (e) => { protein = e.target.value; this.render(); };
            stage.querySelector('#sel-garnish').onchange = (e) => { garnish = e.target.value; this.render(); };

            stage.querySelector('#btn-snap-photo').onclick = () => {
              sound.playClick();
              showToast('📸 Chiroyli fototasvir portfolioingizga saqlandi!', 'success');
              finishGame(70, 'Michelin darajasidagi ajoyib prezentatsiya va estetik kompozitsiya!');
            };
          }
        };
      }

      // ----------------------------------------------------
      // 21. Recipe Creator (16–20 yosh)
      // ----------------------------------------------------
      case 'recipe_creator': {
        return {
          meta,
          init() {
            arenaModal.classList.remove('active');
            openRecipeCreatorModal();
          }
        };
      }

      // ----------------------------------------------------
      // 22. Cooking Strategy (16–20 yosh)
      // ----------------------------------------------------
      case 'cooking_strategy': {
        let stations = [
          { name: 'Tova (Skillet)', heat: 50, target: 80, isDone: false },
          { name: 'Pech (Oven)', heat: 40, target: 75, isDone: false },
          { name: 'Stol (Prep)', heat: 60, target: 90, isDone: false }
        ];

        return {
          meta,
          init() {
            this.render();
          },
          render() {
            const allDone = stations.every(s => s.isDone);

            stage.innerHTML = `
              <div class="game-workspace">
                <div class="game-instructions">
                  ⚡ Pazandachilik Strategiyasi: Har bir stansiyani qizdirib yashil zonaga yetkazing!
                </div>
                <div style="display:flex; flex-direction:column; gap:16px; width:100%; max-width:600px;">
                  ${stations.map((s, idx) => `
                    <div style="background:var(--surface-card); padding:16px 20px; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; gap:20px;">
                      <span style="font-weight:700; width:140px;">${s.name}</span>
                      <div style="flex-grow:1; height:12px; background:var(--surface-secondary); border-radius:var(--radius-full); overflow:hidden;">
                        <div style="height:100%; width:${s.heat}%; background:${s.heat >= s.target ? 'var(--accent-mint)' : 'var(--primary)'};"></div>
                      </div>
                      <button class="btn-sm btn-primary-glow" data-heat-idx="${idx}" ${s.isDone ? 'disabled' : ''}>
                        ${s.isDone ? '✅ Tayyor' : '+ Harorat'}
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;

            stage.querySelectorAll('[data-heat-idx]').forEach(btn => {
              btn.onclick = () => {
                sound.playClick();
                const idx = parseInt(btn.dataset.heatIdx);
                stations[idx].heat += 15;
                if (stations[idx].heat >= stations[idx].target) {
                  stations[idx].isDone = true;
                  sound.playSuccess();
                }
                if (stations.every(s => s.isDone)) {
                  finishGame(80, 'Siz barcha 3 ta stansiyani bir vaqtning o‘zida bekamu-ko‘st boshqardingiz!');
                } else {
                  this.render();
                }
              };
            });
          }
        };
      }

      default:
        return {
          meta,
          init() {
            stage.innerHTML = `<div class="game-workspace"><p>Ushbu o‘yin tez orada ishga tushadi!</p></div>`;
          }
        };
    }
  }

  /* ==========================================================================
     15. INITIALIZATION & GLOBAL EVENT LISTENERS
     ========================================================================== */
  function initApp() {
    loadState();
    applyTheme(appState.theme);
    updateSoundButtonIcons();
    updateBgmButtonIcons();

    // 1. Check if user has already entered username
    if (appState.username) {
      switchScreen('dashboard');
      renderHeaderStats();
      renderHeroGreetings();
      renderFeaturedGames('recommended');
      renderCatalogGames('all');
      renderRecipes('all');
      renderAchievements();
      renderKitchenStats();
      updateDailyChallengeBanner();
    } else {
      switchScreen('welcome');
    }

    // 2. Welcome screen age cards selection
    const ageCards = document.querySelectorAll('.age-card');
    ageCards.forEach(card => {
      card.addEventListener('click', () => {
        sound.playClick();
        selectedAgeGroup = card.dataset.ageKey;
        appState.ageCategory = selectedAgeGroup;

        const cat = CATEGORIES[selectedAgeGroup];
        const catPill = document.getElementById('username-cat-pill');
        const catIcon = document.getElementById('username-cat-icon');
        const catName = document.getElementById('username-cat-name');
        const greetingTitle = document.getElementById('username-greeting-title');

        if (catPill) catPill.innerHTML = `<span>${cat.icon}</span> <span>${cat.title}</span> (${cat.range})`;
        if (greetingTitle) greetingTitle.textContent = `Welcome, ${cat.title}! 🍓`;

        switchScreen('username');
      });
    });

    // 3. Username Back button
    const btnBackToAge = document.getElementById('btn-back-to-age');
    if (btnBackToAge) {
      btnBackToAge.addEventListener('click', () => {
        sound.playClick();
        switchScreen('welcome');
      });
    }

    // 4. Avatar picker
    const avatarBtns = document.querySelectorAll('.avatar-btn');
    avatarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        avatarBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedAvatar = btn.dataset.avatar;
        appState.avatar = selectedAvatar;
      });
    });

    // 5. Username registration form
    const usernameForm = document.getElementById('username-form');
    const inputUsername = document.getElementById('input-username');
    const usernameError = document.getElementById('username-error-msg');

    if (usernameForm && inputUsername) {
      usernameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = inputUsername.value.trim();

        if (!val || val.length < 2) {
          sound.playWrong();
          if (usernameError) usernameError.textContent = 'Iltimos, ismingizni kiriting (kamida 2 ta belgi)!';
          return;
        }

        sound.playSuccess();
        appState.username = val;
        appState.avatar = selectedAvatar;
        appState.ageCategory = selectedAgeGroup;
        saveState();

        confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
        showToast(`Xush kelibsiz, ${val}! Oshxonamiz sen uchun ochiq!`, 'success');

        switchScreen('dashboard');
        renderHeaderStats();
        renderHeroGreetings();
        renderFeaturedGames('recommended');
        renderCatalogGames('all');
        renderRecipes('all');
        renderAchievements();
        renderKitchenStats();
        updateDailyChallengeBanner();
      });
    }

    // 6. Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        sound.playClick();
        const view = link.dataset.view;
        if (view) {
          switchView(view);
          const drawer = document.getElementById('mobile-drawer');
          if (drawer) drawer.classList.remove('open');
        }
      });
    });

    // Brand logo returns to home
    const brandLogo = document.getElementById('nav-brand-logo');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        sound.playClick();
        switchView('home');
      });
    }

    // Nav Profile Pill opens My Kitchen
    const navProfile = document.getElementById('nav-profile-pill');
    if (navProfile) {
      navProfile.addEventListener('click', () => {
        sound.playClick();
        switchView('kitchen');
      });
    }

    // Hero CTA buttons
    const heroBtnStart = document.getElementById('hero-btn-start');
    if (heroBtnStart) {
      heroBtnStart.onclick = () => { sound.playClick(); switchView('games'); };
    }
    const heroBtnExplore = document.getElementById('hero-btn-explore');
    if (heroBtnExplore) {
      heroBtnExplore.onclick = () => { sound.playClick(); switchView('games'); };
    }
    const heroBtnRecipes = document.getElementById('hero-btn-recipes');
    if (heroBtnRecipes) {
      heroBtnRecipes.onclick = () => { sound.playClick(); switchView('recipes'); };
    }

    // Chef tips rotating
    const nextTipBtn = document.getElementById('btn-next-tip');
    const tipText = document.getElementById('chef-fact-text');
    if (nextTipBtn && tipText) {
      nextTipBtn.onclick = () => {
        sound.playClick();
        const rand = CHEF_TIPS[Math.floor(Math.random() * CHEF_TIPS.length)];
        tipText.textContent = rand;
      };
    }

    // Games catalog filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sound.playClick();
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.cat;
        const searchVal = document.getElementById('games-search-input')?.value || '';
        renderCatalogGames(cat, searchVal);
      });
    });

    // Games search input
    const gamesSearch = document.getElementById('games-search-input');
    if (gamesSearch) {
      gamesSearch.addEventListener('input', () => {
        const activeTab = document.querySelector('.filter-tab.active')?.dataset.cat || 'all';
        renderCatalogGames(activeTab, gamesSearch.value);
      });
    }

    // Home quick filter pills
    const homePills = document.querySelectorAll('.category-quick-pills .pill-btn');
    homePills.forEach(pill => {
      pill.addEventListener('click', () => {
        sound.playClick();
        homePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderFeaturedGames(pill.dataset.filter);
      });
    });

    // Recipe filter pills
    const recipePills = document.querySelectorAll('.recipe-filter-bar .filter-pill');
    recipePills.forEach(pill => {
      pill.addEventListener('click', () => {
        sound.playClick();
        recipePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const rtype = pill.dataset.rtype;
        const searchVal = document.getElementById('recipe-search-input')?.value || '';
        renderRecipes(rtype, searchVal);
      });
    });

    // Recipe search
    const recipeSearch = document.getElementById('recipe-search-input');
    if (recipeSearch) {
      recipeSearch.addEventListener('input', () => {
        const activePill = document.querySelector('.recipe-filter-bar .filter-pill.active')?.dataset.rtype || 'all';
        renderRecipes(activePill, recipeSearch.value);
      });
    }

    // Kitchen action buttons
    const btnEditName = document.getElementById('btn-edit-username');
    if (btnEditName) {
      btnEditName.onclick = () => { sound.playClick(); switchScreen('username'); };
    }
    const btnChangeAge = document.getElementById('btn-change-age-group');
    if (btnChangeAge) {
      btnChangeAge.onclick = () => { sound.playClick(); switchScreen('welcome'); };
    }
    const btnCreateRecipe = document.getElementById('btn-create-new-recipe');
    if (btnCreateRecipe) {
      btnCreateRecipe.onclick = () => { sound.playClick(); openRecipeCreatorModal(); };
    }
    const btnViewAchs = document.getElementById('btn-view-all-achievements');
    if (btnViewAchs) {
      btnViewAchs.onclick = () => { sound.playClick(); switchView('achievements'); };
    }

    // Header Controls: Sound, BGM, Theme, Settings, Mobile Drawer
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.onclick = () => {
        appState.soundEnabled = !appState.soundEnabled;
        sound.soundEnabled = appState.soundEnabled;
        saveState();
        updateSoundButtonIcons();
        if (appState.soundEnabled) sound.playClick();
      };
    }

    const btnBgm = document.getElementById('btn-toggle-bgm');
    if (btnBgm) {
      btnBgm.onclick = () => {
        appState.bgmEnabled = !appState.bgmEnabled;
        saveState();
        if (appState.bgmEnabled) sound.startAmbientBgm();
        else sound.stopAmbientBgm();
        updateBgmButtonIcons();
      };
    }

    const btnTheme = document.getElementById('btn-toggle-theme');
    if (btnTheme) {
      btnTheme.onclick = () => {
        sound.playClick();
        appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
        applyTheme(appState.theme);
        saveState();
      };
    }

    const btnSettings = document.getElementById('btn-open-settings');
    if (btnSettings) {
      btnSettings.onclick = () => { sound.playClick(); openSettingsModal(); };
    }

    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const drawerSettingsBtn = document.getElementById('drawer-settings-btn');

    if (btnMobileMenu && mobileDrawer) {
      btnMobileMenu.onclick = () => { sound.playClick(); mobileDrawer.classList.add('open'); };
    }
    if (btnCloseDrawer && mobileDrawer) {
      btnCloseDrawer.onclick = () => { sound.playClick(); mobileDrawer.classList.remove('open'); };
    }
    if (drawerSettingsBtn) {
      drawerSettingsBtn.onclick = () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        openSettingsModal();
      };
    }

    // Arena Modal controls
    const arenaClose = document.getElementById('arena-btn-close');
    if (arenaClose) {
      arenaClose.onclick = () => {
        sound.playClick();
        arenaModal.classList.remove('active');
      };
    }

    const arenaRestart = document.getElementById('arena-btn-restart');
    if (arenaRestart) {
      arenaRestart.onclick = () => {
        sound.playClick();
        if (currentGameInstance && currentGameInstance.meta) {
          launchGame(currentGameInstance.meta.id);
        }
      };
    }

    const arenaSound = document.getElementById('arena-btn-sound');
    if (arenaSound) {
      arenaSound.onclick = () => {
        appState.soundEnabled = !appState.soundEnabled;
        sound.soundEnabled = appState.soundEnabled;
        saveState();
        updateSoundButtonIcons();
      };
    }

    // Victory screen action buttons
    const vicReplay = document.getElementById('victory-btn-replay');
    if (vicReplay) {
      vicReplay.onclick = () => {
        sound.playClick();
        if (currentGameInstance && currentGameInstance.meta) {
          launchGame(currentGameInstance.meta.id);
        }
      };
    }
    const vicGames = document.getElementById('victory-btn-games');
    if (vicGames) {
      vicGames.onclick = () => {
        sound.playClick();
        arenaModal.classList.remove('active');
        switchView('games');
      };
    }
    const vicKitchen = document.getElementById('victory-btn-kitchen');
    if (vicKitchen) {
      vicKitchen.onclick = () => {
        sound.playClick();
        arenaModal.classList.remove('active');
        switchView('kitchen');
      };
    }

    // Modal Close buttons
    const recipeClose = document.getElementById('recipe-modal-close');
    if (recipeClose && recipeModal) {
      recipeClose.onclick = () => { sound.playClick(); recipeModal.classList.remove('active'); };
    }

    const creatorClose = document.getElementById('creator-modal-close');
    if (creatorClose && creatorModal) {
      creatorClose.onclick = () => { sound.playClick(); creatorModal.classList.remove('active'); };
    }

    const settingsClose = document.getElementById('settings-modal-close');
    if (settingsClose && settingsModal) {
      settingsClose.onclick = () => { sound.playClick(); settingsModal.classList.remove('active'); };
    }

    const confirmCancel = document.getElementById('confirm-btn-cancel');
    if (confirmCancel && confirmModal) {
      confirmCancel.onclick = () => { sound.playClick(); confirmModal.classList.remove('active'); };
    }

    const confirmYes = document.getElementById('confirm-btn-yes');
    if (confirmYes && confirmModal) {
      confirmYes.onclick = () => {
        sound.playClick();
        confirmModal.classList.remove('active');
        if (typeof onConfirmCallback === 'function') {
          onConfirmCallback();
        }
      };
    }

    // Initialize sub-modules
    initRecipeCreator();
    initSettingsListeners();
  }

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
