-- --------------------------------------------------------
-- Host:                         cbd.usask.ca
-- Server version:               5.7.24 - MySQL Community Server (GPL)
-- Server OS:                    Linux
-- HeidiSQL Version:             9.5.0.5249
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for GWF
CREATE DATABASE IF NOT EXISTS `GWF` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `GWF`;

-- Dumping structure for table GWF.tag
CREATE TABLE IF NOT EXISTS `tag` (
  `id` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `color` varchar(20) NOT NULL,
  `position` text NOT NULL,
  `comment` tinytext,
  `date` varchar(10) DEFAULT NULL,
  `variable` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table GWF.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(20) NOT NULL,
  `username` varchar(10) NOT NULL,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table GWF.user-tag
CREATE TABLE IF NOT EXISTS `user-tag` (
  `userId` varchar(20) NOT NULL,
  `tagId` varchar(20) NOT NULL,
  PRIMARY KEY (`userId`,`tagId`),
  KEY `FK_user-tag_tag` (`tagId`),
  CONSTRAINT `FK_user-tag_tag` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`),
  CONSTRAINT `FK_user-tag_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
