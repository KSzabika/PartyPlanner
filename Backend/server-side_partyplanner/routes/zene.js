const express = require("express");
const router = express.Router();
const pool = require("../db");

//egy buli zenei lehetosegei, a szavazatok osszesitesevel
router.get("/buli/:buliId", async (req, res) => {
  try {
    const { buliId } = req.params;
    const [sorok] = await pool.query(
      `SELECT zl.zene_lehetoseg_id, z.zene_id, z.zene_mufaj_neve,
              COUNT(CASE WHEN s.zene_szavazat = 1 THEN 1 END) AS igen_szavazatok
       FROM zene_lehetosegek zl
       JOIN zenek z ON zl.zene_id = z.zene_id
       LEFT JOIN zene_mufaj_szavazas s ON s.zene_lehetoseg_id = zl.zene_lehetoseg_id
       WHERE zl.buli_id = ?
       GROUP BY zl.zene_lehetoseg_id, z.zene_id, z.zene_mufaj_neve`,
      [buliId]
    );
    res.json(sorok);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a zenei lehetosegek lekerdezesekor." });
  }
});

// szavazas leadasa
router.post("/szavazat", async (req, res) => {
  try {
    const { zene_lehetoseg_id, tagok_id, zene_szavazat } = req.body;

    if (!zene_lehetoseg_id || !tagok_id || zene_szavazat === undefined) {
      return res.status(400).json({ error: "A zene_lehetoseg_id, tagok_id es zene_szavazat mezok kotelezok!" });
    }

    const [mar] = await pool.query(
      "SELECT szavazas_id FROM zene_mufaj_szavazas WHERE zene_lehetoseg_id = ? AND tagok_id = ?",
      [zene_lehetoseg_id, tagok_id]
    );

    if (mar.length > 0) {
      await pool.query(
        "UPDATE zene_mufaj_szavazas SET zene_szavazat = ? WHERE szavazas_id = ?",
        [zene_szavazat, mar[0].szavazas_id]
      );
      return res.json({ szavazas_id: mar[0].szavazas_id, zene_lehetoseg_id, tagok_id, zene_szavazat });
    }

    const [eredmeny] = await pool.query(
      "INSERT INTO zene_mufaj_szavazas (tagok_id, zene_lehetoseg_id, zene_szavazat) VALUES (?, ?, ?)",
      [tagok_id, zene_lehetoseg_id, zene_szavazat]
    );

    res.status(201).json({ szavazas_id: eredmeny.insertId, zene_lehetoseg_id, tagok_id, zene_szavazat });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a szavazas soran." });
  }
});

module.exports = router;
