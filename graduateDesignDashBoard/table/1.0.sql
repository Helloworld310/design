create database blog;
use blog;
grant all privileges on blog.* to 'www'@'%' identified by 'www';
flush privileges;