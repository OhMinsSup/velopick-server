import { customAlphabet } from 'nanoid'

import { DI } from '../app'
import { escapeForUrl } from '../libs/utils'
import { Pick, User } from '../entities'
import { CreatePickBody } from '../routes/api/pick/dto/create-pick.dto'
import { ResponseType, successResponse } from 'libs/response'

interface PickServiceInterface {
  createPick(
    body: CreatePickBody,
    user: User
  ): Promise<
    ResponseType<{
      id: number
      url_slug: string
    }>
  >
}

class PickService implements PickServiceInterface {
  async createPick(body: CreatePickBody, user: User) {
    try {
      let processedUrlSlug = escapeForUrl(body.url_slug)
      const urlSlugDuplicate = await DI.pickRespository.findOne({
        ownerUser: user,
        url_slug: processedUrlSlug,
      })
      if (urlSlugDuplicate) {
        const randomString = customAlphabet(
          'abcdefghijklmnopqrstuvwxyz1234567890',
          8
        )
        processedUrlSlug += `-${randomString()}`
      }

      if (processedUrlSlug === '' || !processedUrlSlug) {
        processedUrlSlug = customAlphabet(
          'abcdefghijklmnopqrstuvwxyz1234567890',
          8
        )()
      }

      const pick = new Pick()
      pick.title = body.title
      pick.ownerUser = user
      pick.description = body.description
      pick.is_temp = body.is_temp || false
      pick.is_private = body.is_private || false
      pick.url_slug = processedUrlSlug

      await DI.pickRespository.persist(pick).flush()

      return successResponse({
        data: {
          id: pick.id,
          url_slug: pick.url_slug,
        },
      })
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

const pickService = new PickService()

export { pickService }
