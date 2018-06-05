create table notices (
  id int not null auto_increment,
  title varchar (100) not null,
  content longtext not null,
  status varchar (10) not null,
  time varchar (20) not null,
  primary key (id)
) engine=innodb;
