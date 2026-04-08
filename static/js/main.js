document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const root = document.documentElement;
  const body = document.body;
  const storageKey = "portfolio-theme";
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");
  const themeIcons = document.querySelectorAll("[data-theme-icon]");

  const syncThemeIcons = () => {
    const isDark = root.classList.contains("dark");
    themeIcons.forEach((icon) => {
      const iconTheme = icon.getAttribute("data-theme-icon");
      icon.classList.toggle("hidden", isDark ? iconTheme !== "sun" : iconTheme !== "moon");
    });
  };

  const setTheme = (theme) => {
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(storageKey, theme);
    syncThemeIcons();
  };

  syncThemeIcons();

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = root.classList.contains("dark") ? "light" : "dark";
      setTheme(nextTheme);
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      const delay = Number(element.dataset.delay || 0);
      element.style.setProperty("--stagger-delay", `${delay}ms`);
      revealObserver.observe(element);
    });
  }

  document.querySelectorAll("[data-load]").forEach((element, index) => {
    const delay = Number(element.dataset.delay || index * 100);
    element.style.setProperty("--load-delay", `${delay}ms`);
    window.setTimeout(() => {
      element.classList.add("is-visible");
    }, delay + 40);
  });

  const modal = document.querySelector("[data-project-modal]");
  const modalPanel = document.querySelector("[data-project-panel]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalDescription = document.querySelector("[data-modal-description]");
  const modalStack = document.querySelector("[data-modal-stack]");
  const modalGithub = document.querySelector("[data-modal-github]");
  const modalLive = document.querySelector("[data-modal-live]");
  const projectTriggers = document.querySelectorAll(".project-trigger");
  const closeTriggers = document.querySelectorAll("[data-project-close]");

  if (
    modal &&
    modalPanel &&
    modalTitle &&
    modalDescription &&
    modalStack &&
    modalGithub &&
    modalLive
  ) {
    const openModal = (trigger) => {
      modalTitle.textContent = trigger.dataset.title || "Project Title";
      modalDescription.textContent = trigger.dataset.description || "";

      const stackItems = (trigger.dataset.tech || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

      modalStack.innerHTML = "";
      stackItems.forEach((item) => {
        const tag = document.createElement("span");
        tag.className =
          "border border-theme-subtle px-3 py-2 text-[0.65rem] uppercase tracking-[0.24em]";
        tag.textContent = item;
        modalStack.appendChild(tag);
      });

      const githubLink = trigger.dataset.github || "";
      const liveLink = trigger.dataset.live || "";

      modalGithub.href = githubLink || "#";
      modalLive.href = liveLink || "#";
      modalGithub.classList.toggle("hidden", !githubLink);
      modalLive.classList.toggle("hidden", !liveLink);

      modal.classList.remove("invisible", "opacity-0", "pointer-events-none");
      modalPanel.classList.remove("translate-y-5");
      modal.setAttribute("aria-hidden", "false");
      body.classList.add("modal-open");
    };

    const closeModal = () => {
      modalPanel.classList.add("translate-y-5");
      modal.classList.add("opacity-0", "pointer-events-none");
      modal.setAttribute("aria-hidden", "true");
      body.classList.remove("modal-open");
      window.setTimeout(() => {
        modal.classList.add("invisible");
      }, 300);
    };

    projectTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openModal(trigger));
    });

    closeTriggers.forEach((trigger) => {
      trigger.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    });
  }
});
