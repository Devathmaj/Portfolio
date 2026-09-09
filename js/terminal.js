// terminal.js

const PROJECTS = [
  {
    id: "voucherbot",
    name: "VoucherBot",
    status: "stable",
    summary:
      "AI-powered certification voucher aggregator that monitors sources, filters opportunities, and delivers instant alerts.",
    stack: [
      "Python 3.11+",
      "Groq",
      "Google Gemini",
      "Supabase",
      "Reddit API",
      "Resend",
      "Render",
      "Discord",
      "Telegram",
    ],
    highlights: [
      "AI-assisted voucher detection with Groq and Gemini fallback",
      "Reddit API for continuous certification post monitoring",
      "Supabase storage with duplicate detection",
      "Discord and Telegram notification bots",
    ],
  },
  {
    id: "football",
    name: "Football Market Intelligence",
    status: "active",
    summary:
      "Football prediction and market intelligence platform combining ML models, live data, and Monte Carlo simulations.",
    stack: [
      "Next.js",
      "FastAPI",
      "Python",
      "XGBoost",
      "Logistic Regression",
      "PostgreSQL",
      "Docker",
      "API-Football",
      "Monte Carlo Simulation",
    ],
    highlights: [
      "XGBoost and Logistic Regression match outcome models",
      "Monte Carlo tournament simulation for market analysis",
      "Feature engineering with Elo ratings and squad data",
      "Containerized architecture with Docker Compose",
    ],
  },
  {
    id: "continumm",
    name: "Continumm",
    status: "stable",
    summary:
      "Network telemetry and observability platform with auto-discovery, health polling, and dashboards.",
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
    highlights: [
      "Full observability stack with alert routing",
      "OpenTelemetry instrumentation and trace pipeline",
      "Terraform IaC for Azure VM provisioning",
      "Reverse proxy with rate limiting and security headers",
    ],
  },
  {
    id: "confessit",
    name: "ConfessIt",
    status: "shipped",
    summary:
      "Anonymous social platform for confessions, matchmaking, love notes, and mini-games.",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
      "Python",
      "MongoDB",
      "Redis",
      "Docker",
    ],
    highlights: [
      "Anonymous confession sharing with reactions and comments",
      "Matchmaking system for discovering connections",
      "Magic-link authentication for passwordless access",
      "Redis and MongoDB backend architecture",
    ],
  },
];

const STACK_GROUPS = [
  {
    label: "backend",
    items: ["FastAPI", "Flask", "REST", "WebSockets"],
  },
  {
    label: "data",
    items: ["PostgreSQL", "Redis", "MongoDB"],
  },
  {
    label: "infra",
    items: ["Docker", "Kubernetes", "Terraform", "Linux"],
  },
  {
    label: "ai/ml",
    items: ["XGBoost", "Groq", "Google Gemini"],
  },
  {
    label: "frontend",
    items: ["Next.js", "React", "TypeScript"],
  },
];

const HELP = [
  "help                - show command index",
  "whoami              - show operator identity",
  "ls projects         - list deployed projects",
  "inspect <id>        - inspect project details",
  "stack               - list technologies and tooling",
  "metrics             - view observability stack",
  "traces              - inspect telemetry pipeline",
  "logs                - stream recent system events",
  "services            - list active platform services",
  "deploy              - show deployment workflow",
  "infra               - inspect infrastructure layout",
  "status              - show current build/runtime status",
  "contact             - reveal contact channel",
  "clear               - clear terminal",
];

const BANNER = [
  "devathmaj // coastal-shell v1.0",
  "type `help` to list commands. tab to autocomplete. up/down for history.",
];

