const pool = require("./db");

async function naploz(felhasznaloId, buliId, muveletTipus, leiras) {
  try {
    await pool.query(
      `INSERT INTO naplo (felhasznalo_id, buli_id, muvelet_tipus, leiras)
       VALUES (?, ?, ?, ?)`,
      [felhasznaloId || null, buliId || null, muveletTipus, leiras]
    );
  } catch (hiba) {
    console.error("Naplozasi hiba:", hiba);
  }
}

module.exports = naploz;
