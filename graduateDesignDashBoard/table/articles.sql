create table articles (
  id int not null auto_increment,
  title varchar (100) not null,
  description text not null,
  content text not null,
  status varchar (10) not null,
  time varchar (20) not null,
  img varchar (255) not null,
  primary key (id)
) engine=innodb;
