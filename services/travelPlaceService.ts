import axiosInstance from '@/utils/axios'

export type TravelPlaceApi = {
  id: number
  title: string
  slug: string
  location: string
  description_short: string
  description_full: string
  visit_duration: string
  distance_from_city_km: number
  car_recommendation: string
  image_url: string
  gallery_urls?: string[]
  sort_order: number
  is_active: boolean
}

export const getActiveTravelPlaces = async (): Promise<TravelPlaceApi[]> => {
  try {
    const response = await axiosInstance.get('/travel-places/active', {
      params: { _t: Date.now() },
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0',
        Pragma: 'no-cache',
      },
    })
    return Array.isArray(response.data) ? response.data : []
  } catch {
    return []
  }
}

export const getTravelPlaceBySlug = async (slug: string): Promise<TravelPlaceApi | null> => {
  try {
    const response = await axiosInstance.get(`/travel-places/slug/${encodeURIComponent(slug)}`, {
      params: { _t: Date.now() },
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0',
        Pragma: 'no-cache',
      },
    })
    return response.data ?? null
  } catch {
    return null
  }
}
