import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from './BaseEntity'

@Entity()
export class PickPlace extends BaseEntity {
  @Property({ type: 'string', comment: '설명' })
  description: string

  @Property({ type: 'string', nullable: false, comment: '장소명' })
  place_name: string

  @Property({ type: 'string', nullable: false, comment: '주소' })
  address_name: string

  @Property({ type: 'string', comment: '도로명 주소' })
  road_address_name: string

  @Property({ type: 'number', comment: '위도' })
  lat: number

  @Property({ type: 'number', comment: '경도' })
  lng: number
}
