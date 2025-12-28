-- MySQL dump 10.13  Distrib 8.4.7, for Linux (aarch64)
--
-- Host: localhost    Database: dorston
-- ------------------------------------------------------
-- Server version	8.4.7

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
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('dorston-cache-spatie.permission.cache','a:3:{s:5:\"alias\";a:0:{}s:11:\"permissions\";a:0:{}s:5:\"roles\";a:0:{}}',1766953226);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_08_14_170933_add_two_factor_columns_to_users_table',1),(5,'2025_12_13_094906_create_permission_tables',1),(6,'2025_12_18_144445_create_nomenclature_categories_table',2),(7,'2025_12_18_144821_create_nomenclatures_table',3),(8,'2025_12_19_234931_change_base_price_column_in_nomenclatures_table',4),(10,'2025_12_19_235455_change_unit_column_in_nomenclatures_table',5),(11,'2025_12_23_105243_add_display_name_to_permissions_table',6),(12,'2025_12_23_105441_add_display_name_to_roles_table',7),(13,'2025_12_28_101226_create_orders_table',8);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nomenclature_categories`
--

DROP TABLE IF EXISTS `nomenclature_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nomenclature_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nomenclature_categories`
--

LOCK TABLES `nomenclature_categories` WRITE;
/*!40000 ALTER TABLE `nomenclature_categories` DISABLE KEYS */;
INSERT INTO `nomenclature_categories` VALUES (1,'Основное (Разное)','2025-12-18 15:48:47','2025-12-18 15:48:47'),(2,'Порошковая краска','2025-12-18 15:48:47','2025-12-18 15:48:47'),(3,'Фурнитура','2025-12-18 15:48:47','2025-12-18 15:48:47'),(4,'Упаковка','2025-12-18 15:48:47','2025-12-18 15:48:47'),(5,'Цилиндры','2025-12-18 15:48:47','2025-12-18 15:48:47'),(6,'Ручки','2025-12-18 15:48:47','2025-12-18 15:48:47'),(7,'Прочее','2025-12-18 15:48:47','2025-12-18 15:48:47'),(8,'Накладки','2025-12-18 15:48:47','2025-12-18 15:48:47'),(9,'Для расчетов МДФ панелей','2025-12-18 15:48:47','2025-12-18 15:48:47'),(10,'Глазки','2025-12-18 15:48:47','2025-12-18 15:48:47'),(11,'Вертушки','2025-12-18 15:48:47','2025-12-18 15:48:47'),(12,'Модуль дополнений термо','2025-12-18 15:48:47','2025-12-18 15:48:47'),(13,'Пленки','2025-12-18 15:48:47','2025-12-18 15:48:47'),(14,'Внутренняя наценка Dorston','2025-12-18 15:48:47','2025-12-18 15:48:47'),(15,'ФЗП','2025-12-18 15:48:47','2025-12-18 15:48:47'),(16,'Покраска в 2 цвета Termo','2025-12-18 15:48:47','2025-12-18 15:48:47'),(17,'Электронные замки','2025-12-18 15:48:47','2025-12-18 15:48:47'),(18,'Вертушки на шток','2025-12-18 15:48:47','2025-12-18 15:48:47'),(19,'ФЗП Termo','2025-12-18 15:48:47','2025-12-18 15:48:47'),(20,'Наценка дистрибьюторов','2025-12-18 15:48:47','2025-12-18 15:48:47');
/*!40000 ALTER TABLE `nomenclature_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nomenclatures`
--

DROP TABLE IF EXISTS `nomenclatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nomenclatures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomenclature_category_id` bigint unsigned NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_price` double NOT NULL,
  `unit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nomenclatures_nomenclature_category_id_foreign` (`nomenclature_category_id`),
  CONSTRAINT `nomenclatures_nomenclature_category_id_foreign` FOREIGN KEY (`nomenclature_category_id`) REFERENCES `nomenclature_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nomenclatures`
--

LOCK TABLES `nomenclatures` WRITE;
/*!40000 ALTER TABLE `nomenclatures` DISABLE KEYS */;
INSERT INTO `nomenclatures` VALUES (1,'Цинкогрунт',2,NULL,420,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(2,'Антик медь',2,NULL,390,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(3,'Антик серебро',2,NULL,480,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(4,'Букле серый',2,NULL,455,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(5,'Букле чёрный',2,NULL,345,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(6,'Букле опал',2,NULL,421,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(7,'Муар 1019',2,NULL,375,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(8,'Муар чёрный 9005',2,NULL,300,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(9,'Муар 7021',2,NULL,360,'р\\кг','2025-12-20 00:14:42','2025-12-20 00:14:42'),(10,'Задвижка 65',3,NULL,63,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(11,'Эксцентрик',3,NULL,31.4,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(12,'Acuretto ML-16',3,NULL,360,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(13,'Гардиан 32.11',3,NULL,758,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(14,'Kale 442',3,NULL,875,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(15,'Acuretto ML-18',3,NULL,485,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(16,'Гардиан 30.11',3,NULL,1449,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(17,'Kale 442L',3,NULL,2025,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(18,'Acuretto ML-17',3,NULL,390,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(19,'DWF Profi [55/10/25]',5,NULL,235,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(20,'Fuaro D-Pro 507 [55/10/25]',5,NULL,670,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(21,'Secureme K-2 [55/10/25]',5,NULL,3660,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(22,'DWF Profi [60/10/25]',5,NULL,290,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(23,'Fuaro D-Pro 507 [60/10/25]',5,NULL,790,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(24,'Secureme K-2 [60/10/25]',5,NULL,3690,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(25,'Fuaro D-Proterm 507 [60/10/25]',5,NULL,798,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(26,'Guardian GS Termo [60/10/25]',5,NULL,1120,'р\\компл.','2025-12-20 00:14:42','2025-12-20 00:14:42'),(27,'Ручка (21 серия), матовое золото',6,NULL,480,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(28,'Ручка PALIDORE A-527 SSC черная',6,NULL,390,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(29,'Ручка PALIDORE A-527 SSC хром матовый',6,NULL,390,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(30,'Ручка 93 Бронза, компл.',6,NULL,277.1,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(31,'Ручка 93 черн, компл.',6,NULL,240,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(32,'Ручка 93 хром, компл.',6,NULL,218.7,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(33,'Броненакладка + (21 серия), матовое золото',8,NULL,369,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(34,'накладка под шток (21 серия), матовое золото',8,NULL,84,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(35,'Броненакладка врезная PALIDORE 050-080-C SSC черная',8,NULL,360,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(36,'Накладка PALIDORE шток черная 050-03 SSC',8,NULL,70,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(37,'Броненакладка врезная PALIDORE 050-080-C SSC матовый хром',8,NULL,360,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(38,'Накладка PALIDORE шток матовый хром 050-03 SSC',8,NULL,70,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(39,'Броненакладка врезная (Protector Pro 50/27) бронза',8,NULL,395,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(40,'Накладка под шток  (DP-K-11-AB) бронза',8,NULL,81,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(41,'Броненакладка овальная врезная, черн',8,NULL,220,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(42,'Накладка под шток овальная, черн',8,NULL,50,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(43,'Броненакладка врезная хром',8,NULL,260,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(44,'Накладка цилиндровая/овальная/дешёвая хром',8,NULL,19,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(45,'Накладка сувальдная (21 серия), матовое золото, комплект',8,NULL,280.54,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(46,'Накладка PALIDORE сувальдная черная 050-02 SSC',8,NULL,160,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(47,'Накладка PALIDORE сувальдная матовый хром 050-02 SSC',8,NULL,160,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(48,'Накладка сувальдная \"под КРИТ\", бронза (DP-13-S-Auto)',8,NULL,90,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(49,'Накладка сув. овальная (DP-12-S) бронза',8,NULL,120,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(50,'Накладка сувальдная \"под КРИТ\", черная',8,NULL,151,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(51,'Накладка сувальдная овальная черн',8,NULL,50,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(52,'Накладка сувальдная \"под КРИТ\"',8,NULL,55,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(53,'Накладка сувальдная/овальная/дешевая, шт',8,NULL,30,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(54,'Глазок квадратный (21 серия), матовое золото',10,NULL,209.67,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(55,'Глазок квадратный 70-130 черный ',10,NULL,114,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(56,'Глазок MY003-70/130, матовый хром',10,NULL,115,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(57,'Глазок круглый 50х90/Бронза, шт',10,NULL,205,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(58,'Удлинитель Глазка (только в бронзе используется) ',10,NULL,43,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(59,'Глазок Viever 70-130 black',10,NULL,100,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(60,'Глазок круглый 70х130/Хром',10,NULL,73,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(61,'Вертушок на ноч. задв. (21 серия), матовое золото',11,NULL,180.11,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(62,'Вертушок PALIDORE на квадратном основании 050-TL SSC черный, шт',11,NULL,110,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(63,'Вертушок PALIDORE на квадратном основании 050-TL SSC мат. Хром',11,NULL,110,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(64,'Вертушок бронза 8х75 (TT-0705-8/75), шт',11,NULL,145,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(65,'Вертушок 8х75 черн, шт',11,NULL,100,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(66,'Вертушок, хром',11,NULL,64,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(67,'Английский дуб фог',13,NULL,140,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(68,'Астана Эш Уайт',13,NULL,132,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(69,'Белый матовый',13,NULL,105,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(70,'Бетон светлый',13,NULL,148,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(71,'Бетон снежный',13,NULL,148,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(72,'Бетон тёмный',13,NULL,138,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(73,'Верона графит',13,NULL,159,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(74,'Грей',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(75,'Дуб бодега золотой',13,NULL,142,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(76,'Дуб бодега коричневый',13,NULL,220,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(77,'Дуб бодега натуральный',13,NULL,170,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(78,'Дуб мадейра песок',13,NULL,134,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(79,'Дуб мадейра янтарь',13,NULL,134,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(80,'Дуб морёный',13,NULL,245,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(81,'Дуб седан белый',13,NULL,134,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(82,'Дуб седан сиеста',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(83,'Дуб честерфилд лайт-грей',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(84,'Зелёный камень',13,NULL,134,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(85,'Канадский дуб арктик горизонтальный',13,NULL,148,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(86,'Канадский дуб пацифик горизонтальный',13,NULL,147,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(87,'Красная Бургундия',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(88,'Лиственница белая',13,NULL,122,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(89,'Лиственница капучино',13,NULL,145,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(90,'Лофт белый',13,NULL,168,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(91,'Морская волна',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(92,'Олива',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(93,'Орех каньон коньяк',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(94,'Ривьера айс',13,NULL,130,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(95,'Санд айс',13,NULL,263,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(96,'Санд антрацит',13,NULL,138,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(97,'Санд грей',13,NULL,159,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(98,'Санд дарк грей',13,NULL,159,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(99,'Санд лайт грей',13,NULL,159,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(100,'Санд миди грей',13,NULL,159,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(101,'Санд cмоук',13,NULL,159,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(102,'Секвойя графит',13,NULL,134,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(103,'Секвойя какао',13,NULL,134,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(104,'Секвойя латте',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(105,'Секвойя милк',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(106,'Синий',13,NULL,153,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(107,'Статус коньяк',13,NULL,200,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(108,'Чёрный матовый',13,NULL,138,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(109,'Шпон дуб коньяк',13,NULL,134,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(110,'Шпон дуб натуральный',13,NULL,181,'р\\кв.м','2025-12-20 00:14:42','2025-12-20 00:14:42'),(111,'Комфорт МП (Стандарт)',15,NULL,1995,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(112,'Комфорт ПП (Стандарт)',15,NULL,2203,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(113,'Absolut МП (Стандарт)',15,NULL,2076,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(114,'Absolut ПП (Стандарт)',15,NULL,2435,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(115,'Цинкогрунтование',15,NULL,230,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(116,'Установка порога из нержавейки',15,NULL,114,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(117,'Закрыть коробку на Комфорт',15,NULL,122,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(118,'Закрыть коробку на Absolut',15,NULL,141,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(119,'Verso ',15,NULL,505,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(120,'Forta',15,NULL,289,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(121,'Stark',15,NULL,400,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(122,'Порог из нержавейки',16,NULL,500,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(123,'Закрытый короб',16,NULL,0,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(124,'Термокабель в короб',16,NULL,500,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(125,'Цинкогрунт',16,NULL,500,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(126,'Hogo P-02',17,NULL,6300,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(127,'Hogo V-05',17,NULL,17200,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(128,'Dircode T850',17,NULL,21000,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(129,'Гардиан 32.21',17,NULL,880,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(130,'Hogo D-01 с бугельной ручкой',17,NULL,34000,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(131,'Бугельная ручка с нажимным механизмом 1600  х 60',17,NULL,10000,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(132,'Бугельная ручка с нажимным механизмом 1800  х 60',17,NULL,11000,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(133,'Вертушок на шток (21 серия), матовое золото',18,NULL,100,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(134,'Вертушок на шток черный, шт',18,NULL,57,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(135,'Вертушок на шток матовый хром',18,NULL,60,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(136,'Вертушок на шток, бронза',18,NULL,100,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(137,'Вертушок на шток, хром',18,NULL,74,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(138,'Termo Optima',19,NULL,3347,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(139,'Termo Soros',19,NULL,4419,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(140,'Termo DARKWOOD SP',19,NULL,6602,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(141,'Termo CREDO  ',19,NULL,6524,'','2025-12-20 00:14:42','2025-12-20 00:14:42'),(142,'Termo CREDO  SP',19,NULL,6825,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(143,'Termo SENATOR MAX SP',19,NULL,6809,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(144,'Termo Drevos',19,NULL,6327,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(145,'Termo Veles',19,NULL,4419,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(146,'Termo SENATOR SP',19,NULL,6809,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(147,'Termo Imperato',19,NULL,8807,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(148,'Termo Nova',19,NULL,4154,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(149,'Установка порога из нержавейки',19,NULL,139,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(150,'Цинкогрунтование',19,NULL,230,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(151,'Установка термокабеля',19,NULL,230,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(152,'Общая база',20,NULL,0,'','2025-12-20 00:14:43','2025-12-20 00:14:43'),(153,'Дверь Хаус',20,NULL,23,'','2025-12-20 00:14:43','2025-12-20 00:14:43');
/*!40000 ALTER TABLE `nomenclatures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `total_price` double NOT NULL,
  `status` enum('pending','confirmed','shipped','in_production','delivered','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('5eyDtHBE1RF1uqcsTWbz3LPL2YI2g3RZe5MySU1S',1,'169.150.247.40','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoia3hsZ2Zia3RkeVQxM3dMS09jSXpkYlZ1SVJWM01mRWt4VGNMaEw4UiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czoxNjoiaHR0cDovL2xvY2FsaG9zdCI7czo1OiJyb3V0ZSI7czo0OiJob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1766768454),('dRCNO97hOSIZtnYZz1EYaH7wsYRq0GQ1ECooxn9U',1,'192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiaEo5cVQwNlF1SW5nSlJua2hGenRlZGZ6UGRjQ2U0QlRTWUtKdkpZNSI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czoyOToiaHR0cDovL2xvY2FsaG9zdC9jb25maWd1cmF0b3IiO3M6NToicm91dGUiO3M6MTI6ImNvbmZpZ3VyYXRvciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1766891620),('l9fTPiRgwzk7ZVxNBFY7eRqJtlRfFuQug5x1abiy',1,'192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo2OntzOjY6Il90b2tlbiI7czo0MDoicDB1OFRnNEdSR1YwSEhETVVMSHk3ajNSSHRIWDgxNVlTOEVnUWVocyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czoyOToiaHR0cDovL2xvY2FsaG9zdC9jb25maWd1cmF0b3IiO3M6NToicm91dGUiO3M6MTI6ImNvbmZpZ3VyYXRvciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjYwOiIkMnkkMTIkaWZwZUpSNjExSEc5NWlMajh5aE9XdVhibC5aRE55bHJjL29IUDVib1RJMzkzZElGbk9hbW0iO3M6NjoidGFibGVzIjthOjI6e3M6NDA6IjZmMWQ4YTNkZjRhM2NhODNmOTM4YjJjNTIzMTZkYWJlX2NvbHVtbnMiO2E6NTp7aTowO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjQ6Im5hbWUiO3M6NToibGFiZWwiO3M6NDoiTmFtZSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjE7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6Imd1YXJkX25hbWUiO3M6NToibGFiZWwiO3M6MTA6Ikd1YXJkIG5hbWUiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aToyO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJjcmVhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjEwOiJDcmVhdGVkIGF0IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9aTozO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJ1cGRhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjEwOiJVcGRhdGVkIGF0IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9aTo0O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEyOiJkaXNwbGF5X25hbWUiO3M6NToibGFiZWwiO3M6MTI6IkRpc3BsYXkgbmFtZSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO319czo0MDoiYjFkMzYwZDJlN2I1YTc3Y2FhMTNmNzg4NjNlYTgwNjRfY29sdW1ucyI7YTo1OntpOjA7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6NDoibmFtZSI7czo1OiJsYWJlbCI7czo0OiJOYW1lIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MTthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMDoiZ3VhcmRfbmFtZSI7czo1OiJsYWJlbCI7czoxMDoiR3VhcmQgbmFtZSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjI7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6ImNyZWF0ZWRfYXQiO3M6NToibGFiZWwiO3M6MTA6IkNyZWF0ZWQgYXQiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjowO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjoxO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7YjoxO31pOjM7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6InVwZGF0ZWRfYXQiO3M6NToibGFiZWwiO3M6MTA6IlVwZGF0ZWQgYXQiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjowO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjoxO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7YjoxO31pOjQ7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTI6ImRpc3BsYXlfbmFtZSI7czo1OiJsYWJlbCI7czoxMjoiRGlzcGxheSBuYW1lIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fX19fQ==',1766868067),('pG83ofrFW6fMJ0icT0zoiUfFF1T2QUR7zsFpYCB3',1,'169.150.247.40','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiVWNUUk15T2ZZcDdWbkJ3ZmZ2anlEZUZGOEpmVnRLY0NXS2JDV2xhRSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTY6Imh0dHA6Ly9sb2NhbGhvc3QiO3M6NToicm91dGUiO3M6NDoiaG9tZSI7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjA6IiQyeSQxMiRpZnBlSlI2MTFIRzk1aUxqOHloT1d1WGJsLlpETnlscmMvb0hQNWJvVEkzOTNkSUZuT2FtbSI7fQ==',1766768581),('rnKjKDzXB7Ic9Dr3WgOwrMQG1OTGrnmrEXuEVhKE',1,'192.168.65.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTo2OntzOjY6Il90b2tlbiI7czo0MDoiQjNFUUFyMDA1RFdHMm5jZ3E2d1J3MVZTTDRwZFlDZzlCd0RySDdKUSI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czoyOToiaHR0cDovL2xvY2FsaG9zdC9jb25maWd1cmF0b3IiO3M6NToicm91dGUiO3M6MTI6ImNvbmZpZ3VyYXRvciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjYwOiIkMnkkMTIkaWZwZUpSNjExSEc5NWlMajh5aE9XdVhibC5aRE55bHJjL29IUDVib1RJMzkzZElGbk9hbW0iO3M6NjoidGFibGVzIjthOjQ6e3M6NDA6ImU3OTNhMjc5ZDU2ZTQ1MDYwOTc1NDAyMGQ2MjdiZWVjX2NvbHVtbnMiO2E6NTp7aTowO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjc6InVzZXJfaWQiO3M6NToibGFiZWwiO3M6Mjc6IklEINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjE7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTE6InRvdGFsX3ByaWNlIjtzOjU6ImxhYmVsIjtzOjI5OiLQntCx0YnQsNGPINGB0YLQvtC40LzQvtGB0YLRjCI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjI7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6Njoic3RhdHVzIjtzOjU6ImxhYmVsIjtzOjEyOiLQodGC0LDRgtGD0YEiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aTozO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJjcmVhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjEyOiLQodC+0LfQtNCw0L0iO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjowO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjoxO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7YjoxO31pOjQ7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MTA6InVwZGF0ZWRfYXQiO3M6NToibGFiZWwiO3M6MTY6ItCe0LHQvdC+0LLQu9C10L0iO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjowO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjoxO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7YjoxO319czo0MDoiZTY0NDgzM2Y0ZTRlMDg3MTIzMTVkYTcxYjMzZmFjZDJfY29sdW1ucyI7YTo2OntpOjA7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6NDoibmFtZSI7czo1OiJsYWJlbCI7czo2OiLQmNC80Y8iO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aToxO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjU6ImVtYWlsIjtzOjU6ImxhYmVsIjtzOjMzOiLQrdC70LXQutGC0YDQvtC90L3QsNGPINC/0L7Rh9GC0LAiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aToyO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjE3OiJlbWFpbF92ZXJpZmllZF9hdCI7czo1OiJsYWJlbCI7czoyODoiRW1haWwg0L/QvtC00YLQstC10YDQttC00LXQvSI7czo4OiJpc0hpZGRlbiI7YjowO3M6OToiaXNUb2dnbGVkIjtiOjE7czoxMjoiaXNUb2dnbGVhYmxlIjtiOjA7czoyNDoiaXNUb2dnbGVkSGlkZGVuQnlEZWZhdWx0IjtOO31pOjM7YTo3OntzOjQ6InR5cGUiO3M6NjoiY29sdW1uIjtzOjQ6Im5hbWUiO3M6MjM6InR3b19mYWN0b3JfY29uZmlybWVkX2F0IjtzOjU6ImxhYmVsIjtzOjI4OiIyRkEg0L/QvtC00YLQstC10YDQttC00LXQvdCwIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6NDthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMDoiY3JlYXRlZF9hdCI7czo1OiJsYWJlbCI7czoxMjoi0KHQvtC30LTQsNC9IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9aTo1O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJ1cGRhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjE2OiLQntCx0L3QvtCy0LvQtdC9IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9fXM6NDA6IjZmMWQ4YTNkZjRhM2NhODNmOTM4YjJjNTIzMTZkYWJlX2NvbHVtbnMiO2E6NTp7aTowO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjQ6Im5hbWUiO3M6NToibGFiZWwiO3M6MTY6ItCd0LDQt9Cy0LDQvdC40LUiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aToxO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJndWFyZF9uYW1lIjtzOjU6ImxhYmVsIjtzOjE5OiLQmNC80Y8g0LfQsNGJ0LjRgtGLIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMDoiY3JlYXRlZF9hdCI7czo1OiJsYWJlbCI7czoxMjoi0KHQvtC30LTQsNC9IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9aTozO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJ1cGRhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjE2OiLQntCx0L3QvtCy0LvQtdC9IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9aTo0O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEyOiJkaXNwbGF5X25hbWUiO3M6NToibGFiZWwiO3M6MzE6ItCe0YLQvtCx0YDQsNC20LDQtdC80L7QtSDQuNC80Y8iO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9fXM6NDA6ImIxZDM2MGQyZTdiNWE3N2NhYTEzZjc4ODYzZWE4MDY0X2NvbHVtbnMiO2E6NTp7aTowO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjQ6Im5hbWUiO3M6NToibGFiZWwiO3M6MTY6ItCd0LDQt9Cy0LDQvdC40LUiO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9aToxO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJndWFyZF9uYW1lIjtzOjU6ImxhYmVsIjtzOjE5OiLQmNC80Y8g0LfQsNGJ0LjRgtGLIjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MTtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MDtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO047fWk6MjthOjc6e3M6NDoidHlwZSI7czo2OiJjb2x1bW4iO3M6NDoibmFtZSI7czoxMDoiY3JlYXRlZF9hdCI7czo1OiJsYWJlbCI7czoxMjoi0KHQvtC30LTQsNC9IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9aTozO2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEwOiJ1cGRhdGVkX2F0IjtzOjU6ImxhYmVsIjtzOjE2OiLQntCx0L3QvtCy0LvQtdC9IjtzOjg6ImlzSGlkZGVuIjtiOjA7czo5OiJpc1RvZ2dsZWQiO2I6MDtzOjEyOiJpc1RvZ2dsZWFibGUiO2I6MTtzOjI0OiJpc1RvZ2dsZWRIaWRkZW5CeURlZmF1bHQiO2I6MTt9aTo0O2E6Nzp7czo0OiJ0eXBlIjtzOjY6ImNvbHVtbiI7czo0OiJuYW1lIjtzOjEyOiJkaXNwbGF5X25hbWUiO3M6NToibGFiZWwiO3M6MzE6ItCe0YLQvtCx0YDQsNC20LDQtdC80L7QtSDQuNC80Y8iO3M6ODoiaXNIaWRkZW4iO2I6MDtzOjk6ImlzVG9nZ2xlZCI7YjoxO3M6MTI6ImlzVG9nZ2xlYWJsZSI7YjowO3M6MjQ6ImlzVG9nZ2xlZEhpZGRlbkJ5RGVmYXVsdCI7Tjt9fX19',1766921674);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Khisrav','kh.khisrav2018@gmail.com',NULL,'$2y$12$ifpeJR611HG95iLj8yhOWuXbl.ZDNylrc/oHP5boTI393dIFnOamm',NULL,NULL,NULL,'yMbRqehj6PZg2btj6X16dH7PdfRbkCiNgJ2hiX7HDuNSdL9LK7dY6R8h4cgU','2025-12-18 15:50:20','2025-12-18 15:50:20');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-28 12:31:55
