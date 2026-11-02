// retired.js
// Shows a 5-second redirect notice for the retired portfolio.

const NEW_PORTFOLIO_URL = "https://devathmaj.me";
const COUNTDOWN_MS = 5000;
const DISMISS_KEY = "retiredNoticeDismissed";

const overlay = document.getElementById("retiredOverlay");

if (overlay) {
  const stayButton = document.getElementById("retiredStay");
  const countdownLabel = document.getElementById("retiredCount");
  const progressBar = document.getElementById("retiredProgress");

  let frameId = null;
  let redirectCancelled = false;
  let endTime = performance.now() + COUNTDOWN_MS;

  // Lock background scrolling while the notice is up
  document.documentElement.classList.add("retired-lock");

  const blockScroll = (event) => event.preventDefault();
  overlay.addEventListener("wheel", blockScroll, { passive: false });
  overlay.addEventListener("touchmove", blockScroll, { passive: false });

  const dismiss = () => {
    if (redirectCancelled) return;
    redirectCancelled = true;

    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }

    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch (error) {
      // Storage can be unavailable in private contexts; ignore.
    }

    overlay.classList.add("is-leaving");
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("retired-lock");

    window.setTimeout(() => overlay.remove(), 320);
  };

  const tick = () => {
    const remaining = Math.max(0, endTime - performance.now());

    countdownLabel.textContent = `${Math.ceil(remaining / 1000)}s`;
    progressBar.style.width = `${(remaining / COUNTDOWN_MS) * 100}%`;

    if (remaining <= 0) {
      window.location.replace(NEW_PORTFOLIO_URL);
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  stayButton.addEventListener("click", dismiss);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dismiss();
    }
  });

  stayButton.focus({ preventScroll: true });
  frameId = requestAnimationFrame(tick);
}
