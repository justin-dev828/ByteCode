/* Gemeinsame Funktionen: Beta-Sperre, Menü, Sale-Banner, Preise, Warenkorb, Dev-Panel. */

function el(tag, klasse, text) {
  const e = document.createElement(tag);
  if (klasse) e.className = klasse;
  if (text !== undefined) e.textContent = text;
  return e;
}
function externerLink(text, klasse, url) {
  const a = el("a", klasse, text);
  a.href = url; a.target = "_blank"; a.rel = "noopener";
  return a;
}
function farbigerName(name, teil) {
  const box = document.createDocumentFragment();
  const i = name.indexOf(teil);
  if (!teil || i < 0) { box.append(name); return box; }
  box.append(name.slice(0, i), el("span", "", teil), name.slice(i + teil.length));
  return box;
}
function preisText(zahl) {
  try { return new Intl.NumberFormat("de-DE", { style: "currency", currency: CONFIG.shop.waehrung }).format(zahl); }
  catch (e) { return zahl + " " + CONFIG.shop.waehrung; }
}

/* ---------- Sale & Preise ---------- */
function saleLaeuft() {
  const s = CONFIG.sale;
  return s.aktiv && (!s.bis || new Date(s.bis + "T23:59:59") > new Date());
}
// Liefert alten Preis, neuen Preis und Rabatt in %. Produkt-Sale hat Vorrang vor dem globalen Sale.
function preisInfo(p) {
  const pr = p.sale ? p.sale : (saleLaeuft() ? CONFIG.sale.prozent : 0);
  return { alt: p.preis, neu: Math.round(p.preis * (100 - pr)) / 100, pr: pr };
}

let bannerEl, bannerTimer;
function banner() {
  if (!bannerEl) { bannerEl = el("div", "sale"); document.body.prepend(bannerEl); }
  clearInterval(bannerTimer);
  if (!saleLaeuft()) { bannerEl.hidden = true; return; }
  bannerEl.hidden = false;
  const s = CONFIG.sale;
  const tick = () => {
    let t = s.name + ": -" + s.prozent + " % auf alles";
    if (s.bis) {
      const d = new Date(s.bis + "T23:59:59") - new Date();
      if (d <= 0) { banner(); return; }
      const h = Math.floor(d / 36e5);
      t += " – noch " + Math.floor(h / 24) + " T " + (h % 24) + " Std " + (Math.floor(d / 6e4) % 60) + " Min " + (Math.floor(d / 1e3) % 60) + " Sek";
    }
    bannerEl.textContent = t;
  };
  tick();
  bannerTimer = setInterval(tick, 1000);
}

/* ---------- Warenkorb (bleibt zwischen den Seiten erhalten) ---------- */
function laden(key, std) { try { return JSON.parse(localStorage.getItem(key)) || std; } catch (e) { return std; } }
function speichern(key, wert) { try { localStorage.setItem(key, JSON.stringify(wert)); } catch (e) {} }
let cart = laden("bc_cart", []);
let code = laden("bc_code", "");
let codeMeldung = "";

function codeFinden(text) {
  const t = (text || "").trim().toUpperCase();
  return CONFIG.codes.find(c => c.code.toUpperCase() === t && (!c.bis || new Date(c.bis + "T23:59:59") > new Date()));
}
function zuWarenkorb(p) {
  if (!cart.includes(p.name)) { cart.push(p.name); speichern("bc_cart", cart); }
  cartRender();
  document.getElementById("cart").classList.add("offen");
}

