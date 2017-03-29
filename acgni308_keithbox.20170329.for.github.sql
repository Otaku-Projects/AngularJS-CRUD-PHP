-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2017 at 04:41 AM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `acgni308_keithbox`
--
CREATE DATABASE IF NOT EXISTS `acgni308_keithbox` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `acgni308_keithbox`;

-- --------------------------------------------------------

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
  `cardID` varchar(4) COLLATE utf8_unicode_ci NOT NULL,
  `nameRef` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `descriptionRef` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `grade` char(2) COLLATE utf8_unicode_ci NOT NULL,
  `maxLimit` int(3) NOT NULL,
  `cardImage` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contentImage` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cardID`),
  KEY `nameRef` (`nameRef`),
  KEY `descriptionRef` (`descriptionRef`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `card`
--

INSERT INTO `card` (`cardID`, `nameRef`, `descriptionRef`, `grade`, `maxLimit`, `cardImage`, `contentImage`) VALUES
('0', '', '', 'SS', 1, '', ''),
('1', '', '', 'SS', 3, '', ''),
('2', '', '', 'SS', 3, '', ''),
('3', '', '', 'A', 17, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `cardcontent`
--

DROP TABLE IF EXISTS `cardcontent`;
CREATE TABLE IF NOT EXISTS `cardcontent` (
  `cardID` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `language` char(3) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`cardID`,`language`),
  KEY `cardID` (`cardID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `cardcontent`
--

INSERT INTO `cardcontent` (`cardID`, `language`, `name`, `description`) VALUES
('0', 'CHI', '支配者的祝福', '一座人口一萬的城鎮 鎮民會按照玩家的規定生活'),
('0', 'ENG', 'Ruler''s Blessing', 'A castle given as a prize for winning the contest, town with population 10,000 included. Its residents will live according to whatever laws and commands you issue.'),
('0', 'JPN', '支配者の祝福', 'クイズ優勝のほうびとして城が与えられる。人口１万人の城下町のおまけ付き。 この町の人々はあなたの作る法律や指令に従い生活する。'),
('1', 'CHI', '一坪的密林', '有"山神的庭園"之稱的巨大森林的入口. 有多種只會在此森林棲息的生物. 任何動物都和人很親近'),
('1', 'ENG', 'Patch of Forest', 'The entrance to the giant forest called the "Mountain God''s Garden" where many unique endemic species live. They are all tame and friendly.'),
('1', 'JPN', '一坪の密林', '「山神の庭」と呼ばれる巨大な森への入り口。\nこの森にしかいない固有種のみが数多く生息する。どの動物も人によくなつく。'),
('2', 'CHI', '一坪的海岸線', '有"海神的栖息处"之称的海底洞穴入口. 每当进入洞穴的时候, 内里的形态会变化而令入侵者迷失.'),
('2', 'ENG', 'Patch of Shore', 'The entrance to a cave called "Poseidon''s Cavern." The cave changes its path at each visit, confusing intruders.'),
('2', 'JPN', '一坪の海岸線', '「海神の棲み家」と呼ばれる海底洞窟への入り口。この洞窟は入る度に中の姿を変え侵入者を迷わせる。'),
('3', 'CHI', '泉水之壶', '經常會湧出清澈水的壺. 一日會湧出1440公升的水'),
('3', 'ENG', 'Pitcher of Eternal Water', 'A jar from which pure, clean water (1440 L per day) continually flows.'),
('3', 'JPN', '湧き水の壺', '常にきれいな水が湧き続ける壺。１日で1440ℓの水が湧き出る。');

-- --------------------------------------------------------

--
-- Table structure for table `cardtype`
--

DROP TABLE IF EXISTS `cardtype`;
CREATE TABLE IF NOT EXISTS `cardtype` (
  `cardTypeID` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cardTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `cardtype`
--

INSERT INTO `cardtype` (`cardTypeID`, `category`, `description`) VALUES
('Free', 'Free Slot Cards', 'These cards are not required to be collected in order to complete the game. Instead, these cards are any other items that can be used by the player whilst playing.'),
('Rules', 'Game master Only Cards', 'Only one of these cards is ever been revealed in the series, which Razor used on the Phantom Troupe. Gon also gains access to this card.'),
('Specify', 'Specified Slot Cards', 'A player has to collect specified slot cards 001-099 in their Book Binder in order to receive card #000 which is needed to complete the game.'),
('Spell', 'Spell Cards', 'These cards can only be acquired in shops in the town of Masadora; they can be purchased in packs containing random spell cards. In order to use a spell card you have to hold it in your hand, say its name followed up with the keyword "On" then the name of the player or place you want it to be designated. Another method is to insert the spell card into the slot at the end of the binder. Spell cards disappear after using it. There are a total of 40 different spell cards.');

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
CREATE TABLE IF NOT EXISTS `permission` (
  `permissionID` int(10) NOT NULL AUTO_INCREMENT,
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `level` int(10) DEFAULT NULL,
  `globalCreateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalReadRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalUpdateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalDeleteRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  PRIMARY KEY (`permissionID`),
  KEY `permissionGroupName` (`permissionGroupName`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`permissionID`, `permissionGroupName`, `description`, `level`, `globalCreateRight`, `globalReadRight`, `globalUpdateRight`, `globalDeleteRight`) VALUES
(3, 'admin', 'demo right', NULL, 'A', 'A', 'A', 'A'),
(4, 'user', 'general user', NULL, 'D', 'D', 'D', 'D');

-- --------------------------------------------------------

--
-- Table structure for table `permissiongroup`
--

DROP TABLE IF EXISTS `permissiongroup`;
CREATE TABLE IF NOT EXISTS `permissiongroup` (
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `otherDesc` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`permissionGroupName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `permissiongroup`
--

INSERT INTO `permissiongroup` (`permissionGroupName`, `description`, `otherDesc`) VALUES
('admin', 'demo right', NULL),
('approver', NULL, NULL),
('manager', NULL, NULL),
('operator', 'Data input operator', NULL),
('user', 'Customer / Client', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissiongroupright`
--

DROP TABLE IF EXISTS `permissiongroupright`;
CREATE TABLE IF NOT EXISTS `permissiongroupright` (
  `permissionID` int(10) DEFAULT NULL,
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `functionName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `controllerName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `readRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `updateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `deleteRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  KEY `permissionGroupName` (`permissionGroupName`),
  KEY `permissionID` (`permissionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `senseiprofile`
--

DROP TABLE IF EXISTS `senseiprofile`;
CREATE TABLE IF NOT EXISTS `senseiprofile` (
  `senseiID` int(10) NOT NULL AUTO_INCREMENT,
  `originalName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `jpnKana` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `jpnRomanization` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `chiTranslation` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `introduction` text COLLATE utf8_unicode_ci NOT NULL,
  `dateOfBirth` datetime DEFAULT NULL,
  `placeOfBirth` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createDate` timestamp NULL DEFAULT NULL,
  `createUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastUpdateDate` timestamp NULL DEFAULT NULL,
  `lastUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `systemUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `systemUpdateUser` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `systemUpdateProgram` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`senseiID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `senseiprofile`
--

INSERT INTO `senseiprofile` (`senseiID`, `originalName`, `jpnKana`, `jpnRomanization`, `chiTranslation`, `introduction`, `dateOfBirth`, `placeOfBirth`, `gender`, `createDate`, `createUser`, `lastUpdateDate`, `lastUpdateUser`, `systemUpdateDate`, `systemUpdateUser`, `systemUpdateProgram`) VALUES
(1, '小畑健', 'おばた たけし', 'OBATA TAKESHI', '小畑健', '遲D填', '1969-02-11 00:00:00', '新潟縣新潟市', 'M', '2016-01-12 06:54:09', NULL, '2016-01-12 06:54:09', NULL, '0000-00-00 00:00:00', '', NULL),
(2, '', 'しょくげきのソーマ', 'SHOKUGEKI NO SŌMA', '附田祐斗', 'testeing', '1986-03-16 20:45:12', '', 'M', '2016-01-14 12:47:52', NULL, '2017-01-11 09:31:29', NULL, '0000-00-00 00:00:00', '', NULL),
(3, '支倉 凍砂', 'はせくら いすな', 'HASEKURA ISUNA', '支倉凍砂', '14歲開始小說創作，16歲起投稿參賽。受山內進著『北の十字軍』（ISBN 4-06-258112-4）、Jean Favier著『金と香辛料』（ISBN 4-393-48521-1），以及阿部謹也著『ドイツ中世後期の世界』、『中世の星の下で』觸發，就讀立教大學期間開始《狼與辛香料》的執筆。\n2005年以《狼與辛香料》獲得第十二屆電擊小說大賞「銀賞」，單行本於2006年2月開始在電擊文庫（MediaWorks，現ASCII MEDIA WORKS）出版，正式出道，並在2007年拿下這本輕小說真厲害！作品部門第一位[3]。\n個人以看漫畫為主，不太讀小說[3]。', '1982-12-27 20:54:10', NULL, 'M', '2016-01-14 12:54:56', NULL, '2016-01-14 12:54:56', NULL, '0000-00-00 00:00:00', '', NULL),
(4, '椎名 橙', 'しいな だい', 'しいな だい', '椎名橙', 'NULL', NULL, NULL, 'F', '2016-01-14 13:01:20', NULL, '2016-01-14 13:01:20', NULL, '0000-00-00 00:00:00', '', NULL),
(40, 'test', 'updated', 't~!@#$%^', '提提', 't', '2016-05-24 22:35:07', 'Hong Kong', 'F', '2016-05-24 14:35:07', NULL, '2016-05-24 15:32:06', NULL, '0000-00-00 00:00:00', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `spellclass`
--

DROP TABLE IF EXISTS `spellclass`;
CREATE TABLE IF NOT EXISTS `spellclass` (
  `spellClassID` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`spellClassID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `spellclass`
--

INSERT INTO `spellclass` (`spellClassID`, `name`, `description`) VALUES
('*S', 'Special Spell', 'A spell card with special attributes. (Only the Game Master cards have this)'),
('AA', 'Anti-Attack Spell', 'A spell to prevent the use of Attack Spells'),
('AS', 'Attack Spell', 'A spell that effects another player.'),
('C', 'Continuous Spell', 'A spell that works actively (until destroyed)'),
('DS', 'Defensive', 'A spell that is applied to the user.'),
('LR', 'Long Range', 'Effect applies to anything more than a one meter radius'),
('RS', 'Regular Spell', 'A spell that has a instant-constant effect.'),
('SR', 'Short Range', 'Usually applies to the user''s personal space.'),
('VS', 'Versus Spell', 'A spell that counters another');

-- --------------------------------------------------------

--
-- Table structure for table `webuser`
--

DROP TABLE IF EXISTS `webuser`;
CREATE TABLE IF NOT EXISTS `webuser` (
  `userID` int(10) NOT NULL AUTO_INCREMENT,
  `loginID` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'active',
  `isLoginOn` varchar(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `isDisabled` varchar(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `activateDate` date NOT NULL,
  `permissionID` int(10) DEFAULT NULL,
  `createDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `systemUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `systemUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `systemUpdateProgram` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `loginID` (`loginID`),
  KEY `permissionID` (`permissionID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `webuser`
--

INSERT INTO `webuser` (`userID`, `loginID`, `password`, `status`, `isLoginOn`, `isDisabled`, `activateDate`, `permissionID`, `createDate`, `createUser`, `lastUpdateDate`, `lastUpdateUser`, `systemUpdateUser`, `systemUpdateDate`, `systemUpdateProgram`) VALUES
(1, 'demo', '60fbb7713999ac287be814420c77f68214977384', 'active', NULL, 'N', '2015-07-08', 3, '2015-07-07 16:00:00', NULL, '2015-07-07 16:00:00', NULL, NULL, '2015-07-07 16:00:00', ''),
(9, '0772', 'ef56111a03218630989f40d20faeeb4a0921c205', 'unactivated', NULL, 'N', '0000-00-00', 4, '2015-07-14 16:00:38', NULL, '2015-07-14 16:00:38', NULL, NULL, '0000-00-00 00:00:00', ''),
(11, 'o.keithpoon@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'unactivated', NULL, 'N', '0000-00-00', 4, '2015-12-14 17:00:12', NULL, '2015-12-14 17:00:12', NULL, NULL, '0000-00-00 00:00:00', ''),
(12, 'kameneko', 'a7056e6aad149d89ad8abfa1bd00fb57bc7697c2', 'active', NULL, 'N', '2016-05-25', 3, '2016-05-24 21:19:00', NULL, '2016-05-24 21:19:00', NULL, NULL, '0000-00-00 00:00:00', '');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cardcontent`
--
ALTER TABLE `cardcontent`
  ADD CONSTRAINT `cardcontent_ibfk_1` FOREIGN KEY (`cardID`) REFERENCES `card` (`cardID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
