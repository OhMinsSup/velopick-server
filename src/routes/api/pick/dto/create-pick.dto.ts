export interface CreatePickBody {
  title: string
  description: string | null
  is_private: boolean | null
  is_temp: boolean | null
  url_slug: string | null
}
