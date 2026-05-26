// hero.js

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

  // Select hero image element
  const heroImg = document.querySelector(".hero-img img");
  const heroImages = [
    "/images/work-items/Continumm.png",
    "/images/work-items/storageos.jpg",
    "/images/work-items/Confessit.png",
    "/images/work-items/tracient.png",
    "/images/work-items/serverscribe.png",
    "/images/work-items/netbackup.png",
    "/images/work-items/dms.png",
    "/images/work-items/instagramparser.jpg",
    "/images/work-items/winningtracker.png",
    "/images/work-items/wordle.png",
  ];
  let currentImageIndex = 0; // Tracks current image in sequence
  let scrollTriggerInstance = null; // Stores ScrollTrigger instance for cleanup

  // Cycle through images every 250ms
  setInterval(() => {
    // Increment image index, reset to 1 if it exceeds totalImages
    currentImageIndex =
      currentImageIndex >= heroImages.length - 1 ? 0 : currentImageIndex + 1;
    // Update hero image source
    heroImg.src = heroImages[currentImageIndex];
  }, 250);

  // Initialize animations with ScrollTrigger
  const initAnimations = () => {
    // Kill existing ScrollTrigger instance to prevent duplicates
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    // Create new ScrollTrigger instance
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".hero-img-holder", // Element that triggers animation
      start: "top bottom", // Animation starts when top of trigger hits bottom of viewport
      end: "top top", // Animation ends when top of trigger hits top of viewport
      onUpdate: (self) => {
        const progress = self.progress; // Scroll progress (0 to 1)
        // Animate hero image properties based on scroll progress
        const opacity = 0.25 + 0.75 * progress;
        gsap.set(".hero-img", {
          y: `${-110 + 110 * progress}%`, // Move up from -110% to 0%
          scale: 0.25 + 0.75 * progress, // Scale from 0.25 to 1
          rotation: -15 + 15 * progress, // Rotate from -15deg to 0deg
          opacity,
        });
        gsap.set(".hero-img img", {
          opacity,
        });
      },
    });
  };

  // Run animations on page load
  initAnimations();

  // Re-run animations on window resize to recalculate trigger points
  window.addEventListener("resize", () => {
    initAnimations();
  });
});