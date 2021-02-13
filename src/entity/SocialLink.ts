import { Column } from 'typeorm'

enum SocialType {
  Facebook = 'facebook',
  Twitter = 'twitter',
  Instagram = 'instagram',
}

class SocialLink {
  @Column({ type: 'enum', enum: SocialType })
  socialType: SocialType

  @Column()
  url: string
}

export default SocialLink