function cartRender() {
  document.getElementById("cartZahl").textContent = cart.length;
  const box = document.getElementById("cartInhalt");
  box.replaceChildren();
  const items = cart.map(n => CONFIG.produkte.find(p => p.name === n)).filter(Boolean);
  if (!items.length) { box.append(el("p", "leer", "Dein Warenkorb ist leer.")); return; }

  let summe = 0;
  items.forEach(p => {
    const preis = preisInfo(p).neu;
    summe += preis;
    const z = el("div", "zeile");
    const x = el("button", "x", "✕");
    x.setAttribute("aria-label", p.name + " entfernen");
    x.onclick = () => { cart = cart.filter(n => n !== p.name); speichern("bc_cart", cart); cartRender(); };
    z.append(el("span", "", p.name), el("span", "", preisText(preis)), x);
    box.append(z);
  });

  // Rabattcode
  const zeile = el("div", "coderow");
  const inp = el("input"); inp.placeholder = "Rabattcode"; inp.value = code;
  const ok = el("button", "btn", "Einlösen");
  ok.onclick = () => {
    const c = codeFinden(inp.value);
    code = c ? c.code : "";
    codeMeldung = c ? "Code angewendet." : "Dieser Code ist ungültig oder abgelaufen.";
    speichern("bc_code", code); cartRender();
  };
  zeile.append(inp, ok);
  box.append(zeile);
  if (codeMeldung) box.append(el("p", "hinweis", codeMeldung));

  const c = code ? codeFinden(code) : null;
  const abzug = c ? (c.prozent ? Math.round(summe * c.prozent) / 100 : Math.min(c.betrag, summe)) : 0;
  const gesamt = Math.max(0, summe - abzug);
  if (abzug) box.append(el("div", "zeile", "Code " + c.code + ": -" + preisText(abzug)));
  box.append(el("div", "gesamt", "Gesamt: " + preisText(gesamt)));

  // Bestellung als Text kopieren und im Discord einfügen
  const text = "Bestellung bei " + CONFIG.name + "\n" +
    items.map(p => "- " + p.name + ": " + preisText(preisInfo(p).neu)).join("\n") +
    (abzug ? "\nCode " + c.code + ": -" + preisText(abzug) : "") +
    "\nGesamt: " + preisText(gesamt);
  const kopieren = el("button", "btn voll", "Bestellung kopieren");
  kopieren.onclick = () => {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(() => { kopieren.textContent = "Kopiert! Jetzt im Discord einfügen"; })
      .catch(() => { kopieren.textContent = "Kopieren nicht möglich"; });
  };
  box.append(kopieren, externerLink("Discord öffnen", "btn", CONFIG.discordLink));
}

function warenkorbBauen() {
  const d = el("aside", "drawer"); d.id = "cart";
  const kopf = el("div", "drawerkopf");
  const zu = el("button", "x", "✕");
  zu.setAttribute("aria-label", "Schließen");
  zu.onclick = () => d.classList.remove("offen");
  kopf.append(el("h2", "", "Warenkorb"), zu);
  const inhalt = el("div"); inhalt.id = "cartInhalt";
  d.append(kopf, inhalt);
  document.body.append(d);
  cartRender();
}

/* ---------- Produktkarte (Startseite und Shop) ---------- */
function produktKarte(p) {
  const i = preisInfo(p);
  const k = el("div", "karte");
  if (p.ausverkauft) k.append(el("div", "badge aus", "Ausverkauft"));
  else if (i.pr) k.append(el("div", "badge sale", "-" + i.pr + " %"));
  else if (p.neu) k.append(el("div", "badge", "Neu"));

  const tags = el("div", "tags");
  p.tags.forEach(t => tags.append(el("span", "", t)));

  const preis = el("div", "preis");
  if (i.pr) preis.append(el("s", "alt", preisText(i.alt)), " ");
  preis.append(el("strong", "", preisText(i.neu)));

  const knopf = el("button", "btn" + (p.ausverkauft ? " aus" : ""), p.ausverkauft ? "Nicht verfügbar" : CONFIG.shop.kaufenText);
  if (!p.ausverkauft) knopf.onclick = () => { zuWarenkorb(p); knopf.textContent = "Im Warenkorb"; };
  k.append(el("h3", "", p.name), el("p", "", p.beschreibung), tags, preis, knopf);
  return k;
}

