/* =====================================================================
   HIER KONFIGURIERST DU ALLES (gilt für Startseite UND Shop).
   Ändere nur diese Datei, die Seiten bauen sich selbst daraus auf.
   ===================================================================== */
const CONFIG = {

  // --- Allgemein ---
  name: "Byte Code",
  titelTeil: "Code",                    // dieser Teil des Namens wird farbig
  tagline: "Fertiger Code für deine Projekte. Direkt nutzbar, sauber und fair lizenziert.",
  discordLink: "https://discord.gg/DEIN-LINK",   // <-- deinen Einladungslink eintragen

  // --- Farben ---
  farben: {
    bg: "#0b0a1a",
    flaeche: "#15132b",
    text: "#e9e7ff",
    lila: "#a855f7",
    blau: "#38bdf8"
  },

  // --- Bereiche auf der Startseite: true = anzeigen, false = verstecken ---
  zeigen: {
    shopVorschau: true,
    skills: true,
    ueberMich: true,
    kontakt: true
  },

  // --- SHOP-Einstellungen ---
  shop: {
    titel: "Shop",
    beschreibung: "Alle Produkte von Byte Code. Gekauft wird über unseren Discord-Server.",
    waehrung: "EUR",                    // z. B. "EUR" oder "USD"
    kaufenText: "Auf Discord kaufen",   // Text auf dem Kaufen-Knopf
    vorschauAnzahl: 3,                  // so viele Produkte erscheinen auf der Startseite
    lizenzTitel: "Lizenz & Regeln",
    // Jeder Eintrag ist eine Zeile in der Lizenz-Box. PLATZHALTER: bitte durch deine echten Regeln ersetzen.
    lizenz: [
      "Du darfst den Code in deinen eigenen Projekten verwenden.",
      "Weiterverkauf oder Weitergabe des Codes ist nicht erlaubt.",
      "Support und Fragen laufen über den Discord-Server."
    ]
  },

  // --- PRODUKTE (kopiere einen Block { ... }, um ein neues hinzuzufügen) ---
  // preis: nur die Zahl, mit Punkt (9.99). neu / ausverkauft: true oder false.
  produkte: [
    {
      name: "Discord Bot Starter",
      beschreibung: "Fertige Bot-Basis mit Befehlen, Event-Handler und Config-Datei.",
      preis: 9.99,
      tags: ["Discord", "JavaScript"],
      link: "https://discord.gg/DEIN-LINK",
      neu: true,
      ausverkauft: false
    },
    {
      name: "Moderations-Paket",
      beschreibung: "Ban, Kick, Timeout und Logging, sofort einsetzbar.",
      preis: 14.99,
      tags: ["Discord", "Python"],
      link: "https://discord.gg/DEIN-LINK",
      neu: false,
      ausverkauft: false
    },
    {
      name: "Portfolio-Template",
      beschreibung: "Einfache Webseiten-Vorlage mit HTML, CSS und etwas JavaScript.",
      preis: 4.99,
      tags: ["Web", "HTML"],
      link: "https://discord.gg/DEIN-LINK",
      neu: false,
      ausverkauft: false
    },
    {
      name: "Ticket-System",
      beschreibung: "Support-Tickets per Knopfdruck mit eigenen Kanälen.",
      preis: 12.5,
      tags: ["Discord", "Python"],
      link: "https://discord.gg/DEIN-LINK",
      neu: false,
      ausverkauft: true
    }
  ],

  // --- Skills (level = 0 bis 100) ---
  skills: [
    { name: "HTML / CSS", level: 60 },
    { name: "JavaScript", level: 50 },
    { name: "Python", level: 40 }
  ],

  ueberMich: "Hi, ich bin Justin. Ich schreibe Code und verkaufe ihn über meinen Discord-Server. Schreib mir, wenn du etwas Bestimmtes brauchst.",

  kontakt: [
    { text: "Discord-Server", url: "https://discord.gg/DEIN-LINK" },
    { text: "GitHub", url: "https://github.com/DEIN-NAME" }
  ],

  footer: "© 2026 Byte Code. Alle Rechte vorbehalten."
};
