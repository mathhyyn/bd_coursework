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

alter table body_data
alter column updated_at type timestamp with time zone,
alter column updated_at set default now();

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

select * from body_data where user_id_ref = 'user1';

select * from parameter_data where body_data_ref = 8 order by created_at desc;


create or replace function get_body_data_list(login_ varchar(255), id_ integer)
returns table(
  id1 integer,
  body_data_ref1 integer,
  value1 varchar(255),
  created_at1 timestamp with time zone
  ) as $$
begin
	if not exists (select * from body_data where user_id_ref = login_ and id = id_) then
		raise exception 'access denied';
	else
  		return query select * from parameter_data where body_data_ref = id_ order by created_at desc;
  	end if;
end;
$$ language plpgsql;

select * from get_body_data_list('user2', 8)

drop function get_body_data_list(character varying,integer) 
	