/* ---------- Dev-Panel (nur im Beta-Modus): Sale live testen ---------- */
function devPanel() {
  const d = el("div", "dev");
  const an = el("input"); an.type = "checkbox"; an.checked = CONFIG.sale.aktiv;
  const pz = el("input"); pz.type = "number"; pz.min = 0; pz.max = 90; pz.value = CONFIG.sale.prozent;
  const aendern = () => {
    CONFIG.sale.aktiv = an.checked;
    CONFIG.sale.prozent = Math.max(0, Math.min(90, Number(pz.value) || 0));
    banner(); cartRender();
    if (window.neuZeichnen) window.neuZeichnen();
  };
  an.onchange = aendern; pz.oninput = aendern;
  const l1 = el("label"); l1.append(an, " Sale an");
  const l2 = el("label"); l2.append("Rabatt ", pz, " %");
  d.append(el("strong", "", "Dev-Panel"), l1, l2,
           el("small", "", "Nur Vorschau. Zum Speichern den Wert in config.js eintragen."));
  document.body.append(d);
}

/* ---------- Seite starten (mit Beta-Sperre) ---------- */
function menue(aktiv) {
  const nav = el("nav");
  const logo = el("a", "logo");
  logo.href = "index.html";
  logo.append(farbigerName(CONFIG.name, CONFIG.titelTeil));
  if (CONFIG.beta.aktiv) logo.append(" ", el("small", "beta", "BETA"));
  const links = el("div", "links");
  const eintraege = [["index.html", "Start", "start", true], ["shop.html", "Shop", "shop", true]];
  if (CONFIG.zeigen.skills)    eintraege.push(["index.html#skills", "Skills", "", false]);
  if (CONFIG.zeigen.ueberMich) eintraege.push(["index.html#ueberMich", "Über mich", "", false]);
  if (CONFIG.zeigen.kontakt)   eintraege.push(["index.html#kontakt", "Kontakt", "", false]);
  eintraege.forEach(([href, label, id, haupt]) => {
    const a = el("a", (haupt ? "haupt " : "") + (id === aktiv ? "aktiv" : ""), label);
    a.href = href;
    links.append(a);
  });
  const wk = el("button", "btn");
  wk.append("Warenkorb (", el("span", "", "0"), ")");
  wk.lastChild.previousSibling.id = "cartZahl";
  wk.onclick = () => document.getElementById("cart").classList.toggle("offen");
  links.append(wk);
  nav.append(logo, links);
  document.body.prepend(nav);
}

function seiteStarten(aktiv, seitenTitel, bauen) {
  const F = CONFIG.farben, r = document.documentElement.style;
  r.setProperty("--bg", F.bg); r.setProperty("--flaeche", F.flaeche); r.setProperty("--text", F.text);
  r.setProperty("--lila", F.lila); r.setProperty("--blau", F.blau);
  document.title = seitenTitel + " | " + CONFIG.name;
  document.getElementById("footer").textContent = CONFIG.footer;

  const los = () => {
    menue(aktiv); banner(); warenkorbBauen();
    if (CONFIG.beta.aktiv) devPanel();
    bauen();
  };

  let frei = !CONFIG.beta.aktiv;
  try { if (sessionStorage.getItem("bc_beta") === "ok") frei = true; } catch (e) {}
  if (frei) { los(); return; }

  // Gesperrt: Seiteninhalt wird gar nicht erst gebaut
  const gate = el("div", "gate");
  const inp = el("input"); inp.type = "password"; inp.placeholder = "Beta-Passwort";
  const msg = el("p", "hinweis");
  const knopf = el("button", "btn voll", "Freischalten");
  const pruefen = () => {
    if (inp.value === CONFIG.beta.passwort) {
      try { sessionStorage.setItem("bc_beta", "ok"); } catch (e) {}
      gate.remove(); los();
    } else { msg.textContent = "Falsches Passwort."; }
  };
  knopf.onclick = pruefen;
  inp.onkeydown = e => { if (e.key === "Enter") pruefen(); };
  const h = el("h1"); h.append(farbigerName(CONFIG.name, CONFIG.titelTeil));
  gate.append(h, el("p", "", "Beta-Phase: Diese Seite ist noch nicht öffentlich."), inp, knopf, msg);
  document.body.append(gate);
}
