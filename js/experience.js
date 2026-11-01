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
        gsap.set(".col-3", { x: "0%", y: "100%" });
        gsap.set(".col-3 .col-content-wrapper .line span", { yPercent: 0 });

        // 3️⃣ Slide the second experience entry in while revealing its image
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".sticky-cols",
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 1,
            },
        });

        tl.to(".col-1", { opacity: 0, scale: 0.8, duration: 0.8 })
            .to(".col-3", { y: "0%", duration: 0.8 }, "<")
            .to(".col-img-2", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.8,
            }, "<")
            .to(".col-img-2 img", { scale: 1, duration: 0.8 }, "<");
    });
});
