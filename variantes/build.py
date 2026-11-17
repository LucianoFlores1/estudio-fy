# Genera las variantes a partir de los bloques compartidos de index.html
# Uso: python variantes/build.py
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
src = (root / "index.html").read_text(encoding="utf-8")


def grab(start, end):
    i = src.index(start)
    j = src.index(end, i) + len(end)
    return src[i:j]


FORM = grab('<form class="wiz"', "</form>")
ACC = grab('<div class="acc">', "</details>\n        </div>")
PEOPLE = grab('<ul class="people">', "</ul>")
PLACE = grab('<a class="place"', "</a>")
SHEET = grab('<div class="sheet"', "</div>\n  </div>")
SPRITE = grab('<svg width="0" height="0"', "</svg>\n")
FAB = """<button class="fab is-hidden" type="button" data-open-wa aria-label="Escribir por WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>
  </button>"""

EXTRA_ICONS = """    <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></symbol>
    <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/></symbol>
  </svg>"""
SPRITE = SPRITE.replace("  </svg>", EXTRA_ICONS, 1)

P1 = "Somos un estudio jurídico integrado por <em>abogadas</em> con ejercicio profesional en la Provincia de Salta."
P2 = ("Brindamos asesoramiento y representación legal integral, acompañando a nuestros clientes en la prevención, "
      "resolución y seguimiento de sus asuntos jurídicos, con un enfoque <b>responsable, personalizado y comprometido</b>.")

ICON = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-{}"/></svg>'
NAV = ('<nav class="nav" aria-label="Secciones"><a href="#turnos">Turnos</a>'
       '<a href="#servicios">Servicios</a><a href="#contacto">Contacto</a></nav>')


def head(title, css):
    return f"""<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
  <title>{title} · Estudio Jurídico F&amp;Y</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="https://lucianoflores1.github.io/estudio-fy/">
  <meta name="theme-color" content="{'#f7f3ee' if css == 'b.css' else '#2a1c13'}">
  <link rel="icon" href="../../favicon.ico" sizes="any">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../css/styles.css">
  <link rel="stylesheet" href="{css}">
</head>
"""


def brand(dark=True):
    iso = "isotipo-crema" if dark else "isotipo-marron"
    return f"""<a class="brand" href="#inicio" aria-label="Estudio Jurídico F&amp;Y, inicio">
        <img src="assets/{iso}.png" alt="" width="34" height="34">
        <span class="brand__name"><b>F&amp;Y</b><small>Estudio Jurídico</small></span>
      </a>"""


def booking(form, sub="En cuatro pasos. Te confirmamos por WhatsApp."):
    return f"""    <section class="book" id="turnos" aria-labelledby="book-title">
      <div class="wrap book__in">
        <div class="book__head">
          <h2 id="book-title" class="h2">Reservá tu turno</h2>
          <p class="muted">{sub}</p>
        </div>
        {form}
      </div>
    </section>
"""


SERVICES = f"""    <section class="services" id="servicios" aria-labelledby="serv-title">
      <div class="wrap services__in">
        <h2 id="serv-title" class="h2">Servicios</h2>
        {ACC}
      </div>
    </section>
"""

CONTACT = f"""    <section class="contact" id="contacto" aria-labelledby="contact-title">
      <div class="wrap contact__in">
        <h2 id="contact-title" class="h2">Contacto</h2>
        {PEOPLE}
        {PLACE}
      </div>
    </section>
"""

FOOT = f"""  <footer class="foot">
    <div class="wrap foot__in">
      <img src="assets/logo-crema.png" alt="Estudio Jurídico F&amp;Y, Salta Iuris" width="96" height="96" loading="lazy">
      <ul class="social">
        <li><a href="https://www.instagram.com/abogadas.salta.iuris" target="_blank" rel="noopener" aria-label="Instagram">{ICON.format('ig')}</a></li>
        <li><a href="https://www.tiktok.com/@abogadas.salta.iuris" target="_blank" rel="noopener" aria-label="TikTok">{ICON.format('tt')}</a></li>
      </ul>
      <p>© <span data-year>2026</span> Estudio Jurídico F&amp;Y · Salta Iuris</p>
    </div>
  </footer>
"""


def tail(extra=""):
    return f"""{extra}
  {SHEET}
  {SPRITE}
  <script src="../../js/main.js" defer></script>
</body>
</html>
"""


def fix(html):
    return html.replace('src="assets/', 'src="../../assets/')


# ---------------- A · Retrato ----------------
A = head("Variante A · Retrato", "a.css") + f"""<body class="v-a">
  <header class="top">
    <div class="top__in wrap">
      {brand()}
      {NAV}
      <a class="btn btn--cream btn--sm top__cta" href="#turnos">Reservar turno</a>
    </div>
  </header>
  <main>
    <section class="hero" id="inicio">
      <div class="ra">
        <figure class="ra__ph"><img src="assets/fotos/dra-flores.jpg" alt="Dra. Ana Paula Flores" width="1000" height="1250"><figcaption>Dra. Ana Paula Flores</figcaption></figure>
        <figure class="ra__ph"><img src="assets/fotos/dra-yonar.jpg" alt="Dra. Paula Talía Yonar" width="1000" height="1250"><figcaption>Dra. Paula Talía Yonar</figcaption></figure>
      </div>
      <div class="ra__copy">
        <h1 class="hero__title">{P1}</h1>
        <p class="hero__lede">{P2}</p>
        <div class="hero__cta ra__cta">
          <a class="btn btn--cream btn--lg" href="#turnos">{ICON.format('cal')}Reservar turno</a>
          <button class="btn btn--ghost btn--lg" type="button" data-open-wa>{ICON.format('wa')}WhatsApp</button>
        </div>
      </div>
    </section>
{booking(FORM)}{SERVICES}{CONTACT}  </main>
{FOOT}""" + tail(f"""  <nav class="actbar" aria-label="Acciones rápidas">
    <a class="btn btn--cream actbar__main" href="#turnos">{ICON.format('cal')}Reservar turno</a>
    <button class="actbar__wa" type="button" data-open-wa aria-label="Escribir por WhatsApp">{ICON.format('wa')}</button>
  </nav>""")

