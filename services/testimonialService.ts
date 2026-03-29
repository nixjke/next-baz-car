import axiosInstance from '@/utils/axios'

export type TestimonialApi = {
  id: number
  name: string
  role: string
  content: string
  rating: number
  avatar_initial: string
  video_title?: string
  video_url?: string
  video_placeholder?: string
  sort_order: number
  is_active: boolean
}

export const getActiveTestimonials = async (): Promise<TestimonialApi[]> => {
  try {
    const response = await axiosInstance.get('/testimonials/active', {
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
