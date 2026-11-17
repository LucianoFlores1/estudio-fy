(function () {
  "use strict";

  // ---- Horarios de su sistema de turnos: [primer turno, cierre). 6 = sábado ----
  var DRAS = {
    flores: { nombre: "Dra. Ana Paula Flores", corto: "Dra. Flores", wa: "5493875429897", horario: { 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20] } },
    yonar: { nombre: "Dra. Paula Talía Yonar", corto: "Dra. Yonar", wa: "5493874828131", horario: { 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [8, 20] } }
  };
  var MODOS = {
    Presencial: "En nuestro estudio, Santa Fe 474, Salta Capital.",
    Escrita: "Mandanos tu consulta y te asesoramos por escrito.",
    Online: "Estés donde estés, te asesoramos por videollamada."
  };
  var DIAS_MAX = 7;            // cuántos días hacia adelante se puede reservar
  var ANTICIPACION_H = 24;     // horas mínimas de anticipación
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var DOW = ["L", "M", "M", "J", "V", "S", "D"];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- WhatsApp: hoja para elegir abogada ----------
  var sheet = $("[data-sheet]");
  var fab = $(".fab");
  var lastFocus = null;
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    document.documentElement.style.overflow = "hidden";
    var a = $(".sheet__opt", sheet); a && a.focus({ preventScroll: true });
  }
  function closeSheet() {
    sheet.hidden = true;
    document.documentElement.style.overflow = "";
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  $$("[data-open-wa]").forEach(function (b) { b.addEventListener("click", openSheet); });
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet || e.target.closest("[data-sheet-close]")) closeSheet();
  });
  $$(".sheet__opt", sheet).forEach(function (a) { a.addEventListener("click", function () { setTimeout(closeSheet, 250); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });

  // El botón flotante aparece justo cuando el botón de WhatsApp del inicio sale de la pantalla
  // (también cuando queda tapado por el encabezado fijo).
  var heroWa = $(".hero [data-open-wa]");
  if ("IntersectionObserver" in window && heroWa) {
    var header = $(".top"), io = null;
    var watch = function () {
      if (io) io.disconnect();
      io = new IntersectionObserver(function (es) {
        fab.classList.toggle("is-hidden", es[0].isIntersecting);
      }, { rootMargin: "-" + header.offsetHeight + "px 0px 0px 0px", threshold: 0 });
      io.observe(heroWa);
    };
    watch();
    window.addEventListener("resize", watch);
  }

  // ---------- Turnos ----------
  var form = $("[data-wiz]");
  var S = { tipo: null, modo: null, dra: null, fecha: null, hora: null, view: null };
  var trail = ["tipo"];

  function flow() { return S.tipo === "tramite" ? ["tipo", "datos"] : ["tipo", "quien", "fecha", "datos"]; }

  function show(step, dir) {
    $$(".step", form).forEach(function (el) {
      var on = el.dataset.step === step;
      el.hidden = !on;
      el.classList.remove("is-in");
      if (on && dir) { void el.offsetWidth; el.classList.add("is-in"); }
    });
    var f = flow(), i = f.indexOf(step), done = step === "listo";
    $("[data-step-label]").textContent = done ? "Listo" : "Paso " + (i + 1) + " de " + f.length;
    $("[data-step-fill]").style.width = (done ? 100 : ((i + 1) / f.length) * 100) + "%";
    $("[data-back]").hidden = trail.length < 2 || done;

    if (step === "fecha") renderCal();
    if (step === "datos") renderSummary();

    // Si el formulario quedó arriba de la pantalla, lo traemos a la vista.
    if (dir) {
      var top = form.getBoundingClientRect().top;
      if (top < 0) window.scrollTo({ top: window.scrollY + top - 76, behavior: reduced() ? "auto" : "smooth" });
    }
  }
  function go(step) { trail.push(step); show(step, 1); }
  function reduced() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  $("[data-back]").addEventListener("click", function () {
    if (trail.length > 1) { trail.pop(); show(trail[trail.length - 1], -1); }
  });

  // Paso 1
  $$('input[name="tipo"]', form).forEach(function (r) {
    r.addEventListener("change", function () {
      S.tipo = r.value;
      $("[data-tramite-field]").hidden = S.tipo !== "tramite";
      setTimeout(function () { go(S.tipo === "tramite" ? "datos" : "quien"); }, 140);
    });
  });

  // Paso 2
  var quienNext = $('[data-step="quien"] [data-next]', form);
  function checkQuien() { quienNext.disabled = !(S.modo && S.dra); }
  $$('input[name="modo"]', form).forEach(function (r) {
    r.addEventListener("change", function () {
      S.modo = r.value;
      $("[data-modo-note]").textContent = MODOS[S.modo];
      checkQuien();
    });
  });
  $$('input[name="dra"]', form).forEach(function (r) {
    r.addEventListener("change", function () {
      S.dra = r.value; S.fecha = null; S.hora = null; S.view = null;
      checkQuien();
    });
  });
  quienNext.addEventListener("click", function () { go("fecha"); });

  // Paso 3: calendario
  var fechaNext = $('[data-step="fecha"] [data-next]', form);
  fechaNext.addEventListener("click", function () { go("datos"); });

  function drasSel() { return S.dra === "any" ? ["flores", "yonar"] : [S.dra]; }
  function key(d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function fromKey(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function today0() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }

  function horas(d) {
    if (d.getDay() === 0) return [];                       // domingos descartados
    var limite = today0(); limite.setDate(limite.getDate() + DIAS_MAX);
    if (d > limite) return [];
    var minimo = Date.now() + ANTICIPACION_H * 3600e3, set = {};
    drasSel().forEach(function (k) {
      var r = DRAS[k].horario[d.getDay()];
      if (!r) return;
      for (var h = r[0]; h < r[1]; h++) {
        var t = new Date(d); t.setHours(h, 0, 0, 0);
        if (t.getTime() >= minimo) set[h] = 1;
      }
    });
    return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  }

  function renderCal() {
    var t = today0();
    if (!S.view) S.view = new Date(t.getFullYear(), t.getMonth(), 1);
    var y = S.view.getFullYear(), m = S.view.getMonth();
    var first = new Date(y, m, 1), nd = new Date(y, m + 1, 0).getDate();
    var lead = (first.getDay() + 6) % 7; // semana empieza el lunes
    var limite = new Date(t); limite.setDate(t.getDate() + DIAS_MAX);
    var canPrev = new Date(y, m, 1) > new Date(t.getFullYear(), t.getMonth(), 1);
    var canNext = new Date(y, m + 1, 1) <= limite;

    var h = '<div class="cal__head">' +
      '<button type="button" class="cal__nav" data-nav="-1" aria-label="Mes anterior"' + (canPrev ? "" : " disabled") + '><svg class="ic" viewBox="0 0 24 24" style="transform:scaleX(-1)"><use href="#i-chev"/></svg></button>' +
      "<b>" + MESES[m].charAt(0).toUpperCase() + MESES[m].slice(1) + " " + y + "</b>" +
      '<button type="button" class="cal__nav" data-nav="1" aria-label="Mes siguiente"' + (canNext ? "" : " disabled") + '><svg class="ic" viewBox="0 0 24 24"><use href="#i-chev"/></svg></button>' +
      '</div><div class="cal__grid" role="grid">';
    DOW.forEach(function (d, i) { h += '<span class="cal__dow' + (i === 6 ? " cal__dow--off" : "") + '" aria-hidden="true">' + d + "</span>"; });
    for (var i = 0; i < lead; i++) h += "<span></span>";
    for (var d = 1; d <= nd; d++) {
      var date = new Date(y, m, d), k = key(date), ok = date >= t && horas(date).length > 0;
      var cls = (date.getDay() === 0 ? "is-sun " : "") + (date.getTime() === t.getTime() ? "is-today" : "");
      h += '<button type="button" class="' + cls + '" data-day="' + k + '" aria-pressed="' + (S.fecha === k) + '"' +
        ' aria-label="' + DIAS[date.getDay()] + " " + d + " de " + MESES[m] + (ok ? "" : ", sin turnos") + '"' + (ok ? "" : " disabled") + ">" + d + "</button>";
    }
    h += '</div><p class="cal__legend">Los domingos no hay atención. Turnos con al menos 24 horas de anticipación.</p>';
    $("[data-cal]").innerHTML = h;
    renderSlots();
  }

  $("[data-cal]").addEventListener("click", function (e) {
    var nav = e.target.closest("[data-nav]");
    if (nav && !nav.disabled) { S.view = new Date(S.view.getFullYear(), S.view.getMonth() + +nav.dataset.nav, 1); renderCal(); return; }
    var b = e.target.closest("[data-day]");
    if (!b || b.disabled) return;
    S.fecha = b.dataset.day; S.hora = null;
    renderCal();
    var sl = $("[data-slots]");
    if (sl.getBoundingClientRect().bottom > window.innerHeight) sl.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
  });

  function renderSlots() {
    var box = $("[data-slots]");
    fechaNext.disabled = !(S.fecha && S.hora !== null);
    if (!S.fecha) { box.hidden = true; return; }
    var d = fromKey(S.fecha), hs = horas(d);
    box.hidden = false;
    $("[data-slots-title]").textContent = "Horarios del " + DIAS[d.getDay()] + " " + d.getDate() + " de " + MESES[d.getMonth()];
    $("[data-slots-grid]").innerHTML = hs.map(function (x) {
      return '<button type="button" data-hour="' + x + '" aria-pressed="' + (S.hora === x) + '">' + x + ":00</button>";
    }).join("");
  }
  $("[data-slots-grid]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-hour]");
    if (!b) return;
    S.hora = +b.dataset.hour;
    renderSlots();
    fechaNext.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "nearest" });
  });

  // Paso 4
  function fechaTexto() {
    if (!S.fecha) return "";
    var d = fromKey(S.fecha);
    return DIAS[d.getDay()] + " " + d.getDate() + " de " + MESES[d.getMonth()] + " a las " + S.hora + ":00";
  }
  function quien() { return S.dra === "any" ? "Cualquier profesional" : DRAS[S.dra].nombre; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderSummary() {
    var h = S.tipo === "tramite"
      ? "<b>Trámite administrativo</b><span>Te contactamos para coordinar día y horario.</span>"
      : "<b>Consulta " + esc(S.modo.toLowerCase()) + " · " + esc(quien()) + "</b><span>" + esc(fechaTexto().charAt(0).toUpperCase() + fechaTexto().slice(1)) + "</span>";
    $("[data-summary]").innerHTML = h;
  }

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") && e.target.value.trim()) e.target.removeAttribute("aria-invalid");
    if (!form.querySelector('[aria-invalid="true"]')) $("[data-error]").hidden = true;
  });

  var waUrl = "";
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = form.nombre.value.trim(), tel = form.tel.value.trim(), mail = form.mail.value.trim(), det = form.detalle.value.trim();
    var err = $("[data-error]"), bad = [];
    [form.nombre, form.tel, form.detalle].forEach(function (f) { f.removeAttribute("aria-invalid"); });
    if (S.tipo === "tramite" && !det) bad.push(form.detalle);
    if (!nombre) bad.push(form.nombre);
    if (tel.replace(/\D/g, "").length < 8) bad.push(form.tel);
    if (bad.length) {
      bad.forEach(function (f) { f.setAttribute("aria-invalid", "true"); });
      err.textContent = bad[0] === form.tel && bad.length === 1 ? "Revisá tu teléfono: necesitamos un número para confirmarte." : "Completá los campos marcados para confirmar el turno.";
      err.hidden = false;
      bad[0].focus();
      return;
    }
    err.hidden = true;

    var dra = S.tipo === "tramite" || S.dra === "any" ? DRAS.flores : DRAS[S.dra];
    var lines = S.tipo === "tramite"
      ? ["Hola, quiero pedir un turno para un trámite administrativo (desde la web).", "", "Trámite: " + det]
      : ["Hola " + (S.dra === "any" ? "" : dra.corto + ", ") + "quiero reservar un turno (desde la web).", "",
         "Consulta: " + S.modo, "Profesional: " + quien(), "Día: " + fechaTexto()];
    lines.push("Nombre: " + nombre, "Teléfono: " + tel);
    if (mail) lines.push("Correo: " + mail);
    waUrl = "https://wa.me/" + dra.wa + "?text=" + encodeURIComponent(lines.join("\n"));

    window.open(waUrl, "_blank", "noopener");

    $("[data-done-wa]").href = waUrl;
    $("[data-ics]").hidden = S.tipo === "tramite";
    $("[data-done-text]").textContent = S.tipo === "tramite"
      ? nombre.split(" ")[0] + ", enviá el mensaje de WhatsApp y te contactamos para coordinar."
      : nombre.split(" ")[0] + ", enviá el mensaje de WhatsApp y te confirmamos el turno del " + fechaTexto() + ".";
    go("listo");
  });

  // Agregar al calendario (.ics)
  $("[data-ics]").addEventListener("click", function () {
    var d = fromKey(S.fecha);
    function z(n) { return (n < 10 ? "0" : "") + n; }
    function utc(h) { // Salta es UTC-3 todo el año
      var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), h + 3));
      return t.getUTCFullYear() + z(t.getUTCMonth() + 1) + z(t.getUTCDate()) + "T" + z(t.getUTCHours()) + "0000Z";
    }
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Estudio Juridico FY//Turnos//ES", "BEGIN:VEVENT",
      "UID:" + Date.now() + "@estudio-fy", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
      "DTSTART:" + utc(S.hora), "DTEND:" + utc(S.hora + 1),
      "SUMMARY:Consulta " + S.modo.toLowerCase() + " - Estudio Jurídico F&Y",
      "LOCATION:" + (S.modo === "Presencial" ? "Santa Fe 474\\, Salta Capital" : S.modo),
      "DESCRIPTION:" + quien() + ". Pendiente de confirmación por WhatsApp.",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "turno-estudio-fy.ics";
    document.body.appendChild(a); a.click(); a.remove();
  });

  $("[data-restart]").addEventListener("click", function () {
    form.reset();
    S = { tipo: null, modo: null, dra: null, fecha: null, hora: null, view: null };
    $("[data-modo-note]").textContent = "Elegí una modalidad.";
    quienNext.disabled = true;
    trail = ["tipo"];
    show("tipo", 1);
  });

  var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();
  show("tipo");
})();
