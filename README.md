# Moje procedúry – Kováčová 2026

Mobilná aplikácia (PWA) s rozpisom 84 kúpeľných procedúr počas pobytu 16. 11. – 13. 12. 2026.
Funguje offline a dá sa pridať na plochu telefónu.

## Čo vie

- **Deň:** karta „Najbližšia procedúra“ s odpočtom a časom príchodu (5 min vopred). Ukazuje aj procedúru, ktorá práve prebieha, a upozorní na tesné prechody medzi procedúrami.
- **Pobyt:** rozpis po týždňoch s filtrom podľa druhu procedúry.
- **Prehľad:** štatistika podľa druhu procedúry, týždňa a miesta a priebeh liečby.
- **Upozornenia:** stiahnutie kalendára (`.ics`) s pripomienkou 10/15/30/60 minút alebo 30 + 10 minút vopred. Ďalej popisy procedúr, pravidlá z preukazu a kontakt na recepciu.
- Odškrtnuté procedúry sa ukladajú iba v telefóne (`localStorage`).

Repozitár je verejný, preto v ňom **nie sú žiadne osobné údaje** (meno, izba, lekár, diagnóza). Je tu iba rozpis procedúr.

## Nasadenie na Netlify (jednorazovo)

1. Prihlás sa na [app.netlify.com](https://app.netlify.com), najlepšie cez GitHub.
2. Klikni na **Add new site → Import an existing project → GitHub** a vyber repozitár `kovacova`.
3. Branch: tá, v ktorej je aplikácia (po zlúčení PR je to `main`). Nastavenia sa načítajú z `netlify.toml`, takže nič nemeň.
4. Klikni na **Deploy**. O chvíľu dostaneš odkaz `https://<nazov>.netlify.app`. Názov sa dá zmeniť v **Site configuration → Change site name**.

## Pridanie na plochu telefónu

- **iPhone (Safari):** Zdieľať → **Pridať na plochu**.
- **Android (Chrome):** menu ⋮ → **Pridať na plochu** alebo **Inštalovať aplikáciu**.

## Zmena rozpisu

Rozpis je v `public/index.html` v bloku `RAW` (jeden riadok = jeden deň, napr. `2026-11-16|13:30 RB,14:00 KV`).
Po zmene spusti `node scripts/build.mjs`. Skript skontroluje dáta a znova vygeneruje kalendáre `.ics`. Netlify ho spúšťa automaticky pri každom nasadení.

Testovanie iného času: `index.html?now=2026-11-20T13:10`.
