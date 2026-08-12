/* =========================================================
   IITK SAMANVAY 2026 — single source of truth for speakers
   Edit ONLY this file to update the site. Both index.html
   (preview grid) and panellist.html (full grid) read from it.

   Fields per person:
     name          – full name
     designation   – job title
     organization  – company / institute
     panel         – "Panel 1" | "Panel 2" | "Panel 3"
     role          – optional, e.g. "Moderator" (shows a gold badge)
     image         – path inside images/ ; leave "" for placeholder card
     bio           – long text shown in the Read More modal
   ========================================================= */

const SAMANVAY = {

  /* ---------- panel titles (also used on index.html) ---------- */
  panelTitles: {
    "Panel 1": "Emerging Technologies Shaping India\u2019s Future in Innovation",
    "Panel 2": "Healthcare Innovation for Bharat: Advancing Accessible & Scalable MedTech Solutions",
    "Panel 3": "Impact Multipliers: Technology and Research for Greater Good"
  },

  /* ---------- chief guest ---------- */
  chiefGuest: {
    name: "Name",
    designation: "Designation",
    organization: "Organisation",
    image: "",
    bio: "A brief profile and welcome message will be added upon confirmation."
  },

  /* ---------- keynote speaker ---------- */
  keynote: {
    name: "Name",
    designation: "Designation",
    organization: "Organisation",
    image: "",
    bio: "A keynote address on the future of technology, innovation and industry-academia collaboration."
  },

  /* ---------- panellists ---------- */
  panellists: [
    /* ---- Panel 1 ---- */
    { name: "To be announced", designation: "Designation", organization: "IIT Kanpur", panel: "Panel 1", role: "Moderator", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 1", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 1", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 1", image: "", bio: "Details will be updated soon." },

    /* ---- Panel 2 ---- */
    { name: "To be announced", designation: "Designation", organization: "IIT Kanpur", panel: "Panel 2", role: "Moderator", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 2", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 2", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 2", image: "", bio: "Details will be updated soon." },

    /* ---- Panel 3 ---- */
    { name: "To be announced", designation: "Designation", organization: "IIT Kanpur", panel: "Panel 3", role: "Moderator", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 3", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 3", image: "", bio: "Details will be updated soon." },
    { name: "To be announced", designation: "Designation", organization: "Organisation", panel: "Panel 3", image: "", bio: "Details will be updated soon." }
  ]
};

/* =========================================================
   GALLERY
   Nayi photos yahan add kar dijiye — grid apne aap update ho jayega.
   size: "" (normal) | "wide" | "tall" | "big"
   Agar koi file missing ho to us tile ko grid se hata diya jayega.
   ========================================================= */
const GALLERY = [
  { src: "images/gallery/g01.jpg?v=5cf1f3ee", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g02.jpg?v=81fa7e91", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g03.jpg?v=4f00c3e1", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g04.jpg?v=5b41b9bf", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g05.jpg?v=0bee8925", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g06.jpg?v=e7f32d25", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/feature.jpg?v=414ee679", alt: "IITK Samanvay 2025 inaugural session", size: "center" },
  { src: "images/gallery/g07.jpg?v=fa0827a8", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g08.jpg?v=4f9a8488", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g09.jpg?v=900700d9", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g11.jpg?v=0fd81757", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g12.jpg?v=5c384114", alt: "IITK Samanvay 2025" },
  { src: "images/gallery/g14.jpg?v=07c0036f", alt: "IITK Samanvay 2025" }
];

/* ---------- shared card renderer (used by both pages) ---------- */
function samanvaySpeakerCard(p) {
  // placeholder always sits underneath; the photo (if any) paints over it
  const thumb = `<div class="ph-inner"><i class="bi bi-person"></i></div>` +
    (p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.remove();">`
      : '');

  const badge = p.panel ? `<span class="speaker-badge">${p.panel}</span>` : '';
  const role = p.role ? `<span class="moderator-badge">${p.role}</span>` : '';

  return `
    <div class="speaker-card">
      <div class="speaker-thumb">
        ${thumb}
        ${badge}
      </div>
      <div class="speaker-body">
        <h5>${p.name}</h5>
        ${role}
        <p class="desig">${p.designation || ''}</p>
        <p class="org">${p.organization || ''}</p>
        <div class="speaker-actions">
          <button class="btn-gtu-ghost btn-sm-gtu w-100 readmore"
            data-read-more='${JSON.stringify(p).replace(/'/g, "&apos;")}'
            data-bs-toggle="modal" data-bs-target="#bioModal">Read More</button>
        </div>
      </div>
    </div>`;
}
