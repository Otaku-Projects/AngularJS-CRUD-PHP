-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 22, 2018 at 07:28 PM
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
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
CREATE TABLE `area` (
  `areaCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `areaDescription` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bank`
--

DROP TABLE IF EXISTS `bank`;
CREATE TABLE `bank` (
  `BankCode` char(3) COLLATE utf8_unicode_ci NOT NULL,
  `BankChineseName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `BankEnglishName` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `bank`
--

INSERT INTO `bank` (`BankCode`, `BankChineseName`, `BankEnglishName`) VALUES
('020', '永隆銀行有限公司', 'WING LUNG BANK LIMITED'),
('024', '恒生銀行有限公司', 'HANG SENG BANK LTD.');

-- --------------------------------------------------------

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `cardID` varchar(4) COLLATE utf8_unicode_ci NOT NULL,
  `nameRef` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `descriptionRef` char(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `grade` char(2) COLLATE utf8_unicode_ci NOT NULL,
  `maxLimit` int(2) NOT NULL,
  `cardImage` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contentImage` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `card`
--

INSERT INTO `card` (`cardID`, `nameRef`, `descriptionRef`, `grade`, `maxLimit`, `cardImage`, `contentImage`) VALUES
('000', '', '', 'SS', 1, '', ''),
('001', '', '', 'SS', 3, '', ''),
('002', '', '', 'SS', 3, '', ''),
('003', '', '', 'A', 17, '', ''),
('004', NULL, NULL, 'A', 15, NULL, NULL),
('005', NULL, NULL, 'S', 8, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cardcontent`
--

DROP TABLE IF EXISTS `cardcontent`;
CREATE TABLE `cardcontent` (
  `cardID` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `language` char(3) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `cardcontent`
--

INSERT INTO `cardcontent` (`cardID`, `language`, `name`, `description`) VALUES
('000', 'CHI', '支配者的祝福', '一座人口一萬的城鎮 鎮民會按照玩家的規定生活'),
('000', 'ENG', 'Ruler''s Blessing', 'A castle given as a prize for winning the contest, town with population 10,000 included. Its residents will live according to whatever laws and commands you issue.'),
('000', 'JPN', '支配者の祝福', 'クイズ優勝のほうびとして城が与えられる。人口１万人の城下町のおまけ付き。 この町の人々はあなたの作る法律や指令に従い生活する。'),
('001', 'CHI', '一坪的密林', '有"山神的庭園"之稱的巨大森林的入口. 有多種只會在此森林棲息的生物. 任何動物都和人很親近'),
('001', 'ENG', 'Patch of Forest', 'The entrance to the giant forest called the "Mountain God''s Garden" where many unique endemic species live. They are all tame and friendly.'),
('001', 'JPN', '一坪の密林', '「山神の庭」と呼ばれる巨大な森への入り口。\nこの森にしかいない固有種のみが数多く生息する。どの動物も人によくなつく。'),
('002', 'CHI', '一坪的海岸線', '有"海神的栖息处"之称的海底洞穴入口. 每当进入洞穴的时候, 内里的形态会变化而令入侵者迷失.'),
('002', 'ENG', 'Patch of Shore', 'The entrance to a cave called "Poseidon''s Cavern." The cave changes its path at each visit, confusing intruders.'),
('002', 'JPN', '一坪の海岸線', '「海神の棲み家」と呼ばれる海底洞窟への入り口。この洞窟は入る度に中の姿を変え侵入者を迷わせる。'),
('003', 'CHI', '泉水之壶', '經常會湧出清澈水的壺. 一日會湧出1440公升的水'),
('003', 'ENG', 'Pitcher of Eternal Water', 'A jar from which pure, clean water (1440 L per day) continually flows.'),
('003', 'JPN', '湧き水の壺', '常にきれいな水が湧き続ける壺。１日で1440ℓの水が湧き出る。'),
('004', 'CHI', '美肌溫泉', '能降解決任何肌膚問題的溫泉. 一日浸三十分鐘, 肌膚會變得像嬰兒般光滑.'),
('004', 'ENG', '', ''),
('004', 'JPN', '', ''),
('005', 'CHI', '消失的洞', '走進走出這個洞之後, 會去到人跡罕至的區域. 但只會在國內. 即使被傳送到那裡也好, 不知所以一毫錢也不需要就能回到洞口'),
('005', 'ENG', '', ''),
('005', 'JPN', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `cardspellclass`
--

DROP TABLE IF EXISTS `cardspellclass`;
CREATE TABLE `cardspellclass` (
  `cardSpellClassID` int(10) NOT NULL,
  `cardID` varchar(4) COLLATE utf8_unicode_ci NOT NULL,
  `spellClassID` varchar(2) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cardtype`
--

DROP TABLE IF EXISTS `cardtype`;
CREATE TABLE `cardtype` (
  `cardTypeID` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL
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
-- Table structure for table `catalog`
--

DROP TABLE IF EXISTS `catalog`;
CREATE TABLE `catalog` (
  `catalogID` int(10) NOT NULL,
  `parentCatalogID` int(10) NOT NULL,
  `catalogName` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `catalogDescription` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `DepartmentCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `Description` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `OtherDesc` varchar(250) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`DepartmentCode`, `Description`, `OtherDesc`) VALUES
('AC', 'Finance', '財務'),
('BSD', 'Development', '開發部'),
('D', 'DD', 'DOD'),
('ENG', 'Engineering', '工程部'),
('EXO', 'Executive Office', ''),
('FO', 'Front Office', ''),
('HR', 'Human Resources', '人力資源'),
('IT', 'Information Technology', '資訊科技'),
('T1', 'test1', ''),
('T2', 'test2', ''),
('T3', 'test3', ''),
('T4', 'change', ''),
('T5', 'test', ''),
('T6', 'test', ''),
('T7', 'test', ''),
('T8', 'test', ''),
('T9', 'test', '');

-- --------------------------------------------------------

--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `district`;
CREATE TABLE `district` (
  `districtCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `districtName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `areaCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `highmark`
--
DROP VIEW IF EXISTS `highmark`;
CREATE TABLE `highmark` (
`StudentName` varchar(50)
,`Marks` int(5)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `highmarka`
--
DROP VIEW IF EXISTS `highmarka`;
CREATE TABLE `highmarka` (
`StudentName` varchar(50)
,`Marks` int(5)
);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `memberID` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `userID` int(10) DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `fullName` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `fullNameChi` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fullNameEng` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `imagePath` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nickName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` char(1) COLLATE utf8_unicode_ci NOT NULL,
  `dateOfBirth` date NOT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contactNo1` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contactNo2` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`memberID`, `userID`, `lastName`, `firstName`, `fullName`, `fullNameChi`, `fullNameEng`, `imagePath`, `nickName`, `gender`, `dateOfBirth`, `address`, `contactNo1`, `contactNo2`, `email`) VALUES
('0771', 1, 'POON', 'Yat Lam', 'POON YAT LAM', '', '', 'passport04.jpg', 'Frankie', 'M', '1986-07-10', 'P.O. Box 210, 3541 Phasellus St.\nDolor Sit Amet Inc.\nQC', '25143600', '63524100', 'shelley@com'),
('0772', 9, 'Chow', 'Shiu Hui', 'Chow Shiu Hui', '', '', 'alexandre-prates-emprego-renda.jpg', 'Sindy', 'F', '1994-03-02', '4204 Erat. Avenue\nVel Convallis Limited\nMunster', '25143689', '85296341', 'rocky@com');

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `permissionID` int(10) NOT NULL,
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `level` int(10) DEFAULT NULL,
  `globalCreateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalReadRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalUpdateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `globalDeleteRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
CREATE TABLE `permissiongroup` (
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `otherDesc` text COLLATE utf8_unicode_ci
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
CREATE TABLE `permissiongroupright` (
  `permissionID` int(10) DEFAULT NULL,
  `permissionGroupName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `functionName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `controllerName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `readRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `updateRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D',
  `deleteRight` char(1) COLLATE utf8_unicode_ci DEFAULT 'D'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `productID` int(10) NOT NULL,
  `productName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `productDescription` mediumtext COLLATE utf8_unicode_ci,
  `sellingPoint` text COLLATE utf8_unicode_ci,
  `termOfUse` text COLLATE utf8_unicode_ci,
  `takenVenue` text COLLATE utf8_unicode_ci,
  `price` double(6,2) DEFAULT NULL,
  `quantity` int(8) DEFAULT NULL,
  `publishStartDate` date DEFAULT NULL,
  `publishEndDate` date DEFAULT NULL,
  `bannerURL` varchar(120) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ICONURL` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deliveryMethod` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `getPointPre` int(10) DEFAULT NULL,
  `catalogID` int(10) DEFAULT NULL,
  `vendorID` int(10) DEFAULT NULL,
  `discountID` int(10) DEFAULT NULL,
  `postDate` date DEFAULT NULL,
  `status` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `productName`, `productDescription`, `sellingPoint`, `termOfUse`, `takenVenue`, `price`, `quantity`, `publishStartDate`, `publishEndDate`, `bannerURL`, `ICONURL`, `deliveryMethod`, `getPointPre`, `catalogID`, `vendorID`, `discountID`, `postDate`, `status`, `createDate`) VALUES
(1, 'Otamatone', NULL, NULL, NULL, NULL, 105.00, 10, '2015-01-01', '2016-07-08', '07131507_4e1d361099455.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-08-27 14:37:03'),
(2, 'Rudy Project Rydon Photochromic - Fluoro Yellow/ImpactX Clear', NULL, NULL, NULL, NULL, 964.00, 10, '2015-06-13', '2015-10-31', 'Rydon-Fluoro-Yellow---ImpactX-Photo-Multi-Laser-Clear-large.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-08-27 14:37:03'),
(3, '【HKK Outdoor】窗口式防水袋', '<div>\n<div><strong>購買前，請提出交收日期，時間。所有交收以WhatsApp作實 ! 請謹記，所有交收以WhatsApp作實 !&nbsp;</strong></div>\n\n<div><strong>交收方法 :</strong></div>\n\n<div><strong>1) 面交</strong></div>\n\n<div><strong>交收地點 : 九龍灣港鐵站A出口(可不用出閘)</strong></div>\n\n<div><strong>2) 速遞&nbsp;&nbsp;</strong></div>\n\n<div><strong>加$20元</strong></div>\n\n<div><strong>3) 駕駛人士</strong></div>\n\n<div><strong>可到牛頭角定安街取貨。</strong></div>\n\n<div><strong>本公司尚有其他露營及遠足物品出售，如睡袋、帳篷、背囊、水具、炊具、地墊、行山杖和摺櫈。有需要可查看「賣方的所有拍賣品」</strong></div>\n\n<div><strong>現凡購物滿$400，即自動成為本公司之VIP，於下次光顧時可享有折扣優惠。</strong></div>\n</div>\n\n<div>&nbsp;</div>\n\n<div>&nbsp;</div>\n', NULL, NULL, NULL, 87.00, 30, '2015-03-01', '2015-03-31', '1139584872-ac-8463xf10x0600x0563-m', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48'),
(4, '2015新款塗鴉迷彩中學生書包韓版雙肩包男士背包旅行包女背包男包\n', NULL, NULL, NULL, NULL, 468.00, NULL, NULL, NULL, 'TB1hs7xIXXXXXbTXpXXXXXXXXXX_!!0-item_pic.jpg_600x600.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-06 15:45:48'),
(5, 'Anime One Piece Monkey D Luffy Casual Unisex Clothing Tee White T-shirt S to XXL', NULL, NULL, NULL, NULL, 78.00, NULL, '2015-05-01', '2015-05-31', '$_57.JPG', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48'),
(6, 'New One Piece Trafalgar Law Tattoo T Shirt Short Sleeves Anime Cosplay Men', NULL, NULL, NULL, NULL, 78.00, NULL, '2015-06-01', '2015-06-30', '$_57.JPG', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48'),
(7, 'Anime One Piece Monkey D Luffy Straw Hat Casual Costume Clothing Unisex T-shirt', NULL, NULL, NULL, NULL, 88.00, 4, '2015-09-23', '2015-09-23', '360622A56FE-3537104_zps4b65c30c.jpg', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48'),
(9, 'Cute 9.8" League of Legends LOL Limited Poro Plush Stuffed Toy Figure Doll', NULL, NULL, NULL, NULL, 120.00, NULL, '2015-09-01', '2015-09-30', '$_57.JPG', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-06 15:45:48'),
(10, '《多芬》Dove沐浴乳-舒活水嫩1000ml', NULL, NULL, NULL, NULL, 65.00, NULL, NULL, NULL, '380816.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-06 15:45:48'),
(11, 'Instant Bronze Self Tanning Lotion', NULL, NULL, NULL, NULL, 133.00, NULL, NULL, NULL, '2224386.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-06 15:45:48'),
(12, 'Garmin Forerunner 920XT HRM-Run Triathlon GPS Smart notification NEGOZIO A ROMA', NULL, NULL, NULL, NULL, 2360.00, NULL, '2015-09-23', '2015-09-23', 'GA1000-9B_xlarge.png', NULL, NULL, NULL, NULL, NULL, NULL, '2015-09-23', NULL, '2015-09-06 15:45:48');

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile` (
  `profileID` int(10) NOT NULL,
  `userID` int(10) DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `firstName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `fullName` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fullNameChi` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fullNameEng` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nickName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `localation` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `imagePath` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `facebookEmail` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `createUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `systemUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `systemUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `systemUpdateProgram` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`profileID`, `userID`, `lastName`, `firstName`, `title`, `fullName`, `fullNameChi`, `fullNameEng`, `nickName`, `gender`, `dateOfBirth`, `address`, `email`, `localation`, `phone`, `imagePath`, `facebookEmail`, `createDate`, `createUser`, `lastUpdateDate`, `lastUpdateUser`, `systemUpdateUser`, `systemUpdateDate`, `systemUpdateProgram`) VALUES
(2, 11, 'POON', 'YAT LAM', '', NULL, '潘日林先生', 'POON YAT LAM', NULL, NULL, '2015-12-04', NULL, 'o.keithpoon@gmail.com', NULL, 'NULL', NULL, 'o.keithpoon@gmail.com', '2015-12-14 17:00:12', NULL, '2015-12-14 17:00:12', NULL, NULL, '0000-00-00 00:00:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
CREATE TABLE `purchase` (
  `purchaseID` int(10) NOT NULL,
  `productID` int(10) NOT NULL,
  `purchaseQuantity` int(10) DEFAULT NULL,
  `totalAmount` int(10) DEFAULT NULL,
  `isDelivery` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `purchaseDate` date DEFAULT NULL,
  `userID` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `senseiprofile`
--

DROP TABLE IF EXISTS `senseiprofile`;
CREATE TABLE `senseiprofile` (
  `senseiID` int(10) NOT NULL,
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
  `systemUpdateProgram` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `senseiprofile`
--

INSERT INTO `senseiprofile` (`senseiID`, `originalName`, `jpnKana`, `jpnRomanization`, `chiTranslation`, `introduction`, `dateOfBirth`, `placeOfBirth`, `gender`, `createDate`, `createUser`, `lastUpdateDate`, `lastUpdateUser`, `systemUpdateDate`, `systemUpdateUser`, `systemUpdateProgram`) VALUES
(1, '小畑健', 'おばた たけし', 'OBATA TAKESHI', '小畑健', '遲D填', '1905-05-22 00:00:00', '新潟縣新潟市', 'M', '2016-01-12 06:54:09', NULL, '2016-01-12 06:54:09', NULL, '0000-00-00 00:00:00', '', NULL),
(2, '', 'しょくげきのソーマ', 'SHOKUGEKI NO SŌMA', '附田祐斗', 'testeing', '1905-06-08 00:00:00', '', 'M', '2016-01-14 12:47:52', NULL, '2016-11-13 07:49:16', NULL, '0000-00-00 00:00:00', '', NULL),
(3, '支倉 凍砂', 'はせくら いすな', 'HASEKURA ISUNA', '支倉凍砂', '14歲開始小說創作，16歲起投稿參賽。受山內進著『北の十字軍』（ISBN 4-06-258112-4）、Jean Favier著『金と香辛料』（ISBN 4-393-48521-1），以及阿部謹也著『ドイツ中世後期の世界』、『中世の星の下で』觸發，就讀立教大學期間開始《狼與辛香料》的執筆。\n2005年以《狼與辛香料》獲得第十二屆電擊小說大賞「銀賞」，單行本於2006年2月開始在電擊文庫（MediaWorks，現ASCII MEDIA WORKS）出版，正式出道，並在2007年拿下這本輕小說真厲害！作品部門第一位[3]。\n個人以看漫畫為主，不太讀小說[3]。', '1905-06-04 00:00:00', '', 'M', '2016-01-14 12:54:56', NULL, '2016-01-14 12:54:56', NULL, '0000-00-00 00:00:00', '', NULL),
(4, '椎名 橙', 'しいな だい', 'しいな だい', '椎名橙', '', '0000-00-00 00:00:00', '', 'F', '2016-01-14 13:01:20', NULL, '2016-01-14 13:01:20', NULL, '0000-00-00 00:00:00', '', NULL),
(5, 'あだち 充', 'あだち みつる', 'Adachi Mitsuru', '安達充', '', '1951-02-09 00:00:00', '', 'M', '2016-11-13 07:35:24', NULL, '2016-11-13 07:35:24', NULL, '0000-00-00 00:00:00', '', NULL),
(6, '青山剛昌', 'あおやま ごうしょう', 'Aoyama Gōshō', '青山剛昌', '', '1963-06-21 01:00:00', '', 'M', '2016-11-13 07:35:24', NULL, '2016-11-13 07:35:24', NULL, '0000-00-00 00:00:00', '', NULL),
(7, '荒川弘', 'あらかわ ひろむ', 'Arakawa Hiromumi', '荒川弘', '本名為荒川弘美，筆名荒川弘是直接去掉本名「美」字而來', '1973-05-08 01:00:00', '', 'F', '2016-11-13 07:35:24', NULL, '2016-11-13 07:35:24', NULL, '0000-00-00 00:00:00', '', NULL),
(8, 'CLAMP', 'クランプ', '', 'CLAMP', 'CLAMP（クランプ）是日本漫畫家組合，是個著名和多產的漫畫家團體。', '2016-11-13 22:23:54', '', '', '2016-11-13 07:35:24', NULL, '2016-11-13 07:35:24', NULL, '0000-00-00 00:00:00', '', NULL),
(9, '藤子不二雄', 'ふじこ ふじお', '', '藤子不二雄', '', '2016-11-13 22:23:54', '', 'M', '2016-11-13 07:35:24', NULL, '2016-11-13 07:35:24', NULL, '0000-00-00 00:00:00', '', NULL),
(10, '岸本齊史', 'きしもとまさし', 'Kishimoto Masashi', '岸本齊史', '', '1974-11-08 00:00:00', '', 'M', '2016-11-13 07:35:24', NULL, '2016-11-13 07:35:24', NULL, '0000-00-00 00:00:00', '', NULL),
(11, '岸本聖史', 'きしもと せいし', 'Kishimoto Seishi', '岸本聖史', '', '1974-11-08 00:00:00', '', 'M', '2016-11-13 07:35:24', NULL, '2016-11-13 07:35:24', NULL, '0000-00-00 00:00:00', '', NULL),
(12, '井上雄彥', 'いのうえ たけひこ', 'Inoue Takehiko', '井上雄彥', '', '1967-01-12 00:00:00', '', 'M', '2016-11-13 07:35:24', NULL, '2016-11-13 07:35:24', NULL, '0000-00-00 00:00:00', '', NULL),
(13, '貝谷忍', 'かいたに しのぶ', ' Kaitani Shinobu', '甲斐谷忍', '代表作《美酒貴公子》（ソムリエ）、《ONE OUTS》、《 LIAR GAME詐欺遊戲》等。', '1967-09-24 01:00:00', '鹿兒島市', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(14, '久保帶人', 'くぼ たいと', ' Kubo Taito', '久保帶人', '', '1977-06-26 00:00:00', '廣島縣', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(15, '尾田 栄一郎', 'おだ えいいちろう', 'Oda Eiichirō', '尾田榮一郎', '', '1975-01-01 00:00:00', '熊本市', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(16, '雷句 誠', 'らいく まこと', 'Raiku Makoto', '雷句誠', '本名河田誠', '1974-08-23 01:00:00', '岐阜縣岐阜市', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(17, '高橋留美子', 'たかはし るみこ', 'Takahashi Rumiko', '高橋留美子', '', '1957-10-10 01:00:00', '新潟縣新潟市', 'F', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(18, '鳥山 明', 'とりやま あきら', 'Toriyama Akira', '鳥山明', '', '1955-04-05 01:00:00', '愛知縣名古屋市', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(19, '高橋 和希', 'たかはし かずき', 'Takahashi Kazuki', '高橋和希', '', '1963-10-04 01:00:00', '', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(20, '武井宏之', 'たけい ひろゆき', 'Takei Hiroyuki', '武井宏之', '', '1972-05-15 01:00:00', '', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(21, '武內直子', 'たけうち なおこ', 'Takeuchi Naoko', '武內直子', '', '1967-03-15 00:00:00', '', 'F', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(22, '手塚治虫', 'てづか おさむ', 'Tezuka Osamu', '手塚治虫', '', '1928-11-03 00:00:00', '', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(23, '冨樫義博', 'とがし よしひろ', 'Togashi Yoshihiro', '冨樫義博', '', '1966-04-27 01:00:00', '', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(24, '臼井儀人', 'うすい よしと', 'Usui Yoshito', '臼井儀人', '', '1958-04-21 01:00:00', '', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(25, '加藤一彥', '', 'Kazuhiko Katō', '加藤一彦', '', '1937-05-26 00:00:00', '', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(26, '小畑健', 'おばた たけし', 'Obata Takeshi', '小畑健', '', '1969-02-11 00:00:00', '', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(27, '村田雄介', ' むらた ゆうすけ', 'Murata Yūsuke', '村田雄介', '', '1978-07-04 00:00:00', '', 'M', '2016-11-13 07:35:25', NULL, '2016-11-13 07:35:25', NULL, '0000-00-00 00:00:00', '', NULL),
(28, 'Testing', 'test', '123', '456', '789', '1970-01-01 08:00:00', NULL, 'M', '2017-01-27 10:18:54', NULL, '2017-01-27 10:18:54', NULL, '0000-00-00 00:00:00', '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `spellclass`
--

DROP TABLE IF EXISTS `spellclass`;
CREATE TABLE `spellclass` (
  `spellClassID` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci NOT NULL
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
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `StaffID` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `FirstName` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `ChineseName` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `DeptCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `Birthday` date NOT NULL,
  `EmploymentDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`StaffID`, `LastName`, `FirstName`, `ChineseName`, `DeptCode`, `Birthday`, `EmploymentDate`) VALUES
('SF001', 'Tai Man', 'Chan', '陳大文', 'BSD', '1991-07-23', '2018-07-23');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `StudentID` int(10) NOT NULL,
  `StudentName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Marks` int(5) DEFAULT NULL,
  `Remarks` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`StudentID`, `StudentName`, `Marks`, `Remarks`) VALUES
(1, 'Peter', 10, 'Test'),
(2, 'Mary', 80, 'Test'),
(3, 'David', 50, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `timedeposittran`
--

DROP TABLE IF EXISTS `timedeposittran`;
CREATE TABLE `timedeposittran` (
  `TimeDepositTranID` int(10) NOT NULL,
  `MaturityInstruction` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `EffectiveDate` date NOT NULL,
  `BankCode` char(3) COLLATE utf8_unicode_ci NOT NULL,
  `DepositPeriodAmt` int(11) NOT NULL,
  `DepositPeriodUnit` char(1) COLLATE utf8_unicode_ci NOT NULL,
  `DepositRate` decimal(10,4) DEFAULT NULL,
  `MaturityDate` date DEFAULT NULL,
  `PrincipalCurrency` char(3) COLLATE utf8_unicode_ci NOT NULL,
  `Principal` decimal(10,2) NOT NULL,
  `Interest` decimal(10,2) DEFAULT NULL,
  `TotalCredit` decimal(10,2) DEFAULT NULL,
  `Remarks` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `timedeposittran`
--

INSERT INTO `timedeposittran` (`TimeDepositTranID`, `MaturityInstruction`, `EffectiveDate`, `BankCode`, `DepositPeriodAmt`, `DepositPeriodUnit`, `DepositRate`, `MaturityDate`, `PrincipalCurrency`, `Principal`, `Interest`, `TotalCredit`, `Remarks`) VALUES
(1, 'RENEW_PRINCIPAL_ONLY', '2014-10-17', '024', 12, 'M', '0.2000', '2015-10-19', 'HKD', '10000.00', '20.11', '10020.11', NULL),
(2, 'RENEW_PRINCIPAL_ONLY', '2015-06-12', '020', 12, 'M', '3.1603', '2016-06-25', 'NZD', '10000.00', '328.15', '10328.15', ''),
(3, 'RENEW_PRINCIPAL_ONLY', '2016-10-06', '024', 12, 'M', '0.2000', '2017-10-06', 'HKD', '20000.00', '39.97', '20039.77', NULL),
(4, 'RENEW_PRINCIPAL_ONLY', '2016-12-23', '020', 3, 'M', '4.3000', '2017-03-23', 'CNY', '20000.00', '215.00', '20215.00', NULL),
(5, 'RENEW_PRINCIPAL_ONLY', '2016-12-23', '020', 12, 'M', '4.1000', '2017-12-27', 'CNY', '20000.00', '840.50', '20840.50', NULL),
(6, 'RENEW_PRINCIPAL_ONLY', '2017-01-19', '020', 12, 'M', '1.6000', '2018-01-19', 'HKD', '100000.00', '1600.00', '101600.00', NULL),
(7, 'RENEW_PRINCIPAL_ONLY', '2017-03-28', '020', 9, 'M', '4.3500', '2017-12-28', 'CNY', '23015.00', '764.77', '23779.77', NULL),
(8, 'RENEW_PRINCIPAL_ONLY', '2017-04-18', '024', 12, 'M', '0.2000', '2018-04-18', 'HKD', '10000.00', '20.00', '10020.00', NULL),
(9, 'NO_RENEWAL', '2017-07-17', '020', 7, 'D', '0.0200', '2017-07-24', 'HKD', '10000.00', '0.40', '10000.40', NULL),
(10, 'RENEW_PRINCIPAL_ONLY', '2017-04-18', '024', 6, 'M', '0.0500', '2017-10-18', 'HKD', '10000.00', '2.51', '10002.51', NULL),
(11, 'NO_RENEWAL', '2017-07-14', '020', 12, 'M', '1.3500', '2018-07-16', 'HKD', '10000.00', '135.00', '10135.00', NULL),
(12, 'NO_RENEWAL', '2017-07-14', '020', 1, 'M', '0.4500', '2017-08-14', 'HKD', '10000.00', '3.75', '10003.75', NULL),
(13, 'NO_RENEWAL', '2017-08-14', '020', 1, 'Y', '1.1500', '2018-08-14', 'HKD', '10000.00', '115.00', '10115.00', NULL),
(14, 'NO_RENEWAL', '2017-08-17', '020', 3, 'M', '2.0500', '2017-11-17', 'NZD', '1002.00', '5.14', '1007.14', NULL),
(15, 'NO_RENEWAL', '2017-09-17', '020', 1, 'Y', '0.8500', '2018-09-17', 'HKD', '10000.00', '85.00', '10085.00', NULL),
(16, 'RENEW_PRINCIPAL_ONLY', '2015-06-12', '020', 12, 'M', '3.1603', '2016-06-25', 'NZD', '10000.00', '328.15', '10328.15', NULL),
(17, 'RENEW_PRINCIPAL_ONLY', '2015-06-12', '020', 12, 'M', '3.1603', '2016-06-13', 'NZD', '10000.00', '316.03', '10316.03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `webuser`
--

DROP TABLE IF EXISTS `webuser`;
CREATE TABLE `webuser` (
  `userID` int(10) NOT NULL,
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
  `systemUpdateProgram` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `webuser`
--

INSERT INTO `webuser` (`userID`, `loginID`, `password`, `status`, `isLoginOn`, `isDisabled`, `activateDate`, `permissionID`, `createDate`, `createUser`, `lastUpdateDate`, `lastUpdateUser`, `systemUpdateUser`, `systemUpdateDate`, `systemUpdateProgram`) VALUES
(1, 'demo', '60fbb7713999ac287be814420c77f68214977384', 'active', NULL, 'N', '2015-07-08', 3, '2015-07-07 16:00:00', NULL, '2015-07-07 16:00:00', NULL, NULL, '2015-07-07 16:00:00', ''),
(9, '0772', 'ef56111a03218630989f40d20faeeb4a0921c205', 'unactivated', NULL, 'N', '0000-00-00', 4, '2015-07-14 16:00:38', NULL, '2015-07-14 16:00:38', NULL, NULL, '0000-00-00 00:00:00', ''),
(11, 'o.keithpoon@gmail.com', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'unactivated', NULL, 'N', '0000-00-00', 4, '2015-12-14 17:00:12', NULL, '2015-12-14 17:00:12', NULL, NULL, '0000-00-00 00:00:00', ''),
(12, 'kameneko', 'a7056e6aad149d89ad8abfa1bd00fb57bc7697c2', 'active', NULL, 'N', '2016-05-25', 3, '2016-05-24 21:19:00', NULL, '2016-05-24 21:19:00', NULL, NULL, '0000-00-00 00:00:00', '');

-- --------------------------------------------------------

--
-- Structure for view `highmark`
--
DROP TABLE IF EXISTS `highmark`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `highmark`  AS  select `student`.`StudentName` AS `StudentName`,`student`.`Marks` AS `Marks` from `student` where (`student`.`Marks` > 70) ;

-- --------------------------------------------------------

--
-- Structure for view `highmarka`
--
DROP TABLE IF EXISTS `highmarka`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `highmarka`  AS  select `highmark`.`StudentName` AS `StudentName`,`highmark`.`Marks` AS `Marks` from `highmark` WITH CASCADED CHECK OPTION ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`areaCode`),
  ADD UNIQUE KEY `areaDescription` (`areaDescription`);

--
-- Indexes for table `bank`
--
ALTER TABLE `bank`
  ADD PRIMARY KEY (`BankCode`);

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`cardID`),
  ADD KEY `nameRef` (`nameRef`),
  ADD KEY `descriptionRef` (`descriptionRef`);

--
-- Indexes for table `cardcontent`
--
ALTER TABLE `cardcontent`
  ADD PRIMARY KEY (`cardID`,`language`),
  ADD KEY `cardID` (`cardID`);

--
-- Indexes for table `cardspellclass`
--
ALTER TABLE `cardspellclass`
  ADD PRIMARY KEY (`cardSpellClassID`),
  ADD KEY `cardID` (`cardID`),
  ADD KEY `spellClassID` (`spellClassID`);

--
-- Indexes for table `cardtype`
--
ALTER TABLE `cardtype`
  ADD PRIMARY KEY (`cardTypeID`);

--
-- Indexes for table `catalog`
--
ALTER TABLE `catalog`
  ADD PRIMARY KEY (`catalogID`),
  ADD KEY `FKCatalog462296` (`parentCatalogID`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`DepartmentCode`);

--
-- Indexes for table `district`
--
ALTER TABLE `district`
  ADD PRIMARY KEY (`districtCode`),
  ADD UNIQUE KEY `districtName` (`districtName`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`memberID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`permissionID`),
  ADD KEY `permissionGroupName` (`permissionGroupName`);

--
-- Indexes for table `permissiongroup`
--
ALTER TABLE `permissiongroup`
  ADD PRIMARY KEY (`permissionGroupName`);

--
-- Indexes for table `permissiongroupright`
--
ALTER TABLE `permissiongroupright`
  ADD KEY `permissionGroupName` (`permissionGroupName`),
  ADD KEY `permissionID` (`permissionID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productID`),
  ADD KEY `catalogID` (`catalogID`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`profileID`),
  ADD KEY `FKProfile745830` (`userID`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`purchaseID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `senseiprofile`
--
ALTER TABLE `senseiprofile`
  ADD PRIMARY KEY (`senseiID`);

--
-- Indexes for table `spellclass`
--
ALTER TABLE `spellclass`
  ADD PRIMARY KEY (`spellClassID`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`StaffID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `StudentName` (`StudentName`);

--
-- Indexes for table `timedeposittran`
--
ALTER TABLE `timedeposittran`
  ADD PRIMARY KEY (`TimeDepositTranID`);

--
-- Indexes for table `webuser`
--
ALTER TABLE `webuser`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `loginID` (`loginID`),
  ADD KEY `permissionID` (`permissionID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cardspellclass`
--
ALTER TABLE `cardspellclass`
  MODIFY `cardSpellClassID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `catalog`
--
ALTER TABLE `catalog`
  MODIFY `catalogID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `permissionID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `profileID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `purchaseID` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `senseiprofile`
--
ALTER TABLE `senseiprofile`
  MODIFY `senseiID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `StudentID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `timedeposittran`
--
ALTER TABLE `timedeposittran`
  MODIFY `TimeDepositTranID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `webuser`
--
ALTER TABLE `webuser`
  MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `cardcontent`
--
ALTER TABLE `cardcontent`
  ADD CONSTRAINT `cardcontent_ibfk_1` FOREIGN KEY (`cardID`) REFERENCES `card` (`cardID`);

--
-- Constraints for table `cardspellclass`
--
ALTER TABLE `cardspellclass`
  ADD CONSTRAINT `cardspellclass_ibfk_1` FOREIGN KEY (`cardID`) REFERENCES `card` (`cardID`),
  ADD CONSTRAINT `cardspellclass_ibfk_2` FOREIGN KEY (`spellClassID`) REFERENCES `spellclass` (`spellClassID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
