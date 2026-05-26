// terminal.js

const PROJECTS = [
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
    id: "storageos",
    name: "Storage-OS",
    status: "active",
    summary:
      "Distributed storage system with a custom Buildroot OS and multi-node controller.",
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
      "ZSTD",
    ],
    highlights: [
      "Custom Buildroot OS with storage daemon and CLI",
      "Encrypted sharding with compression and LRU cache",
      "mTLS enrollment with RBAC and JWT auth",
    ],
  },
  {
    id: "confessit",
    name: "ConfessIt-V2",
    status: "shipped",
    summary:
      "Real-time anonymous messaging with fast WebSocket pipelines.",
    stack: [
      "Python",
      "FastAPI",
      "Redis",
      "WebSockets",
      "PostgreSQL",
      "TypeScript",
      "JWT",
    ],
    highlights: [
      "Async WebSocket fan-out",
      "Redis pub/sub message broadcast",
      "JWT auth with PostgreSQL persistence",
    ],
  },
  {
    id: "tracient",
    name: "Tracient",
    status: "prototype",
    summary:
      "Blockchain welfare intelligence platform with anomaly detection.",
    stack: [
      "Go",
      "Hyperledger Fabric",
      "Chaincode",
      "Docker",
      "Machine Learning",
    ],
    highlights: [
      "Consortium ledger architecture",
      "Income traceability workflows",
      "AI/ML anomaly detection signals",
    ],
  },
];

const STACK_GROUPS = [
  {
    label: "backend",
    items: ["FastAPI", "Flask", "Node.js", "REST", "WebSockets", "gRPC"],
  },
  {
    label: "data",
    items: ["PostgreSQL", "Redis", "SQLite", "Timescale"],
  },
  {
    label: "infra",
    items: ["Docker", "Kubernetes", "Terraform", "Linux", "Nginx"],
  },
  {
    label: "observ",
    items: ["Prometheus", "Grafana", "Loki", "Tempo", "OpenTelemetry"],
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
        appendLine("out", "focus         :: observability - distributed infra - k8s");
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
        appendLine("out", "loki          :: centralized logs");
        appendLine("out", "tempo         :: distributed tracing");
        appendLine("out", "otel          :: instrumentation pipeline");
        appendLine("out", "alertmanager  :: alert routing");
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
        appendLine("out", "expose observability stack");
        appendLine("out", "verify telemetry health");
        break;
      case "infra":
        appendLine("out", "infrastructure layout");
        appendLine("out", "----------------------");
        appendLine("out", "docker compose");
        appendLine("out", "kubernetes manifests");
        appendLine("out", "terraform provisioning");
        appendLine("out", "nginx reverse proxy");
        appendLine("out", "postgres persistence");
        appendLine("out", "internal-only services");
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
        appendLine("out", "phone          :: +91-9526290557");
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
    input.focus();
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
