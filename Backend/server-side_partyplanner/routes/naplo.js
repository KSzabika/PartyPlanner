const express = require("express");
const router = express.Router();
const pool = require("../db");

// egy buli naploja
router.get("/buli/:buliId", async (req, res) => {
  try {
    const { buliId } = req.params;
    const [sorok] = await pool.query(
      `SELECT n.naplo_id, n.muvelet_tipus, n.leiras, n.datum, f.felhasznalo_nev
       FROM naplo n
       LEFT JOIN felhasznalo f ON n.felhasznalo_id = f.felhasznalo_id
       WHERE n.buli_id = ?
       ORDER BY n.datum DESC`,
      [buliId]
    );
    res.json(sorok);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a naplo lekerdezesekor." });
  }
});

module.exports = router;
