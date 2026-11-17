# Web · Estudio Jurídico F&Y

Sitio estático (`index.html`, `css/`, `js/`, `assets/`). Publicado en GitHub Pages.

## Fotos de las abogadas

`assets/fotos/dra-flores.jpg` y `assets/fotos/dra-yonar.jpg` son marcos con iniciales. Reemplazalos por las fotos reales con el mismo nombre (vertical 4:5, mínimo 1000×1250 px, cara centrada: también se usan recortadas en círculo).

## Turnos

El formulario funciona en la misma página: tipo de consulta → modalidad y abogada → día y horario → datos. Al confirmar se abre WhatsApp con la reserva escrita, dirigida a la abogada elegida ("Cualquier profesional" y trámites van a la Dra. Flores). Se puede agregar el turno al calendario (.ics).

Reglas en `js/main.js` (arriba de todo):
- Horarios (los de su sistema de turnos): Flores lunes a viernes, turnos de 9 a 19; Yonar lunes a sábado, turnos de 8 a 19.
- Sin domingos, 24 h de anticipación mínima, hasta 7 días hacia adelante (`DIAS_MAX`).
- No bloquea horarios ya tomados (no hay base de datos): la abogada confirma por WhatsApp.

## Dominio

Si cambia la dirección del sitio, reemplazá `https://lucianoflores1.github.io/estudio-fy/` en `index.html`, `robots.txt`, `sitemap.xml` y `llms.txt`.
