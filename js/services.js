// services.js — Bento grid scroll-reveal animations

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstances = [];

  const cleanupInstances = () => {
    scrollTriggerInstances.forEach((st) => {
      if (st && st.kill) st.kill(true);
    });
    scrollTriggerInstances = [];
  };

  const initAnimations = () => {
    const platformSection = document.querySelector(".platform-section");
    const bentoCards = gsap.utils.toArray(".bento-card");
    const platformHeader = document.querySelector(".platform-header");

    if (!platformSection || !bentoCards.length) return;

    // Skip animations on small screens or reduced motion
    if (
      window.innerWidth <= 1000 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      cleanupInstances();
      gsap.set(bentoCards, { clearProps: "all" });
      if (platformHeader) gsap.set(platformHeader, { clearProps: "all" });
      return;
    }

    cleanupInstances();
    gsap.set(bentoCards, { clearProps: "all" });
    if (platformHeader) gsap.set(platformHeader, { clearProps: "all" });

    // Set initial states for scroll-reveal
    gsap.set(platformHeader, {
      opacity: 0,
      y: 40,
    });

    gsap.set(bentoCards, {
      opacity: 0,
      y: 60,
      scale: 0.97,
    });

    // Header entrance
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: platformSection,
        start: "top 85%",
        end: "top 50%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    headerTl.to(platformHeader, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: 1,
    });

    scrollTriggerInstances.push(headerTl.scrollTrigger);

    // Bento card staggered reveal
    const cardOrder = [".bento-backend", ".bento-systems", ".bento-devops", ".bento-observability"];
    const orderedCards = cardOrder
      .map((sel) => platformSection.querySelector(sel))
      .filter(Boolean);

    orderedCards.forEach((card, index) => {
      const isObservability = card.classList.contains("bento-observability");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "top 55%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "power2.out",
        duration: 1,
      });

      // Observability card gets a subtle continuous pulse
      if (isObservability) {
        const pulseTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        });

        pulseTl.to(card, {
          boxShadow: "0 0 0 1px rgba(127, 182, 176, 0.2), 0 8px 32px rgba(127, 182, 176, 0.12)",
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        scrollTriggerInstances.push(pulseTl.scrollTrigger);
      }

      scrollTriggerInstances.push(tl.scrollTrigger);
    });
  };

  initAnimations();

  window.addEventListener("load", () => {
    initAnimations();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initAnimations();
    }, 250);
  });
});
