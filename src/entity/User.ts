import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
import SocialLink from './SocialLink'
import UserProfile from './UserProfile'

@Entity({
  name: 'users',
})
class User {
  @ObjectIdColumn()
  id: ObjectID

  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column((type) => UserProfile)
  profile: UserProfile

  @Column((type) => SocialLink)
  socialLinks: SocialLink[]

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date
}

export default User
