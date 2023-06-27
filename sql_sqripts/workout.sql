create table workout (
  id serial primary key,
  name varchar(255),
  owner_id  varchar(255) references users(user_login) on update cascade on delete set null,
  info json default '{"description":""}',
  created_at timestamp with time zone default current_timestamp
)

create table user_workouts (
  user_id varchar(255) references users(user_login) on update cascade on delete cascade,
  workout_id integer references workout(id) on update cascade on delete cascade,
  primary key (user_id, workout_id)
);
	
drop table workout;
drop table user_workouts;

select workout.*
from workout
join user_workouts on workout.id = user_workouts.workout_id
where user_workouts.user_id = 'user2';

update workout
set info = '{"description":""}' where id <> 13;

