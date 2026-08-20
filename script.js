(function () {
  'use strict';

  /* ---------- 加载页 ---------- */
  var pre = document.getElementById('preloader');
  if (pre) {
    var pctEl = document.getElementById('prePct');
    var bar = document.getElementById('preBar');
    var pct = 0;
    var timer = setInterval(function () {
      pct += Math.floor(Math.random() * 12) + 4;
      if (pct >= 100) pct = 100;
      if (pctEl) pctEl.textContent = pct;
      if (bar) bar.style.width = pct + '%';
      if (pct >= 100) { clearInterval(timer); setTimeout(function () { pre.classList.add('done'); }, 220); }
    }, 80);
    setTimeout(function () { pre.classList.add('done'); }, 3200);
  }

  /* ---------- 全屏菜单 ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var menuOverlay = document.getElementById('menuOverlay');
  var menuClose = document.getElementById('menuClose');
  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', function () { menuOverlay.classList.add('open'); });
    if (menuClose) menuClose.addEventListener('click', function () { menuOverlay.classList.remove('open'); });
    menuOverlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menuOverlay.classList.remove('open'); });
    });
  }

  /* ---------- 顶部栏滚动背景 ---------- */
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    window.addEventListener('scroll', function () {
      topbar.style.background = window.scrollY > 40 ? 'rgba(10,14,19,.92)' : 'rgba(10,14,19,.72)';
    }, { passive: true });
  }

  /* ---------- 自定义光标 ---------- */
  if (!(window.matchMedia && window.matchMedia('(hover: none)').matches)) {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (dot && ring) {
      var mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
      (function loop() {
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(loop);
      })();
      document.addEventListener('mouseover', function (e) {
        var t = e.target.closest('a, button, .archive-project, .tl-card, video, audio');
        ring.classList.toggle('hover', !!t);
      });
    }
  }

  /* ---------- 滚动进度条 ---------- */
  var prog = document.getElementById('scrollProgress');
  if (prog) {
    function upd() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* ---------- 滚动显现 ---------- */
  var revealTargets = document.querySelectorAll('.section-head, .tl-card, .stage, .archive-project, .mini, .c-card, .about-photo');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 3D 线框圆环 ---------- */
  var torus = document.getElementById('torusCanvas');
  if (torus && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var tctx = torus.getContext('2d');
    var TW = 0, TH = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function tresize() {
      TW = torus.clientWidth; TH = torus.clientHeight;
      torus.width = TW * dpr; torus.height = TH * dpr;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    tresize();
    window.addEventListener('resize', tresize);
    var TR = 130, tr = 46, uSeg = 22, vSeg = 12, tpts = [];
    for (var i = 0; i < uSeg; i++) for (var k = 0; k < vSeg; k++) {
      var u = (i / uSeg) * Math.PI * 2, v = (k / vSeg) * Math.PI * 2;
      tpts.push({ x: (TR + tr * Math.cos(v)) * Math.cos(u), y: tr * Math.sin(v), z: (TR + tr * Math.cos(v)) * Math.sin(u) });
    }
    var rotY = 0, rotX = 0.4, tx = 0, ty = 0, mmx = 0, mmy = 0;
    window.addEventListener('mousemove', function (e) { mmx = (e.clientX / window.innerWidth) - 0.5; mmy = (e.clientY / window.innerHeight) - 0.5; }, { passive: true });
    var acc = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2dd4bf';
    var hx = acc.replace('#', ''); if (hx.length === 3) hx = hx.split('').map(function (c) { return c + c; }).join('');
    var nn = parseInt(hx, 16);
    var rgb = [(nn >> 16) & 255, (nn >> 8) & 255, nn & 255];
    function tframe() {
      tctx.clearRect(0, 0, TW, TH);
      rotY += 0.006; rotX += 0.0016;
      tx += (mmx - tx) * 0.04; ty += (mmy - ty) * 0.04;
      var cy = Math.cos(rotY + tx * 0.8), sy = Math.sin(rotY + tx * 0.8);
      var cx = Math.cos(rotX + ty * 0.6), sx = Math.sin(rotX + ty * 0.6);
      var pr = [];
      for (var i = 0; i < tpts.length; i++) {
        var p = tpts[i];
        var x1 = p.x * cy + p.z * sy, z1 = -p.x * sy + p.z * cy;
        var y1 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
        var sc = 300 / (300 + z2);
        pr.push({ x: TW / 2 + x1 * sc, y: TH / 2 + y1 * sc, z: z2 });
      }
      function edge(a, b) {
        var pa = pr[a], pb = pr[b];
        var az = (pa.z + pb.z) / 2;
        var al = (0.05 + Math.max(0, 1 - (az + 200) / 400) * 0.22).toFixed(3);
        tctx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + al + ')';
        tctx.lineWidth = 1;
        tctx.beginPath(); tctx.moveTo(pa.x, pa.y); tctx.lineTo(pb.x, pb.y); tctx.stroke();
      }
      for (var i2 = 0; i2 < uSeg; i2++) for (var k2 = 0; k2 < vSeg; k2++) {
        var a = i2 * vSeg + k2, b = ((i2 + 1) % uSeg) * vSeg + k2, c2 = i2 * vSeg + ((k2 + 1) % vSeg);
        edge(a, b); edge(a, c2);
      }
      for (var i3 = 0; i3 < pr.length; i3++) {
        var pp = pr[i3];
        if (pp.z > -60) {
          tctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.35)';
          tctx.beginPath(); tctx.arc(pp.x, pp.y, 1.4, 0, Math.PI * 2); tctx.fill();
        }
      }
      requestAnimationFrame(tframe);
    }
    requestAnimationFrame(tframe);
  }

  /* ---------- 环境粒子网络 ---------- */
  var bg = document.getElementById('bgCanvas');
  if (bg && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var bctx = bg.getContext('2d');
    var W = 0, H = 0, parts = [], mouse = { x: null, y: null };
    var acc2 = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2dd4bf';
    var hx2 = acc2.replace('#', ''); if (hx2.length === 3) hx2 = hx2.split('').map(function (x) { return x + x; }).join('');
    var n2 = parseInt(hx2, 16);
    var rgb2 = [(n2 >> 16) & 255, (n2 >> 8) & 255, n2 & 255];
    function bresize() { W = bg.width = window.innerWidth; H = bg.height = window.innerHeight; }
    window.addEventListener('resize', bresize);
    bresize();
    var count = Math.min(90, Math.max(36, Math.floor((W * H) / 20000)));
    for (var i = 0; i < count; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: 1 + Math.random() * 1.5 });
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('mouseout', function () { mouse.x = null; mouse.y = null; });
    var linkDist = 130;
    function bframe() {
      bctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        if (mouse.x != null) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150 && d > 0.01) { p.x += (dx / d) * 0.8; p.y += (dy / d) * 0.8; }
        }
        bctx.beginPath(); bctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bctx.fillStyle = 'rgba(' + rgb2[0] + ',' + rgb2[1] + ',' + rgb2[2] + ',0.5)'; bctx.fill();
      }
      for (var a = 0; a < parts.length; a++) for (var b = a + 1; b < parts.length; b++) {
        var pa = parts[a], pb = parts[b];
        var ddx = pa.x - pb.x, ddy = pa.y - pb.y, dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < linkDist) {
          bctx.beginPath(); bctx.moveTo(pa.x, pa.y); bctx.lineTo(pb.x, pb.y);
          bctx.strokeStyle = 'rgba(' + rgb2[0] + ',' + rgb2[1] + ',' + rgb2[2] + ',' + (0.13 * (1 - dd / linkDist)).toFixed(3) + ')';
          bctx.lineWidth = 1; bctx.stroke();
        }
      }
      requestAnimationFrame(bframe);
    }
    requestAnimationFrame(bframe);
  }

  /* ---------- 游戏海报条带 ---------- */
  var track = document.getElementById('pmTrack');
  if (track) {
    var items = [
      ['魔兽世界', 'CG 音效'], ['三角洲行动', 'CG 音效'], ['炉石传说', 'UI 音效'],
      ['守望先锋', '枪械音效'], ['鸣潮', '技能音效'], ['原神', 'UI 音效'],
      ['明日方舟·终末地', 'UI 音效'], ['3D Game Kit', 'Wwise × Unity'],
      ['古谱吟唱音乐会', '原创作曲'], ['视唱练耳教材', '音频制作'],
      ['新声杯作曲比赛', '三等奖'], ['夜舞铃影', '电子音乐'],
      ['霓虹·涟漪', '电子音乐'], ['海洋之歌', '电子音乐']
    ];
    var grads = [
      'linear-gradient(135deg,#0f3d5f,#123a5f 45%,#1e5a8a)', 'linear-gradient(135deg,#0e4d4a,#115e57 50%,#1a7a6f)',
      'linear-gradient(135deg,#3b2f63,#4b3a86 50%,#6d54b8)', 'linear-gradient(135deg,#4a2347,#6b2d5f 50%,#94457f)',
      'linear-gradient(135deg,#0f3557,#164e7a 50%,#2471ab)', 'linear-gradient(135deg,#3a2a52,#543a74 50%,#7a55a3)',
      'linear-gradient(135deg,#12433f,#17655c 50%,#249183)', 'linear-gradient(135deg,#4a3a24,#6b552d 50%,#947a3f)'
    ];
    function card(it, i) {
      var d = document.createElement('div');
      d.className = 'pm-card';
      d.style.background = grads[i % grads.length];
      d.innerHTML = '<span>' + it[1] + '</span><b>' + it[0] + '</b>';
      return d;
    }
    for (var rep = 0; rep < 2; rep++) {
      items.forEach(function (it, i) { track.appendChild(card(it, i)); });
    }
  }
})();
