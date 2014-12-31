-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 31, 2014 at 03:17 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `acgni308_keithbox`
--

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE IF NOT EXISTS `profile` (
  `ID` int(2) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `Gender` char(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Address` mediumtext COLLATE utf8_unicode_ci,
  `createUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createDate` timestamp NULL DEFAULT NULL,
  `lastUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastUpdateDate` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `systemUpdateDate` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `systemUpdateUser` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `systemUpdateProgram` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
