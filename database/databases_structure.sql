-- MySQL dump 10.13  Distrib 8.4.0, for Linux (x86_64)
--
-- Host: localhost    Database: factorymanagement
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `factorymanagement`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `factorymanagement` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `factorymanagement`;

--
-- Table structure for table `Index_env`
--

DROP TABLE IF EXISTS `Index_env`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Index_env` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `timestamp` datetime DEFAULT NULL COMMENT 'Create Time',
  `value` float DEFAULT NULL,
  `module_id` varchar(20) DEFAULT NULL,
  `model_version` varchar(30) DEFAULT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=927667 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Index_health`
--

DROP TABLE IF EXISTS `Index_health`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Index_health` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `timestamp` datetime DEFAULT NULL COMMENT 'Create Time',
  `value` float DEFAULT NULL,
  `watch_id` varchar(20) DEFAULT NULL,
  `model_version` varchar(30) DEFAULT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=1877483 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Index_workload`
--

DROP TABLE IF EXISTS `Index_workload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Index_workload` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `timestamp` datetime DEFAULT NULL COMMENT 'Create Time',
  `value` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `model_env_version` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `model_health_version` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB AUTO_INCREMENT=1688549 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `action_log`
--

DROP TABLE IF EXISTS `action_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
  `log` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `module_id` varchar(20) DEFAULT NULL,
  `factory_id` int DEFAULT NULL,
  `read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `create_time` (`create_time`)
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `airwall`
--