const COMMAND_CANDIDATES = [
  "help",
  "whoami",
  "ls projects",
  "stack",
  "metrics",
  "traces",
  "logs",
  "services",
  "deploy",
  "infra",
  "status",
  "contact",
  "clear",
  "ping devathmaj.local",
  ...PROJECTS.map((project) => `inspect ${project.id}`),
];

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = document.querySelector(".page.home-page");
  if (!isHomePage) return;

  const output = document.getElementById("terminalOutput");
  const input = document.getElementById("terminalInput");
  const form = document.getElementById("terminalForm");
  const historyCount = document.getElementById("terminalHistoryCount");

  if (!output || !input || !form) return;

  let history = [];
  let historyIndex = -1;

  const appendLine = (kind, text) => {
    const line = document.createElement("div");
    line.className = `terminal-line ${kind}`;
    if (kind === "in") {
      const prompt = document.createElement("span");
      prompt.className = "terminal-prompt";
      prompt.textContent = "devathmaj > ";
      line.appendChild(prompt);
    }
    line.appendChild(document.createTextNode(text));
    output.insertBefore(line, form);
    output.scrollTop = output.scrollHeight;
  };

  const updateHistoryCount = () => {
    if (historyCount) historyCount.textContent = String(history.length);
  };

  const runCommand = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    appendLine("in", trimmed);

    const [headRaw, ...args] = trimmed.split(/\s+/);
    const head = headRaw.toLowerCase();

    switch (head) {
      case "help":
        HELP.forEach((line) => appendLine("out", line));
        break;
      case "whoami":
        appendLine("out", "operator      :: Devathmaj A Kaliyathan");
        appendLine("out", "role          :: CS undergraduate - backend & reliability");
        appendLine("out", "location      :: Kerala, India");
        appendLine("out", "focus         :: backend - infrastructure - reliability");
        break;
      case "ls":
        if (args.length === 0 || args[0] === "projects") {
          appendLine("out", "deployed projects:");
          PROJECTS.forEach((project) => {
            appendLine(
              "out",
              `  ${project.id.padEnd(10)} ${project.name.padEnd(18)} [${project.status}]`,
            );
          });
        } else {
          appendLine("err", `ls: unknown target '${args[0]}'`);
        }
        break;
      case "inspect": {
        const project = PROJECTS.find(
          (item) => item.id === (args[0] || "").toLowerCase(),
        );
        if (!project) {
          appendLine(
            "err",
            `inspect: project '${args[0] || ""}' not found. try 'ls projects'`,
          );
          break;
        }
        appendLine("out", `== ${project.name} ==`);
        appendLine("out", `summary    : ${project.summary}`);
        appendLine("out", `stack      : ${project.stack.join(", ")}`);
        appendLine("out", "highlights :");
        project.highlights.forEach((item) => appendLine("out", `  - ${item}`));
        break;
      }
      case "stack":
        STACK_GROUPS.forEach((group) => {
          appendLine("out", `${group.label.padEnd(10)} :: ${group.items.join(", ")}`);
        });
        break;
      case "metrics":
        appendLine("out", "observability stack");
        appendLine("out", "----------------------");
        appendLine("out", "prometheus    :: metrics aggregation");
        appendLine("out", "grafana       :: dashboards and visualization");
        appendLine("out", "tracing       :: distributed trace pipeline");
        break;
      case "traces":
        appendLine("out", "trace pipeline");
        appendLine("out", "----------------------");
        appendLine("out", "app instrumentation");
        appendLine("out", "  -> otel collector");
        appendLine("out", "  -> tempo ingestion");
        appendLine("out", "  -> grafana trace explorer");
        break;
      case "logs":
        appendLine("out", "recent system events");
        appendLine("out", "----------------------");
        appendLine("out", "12:14:42 INFO telemetry worker poll cycle completed");
        appendLine("out", "12:14:40 INFO prometheus metrics scrape successful");
        appendLine("out", "12:14:37 DEBUG otel exporter flushed traces");
        appendLine("out", "12:14:35 INFO grafana dashboard query executed");
        appendLine("out", "12:14:33 INFO alertmanager notification routed");
        appendLine("out", "12:14:31 DEBUG subnet discovery detected 3 hosts");
        appendLine("out", "12:14:29 INFO kubernetes deployment healthy");
        break;
      case "services":
        appendLine("out", "active services");
        appendLine("out", "----------------------");
        appendLine("out", "telemetry-worker");
        appendLine("out", "device-scanner");
        appendLine("out", "metrics-exporter");
        appendLine("out", "grafana");
        appendLine("out", "prometheus");
        appendLine("out", "loki");
        appendLine("out", "tempo");
        appendLine("out", "postgres");
        appendLine("out", "alertmanager");
        break;
      case "deploy":
        appendLine("out", "deployment workflow");
        appendLine("out", "----------------------");
        appendLine("out", "build container images");
        appendLine("out", "apply kubernetes manifests");
        appendLine("out", "provision infrastructure");
        appendLine("out", "verify health");
        break;
      case "infra":
        appendLine("out", "infrastructure layout");
        appendLine("out", "----------------------");
        appendLine("out", "docker compose");
        appendLine("out", "kubernetes manifests");
        appendLine("out", "terraform provisioning");
        appendLine("out", "postgres persistence");
        break;
      case "ping": {
        const host = args[0] || "devathmaj.local";
        for (let i = 0; i < 4; i += 1) {
          const ms = (3 + Math.random() * 6).toFixed(2);
          appendLine("out", `64 bytes from ${host}: icmp_seq=${i} time=${ms}ms`);
        }
        appendLine("out", "4 packets transmitted - 4 received - 0% loss");
        break;
      }
      case "status":
        appendLine("out", "education       :: B.Tech CSE (2022-2026) - CGPA 8.13");
        appendLine("out", "experience      :: DevOps Intern - KVBL (May 2025-Jun 2025)");
        appendLine("out", "certifications  :: AWS CTE - GCP Fundamentals - Python for DS");
        appendLine("out", "availability    :: open to backend / infra roles");
        break;
      case "contact":
        appendLine("out", "email          :: devathmaj@gmail.com");
        appendLine("out", "github         :: github.com/Devathmaj");
        appendLine("out", "linkedin       :: linkedin.com/in/devathmaj");
        break;
      case "clear":
        output.innerHTML = "";
        output.appendChild(form);
        break;
      default:
        appendLine("err", `command not found: ${head}. try 'help'`);
    }
  };

  const boot = () => {
    BANNER.forEach((line) => appendLine("sys", line));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    if (!value.trim()) return;
    runCommand(value);
    history = [value, ...history];
    historyIndex = -1;
    updateHistoryCount();
    input.value = "";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = Math.min(history.length - 1, historyIndex + 1);
      if (nextIndex >= 0 && history[nextIndex] !== undefined) {
        historyIndex = nextIndex;
        input.value = history[nextIndex];
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        historyIndex = -1;
        input.value = "";
      } else {
        historyIndex = nextIndex;
        input.value = history[nextIndex];
      }
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const value = input.value.toLowerCase();
      const match = COMMAND_CANDIDATES.find((candidate) =>
        candidate.startsWith(value),
      );
      if (match) input.value = match;
    }
  });

  output.addEventListener("click", () => {
    if (window.innerWidth > 1000) {
      input.focus();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "`" || event.key === "~") {
      if (document.activeElement !== input) {
        document.getElementById("terminal")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setTimeout(() => input.focus(), 500);
        event.preventDefault();
      }
    }
  });

  boot();
  updateHistoryCount();
});
