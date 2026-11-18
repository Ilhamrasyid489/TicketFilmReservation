/* ============================================================
   CinePass — Movie detail & schedule interactions
   ============================================================ */
(function (document, window) {
  "use strict";

  var toast = function (m) { window.CinePass && window.CinePass.toast(m); };
  var booking = window.CinePass ? window.CinePass.booking : null;

  function init() {
    /* Synopsis expand / collapse */
    var toggle = document.getElementById("synopsis-toggle");
    var text = document.getElementById("synopsis-text");
    var label = document.getElementById("synopsis-label");
    var icon = document.getElementById("synopsis-icon");
    if (toggle && text) {
      toggle.addEventListener("click", function () {
        var expanded = text.classList.toggle("clamp-3") === false;
        label.textContent = expanded ? "Tutup Sinopsis" : "Baca Selengkapnya";
        toggle.classList.toggle("expanded", expanded);
        icon.textContent = expanded ? "expand_less" : "expand_more";
      });
    }

    /* Trailer feedback */
    var play = document.getElementById("play-trailer");
    if (play) play.addEventListener("click", function () { toast("Memutar trailer Dune: Part Two (demo)"); });

    /* Date chips */
    var dates = document.querySelectorAll(".date-chip");
    dates.forEach(function (chip) {
      chip.addEventListener("click", function () {
        dates.forEach(function (d) { d.classList.remove("active"); });
        chip.classList.add("active");
      });
    });

    /* Accordion */
    document.querySelectorAll(".accordion-head").forEach(function (head) {
      head.addEventListener("click", function () {
        var acc = head.closest(".accordion");
        var willOpen = !acc.classList.contains("open");
        document.querySelectorAll(".accordion").forEach(function (a) {
          a.classList.remove("open");
          a.querySelector(".accordion-head").setAttribute("aria-expanded", "false");
          var chev = a.querySelector(".accordion-chevron");
          if (chev) chev.textContent = "expand_more";
        });
        if (willOpen) {
          acc.classList.add("open");
          head.setAttribute("aria-expanded", "true");
          var c = acc.querySelector(".accordion-chevron");
          if (c) c.textContent = "expand_less";
        }
      });
    });

    /* Showtime selection + sticky bar sync */
    var showtimes = document.querySelectorAll(".showtime:not(.sold)");
    var summaryCinema = document.getElementById("summary-cinema");
    var summaryTime = document.getElementById("summary-time");
    var summaryPrice = document.getElementById("summary-price");

    showtimes.forEach(function (btn) {
      btn.addEventListener("click", function () {
        showtimes.forEach(function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");

        var cinema = btn.getAttribute("data-cinema");
        var format = btn.getAttribute("data-format");
        var time = btn.getAttribute("data-time");
        var priceLabel = btn.getAttribute("data-price-label");
        var price = btn.getAttribute("data-price");

        if (summaryCinema) summaryCinema.textContent = cinema + " • " + format;
        if (summaryTime) summaryTime.textContent = time + " WIB • ";
        if (summaryPrice) summaryPrice.innerHTML = "Mulai " + priceLabel + "<small>/tiket</small>";

        if (booking) {
          booking.set({
            movie: "Dune: Part Two",
            cinema: cinema,
            format: format,
            time: time,
            price: Number(price)
          });
        }
      });
    });

    /* Choose seat -> seat selection page */
    var choose = document.getElementById("choose-seat");
    if (choose) {
      choose.addEventListener("click", function () {
        var selected = document.querySelector(".showtime.selected");
        if (booking) {
          if (!selected) {
            booking.set({ movie: "Dune: Part Two", cinema: "Grand Indonesia XXI", format: "IMAX 2D", time: "15:45", price: 75000 });
          } else {
            booking.set({
              movie: "Dune: Part Two",
              cinema: selected.getAttribute("data-cinema"),
              format: selected.getAttribute("data-format"),
              time: selected.getAttribute("data-time"),
              price: Number(selected.getAttribute("data-price"))
            });
          }
        }
        window.location.href = "pilih-kursi.html";
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(document, window);
