import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
	title: 'Аренда премиальных автомобилей в Дагестане',
	description:
		'Аренда премиальных автомобилей в Дагестане. LiXiang, Lexus, Toyota, Geely. Выгодные цены, посуточная аренда, скидки от 3 дней.',
	keywords: [
		'аренда авто Дагестан',
		'прокат машин Махачкала',
		'аренда автомобилей',
		'премиум авто',
	],
}

export default function HomePage() {
	return <HomePageClient />
}
