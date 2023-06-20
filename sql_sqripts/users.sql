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
	
create function get_user_login(login_ varchar(255), email_ varchar(255), password_ varchar(255))
returns table(login varchar(255)) as $$
begin
	if login_ <> '' then
  		return query select user_login from users where user_login = login_ and user_password = password_;
  	else 
  		return query select user_login from users where email = email_ and user_password = password_;
  	end if;
end;
$$ language plpgsql;

DROP FUNCTION public.get_user_login(varchar, varchar, varchar);

select * from get_user_login('', 'anna@gmail.com', '1anna');
