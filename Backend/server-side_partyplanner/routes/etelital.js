const express = require("express");
const router = express.Router();
const pool = require("../db");
const naploz = require("../naplozas");

//egy buli etel/ital lehetosegei, a szavazatok osszesitesevel
router.get("/buli/:buliId", async (req, res) => {
  try {
    const { buliId } = req.params;
    const [sorok] = await pool.query(
      `SELECT l.etel_ital_lehetoseg_id, e.etel_ital_id, e.etel_ital_tipus, e.etel_ital_nev,
              COUNT(CASE WHEN s.etel_ital_szavazat = 1 THEN 1 END) AS igen_szavazatok
       FROM etel_ital_lehetoseg l
       JOIN etel_ital e ON l.etel_ital_id = e.etel_ital_id
       LEFT JOIN etel_ital_szavazat s ON s.etel_ital_lehetoseg_id = l.etel_ital_lehetoseg_id
       WHERE l.buli_id = ?
       GROUP BY l.etel_ital_lehetoseg_id, e.etel_ital_id, e.etel_ital_tipus, e.etel_ital_nev`,
      [buliId]
    );
    res.json(sorok);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba az etel-ital lehetosegek lekerdezesekor." });
  }
});

// uj etel/ital lehetoseg hozzaadasa egy bulihoz

router.post("/lehetoseg", async (req, res) => {
  try {
    const { buli_id, etel_ital_tipus, etel_ital_nev } = req.body;

    if (!buli_id || !etel_ital_tipus || !etel_ital_nev) {
      return res.status(400).json({ error: "A buli_id, etel_ital_tipus es etel_ital_nev mezok kotelezok!" });
    }

    const [etelSorok] = await pool.query(
      "SELECT etel_ital_id FROM etel_ital WHERE etel_ital_nev = ? AND etel_ital_tipus = ?",
      [etel_ital_nev, etel_ital_tipus]
    );

    let etelItalId;
    if (etelSorok.length > 0) {
      etelItalId = etelSorok[0].etel_ital_id;
    } else {
      const [uj] = await pool.query(
        "INSERT INTO etel_ital (etel_ital_tipus, etel_ital_nev) VALUES (?, ?)",
        [etel_ital_tipus, etel_ital_nev]
      );
      etelItalId = uj.insertId;
    }

    const [eredmeny] = await pool.query(
      "INSERT INTO etel_ital_lehetoseg (buli_id, etel_ital_id) VALUES (?, ?)",
      [buli_id, etelItalId]
    );

    res.status(201).json({
      etel_ital_lehetoseg_id: eredmeny.insertId,
      buli_id,
      etel_ital_id: etelItalId,
      etel_ital_nev,
      etel_ital_tipus
    });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a lehetoseg letrehozasakor." });
  }
});

//szavazas leadasa 
router.post("/szavazat", async (req, res) => {
  try {
    const { etel_ital_lehetoseg_id, tagok_id, etel_ital_szavazat } = req.body;

    if (!etel_ital_lehetoseg_id || !tagok_id || etel_ital_szavazat === undefined) {
      return res.status(400).json({
        error: "Az etel_ital_lehetoseg_id, tagok_id es etel_ital_szavazat mezok kotelezok!"
      });
    }

    const [mar] = await pool.query(
      "SELECT szavazat_id FROM etel_ital_szavazat WHERE etel_ital_lehetoseg_id = ? AND tagok_id = ?",
      [etel_ital_lehetoseg_id, tagok_id]
    );

    if (mar.length > 0) {
      await pool.query(
        "UPDATE etel_ital_szavazat SET etel_ital_szavazat = ? WHERE szavazat_id = ?",
        [etel_ital_szavazat, mar[0].szavazat_id]
      );
      return res.json({ szavazat_id: mar[0].szavazat_id, etel_ital_lehetoseg_id, tagok_id, etel_ital_szavazat });
    }

    const [eredmeny] = await pool.query(
      "INSERT INTO etel_ital_szavazat (etel_ital_lehetoseg_id, tagok_id, etel_ital_szavazat) VALUES (?, ?, ?)",
      [etel_ital_lehetoseg_id, tagok_id, etel_ital_szavazat]
    );

    const [infoSorok] = await pool.query(
      `SELECT f.felhasznalo_id, f.felhasznalo_nev, t.buli_id, e.etel_ital_nev
       FROM tagok t
       JOIN felhasznalo f ON t.felhasznalo_id = f.felhasznalo_id
       JOIN etel_ital_lehetoseg l ON l.etel_ital_lehetoseg_id = ?
       JOIN etel_ital e ON l.etel_ital_id = e.etel_ital_id
       WHERE t.tagok_id = ?`,
      [etel_ital_lehetoseg_id, tagok_id]
    );

    if (infoSorok.length > 0) {
      const info = infoSorok[0];
      await naploz(info.felhasznalo_id, info.buli_id, "szavazas", `${info.felhasznalo_nev} szavazott: ${info.etel_ital_nev}`);
    }

    res.status(201).json({ szavazat_id: eredmeny.insertId, etel_ital_lehetoseg_id, tagok_id, etel_ital_szavazat });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a szavazas soran." });
  }
});

module.exports = router;
