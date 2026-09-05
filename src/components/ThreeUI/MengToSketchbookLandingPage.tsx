"use client";
import React, { useEffect, useRef } from 'react';
import './MengToSketchbookLandingPage.css';

export default function MengToSketchbookLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Copy all the JS logic here, but limit queries to the container
    const Q = new URLSearchParams(window.location.search);
    const DIR = '/meng-to-sketchbook/';
    const PAGES = [
      {file:'marina-bay-sands.png',   title:'Marina Bay Sands',          place:'Bayfront'},
      {file:'gardens-by-the-bay.png', title:'Gardens by the Bay',        place:'Supertree Grove'},
      {file:'merlion.png',            title:'The Merlion',               place:'Merlion Park'},
      {file:'buddha-tooth.png',       title:'Buddha Tooth Relic Temple', place:'Chinatown'},
      {file:'joo-chiat.png',          title:'Joo Chiat Shophouses',      place:'Katong'},
      {file:'lau-pa-sat.png',         title:'Lau Pa Sat',                place:'Raffles Quay'},
      {file:'marina-bay-skyline.png', title:'Marina Bay Skyline',        place:'The Bay'},
      {file:'singapore-river.png',    title:'Singapore River',           place:'Boat Quay'},
      {file:'botanic-gardens.png',    title:'Botanic Gardens',           place:'Tanglin'}
    ].map(p => ({ ...p, url: DIR + p.file }));
    const M = PAGES.length, LAND = 6;

    const wrap = container.querySelector('#sbWrap') as HTMLElement;
    const stage = container.querySelector('#sbStage') as HTMLElement;
    const sb3d = container.querySelector('#sb3d') as HTMLElement;
    const book = container.querySelector('#sbBook') as HTMLElement;
    const capBox = container.querySelector('#sbCaptions') as HTMLElement;
    const hint = container.querySelector('#sbHint') as HTMLElement;
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------ the turning leaf */
    const N = 18;            /* strips — enough for a smooth curve          */
    const SPAN = 0.449;      /* gutter → outer page edge, as a fraction     */
    const BETA = 0.60;       /* peak curl of the arc, radians              */
    let idx = 0, turn: any = null;  /* turn = {dir, from, to, t}                   */
    let strips: any[] = [];         /* the chain, kept for per-frame lighting       */

    function el(t: string, c?: string) { const e = document.createElement(t); if(c) e.className = c; return e; }
    function imgEl(i: number, side: string) {
      const im = new Image(); im.className = 'sb-half-img ' + side;
      im.draggable = false; im.alt = ''; im.src = PAGES[i].url; return im;
    }

    function halfEl(pos: string, i: number) {
      const d = el('div', 'sb-half ' + pos);
      d.appendChild(imgEl(i, pos));
      d.appendChild(el('div', 'gutter-shade ' + pos));
      return d;
    }
    
    function buildCurl(dir: string, from: number, to: number) {
      strips = [];
      const c = el('div', 'curl ' + dir);
      c.style.setProperty('--n', N.toString());
      c.style.setProperty('--span', SPAN.toString());
      let host = c;
      for (let i = 0; i < N; i++) {
        const s = el('div', 'strip');
        s.style.setProperty('--i', i.toString());
        const gut = 'calc(var(--bw) * 0.5)';
        const sw = 'calc(var(--bw) * ' + SPAN + ' / ' + N + ')';
        const A = 'calc(-1 * (' + gut + ' + ' + i + ' * ' + sw + '))';         
        const B = 'calc(' + (i + 1) + ' * ' + sw + ' - ' + gut + ')';            
        const f = el('div', 'face front'), b = el('div', 'face back');
        const dress = (e: HTMLElement, url: string, px: string) => {
          e.style.backgroundImage = 'url(' + url + ')';
          e.style.backgroundPositionX = px;
        };
        dress(f, PAGES[from].url, dir === 'next' ? A : B);
        dress(b, PAGES[to].url,   dir === 'next' ? B : A);
        f.appendChild(el('div', 'sh')); f.appendChild(el('div', 'gl'));
        b.appendChild(el('div', 'sh')); b.appendChild(el('div', 'gl'));
        s.appendChild(f); s.appendChild(b);
        if (i === N - 1) s.classList.add('edge');
        host.appendChild(s); host = s;
        strips.push(s);
      }
      return c;
    }

    function applyTurn(t: number) {
      const th = Math.PI * t;                       
      const beta = BETA * Math.sin(Math.PI * t);      
      const D = 180 / Math.PI;
      const tt = th + beta, td = 2 * beta / N;
      sb3d.style.setProperty('--tt', (tt * D).toFixed(2) + 'deg');
      sb3d.style.setProperty('--td', (td * D).toFixed(3) + 'deg');
      sb3d.style.setProperty('--shade', Math.sin(Math.PI * t).toFixed(3));
      fadeCaption(t);
      for (let i = 0; i < strips.length; i++) {
        const l1 = Math.abs(Math.cos(tt - i * td));        
        const l2 = Math.abs(Math.cos(tt - (i + 1) * td));    
        const st = strips[i].style;
        st.setProperty('--lit', l1.toFixed(3));
        st.setProperty('--a1', ((1 - l1) * .62).toFixed(3));
        st.setProperty('--a2', ((1 - l2) * .62).toFixed(3));
      }
    }

    function paint() {
      if(!book) return;
      book.textContent = '';
      if (!turn) {
        const f = el('div', 'sb-full');
        const im = new Image(); im.src = PAGES[idx].url; im.alt = PAGES[idx].title;
        im.draggable = false;
        f.appendChild(im); book.appendChild(f);
        sb3d.style.setProperty('--shade', '0');
      } else {
        const next = turn.dir === 'next';
        book.appendChild(halfEl('left', next ? turn.from : turn.to));
        book.appendChild(halfEl('right', next ? turn.to : turn.from));
        book.appendChild(buildCurl(turn.dir, turn.from, turn.to));
        applyTurn(turn.t);
      }
      const a = el('button', 'sb-zone sb-prev'), b = el('button', 'sb-zone sb-next');
      a.setAttribute('aria-label', 'previous page'); b.setAttribute('aria-label', 'next page');
      book.appendChild(a); book.appendChild(b);
      layout();
      caption();
      marks();
      if (typeof syncZoomLayer === 'function') syncZoomLayer();
      if (typeof placeLoupe === 'function') placeLoupe();
    }

    let capOut: HTMLElement | null = null, capIn: HTMLElement | null = null;
    function caption() {
      if(!capBox) return;
      capBox.textContent = '';
      capOut = capIn = null;
      if (turn) {
        capOut = el('p', 'sb-caption live'); capOut.textContent = PAGES[turn.from].title; capBox.appendChild(capOut);
        capIn = el('p', 'sb-caption live'); capIn.textContent = PAGES[turn.to].title; capBox.appendChild(capIn);
        fadeCaption(turn.t);
      } else {
        const p = el('p', 'sb-caption'); p.textContent = PAGES[idx].title; capBox.appendChild(p);
      }
    }

    function fadeCaption(t: number) {
      if (!capOut || !capIn) return;
      const out = 1 - Math.max(0, Math.min(1, (t - 0.10) / 0.28));
      const inn = Math.max(0, Math.min(1, (t - 0.56) / 0.30));
      capOut.style.opacity = out.toFixed(3);
      capIn.style.opacity = inn.toFixed(3);
    }

    function layout() {
      if(sb3d && book) sb3d.style.setProperty('--bw', book.clientWidth + 'px');
    }
    window.addEventListener('resize', layout);

    let spring: any = null;
    function animateTo(target: number, onDone: Function, stiff?: number, damp?: number) {
      spring = {kind: 'spring', v: 0, target: target, done: onDone, k: stiff || 150, c: damp || 22};
      kick();
    }
    function tweenTo(target: number, dur: number, onDone: Function) {
      spring = {kind: 'tween', from: turn ? turn.t : 0, target: target, dur: dur, e: 0, done: onDone};
      kick();
    }

    let raf: any = null, last = 0;
    function tick(now: number) {
      raf = null;
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016); last = now;
      if (spring && turn) {
        const s = spring;
        if (s.kind === 'tween') {
          s.e += dt;
          const k = Math.min(1, s.e / s.dur);
          turn.t = s.from + (s.target - s.from) * k;
          applyTurn(turn.t);
          if (k >= 1) { spring = null; const d = s.done; d && d(); }
        } else {
          const x = turn.t - s.target;
          s.v += (-s.k * x - s.c * s.v) * dt;
          turn.t += s.v * dt;
          if (Math.abs(turn.t - s.target) < 0.002 && Math.abs(s.v) < 0.02) {
            turn.t = s.target; spring = null;
            applyTurn(turn.t);
            const d = s.done; d && d();
          } else applyTurn(turn.t);
        }
      }
      viewSpring();
      const lmoved = loupeEase();
      if ((spring || viewActive || lmoved) && raf === null) raf = requestAnimationFrame(tick);
    }
    function kick() { if (raf === null) { last = performance.now(); raf = requestAnimationFrame(tick); } }

    const TILT_X = 4.5, TILT_Y = 7;      
    const ZOOM_MIN = 0.9, ZOOM_MAX = 1.5;
    const view = {rx: 0, ry: 0, z: 1, trx: 0, try_: 0, tz: 1};
    let viewActive = false;
    let lastZ = 1;

    function applyView() {
      if(!sb3d) return;
      sb3d.style.setProperty('--rx', view.rx.toFixed(2) + 'deg');
      sb3d.style.setProperty('--ry', view.ry.toFixed(2) + 'deg');
      sb3d.style.setProperty('--zoom', view.z.toFixed(3));
      if (view.z !== lastZ) { lastZ = view.z; if (typeof placeLoupe === 'function') placeLoupe(); }
    }

    function viewSpring() {
      const e = 0.14;
      let moved = false;
      const props: [keyof typeof view, keyof typeof view][] = [['rx', 'trx'], ['ry', 'try_'], ['z', 'tz']];
      for (const [k, t] of props) {
        const d = view[t] - view[k];
        if (Math.abs(d) > 0.0006) { view[k] += d * e; moved = true; }
        else view[k] = view[t];
      }
      if (moved) applyView();
      viewActive = moved;
      return moved;
    }

    function setView(rx: number, ry: number, z: number) {
      view.trx = Math.max(-TILT_X, Math.min(TILT_X, rx));
      view.try_ = Math.max(-TILT_Y, Math.min(TILT_Y, ry));
      view.tz = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
      viewActive = true; kick();
      if (typeof syncZoom === 'function') syncZoom();
    }

    function tiltTo(cx: number, cy: number) {
      if (drag || !book) return;                       
      const r = book.getBoundingClientRect();
      if (!r.width) return;
      const nx = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.62)));
      const ny = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)));
      setView(-ny * TILT_X, nx * TILT_Y, view.tz);
    }
    
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      tiltTo(e.clientX, e.clientY);
    };
    window.addEventListener('pointermove', handlePointerMove, {passive: true});
    window.addEventListener('pointerout', (e) => { if (!e.relatedTarget) setView(0, 0, view.tz); });
    window.addEventListener('blur', () => setView(0, 0, view.tz));
    if(stage) stage.addEventListener('dblclick', () => setView(view.trx, view.try_, 1));

    let drag: any = null;
    function bookRect() { return book.getBoundingClientRect(); }
    function hideHint() { if(hint) hint.classList.add('gone'); }

    if(stage) {
      stage.addEventListener('pointerdown', (e: PointerEvent) => {
        if (e.button !== 0) return;
        e.preventDefault();                     
        const target = e.target as HTMLElement;
        const onBook = target.closest('.sb-zone');
        stage.setPointerCapture(e.pointerId);
        hideHint();
        if (!onBook || introOn) return;
        const r = bookRect();
        const dir = (e.clientX - r.left) / r.width > 0.5 ? 'next' : 'prev';
        startTurn(dir, 0);
        drag = {dir: dir, x0: e.clientX, w: r.width, moved: 0, vel: 0, tPrev: performance.now()};
      });
      stage.addEventListener('pointermove', (e: PointerEvent) => {
        if (!drag) return;
        const dx = e.clientX - drag.x0;
        drag.moved = Math.max(drag.moved, Math.abs(dx));
        const raw = (drag.dir === 'next' ? -dx : dx) / (drag.w * 0.62);
        const t = Math.max(0, Math.min(1, raw));
        const now = performance.now();
        drag.vel = (t - (turn ? turn.t : 0)) / Math.max(0.001, (now - drag.tPrev) / 1000);
        drag.tPrev = now;
        if (turn) { turn.t = t; applyTurn(t); }
      });
      function endDrag(e: PointerEvent) {
        if (!drag) return;
        const d = drag; drag = null;
        if (!turn) return;
        if (d.moved < 6) {                              
          commit(); return;
        }
        const go = turn.t > 0.42 || d.vel > 1.1;
        if (go) commit(); else cancel();
      }
      stage.addEventListener('dragstart', (e: Event) => e.preventDefault());
      stage.addEventListener('selectstart', (e: Event) => e.preventDefault());
      stage.addEventListener('pointerup', endDrag as any);
      stage.addEventListener('pointercancel', endDrag as any);
    }

    function startTurn(dir: string, t: number) {
      spring = null;
      if (turn) { idx = turn.to; turn = null; }      
      if (typeof shoveLoupe === 'function') shoveLoupe(dir);
      const from = idx;
      turn = {dir: dir, from: from, to: dir === 'next' ? (from + 1) % M : (from - 1 + M) % M, t: t || 0};
      paint();
    }
    function commit() {
      if (!turn) return;
      if (REDUCED) { idx = turn.to; turn = null; paint(); return; }
      animateTo(1, () => { idx = turn.to; turn = null; paint(); }, 170, 26);
      kick();
    }
    function cancel() {
      if (!turn) return;
      animateTo(0, () => { turn = null; paint(); }, 150, 24);
      kick();
    }
    function step(dir: string) {
      if (introOn) endIntro();
      if (turn) { idx = turn.to; turn = null; }
      startTurn(dir, 0); commit();
    }
    function goTo(i: number) {
      if (introOn) endIntro();
      if (i === idx) return;
      if (turn) { idx = turn.to; turn = null; }
      const fwd = (i - idx + M) % M, back = (idx - i + M) % M;
      if (Math.min(fwd, back) === 1) { step(fwd === 1 ? 'next' : 'prev'); return; }
      idx = i; paint();
    }
    
    const sbLeft = container.querySelector('#sbLeft') as HTMLElement;
    const sbRight = container.querySelector('#sbRight') as HTMLElement;
    if(sbLeft) sbLeft.onclick = () => step('prev');
    if(sbRight) sbRight.onclick = () => step('next');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      e.preventDefault(); hideHint();
      step(e.key === 'ArrowRight' ? 'next' : 'prev');
    };
    window.addEventListener('keydown', handleKeyDown);

    const loupe = container.querySelector('#loupe') as HTMLElement;
    const lens = container.querySelector('#loupeLens') as HTMLElement;
    const mag = container.querySelector('#loupeMag') as HTMLElement;
    const zRead = container.querySelector('#zRead') as HTMLElement;
    const loupeBtn = container.querySelector('#loupeBtn') as HTMLElement;
    const zInBtn = container.querySelector('#zIn') as HTMLButtonElement;
    const zOutBtn = container.querySelector('#zOut') as HTMLButtonElement;
    const MAG = 2.3;
    let loupeOn = true, lx: number | null = null, ly: number | null = null, lgrab: any = null, lTarget: any = null;

    function loupeSize() { return Math.round(Math.max(165, Math.min(262, book.clientWidth * 0.235))); }
    function bookBox() { return {x: 0, y: 0, w: book.clientWidth, h: book.clientHeight}; }
    function restLoupe() {
      const b = bookBox();
      lx = b.x + b.w * 0.88; ly = b.y + b.h * 0.855;
      placeLoupe();
    }
    
    const zoomWrap = container.querySelector('#zoomWrap') as HTMLElement;
    const zoomInner = container.querySelector('#zoomInner') as HTMLElement;
    function syncZoomLayer() {
      if(!zoomInner || !book) return;
      zoomInner.textContent = '';
      for (const c of Array.from(book.children)) {
        if (c.classList.contains('sb-zone')) continue;      
        zoomInner.appendChild(c.cloneNode(true));
      }
    }
    
    function placeLoupe() {
      if (lx === null || ly === null || !loupe || !zoomWrap || !zoomInner) return;
      const B = bookBox(), bw = B.w, bh = B.h;
      if (!bw) return;
      const R = loupeSize() / 2, bez = R * 2 * 0.058;
      loupe.style.setProperty('--lr', R * 2 + 'px');
      loupe.style.transform = 'translate3d(' + (lx - R).toFixed(1) + 'px,' + (ly - R).toFixed(1) + 'px,0)';
      if (loupeOn) loupe.classList.add('on');

      const z = view.z, cx = bw / 2, cy = bh / 2;
      const x0 = cx + (bw * .051 - cx) * z, x1 = cx + (bw * .949 - cx) * z;
      const y0 = cy + (bh * .218 - cy) * z, y1 = cy + (bh * .782 - cy) * z;
      const nx = Math.max(x0, Math.min(lx, x1));
      const ny = Math.max(y0, Math.min(ly, y1));
      const inside = (lx > x0 && lx < x1 && ly > y0 && ly < y1)
        ? Math.min(lx - x0, x1 - lx, ly - y0, y1 - ly)
        : -Math.hypot(lx - nx, ly - ny);
      const k = Math.max(0, Math.min(1, (inside + R * 0.30) / (R * 0.55)));

      zoomWrap.style.opacity = (loupeOn ? k : 0).toFixed(3);
      if (k <= 0.002) return;
      const r = (R - bez).toFixed(1);
      const mask = 'radial-gradient(circle ' + r + 'px at ' + lx.toFixed(1) + 'px ' + ly.toFixed(1) + 'px,#000 calc(100% - 1px),transparent 100%)';
      zoomWrap.style.webkitMaskImage = mask;
      zoomWrap.style.maskImage = mask;
      const px = cx + (lx - cx) / z, py = cy + (ly - cy) / z, s = MAG * z;
      zoomInner.style.transform = 'translate(' + (lx - px * s).toFixed(1) + 'px,' + (ly - py * s).toFixed(1) + 'px) ' + 'scale(' + s.toFixed(4) + ')';
    }
    
    function shoveLoupe(dir: string) {
      if (!loupeOn || lx === null || ly === null || lgrab) return;
      const b = bookBox();
      const nx = (b.w / 2 + (lx - b.x - b.w / 2) / view.z) / b.w, ny = (b.h / 2 + (ly - b.y - b.h / 2) / view.z) / b.h;
      if (nx < 0.02 || nx > 0.98 || ny < 0.17 || ny > 0.83) return;      
      lTarget = {x: b.x + b.w * (dir === 'next' ? 0.12 : 0.88), y: b.y + b.h * 0.855};
      kick();
    }
    function loupeEase() {
      if (!lTarget) return false;
      if (lgrab) { lTarget = null; return false; }
      const dx = lTarget.x - lx!, dy = lTarget.y - ly!;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) { lx = lTarget.x; ly = lTarget.y; lTarget = null; placeLoupe(); return false; }
      lx! += dx * 0.17; ly! += dy * 0.17; placeLoupe();
      return true;
    }
    
    if(loupe) {
      loupe.addEventListener('pointerdown', (e: PointerEvent) => {
        if (!loupeOn || e.button !== 0) return;
        e.preventDefault(); e.stopPropagation();     
        lTarget = null;
        lgrab = {cx: e.clientX, cy: e.clientY, lx0: lx, ly0: ly};
        loupe.classList.add('held');
        loupe.setPointerCapture(e.pointerId);
        hideHint();
      });
      loupe.addEventListener('pointermove', (e: PointerEvent) => {
        if (!lgrab) return;
        const b = bookBox(), R = loupeSize() / 2;
        lx = Math.max(b.x - R * 0.7, Math.min(b.x + b.w + R * 0.7, lgrab.lx0 + (e.clientX - lgrab.cx)));
        ly = Math.max(b.y - R * 0.7, Math.min(b.y + b.h + R * 1.0, lgrab.ly0 + (e.clientY - lgrab.cy)));
        placeLoupe();
      });
      const dropLoupe = () => { lgrab = null; loupe.classList.remove('held'); };
      loupe.addEventListener('pointerup', dropLoupe as any);
      loupe.addEventListener('pointercancel', dropLoupe as any);
    }
    if(loupeBtn) loupeBtn.onclick = () => {
      loupeOn = !loupeOn;
      loupeBtn.setAttribute('aria-pressed', String(loupeOn));
      loupe?.classList.toggle('on', loupeOn);
      if (loupeOn && lx === null) restLoupe();
    };
    
    function syncZoom() {
      if(zRead) zRead.textContent = Math.round(view.tz * 100) + '%';
      if(zOutBtn) zOutBtn.disabled = view.tz <= ZOOM_MIN + 0.001;
      if(zInBtn) zInBtn.disabled = view.tz >= ZOOM_MAX - 0.001;
    }
    if(zInBtn) zInBtn.onclick = () => { setView(view.trx, view.try_, view.tz * 1.16); hideHint(); };
    if(zOutBtn) zOutBtn.onclick = () => { setView(view.trx, view.try_, view.tz / 1.16); hideHint(); };

    const plateList = container.querySelector('#plateList') as HTMLElement;
    if(plateList) {
      PAGES.forEach((p, i) => {
        const li = el('li');
        const b = el('button', 'plate');
        b.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
                      '<span class="t"></span><span class="p"></span>';
        b.querySelector('.t')!.textContent = p.title;
        b.querySelector('.p')!.textContent = p.place;
        b.onclick = () => { goTo(i); container.querySelector('#sketchbook')?.scrollIntoView({behavior: 'smooth', block: 'center'}); };
        li.appendChild(b); plateList.appendChild(li);
      });
    }
    function marks() {
      if(!plateList) return;
      const cur = turn ? turn.to : idx;
      plateList.querySelectorAll('.plate').forEach((b, i) => b.setAttribute('aria-current', i === cur ? 'true' : 'false'));
    }

    let riffle: any = null, riffleAt = 0, introOn = false;
    function endIntro() {
      introOn = false; wrap?.classList.remove('intro', 'b2');
    }
    function riffleStep() {
      const s = riffle[riffleAt];
      wrap?.classList.toggle('b2', s.bell > 0.55);
      startTurn('next', 0);
      tweenTo(1, s.dur, () => {
        idx = turn.to; turn = null;
        riffleAt++;
        if (introOn && riffleAt < riffle.length) { paint(); riffleStep(); }
        else { endIntro(); paint(); }
      });
    }
    function startIntro() {
      const coarse = window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;
      if (coarse || REDUCED || Q.has('nointro')) { idx = LAND; paint(); return; }
      const steps = M + LAND;
      riffle = [];
      for (let r = 0; r < steps; r++) {
        const bell = Math.sin(Math.PI * (r / (steps - 1)));
        riffle.push({bell: bell, dur: 0.26 - 0.19 * bell});
      }
      riffleAt = 0; introOn = true; wrap?.classList.add('intro');
      riffleStep();
    }

    // boot
    idx = Q.has('shot') ? (parseInt(Q.get('shot') as string, 10) || 0) % M : 0;
    paint(); applyView();
    Promise.all(PAGES.map(p => {
      const im = new Image(); im.src = p.url;
      return im.decode ? im.decode().catch(() => {}) : new Promise(r => { im.onload = im.onerror = r; });
    })).then(() => {
      if (document.fonts && document.fonts.ready) document.fonts.ready.catch(() => {});
      syncZoom(); restLoupe();
      if(container) container.dataset.ready = '1';
      if (Q.has('shot')) {
        if (Q.has('t')) { startTurn(Q.get('dir') || 'next', parseFloat(Q.get('t') as string)); }
        return;
      }
      setTimeout(startIntro, 220);
    });

    return () => {
      window.removeEventListener('resize', layout);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
      if(raf) cancelAnimationFrame(raf);
    };

  }, []);

  return (
    <div ref={containerRef} className="sketchbook-container bg-transparent text-[var(--ink)] antialiased overflow-x-hidden font-serif min-h-[100vh] w-full relative">
      <div className="wash" aria-hidden={true}></div>
      <main className="page home relative w-full h-full">
        
  <header className="top text-white">
    <a className="name font-sans text-2xl font-bold tracking-wider opacity-80 hover:opacity-100 transition-opacity" href="#">ANTIGRAVITY</a>
    <nav className="hidden sm:flex text-gray-300">
      <a href="#plates">Features</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <section id="sketchbook" className="hero w-full">
    <img className="botany l mix-blend-screen opacity-20" src="/meng-to-sketchbook/botany-left.png" alt="" aria-hidden={true} />
    <img className="botany r mix-blend-screen opacity-20" src="/meng-to-sketchbook/botany-right.png" alt="" aria-hidden={true} />

    <p className="hero-kicker text-white/70">Orchestrating Next-Generation Web Experiences</p>

    <div className="sb-wrap" id="sbWrap">
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden={true}>
        <filter id="sb-mblur-1"><feGaussianBlur stdDeviation="5 0"/></filter>
        <filter id="sb-mblur-2"><feGaussianBlur stdDeviation="14 0"/></filter>
      </svg>
      <div className="sb-stage w-full" id="sbStage">
        <button className="sb-arrow left text-white/50 hover:text-white" id="sbLeft" aria-label="previous page">
          <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden={true}><polyline points="11,3 3,22 11,41" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="sb-3d" id="sb3d">
          <div className="sb-tilt" id="sbTilt">
            <div className="sb-cast ambient mix-blend-overlay" aria-hidden={true}></div>
            <div className="sb-cast contact mix-blend-overlay" aria-hidden={true}></div>
            <div className="sb-cast hair mix-blend-overlay" aria-hidden={true}></div>
            <div className="sb-book" id="sbBook"></div>
          </div>
          <div className="zoomwrap" id="zoomWrap" aria-hidden={true}><div className="zoominner" id="zoomInner"></div></div>
          <div className="loupe" id="loupe"><span className="grip"></span><span className="ring"><span className="lens" id="loupeLens"><span className="mag" id="loupeMag"></span></span></span></div>
        </div>
        <button className="sb-arrow right text-white/50 hover:text-white" id="sbRight" aria-label="next page">
          <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden={true}><polyline points="3,3 11,22 3,41" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="sb-captions text-white/80" id="sbCaptions"></div>
      <div className="sb-tools !bg-white/10 !border-white/20 text-white" role="group" aria-label="view controls">
        <button className="tool !text-white/70 hover:!text-white hover:!bg-white/20" id="zOut" aria-label="zoom out"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8.6" cy="8.6" r="5.6"/><path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8"/></svg></button>
        <span className="zoom-read text-white/70" id="zRead">100%</span>
        <button className="tool !text-white/70 hover:!text-white hover:!bg-white/20" id="zIn" aria-label="zoom in"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8.6" cy="8.6" r="5.6"/><path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8M8.6 6.2v4.8"/></svg></button>
        <span className="tool-sep !bg-white/20" aria-hidden={true}></span>
        <button className="tool !text-white/70 hover:!text-white hover:!bg-white/20" id="loupeBtn" aria-label="magnifier" aria-pressed={true}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8.8" cy="8.8" r="5.8"/><path d="M13 13l4.4 4.4"/><path d="M6.4 7.2a3.2 3.2 0 0 1 2.4-1.4" opacity=".55"/></svg></button>
      </div>
      <p className="sb-hint text-white/50" id="sbHint">Drag the page to turn · Drag the glass across it</p>
    </div>

  </section>

  <div className="rule mix-blend-screen opacity-30" aria-hidden={true}></div>

  <section id="about" className="about text-white/90">
    <div>
      <p className="section-label !text-white/50">Antigravity Platform</p>
      <p className="bio">Antigravity is the ultimate platform for next-generation web orchestration. Built with the latest AI technologies and a highly adaptable component architecture, it powers experiences that are both beautiful and performant. This sketchbook demo is adapted seamlessly into our Next.js React ecosystem to showcase tactile digital experiences in a modern web app.</p>
    </div>
    <img className="bloom mix-blend-screen opacity-50" src="/meng-to-sketchbook/bloom.png" alt="" aria-hidden={true} />
  </section>

  <div className="rule short mix-blend-screen opacity-30" aria-hidden={true}></div>

  <section id="plates" className="plates text-white/90">
    <p className="section-label !text-white/50">Featured Views</p>
    <ol className="plate-list !border-white/20" id="plateList"></ol>
  </section>

  <div className="rule short mix-blend-screen opacity-30" aria-hidden={true}></div>
  <p className="foot !text-white/50 pb-20" id="contact">Antigravity Platform · Interactive Sketchbook</p>

      </main>
    </div>
  );
}
