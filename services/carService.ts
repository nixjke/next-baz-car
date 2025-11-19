import axiosInstance from '@/utils/axios'
import { API_CONFIG } from '@/utils/constants'
import { type Car } from '@/data/mockCars'

// Функция для преобразования URL изображений
// Если URL относительный, добавляем базовый URL бэкенда
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
	
	// Иначе возвращаем как есть (может быть уже правильный путь)
	return imagePath
}

// Преобразование данных автомобиля из API в формат фронтенда
const transformCar = (apiCar: any): Car => {
	// Преобразуем specifications из формата бэкенда в формат фронтенда
	let specifications = apiCar.specifications || {}
	
	// Если specifications приходит как объект, нормализуем его
	if (typeof specifications === 'object' && specifications !== null) {
		const normalizedSpecs: any = { ...specifications }
		
		// Маппинг полей из формата бэкенда в формат фронтенда
		// Бэкенд использует: engine, seats, max_speed, acceleration_0_100, trunk_volume, power, range
		// Фронтенд ожидает: engine_ru, seating_ru, topSpeed_ru, acceleration_ru, cargo_ru, power_ru, range_ru
		if (specifications.engine) {
			normalizedSpecs.engine_ru = specifications.engine
		}
		if (specifications.seats) {
			normalizedSpecs.seating_ru = `${specifications.seats} мест`
		}
		if (specifications.max_speed) {
			normalizedSpecs.topSpeed_ru = `${specifications.max_speed} км/ч`
		}
		if (specifications.acceleration_0_100) {
			normalizedSpecs.acceleration_ru = `${specifications.acceleration_0_100} сек`
		}
		if (specifications.range) {
			normalizedSpecs.range_ru = `${specifications.range} км`
		}
		if (specifications.trunk_volume) {
			normalizedSpecs.cargo_ru = `${specifications.trunk_volume} л`
		}
		if (specifications.power) {
			normalizedSpecs.power_ru = `${specifications.power} л.с.`
		}
		
		specifications = normalizedSpecs
	}
	
	// Логируем для отладки
	console.log('TransformCar - additional_services from API:', apiCar.additional_services)
	
	return {
		id: apiCar.id,
		name: apiCar.name,
		category: apiCar.category,
		category_ru: apiCar.category_ru,
		price: apiCar.price || 0,
		price_3plus_days: apiCar.price_3plus_days,
		images: apiCar.images?.map((img: string) => getImageUrl(img)) || [],
		// Используем обычные поля, так как бэкенд уже возвращает русский текст
		description: apiCar.description,
		description_ru: apiCar.description || apiCar.description_ru, // Fallback для совместимости
		features: apiCar.features,
		features_ru: apiCar.features || apiCar.features_ru, // Fallback для совместимости
		specifications: specifications,
		available: apiCar.available,
		rating: apiCar.rating,
		fuelType: apiCar.fuel_type || apiCar.fuelType, // Поддержка обоих форматов
		fuel_type: apiCar.fuel_type,
		restrictions: apiCar.restrictions,
		// Убеждаемся, что additional_services правильно копируется (не ссылка)
		additional_services: apiCar.additional_services ? [...apiCar.additional_services] : [],
		created_at: apiCar.created_at,
		updated_at: apiCar.updated_at,
	}
}

// Получение всех автомобилей
export const getAllCars = async (): Promise<Car[]> => {
	try {
		const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.CARS)
		const cars = Array.isArray(response.data) ? response.data : []
		return cars.map(transformCar)
	} catch (error) {
		console.error('Error fetching all cars:', error)
		throw error
	}
}

// Получение автомобиля по ID
export const getCarById = async (id: number): Promise<Car | null> => {
	try {
		// Добавляем timestamp для предотвращения кеширования
		const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.CARS}${id}`, {
			params: {
				_t: Date.now() // Добавляем timestamp для предотвращения кеширования
			}
		})
		console.log('getCarById - Raw API response:', response.data)
		const transformed = transformCar(response.data)
		console.log('getCarById - Transformed car:', transformed)
		return transformed
	} catch (error: any) {
		if (error.response?.status === 404) {
			return null
		}
		console.error(`Error fetching car ${id}:`, error)
		throw error
	}
}

// Получение популярных автомобилей
export const getFeaturedCars = async (limit: number = 6): Promise<Car[]> => {
	try {
		const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.CARS}popular?limit=${limit}`)
		const cars = Array.isArray(response.data) ? response.data : []
		return cars.map(transformCar)
	} catch (error) {
		console.error('Error fetching featured cars:', error)
		// В случае ошибки возвращаем пустой массив
		return []
	}
}

// Получение метаданных для фильтров
export const getCarsMeta = async (): Promise<any> => {
	try {
		const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.CARS}meta`)
		return response.data
	} catch (error) {
		console.error('Error fetching cars meta:', error)
		return {}
	}
}

// Тип дополнительной услуги
export type AdditionalService = {
	id: number
	service_id: string
	label: string
	description?: string
	fee: number
	fee_type: string
	icon_key?: string
	is_active: boolean
	created_at?: string
	updated_at?: string
}

// Получение дополнительных услуг для автомобиля
export const getCarServices = async (carId: number): Promise<AdditionalService[]> => {
	try {
		const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.CARS}${carId}/services`)
		const services = Array.isArray(response.data) ? response.data : []
		return services
	} catch (error) {
		console.error(`Error fetching car services for car ${carId}:`, error)
		return []
	}
}

// Получение всех активных дополнительных услуг
export const getAllAdditionalServices = async (): Promise<AdditionalService[]> => {
	try {
		const response = await axiosInstance.get('/additional-services/active')
		const services = Array.isArray(response.data) ? response.data : []
		return services
	} catch (error) {
		console.error('Error fetching additional services:', error)
		return []
	}
}

