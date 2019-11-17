-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2019 at 05:35 PM
-- Server version: 10.1.33-MariaDB
-- PHP Version: 7.2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `acgni308_demo_v2`
--
CREATE DATABASE IF NOT EXISTS `acgni308_demo_v2` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `acgni308_demo_v2`;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE IF NOT EXISTS `department` (
  `DepartmentCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `Description` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `OtherDesc` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`DepartmentCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`DepartmentCode`, `Description`, `OtherDesc`) VALUES
('AC', 'Account', '會計部'),
('AFS', 'Corporate Affairs', '公關部'),
('CMC', 'Commercial', '商務部'),
('CPA', 'Compliance', '稽核部'),
('DEV', 'Development', '開發部'),
('ECO', 'Executive Office', '行政部'),
('ENG', 'Engineering', '工程部'),
('FA', 'Finance', '財務部'),
('HR', 'Human Resources', '人力資源'),
('IT', 'Information Technology', '資訊科技'),
('LEGAL', 'Legal', '法務部'),
('OPS', 'Operations', '操作部'),
('PCM', 'Procurement', '採購部'),
('RSM', 'Risk Management', '風險管理部'),
('TAX', 'Taxation', '稅務部'),
('TSU', 'Treasury', '司庫部');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE IF NOT EXISTS `staff` (
  `StaffID` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `LastName` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `FirstName` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `ChineseName` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `DeptCode` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `Birthday` date NOT NULL,
  `EmploymentDate` date NOT NULL,
  PRIMARY KEY (`StaffID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`StaffID`, `LastName`, `FirstName`, `ChineseName`, `DeptCode`, `Birthday`, `EmploymentDate`) VALUES
('SF001', 'Tai Man', 'Chan', '陳大文', 'BSD', '1991-07-23', '2018-07-23');

-- --------------------------------------------------------

--
-- Table structure for table `webuser`
--

CREATE TABLE IF NOT EXISTS `webuser` (
  `UserID` int(10) NOT NULL AUTO_INCREMENT,
  `LoginID` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Status` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Wait email confirm',
  `IsDisabled` varchar(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `ActivateDate` date DEFAULT NULL,
  `CreateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `CreateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LastUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `LastUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SystemUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `SystemUpdateDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `SystemUpdateProgram` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `loginID` (`LoginID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `webuser`
--

INSERT INTO `webuser` (`UserID`, `LoginID`, `Password`, `Status`, `IsDisabled`, `ActivateDate`, `CreateDate`, `CreateUser`, `LastUpdateDate`, `LastUpdateUser`, `SystemUpdateUser`, `SystemUpdateDate`, `SystemUpdateProgram`) VALUES
(1, 'demo', '60fbb7713999ac287be814420c77f68214977384', 'deactivated', 'Y', '2015-07-08', '2015-07-07 08:00:00', NULL, '2016-07-07 08:00:00', NULL, NULL, '0000-00-00 00:00:00', ''),
(2, '0772', '8a86dded0bd3c411655008d1f7320e103b30b513', 'deactivated', 'Y', '2015-07-14', '2015-07-14 08:00:38', NULL, '2016-07-14 08:00:38', NULL, NULL, '0000-00-00 00:00:00', ''),
(3, 'dolphinotaku', '5bf3d1432d0880673eded0c7195c3dbea53d6dc7', 'activated', 'N', '2016-12-14', '2016-12-14 09:00:12', NULL, '2015-12-14 09:00:12', NULL, NULL, '0000-00-00 00:00:00', ''),
(5, 'kameneko', 'd37abe37224efce287404521321685587f4e847f', 'activated', 'N', '2017-05-24', '2017-05-24 13:19:00', NULL, '2016-05-24 13:19:00', NULL, NULL, '0000-00-00 00:00:00', ''),
(8, 'turtlecat', 'a3a3b9d13eb26f5290a8bfd3935db36afd5c10f7', 'Wait email confirm', 'N', NULL, '2018-02-12 16:00:00', NULL, '0000-00-00 00:00:00', NULL, NULL, '0000-00-00 00:00:00', ''),
(11, 'meowotaku', 'ab830ed2fff922983ede48a8c0c36afd09f0e272', 'activated', 'N', '2018-06-07', '2018-06-06 16:00:00', NULL, '0000-00-00 00:00:00', NULL, NULL, '0000-00-00 00:00:00', ''),
(12, '90474', '8f35f39fe5c65c8c7531a6829953459b249c8a0b', 'activated', 'N', '2019-11-14', '2019-11-13 16:00:00', NULL, '0000-00-00 00:00:00', NULL, NULL, '0000-00-00 00:00:00', '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
