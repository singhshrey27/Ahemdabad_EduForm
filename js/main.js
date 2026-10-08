"use strict";

const typographyLink = document.createElement("link");
typographyLink.rel = "stylesheet";
typographyLink.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap";
document.head.appendChild(typographyLink);

// Update this local array as Ahmedabad panellists are confirmed.
const panelists = [
  {
    name: "S. S. Mantha",
    role: "Chancellor",
    institution: "RB University",
    image: "assets/higher-education-speakers/shankar-mantha-white-v2.png"
  },
  {
    name: "Dilip Nandkeolyar",
    role: "Co-Chancellor",
    institution: "Commonwealth University",
    image: "assets/higher-education-speakers/dilip-nandkeolyar-white.png"
  },
  {
    name: "Rajesh S",
    role: "Vice Chancellor",
    institution: "MIT ADT University",
    image: "assets/higher-education-speakers/rajesh-s-white.png"
  },
  {
    name: "Manish Bhalla",
    role: "Vice Chancellor",
    institution: "DY Patil International University",
    image: "assets/higher-education-speakers/manish-bhalla-white-v2.png"
  },
  {
    name: "Ajaykumar Thakur",
    role: "Vice Chancellor",
    institution: "Sanjivani University",
    image: "assets/higher-education-speakers/ajaykumar-thakur-white.png"
  }
];

function renderPanelists() {
  const grid = document.querySelector("#speaker-grid");
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  panelists.forEach((person) => {
    const card = document.createElement("article");
    card.className = "speaker-card";
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = person.image;
    image.alt = person.name;
    image.width = 300;
    image.height = 330;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => image.remove(), { once: true });
    figure.append(image);

    const copy = document.createElement("div");
    copy.className = "speaker-copy";
    [
      ["span", person.role],
      ["h3", person.name],
      ["p", person.institution]
    ].forEach(([tag, value]) => {
      const element = document.createElement(tag);
      element.textContent = value;
      copy.append(element);
    });

    card.append(figure, copy);
    fragment.append(card);
  });
  grid.replaceChildren(fragment);

  // Duplicate the finished set so the transform can loop without a visible seam.
  const cards = Array.from(grid.children);
  cards.forEach((card) => grid.append(card.cloneNode(true)));
}

function startCountdown() {
  const countdown = document.querySelector("[data-countdown]");
  if (!countdown) return;

  const eventStart = new Date("2026-12-09T00:00:00+05:30").getTime();
  const units = ["days", "hours", "minutes", "seconds"].map((name) => ({
    name,
    element: countdown.querySelector(`[data-${name}]`)
  }));
  const intro = document.querySelector(".countdown-title p");

  function updateCountdown() {
    const remaining = Math.max(0, Math.floor((eventStart - Date.now()) / 1000));
    const values = {
      days: Math.floor(remaining / 86400),
      hours: Math.floor(remaining / 3600) % 24,
      minutes: Math.floor(remaining / 60) % 60,
      seconds: remaining % 60
    };

    units.forEach(({ name, element }) => {
      if (element) element.textContent = String(values[name]).padStart(2, "0");
    });
    if (remaining === 0 && intro) intro.textContent = "The forum date has arrived.";
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");
  if (!toggle || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("open")) {
      closeMenu();
      toggle.focus();
    }
  });

  if ("matchMedia" in window) {
    window.matchMedia("(min-width: 851px)").addEventListener("change", closeMenu);
  }

  const links = Array.from(navigation.querySelectorAll("a"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -60% 0px" });

    links.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section) observer.observe(section);
    });
  }
}

function setupRevealAnimations() {
  const sections = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  sections.forEach((section) => observer.observe(section));
}

function setupCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const slides = [
    { image: "images/event-photos/DSC00055.jpg", alt: "Education leaders gathered at a forum", caption: "Education leaders, together" },
    { image: "images/event-photos/DSC00057.jpg", alt: "Forum attendees taking part in an education event", caption: "A community of education leaders" },
    { image: "images/event-photos/DSC00132.jpg", alt: "Senior leaders engaged in a roundtable discussion", caption: "Leadership dialogue in progress" },
    { image: "images/event-photos/DSC00136.jpg", alt: "Participants exchanging perspectives at the forum", caption: "Perspectives that move education forward" },
    { image: "images/event-photos/DSC00181.jpg", alt: "Education leaders participating in a focused roundtable", caption: "Curated leadership roundtables" },
    { image: "images/event-photos/DSC00183.jpg", alt: "Forum delegates sharing ideas around a table", caption: "Ideas shared around the table" },
    { image: "images/event-photos/DSC00252.jpg", alt: "Education professionals meeting at the forum", caption: "Connections across the education community" },
    { image: "images/event-photos/DSC00253.jpg", alt: "Cross-table discussion between forum delegates", caption: "Cross-sector exchange" },
    { image: "images/event-photos/DSC00274.jpg", alt: "Attendees in conversation during the event", caption: "Conversations with purpose" },
    { image: "images/event-photos/DSC00353.jpg", alt: "Boardroom roundtable in session", caption: "Focused roundtable conversations" },
    { image: "images/event-photos/DSC00623.jpg", alt: "A moment from a previous education leadership gathering", caption: "A shared vision for education" },
    { image: "images/event-photos/DSC00624.jpg", alt: "Panel of senior leaders in conversation", caption: "Leadership dialogue" },
    { image: "images/event-photos/DSC09978.jpg", alt: "Wide view of a leadership roundtable", caption: "Collaborative problem solving" },
    { image: "images/event-photos/IMG_5841.jpg", alt: "Education leaders connecting at a previous forum", caption: "Learning from one another" }
  ];
  const image = carousel.querySelector("[data-carousel-image]");
  const caption = carousel.querySelector("[data-carousel-caption]");
  const counter = carousel.querySelector("[data-carousel-count]");
  const dots = carousel.querySelector("[data-carousel-dots]");
  const previous = carousel.querySelector("[data-carousel-previous]");
  const next = carousel.querySelector("[data-carousel-next]");
  const play = carousel.querySelector("[data-carousel-play]");
  const status = carousel.querySelector("[data-carousel-status]");
  if (!image || !caption || !counter || !dots || !previous || !next || !play || !status) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;
  let timer = 0;
  let pausedByUser = reducedMotion.matches;

  const dotButtons = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Show photo ${index + 1}: ${slide.caption}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.append(dot);
    return dot;
  });

  function updatePlayback() {
    const shouldPlay = !pausedByUser && !document.hidden && !reducedMotion.matches;
    window.clearInterval(timer);
    timer = 0;
    play.disabled = reducedMotion.matches;
    play.textContent = reducedMotion.matches ? "Autoplay off" : pausedByUser ? "Play slideshow" : "Pause slideshow";
    play.setAttribute("aria-label", reducedMotion.matches ? "Autoplay disabled because reduced motion is preferred" : pausedByUser ? "Play slideshow" : "Pause slideshow");
    if (shouldPlay) timer = window.setInterval(() => showSlide(currentIndex + 1), 1000);
  }

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];
    image.classList.add("is-changing");
    carousel.style.setProperty("--carousel-background", `url("../${slide.image}")`);
    image.src = slide.image;
    image.alt = slide.alt;
    caption.textContent = slide.caption;
    counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    dotButtons.forEach((dot, dotIndex) => {
      if (dotIndex === currentIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
    image.addEventListener("load", () => image.classList.remove("is-changing"), { once: true });
    image.addEventListener("error", () => {
      image.classList.remove("is-changing");
      status.textContent = `Unable to load carousel photo: ${slide.image}`;
      pausedByUser = true;
      updatePlayback();
    }, { once: true });
    updatePlayback();
  }

  previous.addEventListener("click", () => showSlide(currentIndex - 1));
  next.addEventListener("click", () => showSlide(currentIndex + 1));
  play.addEventListener("click", () => {
    pausedByUser = !pausedByUser;
    updatePlayback();
  });
  document.addEventListener("visibilitychange", updatePlayback);
  reducedMotion.addEventListener("change", updatePlayback);
  showSlide(currentIndex);
}

function setupGallery() {
  const photos = Array.from(document.querySelectorAll("[data-gallery] button"));
  const dialog = document.querySelector(".lightbox");
  if (photos.length === 0 || !dialog || typeof dialog.showModal !== "function") return;

  const image = dialog.querySelector("img");
  const caption = dialog.querySelector(".lightbox-bottom p");
  const counter = dialog.querySelector("#photo-counter");
  const closeButton = dialog.querySelector("[data-close]");
  const previousButton = dialog.querySelector("[data-prev]");
  const nextButton = dialog.querySelector("[data-next]");
  if (!image || !caption || !counter || !closeButton || !previousButton || !nextButton) return;

  let photoIndex = 0;

  function showPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    const photo = photos[photoIndex];
    const thumbnail = photo.querySelector("img");
    image.src = photo.dataset.image;
    image.alt = thumbnail ? thumbnail.alt : photo.dataset.caption || "Previous forum event";
    caption.textContent = photo.dataset.caption || image.alt;
    counter.textContent = `${photoIndex + 1} / ${photos.length}`;
  }

  photos.forEach((photo, index) => {
    photo.addEventListener("click", () => {
      showPhoto(index);
      dialog.showModal();
      document.body.classList.add("modal-open");
    });
  });

  closeButton.addEventListener("click", () => dialog.close());
  previousButton.addEventListener("click", () => showPhoto(photoIndex - 1));
  nextButton.addEventListener("click", () => showPhoto(photoIndex + 1));
  dialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(photoIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(photoIndex - 1);
    }
  });
}

renderPanelists();
startCountdown();
setupNavigation();
setupRevealAnimations();
setupCarousel();
setupGallery();
