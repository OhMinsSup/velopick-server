## Docker MariaDB 실행

```bash
docker exec -it mariadb_db_1 bash

mysql -u root -p

create database [databaseName];

grant all privileges on [databaseName].* TO '[name]'@'%' identified by '[password]';

flush privileges;
```