# ---------------- B · Membrete ----------------
B = head("Variante B · Membrete", "b.css") + f"""<body class="v-b">
  <header class="top">
    <div class="top__in wrap">
      {brand(False)}
      {NAV}
      <a class="btn btn--ink btn--sm" href="#turnos">Reservar turno</a>
    </div>
  </header>
  <main>
    <section class="hero" id="inicio">
      <div class="wrap mb">
        <img class="mb__logo" src="assets/logo-marron.png" alt="Estudio Jurídico F&amp;Y, Salta Iuris" width="534" height="534">
        <h1 class="hero__title">{P1}</h1>
        <p class="mb__lede">Brindamos asesoramiento y representación legal integral, acompañando a nuestros clientes en la prevención, resolución y seguimiento de sus asuntos jurídicos, con un enfoque</p>
        <ul class="mb__values" aria-label="Nuestro enfoque"><li>Responsable</li><li>Personalizado</li><li>Comprometido</li></ul>
        <div class="hero__cta mb__cta">
          <a class="btn btn--ink btn--lg" href="#turnos">{ICON.format('cal')}Reservar turno</a>
          <button class="btn btn--line btn--lg hero__wa" type="button" data-open-wa>{ICON.format('wa')}WhatsApp</button>
        </div>
        <ul class="firmas" aria-label="Las abogadas">
          <li><img src="assets/fotos/dra-flores-avatar.jpg" alt="" width="120" height="120"><b>Dra. Ana Paula Flores</b><small>Abogada</small></li>
          <li><img src="assets/fotos/dra-yonar-avatar.jpg" alt="" width="120" height="120"><b>Dra. Paula Talía Yonar</b><small>Abogada</small></li>
        </ul>
      </div>
    </section>
{booking(FORM)}{SERVICES}{CONTACT}  </main>
{FOOT}""" + tail("  " + FAB)

# ---------------- C · Turnero ----------------
FORM_C = FORM.replace('<form class="wiz" data-wiz novalidate>', '<form class="wiz" data-wiz data-cal-mode="strip" novalidate>')
C = head("Variante C · Turnero", "c.css") + f"""<body class="v-c">
  <header class="top">
    <div class="top__in wrap">
      {brand()}
      {NAV}
      <button class="btn btn--ghost btn--sm tc__wa" type="button" data-open-wa>{ICON.format('wa')}WhatsApp</button>
    </div>
  </header>
  <main>
    <section class="hero" id="inicio">
      <div class="wrap tc">
        <div class="tc__copy">
          <h1 class="hero__title">{P1}</h1>
          <p class="hero__lede">{P2}</p>
        </div>
        <div class="tc__pick">
          <p class="tc__ask">¿Con quién querés tu turno?</p>
          <a class="tc__dra" href="#turnos" data-pick-dra="flores">
            <img src="assets/fotos/dra-flores-avatar.jpg" alt="" width="60" height="60">
            <span><b>Dra. Ana Paula Flores</b><small>Lunes a viernes · 9 a 19 h</small></span>
            {ICON.format('chev')}
          </a>
          <a class="tc__dra" href="#turnos" data-pick-dra="yonar">
            <img src="assets/fotos/dra-yonar-avatar.jpg" alt="" width="60" height="60">
            <span><b>Dra. Paula Talía Yonar</b><small>Lunes a sábado · 8 a 19 h</small></span>
            {ICON.format('chev')}
          </a>
          <a class="tc__other" href="#turnos">Otra profesional o trámite administrativo</a>
        </div>
      </div>
    </section>
{booking(FORM_C, "Elegí día y horario en segundos. Te confirmamos por WhatsApp.")}{SERVICES}{CONTACT}  </main>
{FOOT}""" + tail(f"""  <nav class="tabs" aria-label="Navegación">
    <a href="#inicio">{ICON.format('home')}<span>Inicio</span></a>
    <a href="#turnos">{ICON.format('cal')}<span>Turnos</span></a>
    <button type="button" class="tabs__wa" data-open-wa aria-label="WhatsApp">{ICON.format('wa')}</button>
    <a href="#servicios">{ICON.format('list')}<span>Servicios</span></a>
    <a href="#contacto">{ICON.format('pin')}<span>Contacto</span></a>
  </nav>""")

for name, html in (("a", A), ("b", B), ("c", C)):
    d = root / "variantes" / name
    d.mkdir(parents=True, exist_ok=True)
    (d / "index.html").write_text(fix(html), encoding="utf-8")
print("ok")
