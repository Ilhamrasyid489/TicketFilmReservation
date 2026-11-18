/* ============================================================
   CinePass — Payment & e-ticket interactions
   ============================================================ */
(function (document, window) {
  "use strict";

  var CP = window.CinePass;
  var toast = function (m) { CP && CP.toast(m); };
  var booking = CP ? CP.booking : null;
  var rupiah = CP ? CP.formatRupiah : function (v) { return "Rp " + v; };

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function init() {
    var data = booking ? booking.get() : {};
    var seats = data.seats && data.seats.length ? data.seats : ["D6", "D7"];
    var seatTotal = Number(data.seatTotal) || 150000;
    var unit = Number(data.unitPrice) || 75000;
    var grand = seatTotal + 65000 + 4000 - 20000; // tickets + F&B + tax - promo

    /* Populate summary from shared booking data */
    setText("order-format", data.format || "IMAX 2D");
    setText("order-movie", data.movie || "Dune: Part Two");
    setText("order-cinema", data.cinema || "Grand Indonesia XXI");
    setText("order-time", (data.time || "15:45") + " WIB");
    setText("ticket-x", seats.length + "x " + rupiah(unit));
    setText("ticket-total", rupiah(seatTotal));
    setText("grand-total", rupiah(grand));
    setText("pay-amount", rupiah(grand));
    setText("guest-count", seats.length);

    var seatsEl = document.getElementById("order-seats");
    if (seatsEl) {
      seatsEl.innerHTML = "";
      seats.forEach(function (s) {
        var b = document.createElement("span");
        b.className = "badge badge-solid";
        b.textContent = s;
        seatsEl.appendChild(b);
      });
    }

    /* Populate e-ticket */
    setText("ticket-format", data.format || "IMAX 2D");
    setText("ticket-movie", data.movie || "Dune: Part Two");
    setText("ticket-cinema", data.cinema || "Grand Indonesia");
    setText("ticket-time", (data.time || "15:45") + " WIB");
    setText("ticket-guests", seats.length + " Orang");
    setText("ticket-seats", seats.join(", "));

    /* Tab switching */
    function switchTab(target) {
      var summary = document.getElementById("view-summary");
      var ticket = document.getElementById("view-ticket");
      var sBtn = document.getElementById("tab-summary");
      var tBtn = document.getElementById("tab-ticket");
      var isTicket = target === "ticket";
      summary.classList.toggle("hidden", isTicket);
      ticket.classList.toggle("hidden", !isTicket);
      sBtn.classList.toggle("active", !isTicket);
      tBtn.classList.toggle("active", isTicket);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.querySelectorAll(".switcher-tab").forEach(function (tab) {
      tab.addEventListener("click", function () { switchTab(tab.getAttribute("data-tab")); });
    });

    /* Payment method selection */
    document.querySelectorAll(".pay-option").forEach(function (opt) {
      opt.addEventListener("click", function () {
        document.querySelectorAll(".pay-option").forEach(function (o) { o.classList.remove("active"); });
        opt.classList.add("active");
      });
    });

    /* Countdown timer */
    var remaining = 14 * 60 + 59;
    var countdown = document.getElementById("countdown");
    if (countdown) {
      setInterval(function () {
        if (remaining <= 0) return;
        remaining--;
        var m = Math.floor(remaining / 60);
        var s = remaining % 60;
        countdown.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
      }, 1000);
    }

    /* Confirm payment -> show e-ticket */
    var payBtn = document.getElementById("pay-btn");
    if (payBtn) {
      payBtn.addEventListener("click", function () {
        var original = payBtn.innerHTML;
        payBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Memproses Pembayaran...';
        payBtn.disabled = true;
        setTimeout(function () {
          switchTab("ticket");
          payBtn.innerHTML = original;
          payBtn.disabled = false;
          toast("Pembayaran berhasil! E-ticket siap digunakan.");
        }, 800);
      });
    }

    /* Save ticket */
    var save = document.getElementById("save-ticket");
    if (save) {
      save.addEventListener("click", function () {
        var original = save.innerHTML;
        save.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Tiket Berhasil Disimpan!';
        setTimeout(function () { save.innerHTML = original; }, 2500);
      });
    }

    /* Back home */
    var home = document.getElementById("back-home");
    if (home) home.addEventListener("click", function () { window.location.href = "index.html"; });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(document, window);
