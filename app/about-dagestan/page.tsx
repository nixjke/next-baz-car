import type { Metadata } from 'next'
import AboutDagestanPageClient from './AboutDagestanPageClient'

export const metadata: Metadata = {
	title: 'О Дагестане — путешествия и достопримечательности',
	description:
		'Откройте для себя Дагестан: горы, каньоны, древние города и Каспийское море. Путешествуйте с комфортом на автомобилях BazCar.',
	keywords: [
		'Дагестан',
		'достопримечательности Дагестана',
		'путешествия по Кавказу',
		'Сулакский каньон',
		'Дербент',
	],
}

export default function AboutDagestanPage() {
	return <AboutDagestanPageClient />
}
