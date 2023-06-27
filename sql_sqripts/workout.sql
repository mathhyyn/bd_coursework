create table workout (
  id serial primary key,
  owner_id  varchar(255) references users(user_id) on update cascade on delete set null,
  info json.
  created_at timestamp with time zone default current_timestamp
)
	
drop table workout