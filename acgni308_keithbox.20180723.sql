-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 23, 2018 at 05:31 AM
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
-- Database: `acgni308_keithbox`
--
CREATE DATABASE IF NOT EXISTS `acgni308_keithbox` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `acgni308_keithbox`;

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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`DepartmentCode`);

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
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`profileID`),
  ADD KEY `FKProfile745830` (`userID`);

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
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `permissionID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `profileID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `StudentID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `webuser`
--
ALTER TABLE `webuser`
  MODIFY `userID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
