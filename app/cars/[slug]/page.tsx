import type { Metadata } from 'next'
import { getCarById } from '@/services/carService.server'
import { parseCarIdFromSlug } from '@/utils/carSlug'
import CarDetailPageClient from './CarDetailPageClient'

type Props = {
	params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const resolvedParams = params instanceof Promise ? await params : params
	const slug = resolvedParams.slug || ''
	const id = slug ? parseCarIdFromSlug(slug) : null

	if (!id) {
		return {
			title: 'Автомобиль не найден',
			robots: { index: false, follow: false },
		}
	}
	
	try {
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
	} catch (error: any) {
		return {
			title: 'Ошибка загрузки',
			robots: { index: false, follow: false },
		}
	}
}

export default async function CarDetailPage({ params }: Props) {
	const resolvedParams = params instanceof Promise ? await params : params
	const slug = resolvedParams.slug || ''
	
	return <CarDetailPageClient slug={slug} />
}
