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
      id: "storageos",
      title: "Storage-OS",
      subtitle: "Distributed Storage System with Custom OS",
      image: "./images/work-items/storageos.jpg",
      github: "https://github.com/Devathmaj/Storage-OS",
      summary:
        "Distributed cloud storage system with a custom Buildroot Linux OS, Go controller, React frontend, and multi-node architecture with automated data distribution and recovery.",
      details: [
        "Custom Buildroot OS with storage core, server daemon, CLI, and quota system",
        "B-tree metadata indexing, AES-256-GCM encryption, ZSTD/LZ4 compression, LRU caching",
        "mTLS between controller and storage nodes with built-in certificate authority",
        "OTP-based node enrollment and JWT + RBAC for user authentication",
        "Go controller handles file sharding and health monitoring",
      ],
      stack: [
        "Go",
        "C",
        "TypeScript",
        "React",
        "Buildroot",
        "mTLS",
        "QEMU",
        "SQLite",
        "AES-256-GCM",
        "ZSTD/LZ4",
      ],
    },
    {
      id: "confessit",
      title: "ConfessIt-V2",
      subtitle: "Real-Time Messaging Platform",
      image: "./images/work-items/Confessit.png",
      github: "https://github.com/Devathmaj/ConfessIt-V2",
      summary:
        "Anonymous social platform built around real-time concurrent messaging with WebSockets and fast persistence.",
      details: [
        "FastAPI backend with async WebSocket handling",
        "Redis pub/sub for message broadcasting",
        "PostgreSQL for persistence and JWT authentication",
      ],
      stack: [
        "Python",
        "FastAPI",
        "Redis",
        "WebSockets",
        "PostgreSQL",
        "TypeScript",
        "JWT",
        "AsyncIO",
      ],
    },
    {
      id: "tracient",
      title: "Tracient",
      subtitle: "Blockchain Welfare Intelligence Platform",
      image: "./images/work-items/tracient.png",
      github: "https://github.com/Devathmaj/tracient",
      summary:
        "Hyperledger Fabric-based platform for income traceability, welfare verification, and anomaly detection using AI/ML pipelines.",
      details: [
        "Consortium-grade ledger architecture built on Hyperledger Fabric",
        "Income traceability and BPL/APL classification workflows",
        "AI/ML anomaly detection for welfare verification signals",
      ],
      stack: [
        "Go",
        "Hyperledger Fabric",
        "Chaincode",
        "Fabric CA",
        "Docker",
        "Machine Learning",
        "Anomaly Detection",
        "Ledger",
      ],
    },
  ];

  let scrollTriggerInstance = null;

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

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
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
      node.addEventListener("click", () => openModal(project.id));
    });
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // Run animations on page load
  initAnimations();
  bindTitleClicks();

  // Re-run animations on window resize to recalculate positions and trigger points
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initAnimations();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 250);
  });
});
