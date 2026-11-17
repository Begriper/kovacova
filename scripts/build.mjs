// Generuje kalendárové súbory (.ics) z rozpisu v public/index.html a kontroluje dáta.
// Spustenie: node scripts/build.mjs [cesta-k-povodnemu-html-na-porovnanie]
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const block = html.split("/*SHARED-START*/")[1].split("/*SHARED-END*/")[0];
const ctx = vm.createContext({ TextEncoder, Date, Error, String });
const { buildEvents, buildICS } = vm.runInContext(block + ";({buildEvents, buildICS})", ctx);
const events = buildEvents();

// --- kontroly ---
const fail = (m) => { console.error("CHYBA:", m); process.exit(1); };
if (events.length !== 84) fail(`očakávaných 84 procedúr, je ${events.length}`);
const days = new Set(events.map((e) => e.date));
if (days.size !== 28) fail(`očakávaných 28 dní, je ${days.size}`);
const count = {};
for (const e of events) count[e.name] = (count[e.name] || 0) + 1;
console.log("Procedúr:", events.length, "| dní:", days.size);
console.log(Object.entries(count).sort((a, b) => b[1] - a[1]).map(([n, c]) => `  ${c}× ${n}`).join("\n"));

// voliteľné porovnanie s pôvodným HTML
const orig = process.argv[2];
if (orig && fs.existsSync(orig)) {
  const src = fs.readFileSync(orig, "utf8");
  const old = JSON.parse(src.match(/const events=(\[.*?\]);/s)[1]);
  const norm = (s) => s.toLowerCase();
  let diffs = 0;
  old.forEach((o, i) => {
    const n = events[i];
    if (!n || o.date !== n.date || o.time !== n.time || norm(o.procedure) !== norm(n.name)) {
      diffs++; console.log("ROZDIEL", i + 1, o.date, o.time, o.procedure, "<>", n && `${n.date} ${n.time} ${n.name}`);
    }
  });
  if (old.length !== events.length) diffs++;
  console.log(diffs ? `Porovnanie s pôvodným: ${diffs} rozdielov` : "Porovnanie s pôvodným HTML: dátumy, časy a procedúry sa zhodujú (84/84).");
}

// --- ICS predvoľby (názvy musia sedieť s <select id="alarm"> v index.html) ---
const presets = { bez: [], 10: [10], 15: [15], 30: [30], 60: [60], "30-10": [30, 10] };
for (const [name, alarms] of Object.entries(presets)) {
  fs.writeFileSync(new URL(`../public/kalendar-${name}.ics`, import.meta.url), buildICS(events, alarms));
}
console.log("Vygenerované:", Object.keys(presets).map((p) => `kalendar-${p}.ics`).join(", "));
