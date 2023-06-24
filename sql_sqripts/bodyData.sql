create table parameter_data (
  id serial primary key,
  body_data_ref integer references body_data(id),
  value  varchar(255),
  created_at timestamp default now()
);

drop table parameter_data;

create table body_data (
	id serial primary key,
	user_id_ref varchar(255) references users(user_login),
	parameter_name varchar(255),
	updated_at timestamp default now()
);

drop table body_data;

create or replace function update_statistic()
returns trigger as $$
begin
  update body_data
  set updated_at = now()
  where body_data.id = new.body_data_ref;
  return new;
end;
$$ language plpgsql;

create or replace trigger update_statistic
after insert on parameter_data
for each row
execute function update_statistic();


create unique index user_parameter_index on body_data (user_id_ref, parameter_name);

insert into body_data (user_id_ref, parameter_name)
	values ('user1', 'press')
	
insert into body_data (user_id_ref, parameter_name)
	values ('user2', 'press'), ('user1', 'weight')
	
insert into parameter_data (body_data_ref, value)
	values (1, 2),
	values (1, 2)

	