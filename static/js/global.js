/* ============================================================
   CinePass — Global JavaScript
   Shared utilities used across all pages (no framework).
   ============================================================ */
(function (window, document) {
  "use strict";

  var CinePass = {};

  /* ---------- Toast notification ---------- */
  var toastTimer;
  CinePass.toast = function (message) {
    var toast = document.getElementById("global-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "global-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  };

  /* ---------- Set active navigation links ---------- */
  CinePass.setActiveNav = function (page) {
    document.querySelectorAll("[data-nav]").forEach(function (el) {
      if (el.getAttribute("data-nav") === page) {
        el.classList.add("active");
        if (el.tagName === "A") el.setAttribute("aria-current", "page");
      } else {
        el.classList.remove("active");
        el.removeAttribute("aria-current");
      }
    });
  };

  /* ---------- Back button helper ---------- */
  CinePass.back = function (fallback) {
    if (window.history.length > 1) {
      window.history.back();
    } else if (fallback) {
      window.location.href = fallback;
    }
  };

  /* ---------- Format currency (Indonesian Rupiah) ---------- */
  CinePass.formatRupiah = function (value) {
    return "Rp " + Number(value).toLocaleString("id-ID");
  };

  /* ---------- Tiny booking store (shared between pages) ---------- */
  var STORE_KEY = "cinepass_booking";
  CinePass.booking = {
    get: function () {
      try {
        return JSON.parse(sessionStorage.getItem(STORE_KEY)) || {};
      } catch (e) {
        return {};
      }
    },
    set: function (data) {
      try {
        var next = Object.assign({}, this.get(), data);
        sessionStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch (e) {
        /* storage unavailable — fail silently */
      }
    },
    clear: function () {
      try {
        sessionStorage.removeItem(STORE_KEY);
      } catch (e) {}
    }
  };

  /* ---------- Location selector demo ---------- */
  CinePass.initLocation = function () {
    var btn = document.getElementById("location-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      CinePass.toast("Lokasi: Jakarta Pusat (demo)");
    });
  };

  /* ---------- Init on DOM ready ---------- */
  function init() {
    var page = document.body.getAttribute("data-page") || "";
    CinePass.setActiveNav(page);
    CinePass.initLocation();

    // Wire any element with data-back attribute
    document.querySelectorAll("[data-back]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        CinePass.back(el.getAttribute("data-back"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.CinePass = CinePass;
})(window, document);
