create table albums (
  id int not null auto_increment,
  title varchar (100) not null,
  pictures text not null,
  status varchar (10) not null,
  time varchar (20) not null,
  avatar varchar (100) not null,
  primary key (id)
) engine=innodb default charset=utf8;
