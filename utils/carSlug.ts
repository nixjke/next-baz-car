import { type Car } from '@/data/mockCars'

// Таблица транслитерации кириллицы в латиницу
const transliterationMap: Record<string, string> = {
	'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
	'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
	'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
	'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
	'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
	'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
	'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
	'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
	'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
	'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
}

/**
 * Транслитерирует строку из кириллицы в латиницу
 */
function transliterate(text: string): string {
	return text
		.split('')
		.map(char => transliterationMap[char] || char)
		.join('')
}

/**
 * Преобразует строку в URL-friendly slug
 */
function stringToSlug(text: string): string {
	// Транслитерация кириллицы
	let slug = transliterate(text)
	
	// Приводим к нижнему регистру
	slug = slug.toLowerCase()
	
	// Заменяем пробелы и спецсимволы на дефисы
	slug = slug.replace(/[^\w\s-]/g, '') // Удаляем спецсимволы
	slug = slug.replace(/\s+/g, '-') // Пробелы в дефисы
	slug = slug.replace(/-+/g, '-') // Множественные дефисы в один
	slug = slug.replace(/^-+|-+$/g, '') // Убираем дефисы в начале и конце
	
	return slug
}

/**
 * Генерирует slug для карточки машины в формате: {id}-{name-slug}
 * Пример: "1-lixiang-l6-pro-slonovya-kost"
 */
export function generateCarSlug(car: Car): string {
	const nameSlug = stringToSlug(car.name)
	return `${car.id}-${nameSlug}`
}

/**
 * Извлекает ID машины из slug
 * @param slug - slug в формате "1-lixiang-l6-pro" или "1-lexus-570"
 * @returns ID машины или null, если не удалось извлечь
 */
export function parseCarIdFromSlug(slug: string): number | null {
	if (!slug) return null
	
	// Извлекаем ID из начала slug (до первого дефиса)
	const match = slug.match(/^(\d+)/)
	if (!match) return null
	
	const id = parseInt(match[1], 10)
	return isNaN(id) ? null : id
}

