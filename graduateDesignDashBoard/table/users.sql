create table users (
  id int not null auto_increment,
  account varchar (50) not null,
  password varchar (50) not null,
  primary key (id)
) engine=innodb default charset=utf8;
