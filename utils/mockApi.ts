import { mockCars, type Car } from '@/data/mockCars'

// Имитация задержки сети
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Моковая функция для получения всех автомобилей
export const mockGetAllCars = async (): Promise<Car[]> => {
	await delay(500) // Имитация задержки сети
	return [...mockCars]
}

// Моковая функция для получения автомобиля по ID
export const mockGetCarById = async (id: number): Promise<Car | null> => {
	await delay(300)
	const car = mockCars.find((c) => c.id === id)
	return car || null
}

// Моковая функция для получения популярных автомобилей
export const mockGetFeaturedCars = async (): Promise<Car[]> => {
	await delay(400)
	return mockCars.slice(0, 6)
}

// Моковая функция для проверки QR кода
export type QRVerificationResponse = {
	status: 'success' | 'error' | 'already_used'
	message?: string
	data?: {
		code: string
		discount: number
		active: boolean
	}
}

export const mockVerifyQRCode = async (
	code: string
): Promise<QRVerificationResponse> => {
	await delay(500)

	// Моковые коды для тестирования
	const validCodes: Record<string, { discount: number; active: boolean }> = {
		TEST100: { discount: 100, active: false }, // Выигрыш автомобиля
		TEST50: { discount: 50, active: false }, // Скидка 50%
		TEST25: { discount: 25, active: false }, // Скидка 25%
		USED: { discount: 50, active: true }, // Уже использован
	}

	if (validCodes[code]) {
		const codeData = validCodes[code]
		if (codeData.active) {
			return {
				status: 'already_used',
				message: 'Этот QR код уже был активирован ранее',
				data: {
					code,
					discount: codeData.discount,
					active: codeData.active,
				},
			}
		}
		return {
			status: 'success',
			message: 'QR код успешно проверен',
			data: {
				code,
				discount: codeData.discount,
				active: codeData.active,
			},
		}
	}

	// Неверный код
	return {
		status: 'error',
		message: 'Неверный QR код',
	}
}

