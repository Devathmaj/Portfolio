// services.js

// Import GSAP and ScrollTrigger plugin
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Wait for DOM to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
  // Check if current page is the homepage; exit if not
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  // Register ScrollTrigger plugin with GSAP
  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstances = []; // Store ScrollTrigger instances for cleanup

  // Shared cleanup: always kill ScrollTrigger before its timeline so pin spacers are fully reverted
  const cleanupInstances = () => {
    const [timeline, trigger] = scrollTriggerInstances;
    if (trigger && trigger.kill) trigger.kill(true); // Kill ScrollTrigger first — removes pin spacer
    if (timeline && timeline.kill) timeline.kill();  // Then kill the timeline
    scrollTriggerInstances = [];
  };

  // Initialize animations
  const initAnimations = () => {
    const servicesSection = document.querySelector(".services");
    const services = gsap.utils.toArray(".services .service-card");

    if (!servicesSection || !services.length) return;

    // Disable animations on small screens (width <= 1000px)
    if (window.innerWidth <= 1000) {
      cleanupInstances();
      gsap.set(services, { clearProps: "all" });
      gsap.set(".services .service-card-inner", { clearProps: "all" });
      return;
    }

    // Clean up existing ScrollTrigger instances before re-initialising
    cleanupInstances();
    // Clear all GSAP-applied props so desktop re-init always starts from a clean slate
    gsap.set(services, { clearProps: "all" });
    gsap.set(".services .service-card-inner", { clearProps: "all" });

    const serviceCardInners = services
      .map((service) => service.querySelector(".service-card-inner"))
      .filter(Boolean);
    const stackExitDuration = 2.5;
    const entryDuration = 0.6;
    const exitHoldDuration = 1.25;
    const postExitHoldDuration = 0.75;
    const scrollDistance = Math.max(
      window.innerHeight * Math.max(services.length - 0.5, 1),
      2200
    );

    gsap.set(services, {
      zIndex: (index) => index + 1,
      overflow: "hidden",
    });
    gsap.set(serviceCardInners, {
      y: (index) => `${30 + index * 20}vh`,
      opacity: 1,
      force3D: true,
    });

    const servicesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: servicesSection,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    services.forEach((service, index) => {
      const serviceCardInner = service.querySelector(".service-card-inner"); // Inner element for animation

      servicesTimeline.to(serviceCardInner, {
        y: `${index * 1.25}rem`,
        ease: "none",
        duration: index === 0 ? entryDuration : 1,
      });

      if (index !== services.length - 1) {
        servicesTimeline.to({}, { duration: 0.25 });
      }
    });

    if (exitHoldDuration > 0) {
      servicesTimeline.to({}, { duration: exitHoldDuration });
    }

    servicesTimeline.to(serviceCardInners, {
      y: "-130vh",
      opacity: 0,
      ease: "none",
      duration: stackExitDuration,
    });

    if (postExitHoldDuration > 0) {
      servicesTimeline.to({}, { duration: postExitHoldDuration });
    }

    scrollTriggerInstances.push(servicesTimeline, servicesTimeline.scrollTrigger);
  };

  // Run animations on page load
  initAnimations();

  // Recalculate after images/fonts load to match post-resize behavior
  window.addEventListener("load", () => {
    initAnimations();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  // Re-run animations on window resize to recalculate trigger points.
  // Debounced (250ms) so rapid DevTools viewport switches don't fire overlapping inits.
  // ScrollTrigger.refresh() is handled centrally by lenis-scroll.js after a longer delay.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initAnimations();
    }, 250);
  });
});