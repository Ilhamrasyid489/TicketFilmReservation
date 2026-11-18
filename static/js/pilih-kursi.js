/* ============================================================
   CinePass — Seat selection interactions
   ============================================================ */
(function (document, window) {
  "use strict";

  var CP = window.CinePass;
  var toast = function (m) { CP && CP.toast(m); };
  var booking = CP ? CP.booking : null;
  var formatRupiah = CP ? CP.formatRupiah : function (v) { return "Rp " + v; };

  var occupied = {
    A: [1, 2, 9, 10], B: [4, 5], C: [8, 9], D: [],
    E: [1, 2], F: [9, 10], G: [], H: [3, 4]
  };
  var MAX_SEATS = 6;

  function init() {
    var data = booking ? booking.get() : {};
    var standardPrice = Number(data.price) || 75000;
    var vipPrice = 110000;

    // Fill header from shared booking data
    setText("seat-format", data.format || "IMAX 2D");
    setText("seat-movie", data.movie || "Dune: Part Two");
    setText("seat-cinema", (data.cinema || "Grand Indonesia XXI") + " • Studio IMAX 1");
    setText("seat-time", data.time || "15:45");
    setText("unit-price", formatRupiah(standardPrice));

    var map = document.getElementById("seat-map");
    if (!map) return;

    buildSeatMap(map);

    var selected = ["D6", "D7"]; // default selection like reference design
    selected.forEach(function (id) {
      var el = map.querySelector('[data-seat="' + id + '"]');
      if (el) { el.classList.add("selected"); if (!el.classList.contains("vip")) el.textContent = id; }
    });

    var badges = document.getElementById("selected-badges");
    var totalEl = document.getElementById("total-price");
    var countEl = document.getElementById("ticket-count");
    var selectedCountEl = document.getElementById("selected-count");
    var checkout = document.getElementById("btn-checkout");

    function render() {
      badges.innerHTML = "";
      if (selected.length === 0) {
        badges.innerHTML = '<span class="empty">Pilih minimal 1 kursi bioskop</span>';
        totalEl.textContent = "Rp 0";
        countEl.textContent = "0 Kursi";
        selectedCountEl.textContent = "0";
        checkout.disabled = true;
        return;
      }

      checkout.disabled = false;
      countEl.textContent = selected.length + " Kursi";
      selectedCountEl.textContent = selected.length;

      var total = 0;
      selected.forEach(function (id) {
        total += id.charAt(0) === "H" ? vipPrice : standardPrice;
        var badge = document.createElement("span");
        badge.className = "seat-badge";
        badge.textContent = id;
        badges.appendChild(badge);
      });

      var meta = document.createElement("span");
      meta.className = "seat-meta";
      meta.textContent = "Studio 1 • " + (data.format || "IMAX 2D");
      badges.appendChild(meta);

      totalEl.textContent = formatRupiah(total);
    }

    map.addEventListener("click", function (e) {
      var seat = e.target.closest(".seat");
      if (!seat || seat.disabled) return;
      var id = seat.getAttribute("data-seat");
      var idx = selected.indexOf(id);

      if (idx > -1) {
        selected.splice(idx, 1);
        seat.classList.remove("selected");
        if (seat.classList.contains("vip")) seat.innerHTML = '<span class="material-symbols-outlined">star</span>';
        else seat.textContent = "";
      } else {
        if (selected.length >= MAX_SEATS) {
          toast("Maksimal pemesanan adalah " + MAX_SEATS + " kursi per transaksi.");
          return;
        }
        selected.push(id);
        seat.classList.add("selected");
        seat.textContent = id;
      }
      render();
    });

    // + / - ticket controls
    var plus = document.getElementById("btn-plus");
    var minus = document.getElementById("btn-minus");
    if (plus) plus.addEventListener("click", function () {
      var free = map.querySelector('.seat:not(:disabled):not(.selected)');
      if (free) free.click(); else toast("Semua kursi sudah terpilih.");
    });
    if (minus) minus.addEventListener("click", function () {
      if (!selected.length) return;
      var el = map.querySelector('[data-seat="' + selected[selected.length - 1] + '"]');
      if (el) el.click();
    });

    // Checkout -> payment page
    if (checkout) checkout.addEventListener("click", function () {
      if (!selected.length) return;
      var total = selected.reduce(function (sum, id) {
        return sum + (id.charAt(0) === "H" ? vipPrice : standardPrice);
      }, 0);
      if (booking) {
        booking.set({
          seats: selected.slice(),
          seatTotal: total,
          unitPrice: standardPrice,
          vipPrice: vipPrice
        });
      }
      window.location.href = "pembayaran.html";
    });

    render();
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function buildSeatMap(map) {
    var html = "";

    // Standard rows A–G, 10 seats with a center aisle
    ["A", "B", "C", "D", "E", "F", "G"].forEach(function (row) {
      html += '<div class="seat-row">';
      html += '<span class="row-label">' + row + "</span>";
      html += '<div class="seat-group">' + seatsFor(row, 1, 5, occupied[row] || []) + "</div>";
      html += '<div class="aisle"></div>';
      html += '<div class="seat-group">' + seatsFor(row, 6, 10, occupied[row] || []) + "</div>";
      html += '<span class="row-label">' + row + "</span>";
      html += "</div>";
    });

    // VIP sweetbox row H
    html += '<div class="vip-separator"><span>Baris H • VIP Sweetbox</span></div>';
    html += '<div class="seat-row">';
    html += '<span class="row-label vip">H</span>';
    [[1, 2], [3, 4], [5, 6], [7, 8]].forEach(function (pair) {
      html += '<div class="seat-group">';
      pair.forEach(function (n) {
        var id = "H" + n;
        var isOccupied = (occupied.H || []).indexOf(n) > -1;
        html += isOccupied
          ? '<button class="seat vip occupied" disabled data-seat="' + id + '"><span class="material-symbols-outlined">close</span></button>'
          : '<button class="seat vip" data-seat="' + id + '" aria-label="Kursi ' + id + '"><span class="material-symbols-outlined">star</span></button>';
      });
      html += "</div>";
    });
    html += '<span class="row-label vip">H</span>';
    html += "</div>";

    map.innerHTML = html;
  }

  function seatsFor(row, from, to, taken) {
    var html = "";
    for (var n = from; n <= to; n++) {
      var id = row + n;
      html += taken.indexOf(n) > -1
        ? '<button class="seat occupied" disabled data-seat="' + id + '"><span class="material-symbols-outlined">close</span></button>'
        : '<button class="seat" data-seat="' + id + '" aria-label="Kursi ' + id + '"></button>';
    }
    return html;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(document, window);
