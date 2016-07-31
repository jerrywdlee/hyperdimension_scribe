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
