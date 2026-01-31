import axiosInstance from '@/utils/axios'

export type UnavailableDatesResponse = {
	unavailable_dates: string[]
}

/**
 * Получает недоступные для бронирования даты по car_id.
 * @param carId - ID автомобиля
 * @param month - месяц в формате YYYY-MM (опционально, по умолчанию текущий)
 */
export async function getUnavailableDates(
	carId: number,
	month?: string
): Promise<string[]> {
	try {
		const params: Record<string, string> = { car_id: String(carId) }
		if (month) params.month = month
		const { data } = await axiosInstance.get<UnavailableDatesResponse>(
			'booking/unavailable-dates',
			{ params }
		)
		return data?.unavailable_dates ?? []
	} catch {
		return []
	}
}
