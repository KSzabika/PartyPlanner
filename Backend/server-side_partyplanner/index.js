const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const felhasznalokRoute = require("./routes/felhasznalok");
const buliRoute = require("./routes/buli");
const tagokRoute = require("./routes/tagok");
const teendokRoute = require("./routes/teendok");
const penzugyekRoute = require("./routes/penzugyek");
const etelitalRoute = require("./routes/etelital");
const zeneRoute = require("./routes/zene");
const naploRoute = require("./routes/naplo");

app.use("/api/felhasznalok", felhasznalokRoute);
app.use("/api/buli", buliRoute);
app.use("/api/tagok", tagokRoute);
app.use("/api/teendok", teendokRoute);
app.use("/api/penzugyek", penzugyekRoute);
app.use("/api/etelital", etelitalRoute);
app.use("/api/zene", zeneRoute);
app.use("/api/naplo", naploRoute);

app.use((req, res) => {
  res.status(404).json({ error: "A keresett végpont nem létezik." });
});

app.listen(PORT, () => {
  console.log(`A PartyPlanner szerver fut a http://localhost:${PORT} cimen`);
});
