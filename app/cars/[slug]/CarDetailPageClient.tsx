'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCarById } from '@/services/carService'
import { type Car } from '@/data/mockCars'
import { parseCarIdFromSlug } from '@/utils/carSlug'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BookingForm from '@/components/BookingForm'
import { ImageCarousel } from '@/components/ImageCarousel'
import AdditionalServicesSection from '@/components/AdditionalServicesSection'
import {
	Car as CarIcon,
	CalendarDays,
	Users,
	Gauge,
	Zap,
	Fuel,
	Package,
	ArrowLeft,
	Star,
	CheckCircle,
	Tag,
	UserCheck,
	Mountain,
	CreditCard,
	Loader2,
} from 'lucide-react'
import { reachGoal } from '@/lib/metrika'

type CarDetailPageClientProps = {
	slug: string
}

export default function CarDetailPageClient({ slug }: CarDetailPageClientProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const id = slug ? parseCarIdFromSlug(slug) : null

	const [car, setCar] = useState<Car | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const abortControllerRef = useRef<AbortController | null>(null)

	useEffect(() => {
		// Отменяем предыдущий запрос если он еще выполняется
		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
		}
		
		// Если slug еще не загружен, ждем
		if (!slug) {
			return
		}

		// Если ID не определен, не делаем запрос
		if (!id) {
			setError(new Error('ID не указан'))
			setLoading(false)
			return
		}

		// Создаем новый AbortController для этого запроса
		const abortController = new AbortController()
		abortControllerRef.current = abortController

		const fetchCar = async () => {
			try {
				setLoading(true)
				setError(null)
				const carData = await getCarById(id)
				
				// Проверяем, не был ли запрос отменен
				if (abortController.signal.aborted) {
					return
				}
				
				if (!carData) {
					setError(new Error('Автомобиль не найден'))
					setCar(null)
				} else {
					setCar(carData)
				}
			} catch (err: any) {
				// Игнорируем ошибки отмены запроса
				if (err?.name === 'AbortError' || abortController.signal.aborted) {
					return
				}
				setError(err as Error)
				setCar(null)
			} finally {
				// Устанавливаем loading в false только если запрос не был отменен
				if (!abortController.signal.aborted) {
					setLoading(false)
				}
			}
		}

		fetchCar()

		// Cleanup: отменяем запрос при размонтировании или изменении зависимостей
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort()
			}
		}
	}, [id, slug])

	const action = searchParams?.get('action')

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.scrollTo(0, 0)
		}
	}, [id])

	useEffect(() => {
		if (action === 'book') {
			const bookingFormElement = document.getElementById('booking-form-section')
			if (bookingFormElement) {
				bookingFormElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
		}
	}, [action, id])

	useEffect(() => {
		if (car) {
			reachGoal('view_car', { car_name: car.name })
		}
	}, [car?.id])

	// Функция для перевода типа топлива на русский
	const getFuelTypeLabel = (fuelType: string | undefined): string => {
		if (!fuelType) return 'Бензин'

		const fuelTypeMap: Record<string, string> = {
			petrol: 'Бензин',
			gasoline: 'Бензин',
			diesel: 'Дизель',
			electric: 'Электрический',
			hybrid: 'Гибрид',
			'plug-in-hybrid': 'Плагин-гибрид',
			cng: 'КПГ',
			lpg: 'СУГ',
			бензин: 'Бензин',
			дизель: 'Дизель',
			электрический: 'Электрический',
			гибрид: 'Гибрид',
		}

		const normalized = fuelType.toLowerCase().trim()
		return fuelTypeMap[normalized] || fuelType
	}

	const itemVariants = (delay = 0) => ({
		initial: { opacity: 0, y: 15 },
		animate: { opacity: 1, y: 0, transition: { delay: delay * 0.1, duration: 0.5, ease: "easeOut" as const } },
	});

	if (loading) {
		return (
			<div className="container py-20 text-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
				<p className="text-muted-foreground">Загрузка информации об автомобиле...</p>
			</div>
		)
	}

	if (error || !car) {
		return (
			<div className="container py-20 text-center">
				<h1 className="text-4xl font-bold text-destructive mb-4">Машина не найдена</h1>
				<p className="text-muted-foreground text-lg mb-8">Упс! Машина BazCar, которую вы ищете, недоступна или, возможно, уже уехала.</p>
				{error && <p className="text-sm text-muted-foreground mb-4">Ошибка: {error.message}</p>}
				<Button asChild size="lg">
					<Link href="/cars">Посмотреть другие машины BazCar</Link>
				</Button>
			</div>
		)
	}

	return (
		<div className="py-16 bg-background">
			<div className="container">
				<motion.div className="mb-8" variants={itemVariants(0)}>
					<Link
						href="/cars"
						className="text-sm text-primary hover:underline flex items-center"
					>
						<ArrowLeft className="h-4 w-4 mr-1.5" /> Назад к автопарку BazCar
					</Link>
				</motion.div>

				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
					<motion.div variants={itemVariants(1)}>
						<div className="flex items-center mb-2">
							<div className="flex items-center text-yellow-400">
								<Star className="h-5 w-5 fill-yellow-400 mr-1" />
								<span className="text-md font-semibold text-foreground">{car.rating || 0}/5</span>
							</div>
						</div>
						<h1 className="text-4xl md:text-5xl font-extrabold text-foreground">{car.name}</h1>
					</motion.div>

					<motion.div variants={itemVariants(2)} className="mt-4 md:mt-0 text-right">
						<div>
							<span className="text-2xl font-bold text-primary">{(car.price || 0).toLocaleString('ru-RU')} ₽</span>
							<span className="text-muted-foreground text-sm">/день (1-2 дня)</span>
						</div>
						{car.price_3plus_days && (
							<div className="mt-1">
								<span className="text-2xl font-bold text-green-500">{(car.price_3plus_days || 0).toLocaleString('ru-RU')} ₽</span>
								<span className="text-muted-foreground text-sm">/день (от 3 дней)</span>
								<Badge
									variant="outline"
									className="ml-2 text-xs px-2 py-0.5 shadow-sm bg-green-100 text-green-700 border-green-300"
								>
									<Tag className="h-3 w-3 mr-1" /> Выгодно
								</Badge>
							</div>
						)}
					</motion.div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
					<div className="lg:col-span-2">
						<motion.div variants={itemVariants(3)} className="mb-8">
							<ImageCarousel
								images={car.images || []}
								carName={car.name}
							/>
						</motion.div>

						<motion.div variants={itemVariants(4)} className="mb-10 p-6 bg-card rounded-lg shadow-lg border border-border/50">
							<h2 className="text-3xl font-bold text-foreground mb-4">Об этой машине BazCar</h2>
							{car.description ? (
								<p className="text-muted-foreground text-md leading-relaxed mb-6">
									{car.description}
								</p>
							) : (
								<p className="text-muted-foreground text-md leading-relaxed mb-6 italic">
									Описание отсутствует
								</p>
							)}

							{car.specifications && (
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
									{[
										car.specifications.engine && {
											icon: CarIcon,
											label: car.specifications.engine.split(' ')[0],
											sub: 'Двигатель',
										},
										car.specifications.seating && {
											icon: Users,
											label: car.specifications.seating.split(' ')[0],
											sub: 'Мест',
										},
										car.specifications.topSpeed && {
											icon: Gauge,
											label: car.specifications.topSpeed.split(' ')[0],
											sub: 'Макс. скорость',
										},
										car.specifications.acceleration && {
											icon: Zap,
											label: car.specifications.acceleration.split(' ')[0],
											sub: '0-100км/ч',
										},
									].filter(Boolean).map((item, idx) => (
										<motion.div
											key={idx}
											className="bg-secondary p-4 rounded-md hover:bg-primary/10 transition-colors"
											whileHover={{ scale: 1.05 }}
										>
											{item && (
												<>
													<item.icon className="h-7 w-7 mx-auto mb-1.5 text-primary" />
													<span className="block text-lg font-semibold text-foreground">{item.label}</span>
													<span className="text-xs text-muted-foreground">{item.sub}</span>
												</>
											)}
										</motion.div>
									))}
								</div>
							)}
						</motion.div>

						{car.features && car.features.length > 0 ? (
							<motion.div variants={itemVariants(5)} className="mb-10 p-6 bg-card rounded-lg shadow-lg border border-border/50">
								<h2 className="text-3xl font-bold text-foreground mb-5">Ключевые особенности</h2>
								<ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
									{car.features.map((feature, index) => (
										<li key={index} className="flex items-center text-md text-muted-foreground">
											<CheckCircle className="h-5 w-5 text-primary mr-2.5 flex-shrink-0" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
							</motion.div>
						) : null}

						{car.specifications && Object.keys(car.specifications).length > 0 ? (
							<motion.div variants={itemVariants(6)} className="p-6 bg-card rounded-lg shadow-lg border border-border/50 mb-10">
								<h2 className="text-3xl font-bold text-foreground mb-5">Характеристики</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
									{[
										car.specifications.engine && {
											icon: CarIcon,
											label: 'Двигатель',
											value: car.specifications.engine,
										},
										car.specifications.power && {
											icon: Zap,
											label: 'Мощность',
											value: car.specifications.power,
										},
										car.specifications.acceleration && {
											icon: Gauge,
											label: 'Разгон',
											value: car.specifications.acceleration,
										},
										car.specifications.topSpeed && {
											icon: Gauge,
											label: 'Макс. скорость',
											value: car.specifications.topSpeed,
										},
										car.specifications.seating && {
											icon: Users,
											label: 'Количество мест',
											value: car.specifications.seating,
										},
										car.specifications.cargo && {
											icon: Package,
											label: 'Объем багажника',
											value: car.specifications.cargo,
										},
										car.specifications.fuelEconomy && {
											icon: Fuel,
											label: 'Расход топлива',
											value: car.specifications.fuelEconomy,
										},
										car.specifications.range && {
											icon: CalendarDays,
											label: 'Запас хода',
											value: car.specifications.range,
										},
									].filter(Boolean).map((spec, index) => (
										<div key={index} className="spec-item flex items-center">
											{spec && (
												<>
													<spec.icon className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
													<div>
														<p className="text-sm text-muted-foreground">{spec.label}</p>
														<p className="font-semibold text-foreground text-md">{spec.value}</p>
													</div>
												</>
											)}
										</div>
									))}
								</div>
							</motion.div>
						) : null}

						{car.restrictions && (
							<motion.div variants={itemVariants(6.2)} className="p-6 bg-card rounded-lg shadow-lg border border-border/50 mb-10">
								<h2 className="text-3xl font-bold text-foreground mb-5">Условия аренды</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
											{[
												{
													icon: UserCheck,
													label: 'Возраст',
													value: car.restrictions?.age || '21+',
												},
												{
													icon: UserCheck,
													label: 'Стаж вождения',
													value: car.restrictions?.experience || '2 года',
												},
												{
													icon: CreditCard,
													label: 'Залог',
													value: car.restrictions?.deposit || '50,000 ₽',
												},
												{
													icon: Mountain,
													label: 'Поездки в горы',
													value: car.restrictions?.mountainDriving || 'Разрешено',
												},
											].map((restriction, index) => (
												<div key={index} className="spec-item flex items-center">
													<restriction.icon className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
													<div>
														<p className="text-sm text-muted-foreground">{restriction.label}</p>
														<p className="font-semibold text-foreground text-md">
															{restriction.value}
														</p>
													</div>
												</div>
											))}
										</div>
							</motion.div>
						)}

						<motion.div variants={itemVariants(6.5)}>
							<AdditionalServicesSection onCarDetailPage={true} />
						</motion.div>
					</div>

					<motion.div id="booking-form-section" className="lg:col-span-1 sticky top-24" variants={itemVariants(7)}>
						<BookingForm
							car={car}
							price={car.price || 0}
							price3PlusDays={car.price_3plus_days || 0}
						/>
					</motion.div>
				</div>
			</div>
		</div>
	)
}

