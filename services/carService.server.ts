import { API_CONFIG } from '@/utils/constants'
import { type Car } from '@/data/mockCars'

// Функция для преобразования URL изображений (серверная версия)
const getImageUrl = (imagePath: string | null | undefined): string => {
	if (!imagePath) return ''
	
	// Если уже полный URL, возвращаем как есть
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath
	}
	
	// Если путь начинается с /uploads, добавляем базовый URL бэкенда
	if (imagePath.startsWith('/uploads')) {
		const baseUrl = API_CONFIG.BASE_URL.replace('/api/v1', '')
		return `${baseUrl}${imagePath}`
	}
	
	// Если путь относительный, добавляем базовый URL
	if (imagePath.startsWith('/')) {
		const baseUrl = API_CONFIG.BASE_URL.replace('/api/v1', '')
		return `${baseUrl}${imagePath}`
	}
	
	// Иначе возвращаем как есть
	return imagePath
}

// Преобразование данных автомобиля из API в формат фронтенда (серверная версия)
const transformCar = (apiCar: any): Car => {
	// Преобразуем specifications из формата бэкенда в формат фронтенда
	let specifications = apiCar.specifications || {}
	
	// Если specifications приходит как объект, нормализуем его
	if (typeof specifications === 'object' && specifications !== null) {
		const normalizedSpecs: any = { ...specifications }
		
		// Маппинг полей из формата бэкенда в формат фронтенда
		// Бэкенд использует: engine, seats, max_speed, acceleration_0_100, trunk_volume, power, range
		// Фронтенд ожидает: engine, seating, topSpeed, acceleration, cargo, power, range
		if (specifications.seats) {
			normalizedSpecs.seating = `${specifications.seats} мест`
		}
		if (specifications.max_speed) {
			normalizedSpecs.topSpeed = `${specifications.max_speed} км/ч`
		}
		if (specifications.acceleration_0_100) {
			normalizedSpecs.acceleration = `${specifications.acceleration_0_100} сек`
		}
		if (specifications.range) {
			normalizedSpecs.range = `${specifications.range} км`
		}
		if (specifications.trunk_volume) {
			normalizedSpecs.cargo = `${specifications.trunk_volume} л`
		}
		
		specifications = normalizedSpecs
	}
	
	return {
		id: apiCar.id,
		name: apiCar.name,
		category: apiCar.category,
		price: apiCar.price || 0,
		price_3plus_days: apiCar.price_3plus_days,
		images: apiCar.images?.map((img: string) => getImageUrl(img)) || [],
		description: apiCar.description,
		features: apiCar.features,
		specifications: specifications,
		available: apiCar.available,
		rating: apiCar.rating,
		fuelType: apiCar.fuel_type || apiCar.fuelType,
		fuel_type: apiCar.fuel_type,
		restrictions: apiCar.restrictions,
		additional_services: apiCar.additional_services ? [...apiCar.additional_services] : [],
		created_at: apiCar.created_at,
		updated_at: apiCar.updated_at,
	}
}

// Серверная версия получения автомобиля по ID (для использования в generateMetadata)
export const getCarById = async (id: number): Promise<Car | null> => {
	try {
		const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARS}${id}`
		const response = await fetch(url, {
			cache: 'no-store', // Не кешируем для актуальных данных
		})
		
		if (!response.ok) {
			if (response.status === 404) {
				return null
			}
			throw new Error(`Failed to fetch car: ${response.status}`)
		}
		
		const apiCar = await response.json()
		const transformed = transformCar(apiCar)
		return transformed
	} catch (error: any) {
		return null
	}
}

