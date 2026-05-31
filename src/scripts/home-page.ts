const createHomePageController = () => {
  const header = document.querySelector<HTMLElement>("#siteHeader");
  const stages = Array.from(document.querySelectorAll<HTMLElement>(".sticky-stage"));
  const navLinks = Array.from(document.querySelectorAll<HTMLElement>(".nav a"));

  if (!header || stages.length === 0) {
    return () => {};
  }

  const ANIMATION_LOCK_MS = 750;
  const ACTIVE_SECTION_THRESHOLD = 0.6;

  let currentIndex = 0;
  let isAnimating = false;
  let touchStartY = 0;
  let unlockTimer: number | undefined;
  let intersectionObserver: IntersectionObserver | undefined;
  const sectionThresholds = [0.2, 0.4, ACTIVE_SECTION_THRESHOLD, 0.8, 1];

  const getSectionName = (index: number) => {
    return stages[index]?.getAttribute("data-section");
  };

  const getStageIndexByTarget = (target: string | null) => {
    if (!target) {
      return -1;
    }

    return stages.findIndex((stage) => {
      return stage.getAttribute("data-section") === target;
    });
  };

  const getNearestSectionIndex = () => {
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    stages.forEach((stage, index) => {
      const distance = Math.abs(stage.offsetTop - window.scrollY);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  const getVisibleSectionIndex = (entries: IntersectionObserverEntry[]) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

    if (visibleEntries.length === 0) {
      return -1;
    }

    const targetElement = visibleEntries[0].target as HTMLElement;

    return stages.findIndex((stage) => stage === targetElement);
  };

  const updateHeader = () => {
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };

  const updateActiveNav = () => {
    const currentSection = getSectionName(currentIndex);

    navLinks.forEach((link) => {
      const target = link.getAttribute("data-target");
      link.classList.toggle("is-active", target === currentSection);
    });
  };

  const setCurrentIndex = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= stages.length || nextIndex === currentIndex) {
      return;
    }

    currentIndex = nextIndex;
    updateActiveNav();
  };

  const moveToSection = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= stages.length || nextIndex === currentIndex) {
      return;
    }

    isAnimating = true;
    stages[nextIndex].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (unlockTimer !== undefined) {
      window.clearTimeout(unlockTimer);
    }

    unlockTimer = window.setTimeout(() => {
      isAnimating = false;
      unlockTimer = undefined;
    }, ANIMATION_LOCK_MS);
  };

  const moveByOffset = (offset: number) => {
    moveToSection(currentIndex + offset);
  };

  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) return;
    if (event.deltaY === 0) return;

    event.preventDefault();

    if (isAnimating) {
      return;
    }

    if (event.deltaY > 0) {
      moveByOffset(1);
    } else {
      moveByOffset(-1);
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY = event.touches[0].clientY;
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();

    if (isAnimating) {
      return;
    }

    const currentY = event.touches[0].clientY;
    const diff = touchStartY - currentY;

    if (diff === 0) return;

    if (diff > 0) {
      moveByOffset(1);
    } else {
      moveByOffset(-1);
    }

    touchStartY = currentY;
  };

  const handleNavClick = (event: MouseEvent) => {
    const targetElement = (event.target as HTMLElement).closest("[data-target]");

    if (!targetElement) return;

    event.preventDefault();

    const nextIndex = getStageIndexByTarget(targetElement.getAttribute("data-target"));

    moveToSection(nextIndex);
  };

  const handleSectionChange = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    updateHeader();
  };

  const supportsIntersectionObserver = typeof IntersectionObserver !== "undefined";

  if (supportsIntersectionObserver) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const nextIndex = getVisibleSectionIndex(entries);

        if (nextIndex !== -1 && entries.some((entry) => entry.intersectionRatio >= ACTIVE_SECTION_THRESHOLD)) {
          handleSectionChange(nextIndex);
        }
      },
      {
        threshold: sectionThresholds,
      }
    );

    stages.forEach((stage) => {
      intersectionObserver?.observe(stage);
    });
  } else {
    const detectCurrentSection = () => {
      handleSectionChange(getNearestSectionIndex());
    };

    window.addEventListener("load", detectCurrentSection);
    window.addEventListener("resize", detectCurrentSection);
    detectCurrentSection();
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });

  document.addEventListener("click", handleNavClick);

  updateHeader();
  updateActiveNav();

  return () => {
    intersectionObserver?.disconnect();
    if (unlockTimer !== undefined) {
      window.clearTimeout(unlockTimer);
    }
  };
};

createHomePageController();