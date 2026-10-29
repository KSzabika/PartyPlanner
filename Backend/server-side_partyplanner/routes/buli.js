const express = require("express");
const router = express.Router();
const pool = require("../db");
const naploz = require("../naplozas");

// Egyszeru, veletlenszeru meghivo kod generalasa
function kodGeneralas() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

//osszes buli
router.get("/", async (req, res) => {
  try {
    const [sorok] = await pool.query("SELECT * FROM buli ORDER BY buli_datum ASC");
    res.json(sorok);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a bulik lekerdezesekor." });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [sorok] = await pool.query("SELECT * FROM buli WHERE buli_id = ?", [id]);

    if (sorok.length === 0) {
      return res.status(404).json({ error: "A buli nem talalhato!" });
    }

    res.json(sorok[0]);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a buli lekerdezesekor." });
  }
});

// uj buli letrehozasa

router.post("/", async (req, res) => {
  try {
    const { buli_nev, felhasznalo_id, buli_datum, buli_helyszin } = req.body;

    if (!buli_nev || !felhasznalo_id || !buli_datum) {
      return res.status(400).json({ error: "A buli_nev, felhasznalo_id es buli_datum mezok kotelezok!" });
    }

    const meghivo_kod = kodGeneralas();

    const [eredmeny] = await pool.query(
      `INSERT INTO buli (buli_nev, felhasznalo_id, buli_datum, buli_helyszin, meghivo_kod)
       VALUES (?, ?, ?, ?, ?)`,
      [buli_nev, felhasznalo_id, buli_datum, buli_helyszin || null, meghivo_kod]
    );

    const buliId = eredmeny.insertId;

    const [tagEredmeny] = await pool.query(
      `INSERT INTO tagok (buli_id, felhasznalo_id, tagok_szervezo, tagok_statusz)
       VALUES (?, ?, 1, 1)`,
      [buliId, felhasznalo_id]
    );

    await naploz(felhasznalo_id, buliId, "buli_letrehozas", `Letrehozta a bulit: ${buli_nev}`);

    res.status(201).json({
      buli_id: buliId,
      buli_nev,
      felhasznalo_id,
      buli_datum,
      buli_helyszin: buli_helyszin || null,
      meghivo_kod,
      tagok_id: tagEredmeny.insertId
    });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a buli letrehozasakor." });
  }
});

//buli adatainak modositasa
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { buli_nev, buli_datum, buli_helyszin, felhasznalo_id } = req.body;

    if (!buli_nev || !buli_datum) {
      return res.status(400).json({ error: "A buli_nev es buli_datum mezok kotelezok!" });
    }

    const [eredmeny] = await pool.query(
      "UPDATE buli SET buli_nev = ?, buli_datum = ?, buli_helyszin = ? WHERE buli_id = ?",
      [buli_nev, buli_datum, buli_helyszin || null, id]
    );

    if (eredmeny.affectedRows === 0) {
      return res.status(404).json({ error: "A buli nem talalhato!" });
    }

    await naploz(felhasznalo_id || null, id, "buli_modositas", `Modositotta a bulit: ${buli_nev}`);

    res.json({ buli_id: Number(id), buli_nev, buli_datum, buli_helyszin: buli_helyszin || null });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a buli modositasakor." });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [eredmeny] = await pool.query("DELETE FROM buli WHERE buli_id = ?", [id]);

    if (eredmeny.affectedRows === 0) {
      return res.status(404).json({ error: "A buli nem talalhato!" });
    }

    res.json({ uzenet: "A buli sikeresen torolve lett." });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a buli torlesekor." });
  }
});

//csatlakozas meghivo kod alapjan
router.post("/csatlakozas", async (req, res) => {
  try {
    const { meghivo_kod, felhasznalo_id } = req.body;

    if (!meghivo_kod || !felhasznalo_id) {
      return res.status(400).json({ error: "A meghivo_kod es felhasznalo_id mezok kotelezok!" });
    }

    const [buliSorok] = await pool.query("SELECT * FROM buli WHERE meghivo_kod = ?", [meghivo_kod]);

    if (buliSorok.length === 0) {
      return res.status(404).json({ error: "Ervenytelen meghivo kod!" });
    }

    const buli = buliSorok[0];

    const [mar] = await pool.query(
      "SELECT tagok_id FROM tagok WHERE buli_id = ? AND felhasznalo_id = ?",
      [buli.buli_id, felhasznalo_id]
    );

    if (mar.length > 0) {
      return res.status(400).json({ error: "Mar tagja vagy ennek a bulinak!" });
    }

    const [eredmeny] = await pool.query(
      `INSERT INTO tagok (buli_id, felhasznalo_id, tagok_szervezo, tagok_statusz)
       VALUES (?, ?, 0, NULL)`,
      [buli.buli_id, felhasznalo_id]
    );

    await naploz(felhasznalo_id, buli.buli_id, "csatlakozas", `Csatlakozott a bulihoz: ${buli.buli_nev}`);

    res.status(201).json({ tagok_id: eredmeny.insertId, buli });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a csatlakozas soran." });
  }
});

module.exports = router;
