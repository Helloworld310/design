create table photos(
  id int not null auto_increment,
  status varchar (10) not null,
  img varchar (100) not null,
  primary key (id)
) engine=innodb default charset=utf8;