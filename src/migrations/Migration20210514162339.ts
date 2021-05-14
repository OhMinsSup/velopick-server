import { Migration } from '@mikro-orm/migrations';

export class Migration20210514162339 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user_profile` modify `birthday` json comment \'회원 생일\', modify `social_links` json comment \'회원 소셜 정보\';');

    this.addSql('alter table `pick` add `owner_user_id` int(11) unsigned null;');
    this.addSql('alter table `pick` add index `pick_owner_user_id_index`(`owner_user_id`);');

    this.addSql('create table `pick_pick_users` (`pick_id` int(11) unsigned not null, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `pick_pick_users` add index `pick_pick_users_pick_id_index`(`pick_id`);');
    this.addSql('alter table `pick_pick_users` add index `pick_pick_users_user_id_index`(`user_id`);');
    this.addSql('alter table `pick_pick_users` add primary key `pick_pick_users_pkey`(`pick_id`, `user_id`);');

    this.addSql('alter table `pick` add constraint `pick_owner_user_id_foreign` foreign key (`owner_user_id`) references `user` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `pick_pick_users` add constraint `pick_pick_users_pick_id_foreign` foreign key (`pick_id`) references `pick` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `pick_pick_users` add constraint `pick_pick_users_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete cascade;');
  }

}
