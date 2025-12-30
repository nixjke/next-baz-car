import type { Metadata } from 'next'
import { getCarById } from '@/services/carService.server'
import { parseCarIdFromSlug } from '@/utils/carSlug'
import CarDetailPageClient from './CarDetailPageClient'

type Props = {
	params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const id = params.slug ? parseCarIdFromSlug(params.slug) : null

	if (!id) {
		return {
			title: 'Автомобиль не найден',
			robots: { index: false, follow: false },
		}
	}

	const car = await getCarById(id)

	if (!car) {
		return {
			title: 'Автомобиль не найден',
			robots: { index: false, follow: false },
		}
	}

	const title = `${car.name} — аренда в Дагестане`
	const description = `Аренда ${car.name} в Дагестане от ${car.price.toLocaleString('ru-RU')} ₽ в сутки. ${car.description || 'Премиальный комфорт и выгодные условия от BazCar.'}`

	// Получаем первое изображение для OpenGraph
	const ogImage = car.images && car.images.length > 0 ? car.images[0] : '/logo.png'

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 800,
					alt: car.name,
				},
			],
		},
	}
}

export default function CarDetailPage({ params }: Props) {
	return <CarDetailPageClient slug={params.slug} />
}
