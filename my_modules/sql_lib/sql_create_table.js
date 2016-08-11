var SqlQueries = {
   admin_users    : "CREATE TABLE `admin_users` ( "
                  + "`id` INT UNSIGNED primary key AUTO_INCREMENT, "
                  + "`email` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL UNIQUE, "
                  + "`name` text CHARACTER SET utf8 COLLATE utf8_bin , "
                  + "`password` text, "
                  + "`auth_id` TINYINT UNSIGNED, "
                  + "`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  "
                  + "`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, "
                  + "`deleted` TINYINT not null default 0); ",

   auths          : "CREATE TABLE auths ( "
                  + "id INT UNSIGNED primary key AUTO_INCREMENT, "
                  + "auth text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  "
                  + "`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, "
                  + "`deleted` TINYINT not null default 0); ",

   media          : "CREATE TABLE media ( "
                  + "id INT UNSIGNED primary key AUTO_INCREMENT, "
                  + "name text CHARACTER SET utf8 COLLATE utf8_bin, "
                  //+ "-- media_code VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL UNIQUE, "
                  + "email text CHARACTER SET utf8 COLLATE utf8_general_ci, "
                  + "sns text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "homepage text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "media_profile text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  "
                  + "`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, "
                  + "`deleted` TINYINT not null default 0); ",

   items          : "CREATE TABLE items ("
                  + "id INT UNSIGNED primary key AUTO_INCREMENT, "
                  + "name text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "item_code VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci UNIQUE, "
                  + "item_page text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "item_page_iphone text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "item_page_android text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "item_page_line text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "item_page_fb text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "item_page_messenger text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "item_page_twitter text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "item_page_instagram text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "item_page_qq text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "item_page_wechat text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "item_page_alipay text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "item_profile text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  "
                  + "`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, "
                  + "`deleted` TINYINT not null default 0); ",

   scenarios      : "CREATE TABLE scenarios ("
                  + "id INT UNSIGNED primary key AUTO_INCREMENT, "
                  + "scenario text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "scenario_uuid VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL UNIQUE, "
                  + "media_id INT UNSIGNED NOT NULL, "
                  + "item_id INT UNSIGNED NOT NULL, "
                  + "price_per_view FLOAT DEFAULT 0, "
                  + "price_per_buy FLOAT DEFAULT 0, "
                  + "scenario_profile text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  "
                  + "`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, "
                  + "`deleted` TINYINT not null default 0); ",

   view_histories : "CREATE TABLE view_histories ("
                  + "id INT UNSIGNED primary key AUTO_INCREMENT, "
                  + "scenario_uuid text CHARACTER SET utf8 COLLATE utf8_bin , "
                  + "customer_uuid text CHARACTER SET utf8 COLLATE utf8_bin , "
                  + "ip_address text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "user_agent text CHARACTER SET utf8 COLLATE utf8_bin, "
                  + "`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  "
                  + "`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, "
                  + "`deleted` TINYINT not null default 0); ",

   conversion_histories : "CREATE TABLE conversion_histories ("
                  + "id INT UNSIGNED primary key AUTO_INCREMENT,"
                  + "scenario_uuid text CHARACTER SET utf8 COLLATE utf8_bin ,"
                  + "customer_uuid text CHARACTER SET utf8 COLLATE utf8_bin ,"
                  + "purchase_url text CHARACTER SET utf8 COLLATE utf8_bin,"
                  + "`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  "
                  + "`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, "
                  + "`deleted` TINYINT not null default 0); "
}

module.exports = SqlQueries;
