create table training (
  id serial primary key,
  owner_id  varchar(255) references users(user_login),
  video 
  created_at timestamp with time zone default current_timestamp
)
	
drop table users