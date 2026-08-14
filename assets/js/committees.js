/* ==========================================================================
   TGSMUN — shared committee data
   SINGLE SOURCE OF TRUTH. Consumed by committees.html AND whatsapp.html
   (and the homepage strip labels). Add/rename a committee here only.

   TODO — real assets to drop in when they exist:
     logo     : path to the committee crest, e.g. "assets/img/committees/unsc.svg"
                (null → the styled acronym badge placeholder is used instead)
     guide    : URL of the background guide PDF (null → "Guide Soon", disabled)
     whatsapp : the committee's WhatsApp invite URL, e.g.
                "https://chat.whatsapp.com/XXXXXXXXXXXXXXXXX"
                (null → "Link Soon", disabled)
   ========================================================================== */
window.TGSMUN_COMMITTEES = [
  // ---------------- SENIOR WING (Grades 9–12) ----------------
  {
    id: "unsc", abbr: "UNSC", name: "United Nations Security Council",
    wing: "senior", tags: ["Double Delegation"],
    agenda: "To be announced.",
    delegation: "Double delegation — two delegates per country. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "unhrc", abbr: "UNHRC", name: "United Nations Human Rights Council",
    wing: "senior", tags: ["Single Delegation"],
    agenda: "To be announced.",
    delegation: "Single delegation. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "disec", abbr: "DISEC", name: "Disarmament & International Security Committee",
    wing: "senior", tags: ["Single Delegation"],
    agenda: "To be announced.",
    delegation: "Single delegation. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "aippm", abbr: "AIPPM", name: "All India Political Parties Meet",
    wing: "senior", tags: ["Portfolio", "Special ROP"],
    agenda: "To be announced.",
    delegation: "Portfolio-based — leaders across party lines. Allotments to be announced.",
    logo: null, guide: null, whatsapp: null, rop: "rop.html#rop-aippm",
  },
  {
    id: "hcc", abbr: "HCC", name: "Historic Crisis Committee",
    wing: "senior", tags: ["Crisis"],
    agenda: "Briefing to be announced.",
    delegation: "Continuous crisis — directives, midnight updates, fast gavel.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "oas", abbr: "OAS", name: "Organization of American States",
    wing: "senior", tags: ["Single Delegation"],
    agenda: "To be announced.",
    delegation: "Single delegation. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "opec", abbr: "OPEC", name: "Organization of the Petroleum Exporting Countries",
    wing: "senior", tags: ["Crisis"],
    agenda: "Crisis briefing to be announced.",
    delegation: "Crisis committee — expect the market to move against you.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "nba", abbr: "NBA Draft", name: "NBA All-Time Greats Draft",
    wing: "senior", tags: ["Semi-Crisis", "Special ROP"],
    agenda: "Draft the greatest roster in basketball history — and defend every pick.",
    delegation: "Semi-crisis draft. Portfolios to be announced.",
    logo: null, guide: null, whatsapp: null, rop: "rop.html#rop-nba",
  },
  {
    id: "ip", abbr: "Int'l Press", name: "International Press",
    wing: "senior", tags: ["Press Corps"],
    agenda: "Journalism, photography and caricature across all committees.",
    delegation: "Journalist · Photographer · Caricaturist. Seats to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },

  // ---------------- JUNIOR WING ----------------
  {
    id: "unicef", abbr: "UNICEF", name: "United Nations Children's Fund",
    wing: "junior", tags: ["Beginner Friendly"],
    agenda: "To be announced.",
    delegation: "Single delegation. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "unesco", abbr: "UNESCO", name: "UN Educational, Scientific & Cultural Organization",
    wing: "junior", tags: ["Beginner Friendly"],
    agenda: "To be announced.",
    delegation: "Single delegation. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "who", abbr: "WHO", name: "World Health Organization",
    wing: "junior", tags: ["Beginner Friendly"],
    agenda: "To be announced.",
    delegation: "Single delegation. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "csw", abbr: "CSW", name: "Commission on the Status of Women",
    wing: "junior", tags: ["Beginner Friendly"],
    agenda: "To be announced.",
    delegation: "Single delegation. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
  {
    id: "unoosa", abbr: "UNOOSA", name: "UN Office for Outer Space Affairs",
    wing: "junior", tags: ["Beginner Friendly"],
    agenda: "To be announced.",
    delegation: "Single delegation. Size to be announced.",
    logo: null, guide: null, whatsapp: null, rop: null,
  },
];

/* ---------- shared markup helpers ---------- */
window.TGSMUN_ICONS = {
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.25-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23z"/></svg>',
  doc:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>',
  chevron:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
};

/** Placeholder crest — real logo when `logo` is set, styled acronym badge otherwise. */
window.tgsmunCrest = function (c) {
  if (c.logo) return '<span class="crest"><img src="' + c.logo + '" alt="' + c.abbr + ' crest" /></span>';
  return '<span class="crest" aria-hidden="true">' + c.abbr.replace(/[^A-Za-z]/g, "").slice(0, 6) + "</span>";
};
