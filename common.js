/* Gemeinsame Funktionen für alle Seiten. Lädt die Config, setzt Farben, baut Menü und Footer. */

function el(tag, klasse, text) {
  const e = document.createElement(tag);
  if (klasse) e.className = klasse;
  if (text !== undefined) e.textContent = text;
  return e;
}

function externerLink(text, klasse, url) {
  const a = el("a", klasse, text);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

// Name mit farbigem Teil, z. B. "Byte <span>Code</span>"
function farbigerName(name, teil) {
  const box = document.createDocumentFragment();
  const i = name.indexOf(teil);
  if (!teil || i < 0) { box.append(name); return box; }
  box.append(name.slice(0, i), el("span", "", teil), name.slice(i + teil.length));
  return box;
}

// 9.99 -> "9,99 €"
function preisText(zahl) {
  try {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: CONFIG.shop.waehrung }).format(zahl);
  } catch (e) {
    return zahl + " " + CONFIG.shop.waehrung;
  }
}

// Eine Produktkarte bauen (wird auf Startseite und im Shop benutzt)
function produktKarte(p) {
  const k = el("div", "karte");
  if (p.ausverkauft) k.append(el("div", "badge aus", "Ausverkauft"));
  else if (p.neu) k.append(el("div", "badge", "Neu"));

  const tags = el("div", "tags");
  p.tags.forEach(t => tags.append(el("span", "", t)));

  const kauf = externerLink(p.ausverkauft ? "Nicht verfügbar" : CONFIG.shop.kaufenText,
                            "btn" + (p.ausverkauft ? " aus" : ""), p.link);
  k.append(el("h3", "", p.name), el("p", "", p.beschreibung), tags,
           el("div", "preis", preisText(p.preis)), kauf);
  return k;
}

// Farben + Titel setzen, Menü und Footer bauen. "aktiv" ist "start" oder "shop".
function seiteStarten(aktiv, seitenTitel) {
  const F = CONFIG.farben, r = document.documentElement.style;
  r.setProperty("--bg", F.bg);
  r.setProperty("--flaeche", F.flaeche);
  r.setProperty("--text", F.text);
  r.setProperty("--lila", F.lila);
  r.setProperty("--blau", F.blau);
  document.title = seitenTitel + " | " + CONFIG.name;

  const nav = el("nav");
  const logo = el("a", "logo");
  logo.href = "index.html";
  logo.append(farbigerName(CONFIG.name, CONFIG.titelTeil));
  const links = el("div", "links");

  const eintraege = [
    ["index.html", "Start", "start", true],
    ["shop.html", "Shop", "shop", true]
  ];
  if (CONFIG.zeigen.skills)    eintraege.push(["index.html#skills", "Skills", "", false]);
  if (CONFIG.zeigen.ueberMich) eintraege.push(["index.html#ueberMich", "Über mich", "", false]);
  if (CONFIG.zeigen.kontakt)   eintraege.push(["index.html#kontakt", "Kontakt", "", false]);

  eintraege.forEach(([href, label, id, haupt]) => {
    const a = el("a", (haupt ? "haupt " : "") + (id === aktiv ? "aktiv" : ""), label);
    a.href = href;
    links.append(a);
  });
  links.append(externerLink("Discord", "btn voll", CONFIG.discordLink));
  nav.append(logo, links);
  document.body.prepend(nav);

  document.getElementById("footer").textContent = CONFIG.footer;
}
