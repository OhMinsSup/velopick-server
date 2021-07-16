select `e0`.* from `user` as `e0` left join `user_profile` as `e1` on `e0`.`profile_id` = `e1`.`id` where (`e0`.`email` = 'test@gmail.com' or `e1`.`username` = '오민섭') limit 1

insert into `user_profile` (`birthday`, `created_at`, `gender`, `updated_at`, `username`) values ('1970-01-01 09:00:00.031', '2021-07-17 00:29:03.109', 'M', '2021-07-17 00:29:03.109', '오민섭')

insert into `user` (`created_at`, `email`, `password`, `profile_id`, `updated_at`) values ('2021-07-17 00:29:03.186', 'test@gmail.com', '$2b$10$RDENB4PLOXaQVlUCLFy2b.S/20fq0YdlawZOwU4oGaM/U2i6ItaoS', 3, '2021-07-17 00:29:03.186')