const express = require("express");
const router = express.Router();
const pool = require("../db");
const naploz = require("../naplozas");


router.get("/buli/:buliId", async (req, res) => {
  try {
    const { buliId } = req.params;
    const [sorok] = await pool.query(
      "SELECT * FROM teendok WHERE buli_id = ? ORDER BY teendo_hatarido ASC",
      [buliId]
    );
    res.json(sorok);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a teendok lekerdezesekor." });
  }
});

//uj teendo letrehozasa
router.post("/", async (req, res) => {
  try {
    const { buli_id, teendo_nev, teendo_hatarido, tagok_id } = req.body;

    if (!buli_id || !teendo_nev) {
      return res.status(400).json({ error: "A buli_id es teendo_nev mezok kotelezok!" });
    }

    const [eredmeny] = await pool.query(
      `INSERT INTO teendok (buli_id, tagok_id, teendo_hatarido, teendo_statusz, teendo_nev)
       VALUES (?, ?, ?, 0, ?)`,
      [buli_id, tagok_id || null, teendo_hatarido || null, teendo_nev]
    );

    res.status(201).json({
      teendo_id: eredmeny.insertId,
      buli_id,
      tagok_id: tagok_id || null,
      teendo_hatarido: teendo_hatarido || null,
      teendo_statusz: 0,
      teendo_nev
    });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a teendo letrehozasakor." });
  }
});

//valaki elvallalja a teendot
router.put("/:id/vallalas", async (req, res) => {
  try {
    const { id } = req.params;
    const { tagok_id } = req.body;

    if (!tagok_id) {
      return res.status(400).json({ error: "A tagok_id mezo kotelezo!" });
    }

    const [teendoSorok] = await pool.query("SELECT * FROM teendok WHERE teendo_id = ?", [id]);

    if (teendoSorok.length === 0) {
      return res.status(404).json({ error: "A teendo nem talalhato!" });
    }

    await pool.query("UPDATE teendok SET tagok_id = ? WHERE teendo_id = ?", [tagok_id, id]);

    const [infoSorok] = await pool.query(
      `SELECT f.felhasznalo_id, f.felhasznalo_nev, t.buli_id
       FROM tagok t
       JOIN felhasznalo f ON t.felhasznalo_id = f.felhasznalo_id
       WHERE t.tagok_id = ?`,
      [tagok_id]
    );

    if (infoSorok.length > 0) {
      const info = infoSorok[0];
      await naploz(
        info.felhasznalo_id,
        info.buli_id,
        "teendo_vallalas",
        `${info.felhasznalo_nev} elvallalta a teendot: ${teendoSorok[0].teendo_nev}`
      );
    }

    res.json({ teendo_id: Number(id), tagok_id });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a teendo vallalasakor." });
  }
});

//elkeszult / nem keszult jelzese
router.put("/:id/statusz", async (req, res) => {
  try {
    const { id } = req.params;
    const { teendo_statusz } = req.body;

    if (teendo_statusz === undefined) {
      return res.status(400).json({ error: "A teendo_statusz mezo kotelezo!" });
    }

    const [eredmeny] = await pool.query(
      "UPDATE teendok SET teendo_statusz = ? WHERE teendo_id = ?",
      [teendo_statusz, id]
    );

    if (eredmeny.affectedRows === 0) {
      return res.status(404).json({ error: "A teendo nem talalhato!" });
    }

    res.json({ teendo_id: Number(id), teendo_statusz });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a teendo statusz modositasakor." });
  }
});

// torles
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [eredmeny] = await pool.query("DELETE FROM teendok WHERE teendo_id = ?", [id]);

    if (eredmeny.affectedRows === 0) {
      return res.status(404).json({ error: "A teendo nem talalhato!" });
    }

    res.json({ uzenet: "A teendo sikeresen torolve lett." });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a teendo torlesekor." });
  }
});

module.exports = router;
