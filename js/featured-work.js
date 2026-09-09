// featured-work.js

// Import GSAP and ScrollTrigger plugin
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Wait for DOM to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
  // Check if current page is the homepage; exit if not
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  gsap.registerPlugin(ScrollTrigger);

  const PROJECTS = [
    {
      id: "voucherbot",
      title: "VoucherBot",
      subtitle: "AI-Powered Certification Voucher Aggregator",
      image: "./images/work-items/VoucherBot.png",
      github: "https://github.com/Devathmaj/VoucherBot",
      summary:
        "Automated certification deal discovery platform that continuously monitors online sources, uses AI to filter genuine voucher opportunities, stores discovered offers, and delivers timely notifications.",
      details: [
        "AI-assisted voucher detection using Groq with Google Gemini as automatic fallback",
        "Reddit API integration for continuously monitoring certification-related posts",
        "Supabase database for persistent storage and duplicate detection",
        "Automated email notifications through Resend",
        "Cloud deployment on Render for continuous 24/7 execution",
        "Discord and Telegram notification bots for instant voucher alerts",
      ],
      stack: [
        "Python 3.11+",
        "Groq",
        "Google Gemini",
        "Supabase",
        "Reddit API",
        "Resend",
        "Render",
        "UptimeRobot",
        "GitHub",
        "Discord",
        "Telegram",
      ],
    },
    {
      id: "football",
      title: "Football Market Intelligence",
      subtitle: "Football Prediction & Market Intelligence Platform",
      github: "https://github.com/Devathmaj/Football-Market-Intelligence",
      summary:
        "Production-grade football analytics platform that combines machine learning, live football data, Elo ratings, squad and injury data, Monte Carlo tournament simulations, and prediction market odds to estimate fair probabilities and identify potentially mispriced markets.",
      details: [
        "XGBoost and Logistic Regression models for match outcome probability estimation",
        "Monte Carlo tournament simulation for World Cup outcome and market analysis",
        "Feature engineering using Elo ratings, squad valuations, injuries, and lineups",
        "Live football data ingestion through API-Football",
        "PostgreSQL database with dedicated schemas for raw data, features, markets, ML outputs, and opportunities",
        "FastAPI backend with REST APIs and interactive Swagger documentation",
        "Next.js frontend dashboard for visualizing predictions, matchups, simulations, and market opportunities",
        "Fully containerized architecture using Docker Compose across database, backend, and frontend services",
      ],
      stack: [
        "Next.js",
        "FastAPI",
        "Python",
        "XGBoost",
        "Logistic Regression",
        "PostgreSQL",
        "Docker",
        "Docker Compose",
        "API-Football",
        "Elo Ratings",
        "Monte Carlo Simulation",
      ],
    },
    {
      id: "continumm",
      title: "Continumm",
      subtitle: "Network Telemetry & Observability Platform",
      image: "./images/work-items/Continumm.png",
      github: "https://github.com/Devathmaj/Continumm",
      summary:
        "Production-grade network monitoring backend that auto-discovers devices, polls health, and exposes results through REST APIs, Prometheus metrics, and Grafana dashboards.",
      details: [
        "Full observability stack: Prometheus, Grafana, Loki, Tempo, Alertmanager, Node Exporter",
        "OpenTelemetry instrumentation with distributed tracing via OTLP to Tempo",
        "Kubernetes manifests (Kustomize) plus Docker Compose with isolated services",
        "Terraform IaC for Azure VM provisioning with cloud-init automation",
        "Nginx reverse proxy with rate limiting and security headers",
        "PostgreSQL advisory locks for leader election across worker replicas",
      ],
      stack: [
        "Python",
        "Flask",
        "Prometheus",
        "Grafana",
        "Loki",
        "Tempo",
        "Terraform",
        "Kubernetes",
        "Docker",
        "PostgreSQL",
      ],
    },
    {
      id: "confessit",
      title: "ConfessIt",
      subtitle: "Anonymous Social & Connection Platform",
      image: "./images/work-items/Confessit.png",
      github: "https://github.com/Devathmaj/ConfessIt-V2",
      summary:
        "Full-stack social platform that provides a safe, anonymous space for users to share confessions, discover connections, exchange love notes, and interact through lightweight social games.",
      details: [
        "Anonymous confession sharing with reactions, comments, likes, and dislikes",
        "User matchmaking system for discovering and connecting with potential matches",
        "Anonymous love notes for private, lightweight social interactions",
        "Mini-games designed to help users break the ice and engage with others",
        "Customizable user profiles with bios, interests, and profile pictures",
        "Magic-link authentication for passwordless and secure user access",
        "Redis-powered backend support alongside MongoDB for application data",
      ],
      stack: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
        "FastAPI",
        "Python",
        "MongoDB",
        "Redis",
        "Docker",
        "Docker Compose",
      ],
    },
  ];

  let scrollTriggerInstance = null;
  let savedScrollPosition = null;

  const initAnimations = () => {
    const indicatorContainer = document.querySelector(".featured-work-indicator");
    const featuredTitles = document.querySelector(".featured-titles");
    const imagesContainer = document.querySelector(".featured-images");
    if (!imagesContainer || !featuredTitles || !indicatorContainer) return;

    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill(true);
      scrollTriggerInstance = null;
    }

    gsap.killTweensOf(".featured-img-card");
    gsap.killTweensOf(".featured-stack-float");
    indicatorContainer.innerHTML = "";
    imagesContainer.innerHTML = "";
    gsap.set(".featured-work", { clearProps: "all" });

    if (window.innerWidth <= 1000) {
      featuredTitles.style.transform = "translateX(0)";
      return;
    }

    // Restore indicator slider
    for (let section = 1; section <= 5; section++) {
      const sectionNumber = document.createElement("p");
      sectionNumber.className = "mn";
      sectionNumber.textContent = `0${section}`;
      indicatorContainer.appendChild(sectionNumber);
      for (let i = 0; i < 10; i++) {
        const indicator = document.createElement("div");
        indicator.className = "indicator";
        indicatorContainer.appendChild(indicator);
      }
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const featuredCardPos = [
      { x: -vw * 0.28, y: -vh * 0.2 },
      { x: vw * 0.3, y: -vh * 0.28 },
      { x: -vw * 0.34, y: vh * 0.25 },
      { x: vw * 0.34, y: vh * 0.18 },
    ];
    const stackFloatLayout = [
      { x: -0.44, y: -0.32 },
      { x: -0.16, y: -0.42 },
      { x: 0.24, y: -0.36 },
      { x: 0.45, y: -0.14 },
      { x: -0.47, y: 0.02 },
      { x: 0.38, y: 0.11 },
      { x: -0.3, y: 0.34 },
      { x: 0.06, y: 0.4 },
      { x: 0.48, y: 0.33 },
      { x: -0.04, y: -0.18 },
    ];
    const titleSectionCount = featuredTitles.querySelectorAll(
      ".featured-title-wrapper",
    ).length;
    const titleStepCount = Math.max(1, titleSectionCount - 1);

    featuredTitles.style.transform = "translateX(0)";

    const stackFloatNodes = [];
    const imageVisualNodes = [];

    PROJECTS.forEach((project, index) => {
      const position = featuredCardPos[index % featuredCardPos.length];

      if (project.image) {
        const featuredImgCard = document.createElement("div");
        featuredImgCard.className = `featured-img-card featured-img-card-${index + 1}`;

        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title;

        const stack = document.createElement("div");
        stack.className = "featured-img-stack";
        project.stack.slice(0, 6).forEach((item) => {
          const pill = document.createElement("span");
          pill.textContent = item;
          stack.appendChild(pill);
        });

        featuredImgCard.appendChild(img);
        featuredImgCard.appendChild(stack);

        gsap.set(featuredImgCard, {
          xPercent: -50,
          yPercent: -50,
          x: position.x,
          y: position.y,
        });

        imagesContainer.appendChild(featuredImgCard);
        imageVisualNodes.push({ node: featuredImgCard, index });
      }

      project.stack.slice(0, 10).forEach((item, stackIndex) => {
        const stackWord = document.createElement("div");
        stackWord.className = "featured-stack-float";
        stackWord.textContent = item;
        stackWord.style.setProperty(
          "--float-accent",
          `var(--accent${(index % 3) + 1})`,
        );
        const layout = stackFloatLayout[stackIndex % stackFloatLayout.length];
        const wrapOffset =
          Math.floor(stackIndex / stackFloatLayout.length) * vw * 0.05;
        const projectShift = (index - (PROJECTS.length - 1) / 2) * vw * 0.035;
        gsap.set(stackWord, {
          xPercent: -50,
          yPercent: -50,
          x: layout.x * vw + projectShift + wrapOffset,
          y: layout.y * vh - wrapOffset * 0.5,
          z: -1500,
          opacity: 0,
          scale: 0,
          rotation: (stackIndex % 2 === 0 ? -1 : 1) * (4 + stackIndex),
        });
        gsap.to(stackWord, {
          x: `+=${24 + stackIndex * 3}`,
          y: `+=${18 + stackIndex * 2.5}`,
          rotation: `+=${stackIndex % 2 === 0 ? 7 : -7}`,
          duration: 4.5 + stackIndex * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        imagesContainer.appendChild(stackWord);
        stackFloatNodes.push({ node: stackWord, index });
      });
    });

    const featuredImgCards = document.querySelectorAll(".featured-img-card");
    featuredImgCards.forEach((featuredImgCard) => {
      gsap.set(featuredImgCard, {
        xPercent: -50,
        yPercent: -50,
        z: -1500,
        scale: 0,
      });
    });

    const getPresence = (progress, index) => {
      const center = (index + 1) / titleStepCount;
      const span = 0.42;
      const localProgress = Math.max(
        0,
        Math.min(1, (progress - (center - span / 2)) / span),
      );

      return {
        localProgress,
        presence: Math.sin(localProgress * Math.PI),
      };
    };

    const getImageState = (progress, index) => {
      const { localProgress, presence } = getPresence(progress, index);

      return {
        opacity: presence,
        z: -1200 + 2400 * localProgress,
        scale: presence,
      };
    };

    const getStackState = (progress, index) => {
      const { presence } = getPresence(progress, index);

      return {
        opacity: presence,
        z: 80 * presence,
        scale: 0.75 + 0.35 * presence,
      };
    };

    const moveDistance = window.innerWidth * 4;
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: ".featured-work",
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const xPosition = -moveDistance * self.progress;
        gsap.set(featuredTitles, { x: xPosition });
        imageVisualNodes.forEach(({ node, index }) => {
          gsap.set(node, getImageState(self.progress, index));
        });

        stackFloatNodes.forEach(({ node, index }) => {
          gsap.set(node, getStackState(self.progress, index));
        });

        const indicators = document.querySelectorAll(".indicator");
        const totalIndicators = indicators.length;
        const progressPerIndicator = 1 / totalIndicators;
        indicators.forEach((indicator, index) => {
          const indicatorStart = index * progressPerIndicator;
          const indicatorOpacity = self.progress > indicatorStart ? 1 : 0.2;
          gsap.to(indicator, {
            opacity: indicatorOpacity,
            duration: 0.3,
          });
        });
      },
    });
  };

  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("projectModalTitle");
  const modalSubtitle = document.getElementById("projectModalSubtitle");
  const modalSummary = document.getElementById("projectModalSummary");
  const modalList = document.getElementById("projectModalList");
  const modalStack = document.getElementById("projectModalStack");
  const modalLink = document.getElementById("projectModalLink");

  const openModal = (projectId) => {
    if (!modal) return;
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return;

    modalTitle.textContent = project.title;
    modalSubtitle.textContent = project.subtitle;
    modalSummary.textContent = project.summary;
    modalList.innerHTML = "";
    project.details.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      modalList.appendChild(li);
    });
    modalStack.innerHTML = "";
    project.stack.forEach((item) => {
      const span = document.createElement("span");
      span.textContent = item;
      modalStack.appendChild(span);
    });
    modalLink.href = project.github;

    // Save current scroll position before locking body
    savedScrollPosition = window.scrollY;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Restore scroll position so ScrollTrigger doesn't jump
    if (savedScrollPosition !== null) {
      window.scrollTo(0, savedScrollPosition);
      requestAnimationFrame(() => {
        window.scrollTo(0, savedScrollPosition);
        savedScrollPosition = null;
      });
    }
  };

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target?.matches("[data-modal-close]")) {
        closeModal();
      }
    });
  }

  const bindTitleClicks = () => {
    const titleNodes = document.querySelectorAll(
      ".featured-title-wrapper .featured-title",
    );
    titleNodes.forEach((node) => {
      const project = PROJECTS.find(
        (p) => p.title.toLowerCase() === node.textContent?.trim().toLowerCase(),
      );
      if (!project) return;
      node.classList.add("featured-title-link");
      node.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(project.id);
      });
    });

    // Prevent the Inspect Architecture link from jumping to page top
    const inspectLink = document.querySelector(".featured-work-footer a[href='#']");
    if (inspectLink) {
      inspectLink.addEventListener("click", (e) => {
        e.preventDefault();
      });
    }
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // Run animations on page load
  initAnimations();
  bindTitleClicks();

  // Re-run animations on window resize to recalculate positions and trigger points.
  // ScrollTrigger.refresh() is handled centrally by lenis-scroll.js after a longer delay.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initAnimations();
    }, 250);
  });
});
