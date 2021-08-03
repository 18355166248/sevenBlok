---
sidebar: auto
---

# MySql

## node 中间件 mysql 登录问题

如果是安装 mysql8 以上的版本可能使用的密码是严格加密模式 这样的话 node 的 mysql 中间件会登录失败, 需要转换下密码

// { Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client at Handshake.Sequence.\_packetToError
// 解决办法：（修改加密规则为普通模式，默认是严格加密模式）
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// 'password'是你的数据库密码

## 环境变量问题

有可能你不能在命令行直接使用 mysql 命令, 是因为没有配置全局环境变量

我的 mac 是用 .zshrc, 所以去~/.zshrc 下面添加下面这段代码即可

```
PATH=$PATH:/usr/local/mysql/bin
```

## 常用命令行

1. 登录

mysql -u root -p

show databases

## 常用语句

```sql
-- 新增

-- insert into users (username, `password`, realname) values ('lishi', '123', '李四')

-- 查询

-- use myblog;

-- show TABLES;

-- SELECT * From users

-- SELECT id, username from users

-- SELECT * From users where username = 'lishi' and `PASSWORD` = '123'

-- select * from users where username like '%li%'

-- select * from users where PASSWORD like '%1%' ORDER BY id desc


-- 更新

-- UPDATE users set realname = '李四2' where username = 'lishi'


-- 删除

-- delete from users where username = 'lishi'

```
