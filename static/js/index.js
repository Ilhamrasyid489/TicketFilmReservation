/* ============================================================
   CinePass — Home page interactions
   ============================================================ */
(function (document, window) {
  "use strict";

  var toast = function (m) { window.CinePass && window.CinePass.toast(m); };

  function init() {
    /* Tab filter */
    var tabs = document.querySelectorAll(".tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        var filter = tab.getAttribute("data-filter");
        toast(filter === "now" ? "Menampilkan film sedang tayang" :
              filter === "soon" ? "Menampilkan film segera tayang" :
              "Menampilkan pengalaman IMAX");
      });
    });

    /* Promo claim */
    var claim = document.getElementById("claim-btn");
    if (claim) {
      claim.addEventListener("click", function () {
        claim.textContent = "Terklaim ✓";
        toast("Kode VIPCINEMA50 berhasil disalin!");
      });
    }

    /* Voice search (demo) */
    var voice = document.getElementById("voice-btn");
    if (voice) voice.addEventListener("click", function () { toast("Pencarian suara: dengarkan... (demo)"); });

    /* Filter button */
    var filterBtn = document.getElementById("filter-btn");
    if (filterBtn) filterBtn.addEventListener("click", function () { toast("Panel filter (demo)"); });

    /* Trailer button */
    var trailer = document.getElementById("trailer-btn");
    if (trailer) trailer.addEventListener("click", function () { toast("Memutar trailer Dune: Part Two (demo)"); });

    /* Search filter on movie cards */
    var search = document.getElementById("movie-search");
    if (search) {
      search.addEventListener("input", function () {
        var q = search.value.trim().toLowerCase();
        document.querySelectorAll(".movie-card").forEach(function (card) {
          var text = card.textContent.toLowerCase();
          card.style.display = text.indexOf(q) > -1 ? "" : "none";
        });
      });
    }

    /* Movie order buttons — save selection and go to detail */
    document.querySelectorAll(".btn-order").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.CinePass.booking.set({ movie: btn.getAttribute("data-movie") });
        window.location.href = "detail-film.html";
      });
    });

    /* Cinema cards */
    document.querySelectorAll(".cinema-card").forEach(function (card) {
      card.addEventListener("click", function () {
        window.CinePass.booking.set({ cinema: card.getAttribute("data-cinema") });
        window.location.href = "detail-film.html";
      });
    });

    /* See all / manage location */
    var seeAll = document.getElementById("see-all");
    if (seeAll) seeAll.addEventListener("click", function (e) { e.preventDefault(); toast("Menampilkan semua film (demo)"); });
    var manage = document.getElementById("manage-location");
    if (manage) manage.addEventListener("click", function (e) { e.preventDefault(); toast("Kelola lokasi (demo)"); });

    /* Drag-to-scroll on movie rail (mouse users) */
    var rail = document.getElementById("movie-rail");
    if (rail) {
      var isDown = false, startX = 0, startScroll = 0;
      rail.addEventListener("mousedown", function (e) {
        isDown = true; startX = e.pageX; startScroll = rail.scrollLeft;
      });
      window.addEventListener("mouseup", function () { isDown = false; });
      rail.addEventListener("mouseleave", function () { isDown = false; });
      rail.addEventListener("mousemove", function (e) {
        if (!isDown) return;
        e.preventDefault();
        rail.scrollLeft = startScroll - (e.pageX - startX);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(document, window);
