# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS (single `index.html` + `assets/`), no build step. Deployable to Firebase Hosting, Netlify or any static host.

## Users

People in Salta (Argentina), mostly from mobile, facing a personal legal problem: a divorce or alimony claim, an inheritance, a dismissal, a traffic accident, a criminal charge, a pension claim, a debt. They are often anxious, unfamiliar with legal language, and searching on Google, Maps, Instagram or asking ChatGPT "abogada en Salta para ...". Their job: decide quickly whether this firm can help and contact a lawyer.

## Product Purpose

Marketing site for Estudio Jurídico F&Y · Salta Iuris, a law firm of two lawyers. Success = a visitor writes on WhatsApp to one of the two lawyers or books a turno in the existing booking system (https://estudio-fy.web.app/).

## Positioning

A women-led firm of two lawyers practicing in the Province of Salta, offering personal, direct treatment (you talk to the lawyer, not to a secretary), with consultation in person, in writing and online, plus a gestora for administrative paperwork.

## Operating Context

- Office: Santa Fe 474, Salta Capital.
- Dra. Flores Ana Paula · +54 9 387 542-9897 · anapaulaflores012706@gmail.com · attends Mon–Fri, slots 9:00–19:00 (verified on live booking UI, 2026-11-17).
- Dra. Yonar Paula Talía · +54 9 387 482-8131 · abogadasalta.iuris@gmail.com · attends Mon–Sat, slots 8:00–19:00 (verified on live booking UI, 2026-11-17).
- Instagram and TikTok: @abogadas.salta.iuris.
- Redesign must be self-contained: booking happens on the page (no link to the old app). Current build: 4-step wizard, Sundays excluded, 24h lead, 7 days ahead, confirmation sent via WhatsApp. Mobile-first: most traffic is mobile. Keep copy short.

## Capabilities and Constraints

Practice areas exactly as published on the live site (Firebase config/servicios): Acompañamiento a mediación; Derecho de familia (divorcios, alimentos, cuidado personal, régimen de comunicación, filiación, supresión de apellido / cambio de nombre); Derecho sucesorio; Derecho civil (contratos, prescripción adquisitiva); Derecho de daños (accidentes de tránsito, daños y perjuicios); Derecho laboral (incl. ART); Derecho penal; Derecho previsional; Procesos ejecutivos. Plus trámites administrativos (gestora). Do NOT list areas only present in code defaults (violencia, consumidor, derechos reales).

Modalities: Consulta presencial, escrita, online.

Undecided: matrícula numbers, years of practice, university, fees. Do not invent them.

## Brand Commitments

- Logo: scales of justice with interlaced "F" and "Y", "ESTUDIO JURÍDICO" and "Salta Iuris" (`assets/logo.png`).
- Palette: warm cream/beige, deep browns, bronze accent. Classical serif typography (Cormorant Garamond / EB Garamond / Lora family).
- Voice: Rioplatense Spanish with "vos" (reservá, escribinos, elegí). Warm, responsible, personal, committed.

## Evidence on Hand

Logo, a photo of the Poder Judicial de Salta building, contact data, practice-area list. No photos of the lawyers yet (placeholders to be replaced by the user). No testimonials, reviews, case numbers or stats: never fabricate them.

## Product Principles

1. Contact in one tap: WhatsApp to a named lawyer is always within reach.
2. Speak the client's problem, not the legal code.
3. Show the two real people behind the firm.
4. Be findable: local SEO for Salta and clear, factual content that LLMs can cite.

## Accessibility & Inclusion

Mobile-first; readable for non-expert, possibly distressed users; WCAG AA contrast; respect reduced motion. Violencia de género section must be calm and discreet.
