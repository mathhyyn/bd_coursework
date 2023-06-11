create table users (
  user_id serial primary key,
  user_login varchar(255) unique,
  user_password varchar(255) not null,
  user_name varchar(255) not null,
  user_date date not null,
  email varchar(255) unique not null,
  gender bool default false,
  created_at timestamp default current_timestamp
)
	
drop table users

insert into users (user_name, user_password, user_login, user_date, email, gender)
	values ('anna', 'aa', '', '07/20/02', 'a@gmail.com', true)

select user_login from users where email = 'a@gmail.com'

create or replace function users_insert_function()
  returns trigger as
$$
begin
	if new.user_login = '' then
		new.user_login = 'user' || cast(new.user_id as varchar(250));
	end if;
	return new;
end;
$$
language 'plpgsql'

create or replace trigger users_insert_trigger
before insert on users
for each row
	execute function users_insert_function()
