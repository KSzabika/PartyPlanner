const express = require("express");
const router = express.Router();
const pool = require("../db");

//osszes felhasznalo 
router.get("/", async (req, res) => {
  try {
    const [sorok] = await pool.query(
      "SELECT felhasznalo_id, felhasznalo_nev, felhasznalo_email, felhasznalo_szuletesi_datum FROM felhasznalo"
    );
    res.json(sorok);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a felhasznalok lekerdezesekor." });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [sorok] = await pool.query(
      "SELECT felhasznalo_id, felhasznalo_nev, felhasznalo_email, felhasznalo_szuletesi_datum FROM felhasznalo WHERE felhasznalo_id = ?",
      [id]
    );

    if (sorok.length === 0) {
      return res.status(404).json({ error: "A felhasznalo nem talalhato!" });
    }

    res.json(sorok[0]);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a felhasznalo lekerdezesekor." });
  }
});

// uj felhasznalo letrehozasa
router.post("/regisztracio", async (req, res) => {
  try {
    const { felhasznalo_nev, felhasznalo_email, felhasznalo_jelszo, felhasznalo_szuletesi_datum } = req.body;

    if (!felhasznalo_nev || !felhasznalo_email || !felhasznalo_jelszo) {
      return res.status(400).json({ error: "A felhasznalo_nev, felhasznalo_email es felhasznalo_jelszo mezok kotelezok!" });
    }

    const [letezik] = await pool.query(
      "SELECT felhasznalo_id FROM felhasznalo WHERE felhasznalo_email = ?",
      [felhasznalo_email]
    );

    if (letezik.length > 0) {
      return res.status(400).json({ error: "Ez az email cim mar regisztralva van!" });
    }

    
    const [eredmeny] = await pool.query(
      `INSERT INTO felhasznalo (felhasznalo_nev, felhasznalo_email, felhasznalo_jelszo, felhasznalo_szuletesi_datum)
       VALUES (?, ?, ?, ?)`,
      [felhasznalo_nev, felhasznalo_email, felhasznalo_jelszo, felhasznalo_szuletesi_datum || null]
    );

    res.status(201).json({
      felhasznalo_id: eredmeny.insertId,
      felhasznalo_nev,
      felhasznalo_email,
      felhasznalo_szuletesi_datum: felhasznalo_szuletesi_datum || null
    });
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a regisztracio soran." });
  }
});


router.post("/bejelentkezes", async (req, res) => {
  try {
    const { felhasznalo_email, felhasznalo_jelszo } = req.body;

    if (!felhasznalo_email || !felhasznalo_jelszo) {
      return res.status(400).json({ error: "A felhasznalo_email es felhasznalo_jelszo mezok kotelezok!" });
    }

    const [sorok] = await pool.query(
      "SELECT felhasznalo_id, felhasznalo_nev, felhasznalo_email, felhasznalo_jelszo FROM felhasznalo WHERE felhasznalo_email = ?",
      [felhasznalo_email]
    );

    if (sorok.length === 0 || sorok[0].felhasznalo_jelszo !== felhasznalo_jelszo) {
      return res.status(401).json({ error: "Hibas email cim vagy jelszo!" });
    }

    const felhasznalo = sorok[0];
    delete felhasznalo.felhasznalo_jelszo;

    res.json(felhasznalo);
  } catch (hiba) {
    console.error(hiba);
    res.status(500).json({ error: "Szerverhiba a bejelentkezes soran." });
  }
});

module.exports = router;
