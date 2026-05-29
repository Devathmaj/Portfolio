import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".sticky-cols");
    if (!section) return;

    // Helper to split text by <br /> to mimic SplitText behavior
    const splitTextLines = (element) => {
        const html = element.innerHTML;
        // Split by <br> or <br/> or <br />
        const lines = html.split(/<br\s*\/?>/i);
        element.innerHTML = '';
        lines.forEach(text => {
            const line = document.createElement('div');
            line.className = 'line';
            const span = document.createElement('span');
            span.innerHTML = text;
            line.appendChild(span);
            element.appendChild(line);
        });
    };

    // 1️⃣ Split text lines once DOM ready
    const textElements = document.querySelectorAll(".col-3 .sc-heading, .col-3 .sc-desc");
    textElements.forEach((element) => {
        splitTextLines(element);
    });

    // Use GSAP matchMedia to only apply animations on desktop viewports (min-width: 1001px)
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1001px)", () => {
        // 2️⃣ Initial state
        gsap.set(".col-2", { x: "100%" });
        gsap.set(".col-3", { x: "100%", y: "100%" });
        gsap.set(".col-4", { x: "100%", y: "100%" });
        gsap.set(".col-3 .col-content-wrapper .line span", { yPercent: 0 });
        gsap.set(".col-3 .col-content-wrapper-2 .line span", { yPercent: -125 });
        gsap.set(".col-3 .col-content-wrapper-3 .line span", { yPercent: -125 });

        // Helper to toggle reveal states
        const setReveal = (reveal, counterValue) => {
            if (reveal) {
                section.classList.add('reveal');
                const dynamicCounter = document.querySelector('.dynamic-counter');
                if (dynamicCounter && counterValue) dynamicCounter.innerText = counterValue;
            } else {
                section.classList.remove('reveal');
                const dynamicCounter = document.querySelector('.dynamic-counter');
                if (dynamicCounter && counterValue) dynamicCounter.innerText = counterValue;
            }
        };

        // 3️⃣ Controlled phase logic using timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".sticky-cols",
                start: "top top",
                end: "+=350%",
                pin: true,
                scrub: 1,
            },
            onUpdate: function() {
                const time = this.time();
                if (time < 1.4) {
                    setReveal(false, "2");
                } else if (time < 2.8) {
                    setReveal(true, "3");
                } else {
                    setReveal(true, "4");
                }
            }
        });
        
        // PHASE 1: Reveal col-2, hide col-1
        tl.to(".col-1", { opacity: 0, scale: 0.8, duration: 0.8 })
            .to(".col-2", { x: "0%", duration: 0.8 }, "<")
            .to(".col-3", { y: "0%", duration: 0.8 }, "<")
            .to(".col-img-1 img", { scale: 1, duration: 0.8 }, "<")
            .to(".col-img-2", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.8,
            }, "<")
            .to(".col-img-2 img", { scale: 1, duration: 0.8 }, "<");

        // PHASE 2: Switch col-2 -> col-3 content
        tl.to(".col-2", { opacity: 0, scale: 0.8, duration: 0.8 })
            .to(".col-3 .col-content-wrapper .line span", {
                yPercent: -125,
                duration: 0.8,
            }, "<")
        tl.to(".col-3", { x: "0%", duration: 0.8 }, "-=0.8")
            .to(".col-4", { y: "0%", duration: 0.8 }, "<")
            .to(".col-3 .col-content-wrapper-2 .line span", {
                yPercent: 0,
                delay: 0.4,
                duration: 0.8,
            }, "<");

        // PHASE 3: Switch col-3 content (wrapper-2 -> wrapper-3)
        tl.to(".col-3 .col-content-wrapper-2 .line span", {
                yPercent: -125,
                duration: 1.2,
            })
            .to(".col-3 .col-content-wrapper-3 .line span", {
                yPercent: 0,
                delay: 0.4,
                duration: 1.2,
            }, "<")
            .to(".col-img-3", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 1.2,
            }, "<")
            .to(".col-img-3 img", { scale: 1, duration: 1.2 }, "<");
    });
});
