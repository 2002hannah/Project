-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-09-12 10:12:16
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `project`
--

-- --------------------------------------------------------

--
-- 資料表結構 `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(100) NOT NULL,
  `admin_username` varchar(50) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `comment_id` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `current_preview_page`
--

CREATE TABLE `current_preview_page` (
  `User_id` int(100) NOT NULL,
  `CPP_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `current_web_essay`
--

CREATE TABLE `current_web_essay` (
  `CWE_id` int(100) NOT NULL,
  `User_id` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `preview_page`
--

CREATE TABLE `preview_page` (
  `PP_id` int(100) NOT NULL,
  `PP_summary` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `PP_URL` text NOT NULL,
  `PP_Conformity` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `User_id` int(100) NOT NULL,
  `User_login` tinyint(1) NOT NULL,
  `User_gmail` varchar(20) NOT NULL,
  `User_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`User_id`, `User_login`, `User_gmail`, `User_name`) VALUES
(1, 0, '', '勳'),
(2, 0, '', '涵'),
(3, 0, '', '涵');

-- --------------------------------------------------------

--
-- 資料表結構 `user_comments`
--

CREATE TABLE `user_comments` (
  `Comment_id` int(100) NOT NULL,
  `User_id` int(100) NOT NULL,
  `Comment_content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user_comments`
--

INSERT INTO `user_comments` (`Comment_id`, `User_id`, `Comment_content`) VALUES
(17, 0, '嗨'),
(18, 0, 'ya'),
(19, 0, 'ooo'),
(20, 1, '嗨'),
(21, 1, '哈'),
(22, 0, '嗨'),
(23, 2, 'ooo'),
(24, 3, '咿呀哈');

-- --------------------------------------------------------

--
-- 資料表結構 `web_essay`
--

CREATE TABLE `web_essay` (
  `WE_id` int(100) NOT NULL,
  `WE_Summary` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `WE_conformity` int(5) NOT NULL,
  `WE_theme` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- 資料表索引 `current_preview_page`
--
ALTER TABLE `current_preview_page`
  ADD PRIMARY KEY (`CPP_id`);

--
-- 資料表索引 `current_web_essay`
--
ALTER TABLE `current_web_essay`
  ADD PRIMARY KEY (`CWE_id`);

--
-- 資料表索引 `preview_page`
--
ALTER TABLE `preview_page`
  ADD PRIMARY KEY (`PP_id`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_id`);

--
-- 資料表索引 `user_comments`
--
ALTER TABLE `user_comments`
  ADD PRIMARY KEY (`Comment_id`);

--
-- 資料表索引 `web_essay`
--
ALTER TABLE `web_essay`
  ADD PRIMARY KEY (`WE_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `User_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_comments`
--
ALTER TABLE `user_comments`
  MODIFY `Comment_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `user_comments` (`Comment_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
