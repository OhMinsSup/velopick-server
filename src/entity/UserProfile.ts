import { Column, Index } from 'typeorm'

class UserProfile {
  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  username: string

  @Column({ nullable: true })
  address: string

  @Column({ nullable: true })
  thumbnailUrl: string

  @Column({ nullable: true })
  shortBio: string
}

export default UserProfile
