/* ============================================================
   VIPER VISUALS — SITE BEHAVIOUR
   menu / reveal / video modal / photo lightbox / contact form
   ============================================================ */
(function () {
  "use strict";

  /* ---------- drop-down menu ---------- */
  var btn = document.querySelector(".menu-btn");
  var menu = document.getElementById("site-menu");

  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    menu.classList.toggle("open", open);
  }

  if (btn && menu) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(btn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setMenu(false); closeModal(); }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".site-header")) setMenu(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- modal (video player + lightbox) ---------- */
  var modal = document.getElementById("modal");
  var modalBody = document.getElementById("modal-body");

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (modalBody) modalBody.innerHTML = "";
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".modal-close")) closeModal();
    });
  }

  /* video cards -> embed player */
  document.querySelectorAll(".video-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var provider = card.getAttribute("data-provider");
      var id = card.getAttribute("data-id");
      if (!modalBody || !provider || !id) return;
      var src = provider === "vimeo"
        ? "https://player.vimeo.com/video/" + id + "?autoplay=1&title=0&byline=0&portrait=0"
        : "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      var frame = document.createElement("iframe");
      frame.src = src;
      frame.title = card.querySelector(".v-title") ? card.querySelector(".v-title").textContent : "VIDEO";
      frame.allow = "autoplay; fullscreen; picture-in-picture";
      frame.allowFullscreen = true;
      modalBody.innerHTML = "";
      modalBody.appendChild(frame);
      openModal();
    });
  });

  /* photo tiles -> lightbox */
  document.querySelectorAll(".photo-tile").forEach(function (tile) {
    tile.addEventListener("click", function () {
      if (!modalBody) return;
      var full = tile.getAttribute("data-full") || tile.querySelector("img").src;
      var img = document.createElement("img");
      img.src = full;
      img.alt = tile.querySelector("img") ? tile.querySelector("img").alt : "PHOTOGRAPHY";
      img.referrerPolicy = "no-referrer";
      modalBody.innerHTML = "";
      modalBody.appendChild(img);
      openModal();
    });
  });

  /* ---------- contact form ----------
     Static-site friendly: posts to Formspree when FORM_ENDPOINT is set,
     otherwise composes an email to the studio inbox. */
  var FORM_ENDPOINT = ""; /* e.g. "https://formspree.io/f/yourFormId" */
  var STUDIO_EMAIL = "vipervisualsinfo@gmail.com";

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("form-note");
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = "PLEASE FILL IN NAME, EMAIL AND MESSAGE.";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.textContent = "PLEASE ENTER A VALID EMAIL ADDRESS.";
        return;
      }

      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ name: name, email: email, message: message })
        }).then(function (res) {
          if (res.ok) {
            note.textContent = "THANK YOU! YOUR MESSAGE HAS BEEN SENT.";
            form.reset();
          } else {
            note.textContent = "SOMETHING WENT WRONG — EMAIL " + STUDIO_EMAIL + " DIRECTLY.";
          }
        }).catch(function () {
          note.textContent = "SOMETHING WENT WRONG — EMAIL " + STUDIO_EMAIL + " DIRECTLY.";
        });
      } else {
        var subject = encodeURIComponent("PROJECT INQUIRY — " + name);
        var body = encodeURIComponent("NAME: " + name + "\nEMAIL: " + email + "\n\n" + message);
        note.textContent = "THANK YOU! OPENING YOUR MAIL APP…";
        window.location.href = "mailto:" + STUDIO_EMAIL + "?subject=" + subject + "&body=" + body;
      }
    });
  }
})();

/* inner pages: the current homepage card opens its content strip */
(function () {
  var currentCard = document.querySelector('.page-card.current');
  var grid = document.querySelector('.pages-grid');
  var view = document.querySelector('.content-view');
  if (!currentCard || !grid || !view) return;
  currentCard.addEventListener('click', function (e) {
    e.preventDefault();
    grid.hidden = true;
    view.hidden = false;
  });
  var back = view.querySelector('.back-btn');
  if (back) back.addEventListener('click', function () {
    view.hidden = true;
    grid.hidden = false;
  });
})();
