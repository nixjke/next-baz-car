import type { Metadata } from 'next'
import CarsPageClient from './CarsPageClient'

export const metadata: Metadata = {
	title: 'Автопарк премиальных автомобилей',
	description:
		'Автопарк BazCar: LiXiang L6, L7, Lexus IS F, Lexus 570, Toyota Land Cruiser, Geely Monjaro. Выберите автомобиль для путешествий по Дагестану.',
}

export default function CarsPage() {
	return <CarsPageClient />
}
