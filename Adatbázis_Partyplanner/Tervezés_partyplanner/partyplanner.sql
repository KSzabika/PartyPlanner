-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Sze 25. 13:18
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `partyplanner`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `buli`
--

CREATE TABLE `buli` (
  `buli_id` int(11) NOT NULL,
  `buli_nev` varchar(150) DEFAULT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `buli_datum` date DEFAULT NULL,
  `buli_helyszin` varchar(255) DEFAULT NULL,
  `meghivo_kod` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `buli`
--

INSERT INTO `buli` (`buli_id`, `buli_nev`, `felhasznalo_id`, `buli_datum`, `buli_helyszin`, `meghivo_kod`) VALUES
(1, 'Anna szulinapi bulija', 1, '2026-10-10', 'Budapest, Duna utca 5.', 'ANNA2026'),
(2, 'Osz vege buli', 2, '2026-10-17', 'Szeged, Fo utca 12.', 'OSZ2026'),
(3, 'Halloween buli', 3, '2026-10-31', 'Pecs, Kertvaros 8.', 'HALLOWEEN26'),
(4, 'Karacsonyi osszejovetel', 4, '2026-12-20', 'Gyor, Arany Janos utca 4.', 'KARACSONY26'),
(5, 'Evzaro buli', 5, '2026-12-30', 'Debrecen, Nagyerdei ut 10.', 'EVZARO2026');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `etel_ital`
--

CREATE TABLE `etel_ital` (
  `etel_ital_id` int(11) NOT NULL,
  `etel_ital_tipus` varchar(100) DEFAULT NULL,
  `etel_ital_nev` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `etel_ital`
--

INSERT INTO `etel_ital` (`etel_ital_id`, `etel_ital_tipus`, `etel_ital_nev`) VALUES
(1, 'Etel', 'Pizza'),
(2, 'Etel', 'Hamburger'),
(3, 'Etel', 'Tortilla'),
(4, 'Ital', 'Limonade'),
(5, 'Ital', 'Udito');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `etel_ital_lehetoseg`
--

CREATE TABLE `etel_ital_lehetoseg` (
  `etel_ital_lehetoseg_id` int(11) NOT NULL,
  `buli_id` int(11) DEFAULT NULL,
  `etel_ital_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `etel_ital_lehetoseg`
--

INSERT INTO `etel_ital_lehetoseg` (`etel_ital_lehetoseg_id`, `buli_id`, `etel_ital_id`) VALUES
(1, 1, 1),
(2, 1, 4),
(3, 2, 2),
(4, 3, 3),
(5, 4, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `etel_ital_szavazat`
--

CREATE TABLE `etel_ital_szavazat` (
  `szavazat_id` int(11) NOT NULL,
  `etel_ital_lehetoseg_id` int(11) DEFAULT NULL,
  `tagok_id` int(11) DEFAULT NULL,
  `etel_ital_szavazat` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `etel_ital_szavazat`
--

INSERT INTO `etel_ital_szavazat` (`szavazat_id`, `etel_ital_lehetoseg_id`, `tagok_id`, `etel_ital_szavazat`) VALUES
(1, 1, 1, 1),
(2, 2, 2, 1),
(3, 3, 3, 0),
(4, 4, 4, 1),
(5, 5, 5, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `felhasznalo_id` int(11) NOT NULL,
  `felhasznalo_nev` varchar(100) DEFAULT NULL,
  `felhasznalo_email` varchar(150) DEFAULT NULL,
  `felhasznalo_jelszo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`felhasznalo_id`, `felhasznalo_nev`, `felhasznalo_email`, `felhasznalo_jelszo`) VALUES
(1, 'Kovacs Anna', 'anna@example.com', 'jelszo123'),
(2, 'Nagy Bela', 'bela@example.com', 'jelszo123'),
(3, 'Toth Csilla', 'csilla@example.com', 'jelszo123'),
(4, 'Szabo Daniel', 'daniel@example.com', 'jelszo123'),
(5, 'Horvath Eva', 'eva@example.com', 'jelszo123');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `penzugyek`
--

CREATE TABLE `penzugyek` (
  `penzugy_id` int(11) NOT NULL,
  `buli_id` int(11) DEFAULT NULL,
  `tagok_id` int(11) DEFAULT NULL,
  `penzugy_megnevezes` varchar(150) DEFAULT NULL,
  `penzugy_osszeg` int(11) DEFAULT NULL,
  `penzugy_fenntartas` int(11) DEFAULT NULL,
  `penzugy_befizetett` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `penzugyek`
--

INSERT INTO `penzugyek` (`penzugy_id`, `buli_id`, `tagok_id`, `penzugy_megnevezes`, `penzugy_osszeg`, `penzugy_fenntartas`, `penzugy_befizetett`) VALUES
(1, 1, 1, 'Teremberles', 80000, 80000, 80000),
(2, 1, 2, 'Torta', 18000, 18000, 9000),
(3, 2, 3, 'Hangfal berles', 35000, 35000, 35000),
(4, 3, 4, 'Dekoracio', 25000, 25000, 12500),
(5, 4, 5, 'Ajandekok', 50000, 50000, 20000);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tagok`
--

CREATE TABLE `tagok` (
  `tagok_id` int(11) NOT NULL,
  `buli_id` int(11) DEFAULT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `tagok_szervezo` tinyint(1) DEFAULT NULL,
  `tagok_statusz` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `tagok`
--

INSERT INTO `tagok` (`tagok_id`, `buli_id`, `felhasznalo_id`, `tagok_szervezo`, `tagok_statusz`) VALUES
(1, 1, 1, 1, 1),
(2, 1, 2, 0, 1),
(3, 2, 2, 1, 1),
(4, 2, 3, 0, 1),
(5, 3, 4, 0, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `teendok`
--

CREATE TABLE `teendok` (
  `teendo_id` int(11) NOT NULL,
  `buli_id` int(11) DEFAULT NULL,
  `tagok_id` int(11) DEFAULT NULL,
  `teendo_hatarido` datetime DEFAULT NULL,
  `teendo_statusz` tinyint(1) DEFAULT NULL,
  `teendo_nev` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `teendok`
--

INSERT INTO `teendok` (`teendo_id`, `buli_id`, `tagok_id`, `teendo_hatarido`, `teendo_statusz`, `teendo_nev`) VALUES
(1, 1, 1, '2026-10-05 18:00:00', 1, 'Torta megrendelese'),
(2, 1, 2, '2026-10-08 16:00:00', 0, 'Zene lista osszeallitasa'),
(3, 2, 3, '2026-10-12 17:00:00', 1, 'Hangfal elhozasa'),
(4, 3, 4, '2026-10-25 12:00:00', 0, 'Halloween dekoracio beszerzese'),
(5, 4, 5, '2026-12-15 10:00:00', 0, 'Ajandekok becsomagolasa');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `zenek`
--

CREATE TABLE `zenek` (
  `zene_id` int(11) NOT NULL,
  `zene_mufaj_neve` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `zenek`
--

INSERT INTO `zenek` (`zene_id`, `zene_mufaj_neve`) VALUES
(1, 'Popzene'),
(2, 'Rockzene'),
(3, 'Diszko'),
(4, 'Magyar zene'),
(5, 'Elektronikus zene');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `zene_lehetosegek`
--

CREATE TABLE `zene_lehetosegek` (
  `zene_lehetoseg_id` int(11) NOT NULL,
  `zene_id` int(11) DEFAULT NULL,
  `buli_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `zene_lehetosegek`
--

INSERT INTO `zene_lehetosegek` (`zene_lehetoseg_id`, `zene_id`, `buli_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 2),
(4, 4, 3),
(5, 5, 4);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `zene_mufaj_szavazas`
--

CREATE TABLE `zene_mufaj_szavazas` (
  `szavazas_id` int(11) NOT NULL,
  `tagok_id` int(11) DEFAULT NULL,
  `zene_lehetoseg_id` int(11) DEFAULT NULL,
  `zene_szavazat` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `zene_mufaj_szavazas`
--

INSERT INTO `zene_mufaj_szavazas` (`szavazas_id`, `tagok_id`, `zene_lehetoseg_id`, `zene_szavazat`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 3, 0),
(4, 4, 4, 1),
(5, 5, 5, 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `buli`
--
ALTER TABLE `buli`
  ADD PRIMARY KEY (`buli_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A tábla indexei `etel_ital`
--
ALTER TABLE `etel_ital`
  ADD PRIMARY KEY (`etel_ital_id`);

--
-- A tábla indexei `etel_ital_lehetoseg`
--
ALTER TABLE `etel_ital_lehetoseg`
  ADD PRIMARY KEY (`etel_ital_lehetoseg_id`),
  ADD KEY `buli_id` (`buli_id`),
  ADD KEY `etel_ital_id` (`etel_ital_id`);

--
-- A tábla indexei `etel_ital_szavazat`
--
ALTER TABLE `etel_ital_szavazat`
  ADD PRIMARY KEY (`szavazat_id`),
  ADD KEY `etel_ital_lehetoseg_id` (`etel_ital_lehetoseg_id`),
  ADD KEY `tagok_id` (`tagok_id`);

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`felhasznalo_id`);

--
-- A tábla indexei `penzugyek`
--
ALTER TABLE `penzugyek`
  ADD PRIMARY KEY (`penzugy_id`),
  ADD KEY `buli_id` (`buli_id`),
  ADD KEY `tagok_id` (`tagok_id`);

--
-- A tábla indexei `tagok`
--
ALTER TABLE `tagok`
  ADD PRIMARY KEY (`tagok_id`),
  ADD KEY `buli_id` (`buli_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A tábla indexei `teendok`
--
ALTER TABLE `teendok`
  ADD PRIMARY KEY (`teendo_id`),
  ADD KEY `buli_id` (`buli_id`),
  ADD KEY `tagok_id` (`tagok_id`);

--
-- A tábla indexei `zenek`
--
ALTER TABLE `zenek`
  ADD PRIMARY KEY (`zene_id`);

--
-- A tábla indexei `zene_lehetosegek`
--
ALTER TABLE `zene_lehetosegek`
  ADD PRIMARY KEY (`zene_lehetoseg_id`),
  ADD KEY `zene_id` (`zene_id`),
  ADD KEY `buli_id` (`buli_id`);

--
-- A tábla indexei `zene_mufaj_szavazas`
--
ALTER TABLE `zene_mufaj_szavazas`
  ADD PRIMARY KEY (`szavazas_id`),
  ADD KEY `tagok_id` (`tagok_id`),
  ADD KEY `zene_lehetoseg_id` (`zene_lehetoseg_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `buli`
--
ALTER TABLE `buli`
  MODIFY `buli_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `etel_ital`
--
ALTER TABLE `etel_ital`
  MODIFY `etel_ital_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `etel_ital_lehetoseg`
--
ALTER TABLE `etel_ital_lehetoseg`
  MODIFY `etel_ital_lehetoseg_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `etel_ital_szavazat`
--
ALTER TABLE `etel_ital_szavazat`
  MODIFY `szavazat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `penzugyek`
--
ALTER TABLE `penzugyek`
  MODIFY `penzugy_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `tagok`
--
ALTER TABLE `tagok`
  MODIFY `tagok_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `teendok`
--
ALTER TABLE `teendok`
  MODIFY `teendo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `zenek`
--
ALTER TABLE `zenek`
  MODIFY `zene_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `zene_lehetosegek`
--
ALTER TABLE `zene_lehetosegek`
  MODIFY `zene_lehetoseg_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `zene_mufaj_szavazas`
--
ALTER TABLE `zene_mufaj_szavazas`
  MODIFY `szavazas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `buli`
--
ALTER TABLE `buli`
  ADD CONSTRAINT `buli_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`);

--
-- Megkötések a táblához `etel_ital_lehetoseg`
--
ALTER TABLE `etel_ital_lehetoseg`
  ADD CONSTRAINT `etel_ital_lehetoseg_ibfk_1` FOREIGN KEY (`buli_id`) REFERENCES `buli` (`buli_id`),
  ADD CONSTRAINT `etel_ital_lehetoseg_ibfk_2` FOREIGN KEY (`etel_ital_id`) REFERENCES `etel_ital` (`etel_ital_id`);

--
-- Megkötések a táblához `etel_ital_szavazat`
--
ALTER TABLE `etel_ital_szavazat`
  ADD CONSTRAINT `etel_ital_szavazat_ibfk_1` FOREIGN KEY (`etel_ital_lehetoseg_id`) REFERENCES `etel_ital_lehetoseg` (`etel_ital_lehetoseg_id`),
  ADD CONSTRAINT `etel_ital_szavazat_ibfk_2` FOREIGN KEY (`tagok_id`) REFERENCES `tagok` (`tagok_id`);

--
-- Megkötések a táblához `penzugyek`
--
ALTER TABLE `penzugyek`
  ADD CONSTRAINT `penzugyek_ibfk_1` FOREIGN KEY (`buli_id`) REFERENCES `buli` (`buli_id`),
  ADD CONSTRAINT `penzugyek_ibfk_2` FOREIGN KEY (`tagok_id`) REFERENCES `tagok` (`tagok_id`);

--
-- Megkötések a táblához `tagok`
--
ALTER TABLE `tagok`
  ADD CONSTRAINT `tagok_ibfk_1` FOREIGN KEY (`buli_id`) REFERENCES `buli` (`buli_id`),
  ADD CONSTRAINT `tagok_ibfk_2` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`);

--
-- Megkötések a táblához `teendok`
--
ALTER TABLE `teendok`
  ADD CONSTRAINT `teendok_ibfk_1` FOREIGN KEY (`buli_id`) REFERENCES `buli` (`buli_id`),
  ADD CONSTRAINT `teendok_ibfk_2` FOREIGN KEY (`tagok_id`) REFERENCES `tagok` (`tagok_id`);

--
-- Megkötések a táblához `zene_lehetosegek`
--
ALTER TABLE `zene_lehetosegek`
  ADD CONSTRAINT `zene_lehetosegek_ibfk_1` FOREIGN KEY (`zene_id`) REFERENCES `zenek` (`zene_id`),
  ADD CONSTRAINT `zene_lehetosegek_ibfk_2` FOREIGN KEY (`buli_id`) REFERENCES `buli` (`buli_id`);

--
-- Megkötések a táblához `zene_mufaj_szavazas`
--
ALTER TABLE `zene_mufaj_szavazas`
  ADD CONSTRAINT `zene_mufaj_szavazas_ibfk_1` FOREIGN KEY (`tagok_id`) REFERENCES `tagok` (`tagok_id`),
  ADD CONSTRAINT `zene_mufaj_szavazas_ibfk_2` FOREIGN KEY (`zene_lehetoseg_id`) REFERENCES `zene_lehetosegek` (`zene_lehetoseg_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
