const express = require("express");
const router = express.Router();
const pool = require("../db");
const naploz = require("../naplozas");


const statuszSzoveg = { 0: "nem vesz reszt", 1: "reszt vesz", 2: "talan" };

//egy buli osszes tagja, a felhasznalo nevevel egyutt
router.get("/buli/:buliId", async (req, res) => {
  try {
    const { buliId } = req.params;
    const [sorok] = await pool.query(
      `SELECT t.tagok_id, t.buli_id, t.felhasznalo_id, t.tagok_szervezo, t.tagok_statusz,
              f.felhasznalo_nev, f.felhasznalo_email
       FROM tagok t
       JOIN felhasznalo f ON t.felhasznalo_id = f.felhasznalo_id
       WHERE t.buli_id = ?`,
      [buliId]
    );
    res.json(sorok);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a tagok lekerdezesekor." });
  }
});

// reszveteli statusz modositasa (ott leszek / nem leszek ott / talan)

router.put("/:id/statusz", async (req, res) => {
  try {
    const { id } = req.params;
    const { tagok_statusz } = req.body;

    if (tagok_statusz === undefined || tagok_statusz === null) {
      return res.status(400).json({ error: "A tagok_statusz mezo kotelezo!" });
    }

    const [regiSorok] = await pool.query(
      `SELECT t.tagok_statusz, t.buli_id, t.felhasznalo_id, f.felhasznalo_nev, b.buli_nev
       FROM tagok t
       JOIN felhasznalo f ON t.felhasznalo_id = f.felhasznalo_id
       JOIN buli b ON t.buli_id = b.buli_id
       WHERE t.tagok_id = ?`,
      [id]
    );

    if (regiSorok.length === 0) {
      return res.status(404).json({ error: "A tag nem talalhato!" });
    }

    const regi = regiSorok[0];

    const [eredmeny] = await pool.query(
      "UPDATE tagok SET tagok_statusz = ? WHERE tagok_id = ?",
      [tagok_statusz, id]
    );

    if (eredmeny.affectedRows === 0) {
      return res.status(404).json({ error: "A tag nem talalhato!" });
    }

    const regiSzoveg = statuszSzoveg[regi.tagok_statusz] ?? "ismeretlen";
    const ujSzoveg = statuszSzoveg[tagok_statusz] ?? tagok_statusz;
    const leiras = `${regi.felhasznalo_nev} reszveteli statusza (${regi.buli_nev}): ${regiSzoveg} -> ${ujSzoveg}`;

    await naploz(regi.felhasznalo_id, regi.buli_id, "statusz_valtas", leiras);

    res.json({ tagok_id: Number(id), tagok_statusz });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a statusz modositasakor." });
  }
});

// tag eltavolitasa (csak a host)

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [eredmeny] = await pool.query("DELETE FROM tagok WHERE tagok_id = ?", [id]);

    if (eredmeny.affectedRows === 0) {
      return res.status(404).json({ error: "A tag nem talalhato!" });
    }

    res.json({ uzenet: "A tag sikeresen eltavolitva lett." });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a tag eltavolitasakor." });
  }
});

module.exports = router;
