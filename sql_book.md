# 设置DB
## phpMyAdmin中
```
用户名 : hyper_scribe
主机 : '%'和'localhost'各一
密码 : hyper_scribe(临时)
同名DB : hyper_scribe
```

# 生成TABLE
## 管理员
```sql
CREATE TABLE `admin_users` (
                  `id` INT UNSIGNED primary key AUTO_INCREMENT, -- auto_increment
                  `email` VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL UNIQUE, -- 重複不可,TEXT不可用UNIQUE
                  `name` text CHARACTER SET utf8 COLLATE utf8_bin ,
                  `password` text,
                  `auth_id` TINYINT UNSIGNED, -- 无符号一字节整数
                  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- create timestamp UTC
                  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自动更新
                  `deleted` TINYINT not null default 0);
```
```sql
CREATE TABLE `hyper_scribe`.`admin_users` ( `id` INT NOT NULL AUTO_INCREMENT , `email` TEXT NOT NULL , `name` TEXT NOT NULL , `password` TEXT NOT NULL , `auth_id` TINYINT UNSIGNED NOT NULL , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `deleted` TINYINT NOT NULL DEFAULT '0' , PRIMARY KEY (`id`), UNIQUE (`email`)) ENGINE = InnoDB;
```

## 权限表
```sql
CREATE TABLE auths (
                    id INT UNSIGNED primary key AUTO_INCREMENT,
                    auth text CHARACTER SET utf8 COLLATE utf8_bin,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- create timestamp UTC
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自动更新
                    deleted TINYINT not null default 0);
```

## 媒体表
```sql
CREATE TABLE media (
                    id INT UNSIGNED primary key AUTO_INCREMENT,
                    name text CHARACTER SET utf8 COLLATE utf8_bin,
                    -- media_code VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL UNIQUE,
                    email text CHARACTER SET utf8 COLLATE utf8_general_ci, -- 不分大小写
                    sns text CHARACTER SET utf8 COLLATE utf8_bin,
                    homepage text CHARACTER SET utf8 COLLATE utf8_bin,
                    media_profile text CHARACTER SET utf8 COLLATE utf8_bin,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- create timestamp UTC
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自动更新
                    deleted TINYINT not null default 0);
```

## 商品表
```sql
CREATE TABLE items (
                    id INT UNSIGNED primary key AUTO_INCREMENT,
                    name text CHARACTER SET utf8 COLLATE utf8_bin,
                    item_code VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_general_ci UNIQUE,
                    item_page text CHARACTER SET utf8 COLLATE utf8_bin,
                    item_profile text CHARACTER SET utf8 COLLATE utf8_bin,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- create timestamp UTC
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自动更新
                    deleted TINYINT not null default 0);
```

## 推广方案
```sql
CREATE TABLE scenarios (
                    id INT UNSIGNED primary key AUTO_INCREMENT,
                    scenario text CHARACTER SET utf8 COLLATE utf8_bin,
                    scenario_uuid VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL UNIQUE,
                    media_id INT UNSIGNED NOT NULL,
                    item_id INT UNSIGNED NOT NULL,
                    price_per_view FLOAT DEFAULT 0,
                    price_per_buy FLOAT DEFAULT 0,
                    scenario_profile text CHARACTER SET utf8 COLLATE utf8_bin,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- create timestamp UTC
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自动更新
                    deleted TINYINT not null default 0);
```

## 点击记录
```sql
CREATE TABLE view_histories (
                    id INT UNSIGNED primary key AUTO_INCREMENT,
                    scenario_uuid text CHARACTER SET utf8 COLLATE utf8_bin ,
                    customer_uuid text CHARACTER SET utf8 COLLATE utf8_bin ,
                    ip_address text CHARACTER SET utf8 COLLATE utf8_bin,
                    user_agent text CHARACTER SET utf8 COLLATE utf8_bin,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- create timestamp UTC
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自动更新
                    deleted TINYINT not null default 0);
```

## 购买记录
```sql
CREATE TABLE conversion_histories (
                    id INT UNSIGNED primary key AUTO_INCREMENT,
                    scenario_uuid text CHARACTER SET utf8 COLLATE utf8_bin ,
                    customer_uuid text CHARACTER SET utf8 COLLATE utf8_bin ,
                    purchase_url text CHARACTER SET utf8 COLLATE utf8_bin,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- create timestamp UTC
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自动更新
                    deleted TINYINT not null default 0);
```

```php
$sql = "CREATE TABLE conversion_histories (\n"
   . " id INT UNSIGNED primary key AUTO_INCREMENT,\n"
   . " scenario_uuid text CHARACTER SET utf8 COLLATE utf8_bin ,\n"
   . " customer_uuid text CHARACTER SET utf8 COLLATE utf8_bin ,\n"
   . " purchase_url text CHARACTER SET utf8 COLLATE utf8_bin,\n"
   . " created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- create timestamp UTC\n"
   . " updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 自动更新\n"
   . " deleted TINYINT not null default 0)";
```


## date转换
```javascript
> Date.now().toString(36)
'ir9frml9'
> parseInt('ir9frml9', 36)
1469898755613
> date = new Date(1469898755613)
`2016-07-30T17:12:35.613Z`
> date.toLocaleDateString()
'2016-07-31'
> date.toLocaleTimeString()
'02:12:35'

```
