const express = require("express");
const router = express.Router();
const pool = require("../db");
const naploz = require("../naplozas");


router.get("/buli/:buliId", async (req, res) => {
  try {
    const { buliId } = req.params;
    const [sorok] = await pool.query("SELECT * FROM penzugyek WHERE buli_id = ?", [buliId]);
    res.json(sorok);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a penzugyek lekerdezesekor." });
  }
});

// teljes koltseg / befizetett / hatralek
router.get("/buli/:buliId/osszesites", async (req, res) => {
  try {
    const { buliId } = req.params;
    const [sorok] = await pool.query(
      `SELECT SUM(penzugy_osszeg) AS teljes_koltseg, SUM(penzugy_befizetett) AS teljes_befizetett
       FROM penzugyek WHERE buli_id = ?`,
      [buliId]
    );

    const teljes = sorok[0].teljes_koltseg || 0;
    const befizetett = sorok[0].teljes_befizetett || 0;

    res.json({ teljes_koltseg: teljes, teljes_befizetett: befizetett, hatralek: teljes - befizetett });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba az osszesites lekerdezesekor." });
  }
});

//uj kiadas rogzitese
router.post("/", async (req, res) => {
  try {
    const { buli_id, tagok_id, penzugy_megnevezes, penzugy_osszeg, penzugy_befizetett } = req.body;

    if (!buli_id || !tagok_id || !penzugy_megnevezes || penzugy_osszeg === undefined) {
      return res.status(400).json({
        error: "A buli_id, tagok_id, penzugy_megnevezes es penzugy_osszeg mezok kotelezok!"
      });
    }

    const [eredmeny] = await pool.query(
      `INSERT INTO penzugyek (buli_id, tagok_id, penzugy_megnevezes, penzugy_osszeg, penzugy_fenntartas, penzugy_befizetett)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [buli_id, tagok_id, penzugy_megnevezes, penzugy_osszeg, penzugy_osszeg, penzugy_befizetett || 0]
    );

    const [infoSorok] = await pool.query(
      `SELECT f.felhasznalo_id, f.felhasznalo_nev
       FROM tagok t
       JOIN felhasznalo f ON t.felhasznalo_id = f.felhasznalo_id
       WHERE t.tagok_id = ?`,
      [tagok_id]
    );

    if (infoSorok.length > 0) {
      const info = infoSorok[0];
      await naploz(
        info.felhasznalo_id,
        buli_id,
        "koltseg_rogzites",
        `${info.felhasznalo_nev} rogzitett egy kiadast: ${penzugy_megnevezes} (${penzugy_osszeg} Ft)`
      );
    }

    res.status(201).json({ penzugy_id: eredmeny.insertId, buli_id, tagok_id, penzugy_megnevezes, penzugy_osszeg });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a kiadas rogzitesekor." });
  }
});

//befizetett osszeg frissitese
router.put("/:id/befizetes", async (req, res) => {
  try {
    const { id } = req.params;
    const { penzugy_befizetett } = req.body;

    if (penzugy_befizetett === undefined) {
      return res.status(400).json({ error: "A penzugy_befizetett mezo kotelezo!" });
    }

    const [eredmeny] = await pool.query(
      "UPDATE penzugyek SET penzugy_befizetett = ? WHERE penzugy_id = ?",
      [penzugy_befizetett, id]
    );

    if (eredmeny.affectedRows === 0) {
      return res.status(404).json({ error: "A kiadas nem talalhato!" });
    }

    res.json({ penzugy_id: Number(id), penzugy_befizetett });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a befizetes rogzitesekor." });
  }
});

module.exports = router;
