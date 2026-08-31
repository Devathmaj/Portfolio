// services.js — Orbital ring carousel (scroll-driven)

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  const TOTAL = 4;
  const STEP_DEG = 360 / TOTAL;
  const SCROLL_PER_CARD = 100;

  let currentIndex = 0;
  let currentAngle = 0;
  let scrollTriggerInstance = null;
  let touchStartY = 0;

  const section = document.querySelector(".platform-section");
  const stage = document.querySelector(".orbital-stage");
  const ring = document.querySelector(".orbital-ring");
  const cards = gsap.utils.toArray(".orbital-card");
  const dots = gsap.utils.toArray(".orbital-dot");

  if (!section || !stage || !ring || !cards.length) return;

  // ── Reduced motion: static layout ──
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const stageW = stage.offsetWidth;
    const cardW = parseFloat(getComputedStyle(cards[0]).width);
    const radius = Math.min(stageW * 0.42, 520);

    cards.forEach((card, i) => {
      const angle = (i * STEP_DEG - 90) * (Math.PI / 180);
      const x = Math.cos(angle) * radius - cardW / 2;
      const y = Math.sin(angle) * radius * 0.35 - 30;
      const dist = Math.abs(Math.round(Math.cos(angle) * 100));
      const s = 1;
      const isBack = i === 2;
      const o = (i === 0 || isBack) ? 1 : 0.5 + (dist / 100) * 0.35;
      const z = i === 0 ? 5 : 5 - dist / 20;

      gsap.set(card, { x, y, scale: s, opacity: o, z });
      card.classList.toggle("orbital-front", i === 0);
    });
    return;
  }

  // ── Orbital geometry ──
  function getRadius() {
    const stageW = stage.offsetWidth;
    return Math.min(stageW * 0.42, 540);
  }

  function getCardWidth() {
    return parseFloat(getComputedStyle(cards[0]).width);
  }

  function orbitPosition(cardIndex, angle) {
    const cardAngle = (cardIndex * STEP_DEG + angle - 90) * (Math.PI / 180);
    const radius = getRadius();
    const cardW = getCardWidth();

    const cosA = Math.cos(cardAngle);
    const sinA = Math.sin(cardAngle);

    const x = cosA * radius - cardW / 2;
    const y = sinA * radius * 0.35 - 30;
    const dist = Math.abs(Math.round(cosA * 100));
    const normalizedDist = dist / 100;

    const frontIdx = ((-Math.round(angle / STEP_DEG) % TOTAL) + TOTAL) % TOTAL;
    const backIdx = (frontIdx + TOTAL / 2) % TOTAL;
    const isFront = cardIndex === frontIdx;
    const isBack = cardIndex === backIdx;

    const s = 1;
    const o = (isFront || isBack) ? 1 : 0.45 + normalizedDist * 0.4;
    const z = isFront ? 5 : isBack ? 3 : 5 - dist / 25;

    return { x, y, s, o, z };
  }

  function applyPosition(card, pos) {
    gsap.set(card, {
      x: pos.x,
      y: pos.y,
      scale: pos.s,
      opacity: pos.o,
      z: pos.z,
    });
  }

  function updateFrontClass(angle) {
    const frontIdx = ((-Math.round(angle / STEP_DEG) % TOTAL) + TOTAL) % TOTAL;
    cards.forEach((card, i) => {
      card.classList.toggle("orbital-front", i === frontIdx);
    });
    return frontIdx;
  }

  function updateDots(idx) {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === idx);
    });
  }

  function positionAll(angle) {
    cards.forEach((card, i) => {
      const pos = orbitPosition(i, angle);
      applyPosition(card, pos);
    });
    const frontIdx = updateFrontClass(angle);
    updateDots(frontIdx);
    currentIndex = frontIdx;
  }

  // ── Scroll-driven rotation (desktop) ──
  function initDesktop() {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill(true);
      scrollTriggerInstance = null;
    }

    const proxy = { angle: 0 };

    // Set exact initial state
    positionAll(0);

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: `+=${(TOTAL - 1) * SCROLL_PER_CARD}%`,
      pin: true,
      scrub: 0.3,
      fastScrollEnd: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const targetAngle = self.progress * (TOTAL - 1) * STEP_DEG;

        cards.forEach((card, i) => {
          const pos = orbitPosition(i, targetAngle);
          applyPosition(card, pos);
        });
        const frontIdx = updateFrontClass(targetAngle);
        updateDots(frontIdx);
        currentIndex = frontIdx;
        currentAngle = targetAngle;
      },
    });
  }

  // ── Touch swipe (mobile) ──
  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50) {
      const dir = dy > 0 ? 1 : -1;
      const nextIdx = ((currentIndex + dir) % TOTAL + TOTAL) % TOTAL;
      const targetAngle = nextIdx * STEP_DEG;

      gsap.to({ angle: currentAngle }, {
        angle: targetAngle,
        duration: 0.7,
        ease: "power3.out",
        onUpdate() {
          const a = this.targets()[0].angle;
          cards.forEach((card, i) => {
            const pos = orbitPosition(i, a);
            applyPosition(card, pos);
          });
          const frontIdx = updateFrontClass(a);
          updateDots(frontIdx);
        },
        onComplete() {
          currentAngle = targetAngle;
          currentIndex = nextIdx;
        },
      });
    }
  }

  function initMobile() {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill(true);
      scrollTriggerInstance = null;
    }

    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  // ── Keyboard ──
  function onKeyDown(e) {
    if (window.innerWidth <= 1000) return;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = ((currentIndex + 1) % TOTAL + TOTAL) % TOTAL;
      const targetAngle = nextIdx * STEP_DEG;

      gsap.to({ angle: currentAngle }, {
        angle: targetAngle,
        duration: 0.7,
        ease: "power3.out",
        onUpdate() {
          const a = this.targets()[0].angle;
          cards.forEach((card, i) => {
            const pos = orbitPosition(i, a);
            applyPosition(card, pos);
          });
          const frontIdx = updateFrontClass(a);
          updateDots(frontIdx);
        },
        onComplete() {
          currentAngle = targetAngle;
          currentIndex = nextIdx;
        },
      });
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = ((currentIndex - 1) % TOTAL + TOTAL) % TOTAL;
      const targetAngle = prevIdx * STEP_DEG;

      gsap.to({ angle: currentAngle }, {
        angle: targetAngle,
        duration: 0.7,
        ease: "power3.out",
        onUpdate() {
          const a = this.targets()[0].angle;
          cards.forEach((card, i) => {
            const pos = orbitPosition(i, a);
            applyPosition(card, pos);
          });
          const frontIdx = updateFrontClass(a);
          updateDots(frontIdx);
        },
        onComplete() {
          currentAngle = targetAngle;
          currentIndex = prevIdx;
        },
      });
    }
  }

  // ── Init ──
  function init() {
    positionAll(currentAngle);

    if (window.innerWidth > 1000) {
      initDesktop();
    } else {
      initMobile();
    }

    window.addEventListener("keydown", onKeyDown);
  }

  init();

  window.addEventListener("load", () => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      init();
    }, 250);
  });
});
