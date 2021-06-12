create database werewolf; -- Creates the new database
create user 'springuser'@'%' identified by 'werewolfGame';
grant all on werewolf.* to 'springuser'@'%'; -- Gives all privileges to the new user on the newly created database