DROP TABLE IF EXISTS `airwall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airwall` (
  `module_id` varchar(20) NOT NULL,
  `factory_id` int DEFAULT NULL,
  `module_name` varchar(255) DEFAULT NULL,
  `module_description` text,
  `last_update` datetime DEFAULT NULL,
  `last_tvoc` decimal(7,2) DEFAULT NULL,
  `last_co2` decimal(7,2) DEFAULT NULL,
  `last_temperature` decimal(5,2) DEFAULT NULL,
  `last_pm1_0` decimal(7,2) DEFAULT NULL,
  `enable` tinyint(1) DEFAULT NULL,
  `last_pm2_5` decimal(7,2) DEFAULT NULL,
  `last_pm10` decimal(7,2) DEFAULT NULL,
  `type` enum('OSLAB','PICO') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_humid` decimal(7,2) DEFAULT NULL,
  `last_env_index` float DEFAULT NULL,
  `last_env_level` int DEFAULT NULL,
  PRIMARY KEY (`module_id`),
  KEY `airwall_ibfk_1` (`factory_id`),
  CONSTRAINT `airwall_ibfk_1` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`factory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `action_log_for_workshop` BEFORE UPDATE ON `airwall` FOR EACH ROW BEGIN
    DECLARE status_message VARCHAR(20);
    DECLARE action_rule VARCHAR(50);
    -- 초기화
    SET status_message = '';
    SET action_rule = '';
    IF NEW.last_env_level > OLD.last_env_level AND NEW.last_env_level >= 4 THEN
        -- last_env_level 값을 평가하여 상태 메시지 설정
        SET status_message = CASE
            WHEN NEW.last_env_level = 4 THEN '나쁨'
            WHEN NEW.last_env_level = 5 THEN '매우 나쁨'
            ELSE '?'
        END;
        SET action_rule = CASE
            WHEN NEW.last_env_level = 4 THEN ' 4번 조치를 취하세요.'
            WHEN NEW.last_env_level = 5 THEN ' 5번 조치를 취하세요.'
            ELSE ''
        END;
        INSERT INTO action_log (log, module_id, factory_id)
        VALUES (CONCAT("'", NEW.module_name, "' 작업장의 환경이 '", status_message, "'에 도달했습니다.", action_rule),
                NEW.module_id, NEW.factory_id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `airwall_data`
--

DROP TABLE IF EXISTS `airwall_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airwall_data` (
  `sensor_data_id` int NOT NULL AUTO_INCREMENT,
  `sensor_module_id` varchar(20) DEFAULT NULL,
  `factory_id` int DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `tvoc` decimal(7,2) DEFAULT NULL,
  `co2` decimal(7,2) DEFAULT NULL,
  `pm1_0` decimal(7,2) DEFAULT NULL,
  `pm2_5` decimal(7,2) DEFAULT NULL,
  `pm10` decimal(7,2) DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `humid` decimal(7,2) DEFAULT NULL,
  `CO` decimal(7,2) DEFAULT NULL,
  `H2S` decimal(7,2) DEFAULT NULL,
  `CH4` decimal(7,2) DEFAULT NULL,
  `O2` decimal(7,2) DEFAULT NULL,
  PRIMARY KEY (`sensor_data_id`,`timestamp`),
  KEY `factory_id` (`factory_id`),
  KEY `airwall_data_ibfk_1` (`sensor_module_id`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `idx_timestamp_sensor_module_id` (`timestamp`,`sensor_module_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17205612 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50500 PARTITION BY RANGE  COLUMNS(`timestamp`)
(PARTITION p20240521 VALUES LESS THAN ('2024-05-22') ENGINE = InnoDB,
 PARTITION p20240522 VALUES LESS THAN ('2024-05-23') ENGINE = InnoDB,
 PARTITION p20240523 VALUES LESS THAN ('2024-05-24') ENGINE = InnoDB,
 PARTITION p20240524 VALUES LESS THAN ('2024-05-25') ENGINE = InnoDB,
 PARTITION p20240525 VALUES LESS THAN ('2024-05-26') ENGINE = InnoDB,
 PARTITION p20240526 VALUES LESS THAN ('2024-05-27') ENGINE = InnoDB,
 PARTITION p20240527 VALUES LESS THAN ('2024-05-28') ENGINE = InnoDB,
 PARTITION p20240528 VALUES LESS THAN ('2024-05-29') ENGINE = InnoDB,
 PARTITION p20240529 VALUES LESS THAN ('2024-05-30') ENGINE = InnoDB,
 PARTITION p20240530 VALUES LESS THAN ('2024-05-31') ENGINE = InnoDB,
 PARTITION p20240531 VALUES LESS THAN ('2024-06-01') ENGINE = InnoDB,
 PARTITION p20240601 VALUES LESS THAN ('2024-06-02') ENGINE = InnoDB,
 PARTITION p20240602 VALUES LESS THAN ('2024-06-03') ENGINE = InnoDB,
 PARTITION p20240603 VALUES LESS THAN ('2024-06-04') ENGINE = InnoDB,
 PARTITION p20240604 VALUES LESS THAN ('2024-06-05') ENGINE = InnoDB,
 PARTITION p20240605 VALUES LESS THAN ('2024-06-06') ENGINE = InnoDB,
 PARTITION p20240606 VALUES LESS THAN ('2024-06-07') ENGINE = InnoDB,
 PARTITION p20240607 VALUES LESS THAN ('2024-06-08') ENGINE = InnoDB,
 PARTITION p20240608 VALUES LESS THAN ('2024-06-09') ENGINE = InnoDB,
 PARTITION p20240609 VALUES LESS THAN ('2024-06-10') ENGINE = InnoDB,
 PARTITION p20240610 VALUES LESS THAN ('2024-06-11') ENGINE = InnoDB,
 PARTITION p20240611 VALUES LESS THAN ('2024-06-12') ENGINE = InnoDB,
 PARTITION p20240612 VALUES LESS THAN ('2024-06-13') ENGINE = InnoDB,
 PARTITION p20240613 VALUES LESS THAN ('2024-06-14') ENGINE = InnoDB,
 PARTITION p20240614 VALUES LESS THAN ('2024-06-15') ENGINE = InnoDB,
 PARTITION p20240615 VALUES LESS THAN ('2024-06-16') ENGINE = InnoDB,
 PARTITION p20240616 VALUES LESS THAN ('2024-06-17') ENGINE = InnoDB,
 PARTITION p20240617 VALUES LESS THAN ('2024-06-18') ENGINE = InnoDB,
 PARTITION p20240618 VALUES LESS THAN ('2024-06-19') ENGINE = InnoDB,
 PARTITION p20240619 VALUES LESS THAN ('2024-06-20') ENGINE = InnoDB,
 PARTITION p20240620 VALUES LESS THAN ('2024-06-21') ENGINE = InnoDB,
 PARTITION p20240621 VALUES LESS THAN ('2024-06-22') ENGINE = InnoDB,
 PARTITION p20240622 VALUES LESS THAN ('2024-06-23') ENGINE = InnoDB,
 PARTITION p20240623 VALUES LESS THAN ('2024-06-24') ENGINE = InnoDB,
 PARTITION p20240624 VALUES LESS THAN ('2024-06-25') ENGINE = InnoDB,
 PARTITION p20240625 VALUES LESS THAN ('2024-06-26') ENGINE = InnoDB,
 PARTITION p20240626 VALUES LESS THAN ('2024-06-27') ENGINE = InnoDB,
 PARTITION p20240627 VALUES LESS THAN ('2024-06-28') ENGINE = InnoDB,
 PARTITION p20240628 VALUES LESS THAN ('2024-06-29') ENGINE = InnoDB,
 PARTITION p20240629 VALUES LESS THAN ('2024-06-30') ENGINE = InnoDB,
 PARTITION p20240630 VALUES LESS THAN ('2024-07-01') ENGINE = InnoDB,
 PARTITION p20240701 VALUES LESS THAN ('2024-07-02') ENGINE = InnoDB,
 PARTITION p20240702 VALUES LESS THAN ('2024-07-03') ENGINE = InnoDB,
 PARTITION p20240703 VALUES LESS THAN ('2024-07-04') ENGINE = InnoDB,
 PARTITION p20240704 VALUES LESS THAN ('2024-07-05') ENGINE = InnoDB,
 PARTITION p20240705 VALUES LESS THAN ('2024-07-06') ENGINE = InnoDB,
 PARTITION p20240706 VALUES LESS THAN ('2024-07-07') ENGINE = InnoDB,
 PARTITION p20240707 VALUES LESS THAN ('2024-07-08') ENGINE = InnoDB,
 PARTITION p20240708 VALUES LESS THAN ('2024-07-09') ENGINE = InnoDB,
 PARTITION p20240709 VALUES LESS THAN ('2024-07-10') ENGINE = InnoDB,
 PARTITION p20240710 VALUES LESS THAN ('2024-07-11') ENGINE = InnoDB,
 PARTITION p20240711 VALUES LESS THAN ('2024-07-12') ENGINE = InnoDB,
 PARTITION p20240712 VALUES LESS THAN ('2024-07-13') ENGINE = InnoDB,
 PARTITION p20240713 VALUES LESS THAN ('2024-07-14') ENGINE = InnoDB,
 PARTITION p20240714 VALUES LESS THAN ('2024-07-15') ENGINE = InnoDB,
 PARTITION p20240715 VALUES LESS THAN ('2024-07-16') ENGINE = InnoDB,
 PARTITION p20240716 VALUES LESS THAN ('2024-07-17') ENGINE = InnoDB,
 PARTITION p20240717 VALUES LESS THAN ('2024-07-18') ENGINE = InnoDB,
 PARTITION p20240718 VALUES LESS THAN ('2024-07-19') ENGINE = InnoDB,
 PARTITION p20240719 VALUES LESS THAN ('2024-07-20') ENGINE = InnoDB,
 PARTITION p20240720 VALUES LESS THAN ('2024-07-21') ENGINE = InnoDB,
 PARTITION p20240721 VALUES LESS THAN ('2024-07-22') ENGINE = InnoDB,
 PARTITION p20240722 VALUES LESS THAN ('2024-07-23') ENGINE = InnoDB,
 PARTITION p20240723 VALUES LESS THAN ('2024-07-24') ENGINE = InnoDB,
 PARTITION p20240724 VALUES LESS THAN ('2024-07-25') ENGINE = InnoDB,
 PARTITION p20240725 VALUES LESS THAN ('2024-07-26') ENGINE = InnoDB,
 PARTITION p20240726 VALUES LESS THAN ('2024-07-27') ENGINE = InnoDB,
 PARTITION p20240727 VALUES LESS THAN ('2024-07-28') ENGINE = InnoDB,
 PARTITION p20240728 VALUES LESS THAN ('2024-07-29') ENGINE = InnoDB,
 PARTITION p20240729 VALUES LESS THAN ('2024-07-30') ENGINE = InnoDB,
 PARTITION p20240730 VALUES LESS THAN ('2024-07-31') ENGINE = InnoDB,
 PARTITION p20240731 VALUES LESS THAN ('2024-08-01') ENGINE = InnoDB,
 PARTITION p20240801 VALUES LESS THAN ('2024-08-02') ENGINE = InnoDB,
 PARTITION p20240802 VALUES LESS THAN ('2024-08-03') ENGINE = InnoDB,
 PARTITION p20240803 VALUES LESS THAN ('2024-08-04') ENGINE = InnoDB,
 PARTITION p20240804 VALUES LESS THAN ('2024-08-05') ENGINE = InnoDB,
 PARTITION p20240805 VALUES LESS THAN ('2024-08-06') ENGINE = InnoDB,
 PARTITION p20240806 VALUES LESS THAN ('2024-08-07') ENGINE = InnoDB,
 PARTITION p20240807 VALUES LESS THAN ('2024-08-08') ENGINE = InnoDB,
 PARTITION p20240808 VALUES LESS THAN ('2024-08-09') ENGINE = InnoDB,
 PARTITION p20240809 VALUES LESS THAN ('2024-08-10') ENGINE = InnoDB,
 PARTITION p20240810 VALUES LESS THAN ('2024-08-11') ENGINE = InnoDB,
 PARTITION p20240811 VALUES LESS THAN ('2024-08-12') ENGINE = InnoDB,
 PARTITION p20240812 VALUES LESS THAN ('2024-08-13') ENGINE = InnoDB,
 PARTITION p20240813 VALUES LESS THAN ('2024-08-14') ENGINE = InnoDB,
 PARTITION p20240814 VALUES LESS THAN ('2024-08-15') ENGINE = InnoDB,
 PARTITION p20240815 VALUES LESS THAN ('2024-08-16') ENGINE = InnoDB,
 PARTITION p20240816 VALUES LESS THAN ('2024-08-17') ENGINE = InnoDB,
 PARTITION p20240817 VALUES LESS THAN ('2024-08-18') ENGINE = InnoDB,
 PARTITION p20240818 VALUES LESS THAN ('2024-08-19') ENGINE = InnoDB,
 PARTITION p20240819 VALUES LESS THAN ('2024-08-20') ENGINE = InnoDB,
 PARTITION p20240820 VALUES LESS THAN ('2024-08-21') ENGINE = InnoDB,
 PARTITION p20240821 VALUES LESS THAN ('2024-08-22') ENGINE = InnoDB,
 PARTITION p20240822 VALUES LESS THAN ('2024-08-23') ENGINE = InnoDB,
 PARTITION p20240823 VALUES LESS THAN ('2024-08-24') ENGINE = InnoDB) */;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `airwall_data_old`
--

DROP TABLE IF EXISTS `airwall_data_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airwall_data_old` (
  `sensor_data_id` int NOT NULL AUTO_INCREMENT,
  `sensor_module_id` varchar(20) DEFAULT NULL,
  `factory_id` int DEFAULT NULL,
  `temperature` decimal(5,2) DEFAULT NULL,
  `tvoc` decimal(7,2) DEFAULT NULL,
  `co2` decimal(7,2) DEFAULT NULL,
  `pm1_0` decimal(7,2) DEFAULT NULL,
  `pm2_5` decimal(7,2) DEFAULT NULL,
  `pm10` decimal(7,2) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `humid` decimal(7,2) DEFAULT NULL,
  PRIMARY KEY (`sensor_data_id`),
  KEY `factory_id` (`factory_id`),
  KEY `airwall_data_ibfk_1` (`sensor_module_id`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `idx_timestamp_sensor_module_id` (`timestamp`,`sensor_module_id`),
  CONSTRAINT `airwall_data_old_ibfk_1` FOREIGN KEY (`sensor_module_id`) REFERENCES `airwall` (`module_id`),
  CONSTRAINT `airwall_data_old_ibfk_2` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`factory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11688979 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `airwatch`
--

DROP TABLE IF EXISTS `airwatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airwatch` (
  `watch_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_sync` datetime DEFAULT NULL,
  `last_battery_level` decimal(3,2) DEFAULT NULL,
  `last_heart_rate` int DEFAULT NULL,
  `last_body_temperature` decimal(4,2) DEFAULT NULL,
  `last_oxygen_saturation` decimal(4,2) DEFAULT NULL,
  `last_tvoc` decimal(5,2) DEFAULT NULL,
  `last_co2` decimal(5,2) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `factory_id` int DEFAULT NULL,
  `last_wear` tinyint(1) DEFAULT NULL,
  `last_health_index` float DEFAULT NULL,
  `last_health_level` int DEFAULT NULL,
  PRIMARY KEY (`watch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `action_log_for_health_level_change` AFTER UPDATE ON `airwatch` FOR EACH ROW BEGIN
    DECLARE status_message VARCHAR(20);
    DECLARE action_rule VARCHAR(50);
    DECLARE user_name VARCHAR(255);
    DECLARE user_factory_id INT;
    -- 초기화
    SET status_message = '';
    SET action_rule = '';
    SET user_name = '';
    SET user_factory_id = NULL;
    -- 변경된 레코드에 대한 사용자 정보 가져오기
    SELECT u.name, u.factory_id INTO user_name, user_factory_id
    FROM users u
    WHERE u.watch_id = NEW.watch_id;
    IF NEW.last_health_level > OLD.last_health_level AND NEW.last_health_level >= 4 THEN
        -- last_health_level 값을 평가하여 상태 메시지 설정
        SET status_message = CASE
            WHEN NEW.last_health_level = 4 THEN '나쁨'
            WHEN NEW.last_health_level = 5 THEN '매우 나쁨'
            ELSE '?'
        END;
        SET action_rule = CASE
            WHEN NEW.last_health_level = 4 THEN ' 4번 조치를 취하세요.'
            WHEN NEW.last_health_level = 5 THEN ' 5번 조치를 취하세요.'
            ELSE ''
        END;
        INSERT INTO action_log (log, user_id, factory_id)
        VALUES (CONCAT("'", user_name, "' 작업자의 건강상태가 '", status_message, "'에 도달했습니다.", action_rule),
                NULL, user_factory_id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `airwatch_data`
--

DROP TABLE IF EXISTS `airwatch_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airwatch_data` (
  `data_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `device_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `heart_rate` int DEFAULT NULL,
  `body_temperature` decimal(4,2) DEFAULT NULL,
  `oxygen_saturation` decimal(4,2) DEFAULT NULL,
  `tvoc` decimal(5,2) DEFAULT NULL,
  `co2` decimal(5,2) DEFAULT NULL,
  `battery_level` decimal(3,2) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `wear` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`data_id`),
  KEY `device_id` (`device_id`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `airwatch_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3113488 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `factories`
--

DROP TABLE IF EXISTS `factories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factories` (
  `factory_id` int NOT NULL AUTO_INCREMENT,
  `factory_name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `factory_image_url` varchar(255) DEFAULT NULL,
  `manager` varchar(255) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `ny` float DEFAULT NULL,
  `nx` float DEFAULT NULL,
  PRIMARY KEY (`factory_id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `raw_data`
--

DROP TABLE IF EXISTS `raw_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raw_data` (
  `data_id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `ID` varchar(10) DEFAULT NULL,
  `BATT` float DEFAULT NULL,
  `MAGx` int DEFAULT NULL,
  `MAGy` int DEFAULT NULL,
  `MAGz` int DEFAULT NULL,
  `GYROx` int DEFAULT NULL,
  `GYROy` int DEFAULT NULL,
  `GYROz` int DEFAULT NULL,
  `ACCx` int DEFAULT NULL,
  `ACCy` int DEFAULT NULL,
  `ACCz` int DEFAULT NULL,
  `AQI` int DEFAULT NULL,
  `TVOC` int DEFAULT NULL,
  `CO2` int DEFAULT NULL,
  `PM10` int DEFAULT NULL,
  `PM25` int DEFAULT NULL,
  `PM100` int DEFAULT NULL,
  `IRUN` varchar(5) DEFAULT NULL,
  `RED` varchar(5) DEFAULT NULL,
  `ECG` int DEFAULT NULL,
  `TEMP` float DEFAULT NULL,
  `HUMID` float DEFAULT NULL,
  `CO` int DEFAULT NULL,
  `H2S` int DEFAULT NULL,
  `CH4` int DEFAULT NULL,
  `O2` float DEFAULT NULL,
  `LatitudeNS` char(7) DEFAULT NULL,
  `LongitudeEW` char(7) DEFAULT NULL,
  `Speed` float DEFAULT NULL,
  `Angle` float DEFAULT NULL,
  PRIMARY KEY (`data_id`),
  KEY `created_at` (`created_at`),
  KEY `created_at_2` (`created_at`,`ID`),
  KEY `ID` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=15899676 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_health`
--

DROP TABLE IF EXISTS `user_health`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_health` (
  `user_id` int NOT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `smoke_per_day` int DEFAULT NULL,
  `drink_per_week` int DEFAULT NULL,
  `job` varchar(255) DEFAULT NULL,
  `employment_period` int DEFAULT NULL,
  `illness` text,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_health_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `id` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text,
  `phone_number` varchar(20) DEFAULT NULL,
  `factory_id` int DEFAULT NULL,
  `profile_image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'profile/default',
  `date_of_birth` date DEFAULT NULL,
  `join_date` datetime DEFAULT NULL,
  `authority` int DEFAULT '0',
  `watch_id` varchar(20) DEFAULT NULL,
  `manager_of` int DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `airwall_id` varchar(20) DEFAULT NULL,
  `last_workload` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `id` (`id`),
  KEY `factory_id` (`factory_id`),
  KEY `users_ibfk_2` (`watch_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`factory_id`) REFERENCES `factories` (`factory_id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`watch_id`) REFERENCES `airwatch` (`watch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'factorymanagement'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `add_next_day_partition` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`%`*/ /*!50106 EVENT `add_next_day_partition` ON SCHEDULE EVERY 1 DAY STARTS '2024-07-24 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
  DECLARE next_partition_date DATE;
  DECLARE partition_name VARCHAR(16);
  DECLARE partition_value DATE;
  -- 내일의 날짜를 계산
  SET next_partition_date = CURDATE() + INTERVAL 2 DAY; -- 내일 파티션을 위해 모레의 날짜를 계산

  -- 파티션 이름과 값 설정
  SET partition_name = DATE_FORMAT(next_partition_date, 'p%Y%m%d');
  SET partition_value = DATE_FORMAT(next_partition_date + INTERVAL 1 DAY, '%Y-%m-%d');
  -- 파티션 추가 쿼리 생성 및 실행
  SET @sql = CONCAT('ALTER TABLE airwall_data ADD PARTITION (PARTITION ', partition_name, ' VALUES LESS THAN (''', partition_value, '''));');
  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'factorymanagement'
--
/*!50003 DROP PROCEDURE IF EXISTS `create_partitions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `create_partitions`()
BEGIN
    DECLARE start_date DATE;
    DECLARE end_date DATE;
    DECLARE partition_name VARCHAR(16);
    DECLARE partition_end_date DATE;
    SET start_date = '2024-05-22'; -- 시작 날짜를 설정합니다.
    SET end_date = '2024-07-23'; -- 끝 날짜를 설정합니다.

    WHILE start_date <= end_date DO
        SET partition_name = DATE_FORMAT(start_date, 'p%Y%m%d');
        SET partition_end_date = DATE_ADD(start_date, INTERVAL 1 DAY);
        SET @sql = CONCAT('ALTER TABLE airwall_data_partitioned ADD PARTITION (PARTITION ', partition_name, ' VALUES LESS THAN (''', partition_end_date, '''));');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SET start_date = partition_end_date;
    END WHILE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Current Database: `KICT`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `KICT` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `KICT`;

--
-- Table structure for table `fragment`
--

DROP TABLE IF EXISTS `fragment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fragment` (
  `origin_id` int NOT NULL,
  `x` int NOT NULL,
  `y` int NOT NULL,
  `size` int NOT NULL,
  `class1` tinyint(1) DEFAULT NULL,
  `class2` tinyint(1) DEFAULT NULL,
  `class3` tinyint(1) DEFAULT NULL,
  `class4` tinyint(1) DEFAULT NULL,
  `class5` tinyint(1) DEFAULT NULL,
  `class0` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`origin_id`,`x`,`y`,`size`),
  KEY `origin_id` (`origin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `origin_image`
--

DROP TABLE IF EXISTS `origin_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `origin_image` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `file_name` varchar(255) DEFAULT NULL,
  `labeler` varchar(10) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `elapsed_time` int DEFAULT '0',
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_name` (`file_name`),
  KEY `labeler` (`labeler`),
  CONSTRAINT `origin_image_ibfk_1` FOREIGN KEY (`labeler`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=492 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `origin_view`
--

DROP TABLE IF EXISTS `origin_view`;
/*!50001 DROP VIEW IF EXISTS `origin_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `origin_view` AS SELECT 
 1 AS `id`,
 1 AS `file_name`,
 1 AS `labeler`,
 1 AS `start_time`,
 1 AS `elapsed_time`,
 1 AS `width`,
 1 AS `height`,
 1 AS `fragment_count`,
 1 AS `progress_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(20) NOT NULL COMMENT 'Primary Key',
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(10) DEFAULT NULL,
  `last_origin` int DEFAULT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'KICT'
--

--
-- Dumping routines for database 'KICT'
--

--
-- Current Database: `factorymanagement`
--

USE `factorymanagement`;

--
-- Current Database: `KICT`
--

USE `KICT`;

--
-- Final view structure for view `origin_view`
--

/*!50001 DROP VIEW IF EXISTS `origin_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `origin_view` AS select `oi`.`id` AS `id`,`oi`.`file_name` AS `file_name`,`oi`.`labeler` AS `labeler`,`oi`.`start_time` AS `start_time`,`oi`.`elapsed_time` AS `elapsed_time`,`oi`.`width` AS `width`,`oi`.`height` AS `height`,count(`f`.`origin_id`) AS `fragment_count`,((count(`f`.`origin_id`) / (ceiling((`oi`.`height` / 32)) * ceiling((`oi`.`width` / 32)))) * 100) AS `progress_percentage` from (`origin_image` `oi` left join `fragment` `f` on((`oi`.`id` = `f`.`origin_id`))) group by `oi`.`id`,`oi`.`file_name`,`oi`.`labeler`,`oi`.`start_time`,`oi`.`elapsed_time`,`oi`.`width`,`oi`.`height` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-21 16:16:33

-- 'webcontainer' 사용자가 존재하지 않으면 생성
CREATE USER IF NOT EXISTS 'webcontainer'@'%' IDENTIFIED BY 'SJdnlvs642';

-- 'factorymanagement' 데이터베이스에 대한 모든 권한을 부여
GRANT ALL PRIVILEGES ON factorymanagement.* TO 'webcontainer'@'%';

-- 'KICT' 데이터베이스에 대한 모든 권한을 부여
GRANT ALL PRIVILEGES ON KICT.* TO 'webcontainer'@'%';

-- 변경 사항을 적용
FLUSH PRIVILEGES;
