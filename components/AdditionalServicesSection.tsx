'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Baby, UserCheck, Gamepad2, Settings, User, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { getCarServices, getAllAdditionalServices, type AdditionalService } from '@/services/carService'
import { parseCarIdFromSlug } from '@/utils/carSlug'

// Маппинг ID услуги -> компонент иконки
const iconsMapById: Record<number, React.ComponentType<{ className?: string }>> = {
	1: User,        // Молодой водитель
	2: Baby,        // Детское кресло
	3: UserCheck,   // Личный водитель
	4: Gamepad2,    // PlayStation 5
	5: Settings,    // Передача руля
};

// Маппинг ID услуги -> стили
const getServiceStylesById = (serviceId: number) => {
  switch (serviceId) {
    case 1: // youngDriver
      return { iconColor: 'text-blue-500', bgColor: 'bg-blue-500/5', borderColor: 'border-blue-500/30 hover:border-blue-500/50', titleColor: 'text-blue-600' };
    case 2: // childSeat
      return { iconColor: 'text-green-500', bgColor: 'bg-green-500/5', borderColor: 'border-green-500/30 hover:border-green-500/50', titleColor: 'text-green-600' };
    case 3: // personalDriver
      return { iconColor: 'text-purple-500', bgColor: 'bg-purple-500/5', borderColor: 'border-purple-500/30 hover:border-purple-500/50', titleColor: 'text-purple-600' };
    case 4: // ps5
      return { iconColor: 'text-red-500', bgColor: 'bg-red-500/5', borderColor: 'border-red-500/30 hover:border-red-500/50', titleColor: 'text-red-600' };
    case 5: // transmission
      return { iconColor: 'text-yellow-500', bgColor: 'bg-yellow-500/5', borderColor: 'border-yellow-500/30 hover:border-yellow-500/50', titleColor: 'text-yellow-600' };
    default:
      return { iconColor: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-border/50', titleColor: 'text-foreground' };
  }
};

const ServiceCard = ({ service }: { service: AdditionalService }) => {
	// Используем ID услуги для маппинга иконки
	const IconComponent = iconsMapById[service.id] || Settings
	const displayPrice =
		service.fee_type === 'daily'
			? `${service.fee.toLocaleString('ru-RU')} ₽/день`
			: `${service.fee.toLocaleString('ru-RU')} ₽`
	// Используем ID услуги для маппинга стилей
	const styles = getServiceStylesById(service.id)

	const cardVariants = {
		hidden: { opacity: 0, y: 30, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.5, ease: 'easeOut' as const },
		},
		hover: {
			scale: 1.03,
			boxShadow: "0 10px 20px -5px hsla(var(--primary), 0.15)",
		}
	};

	return (
		<motion.div variants={cardVariants} whileHover="hover">
			<Card
				className={`h-full overflow-hidden shadow-lg transition-all duration-300 ease-out border-2 ${styles.borderColor} ${styles.bgColor}`}
			>
				<CardHeader className={`p-5 flex flex-col items-center text-center`}>
					<div className={`p-2.5 rounded-full mb-2.5 ${styles.bgColor}`}>
						<IconComponent className={`h-8 w-8 ${styles.iconColor}`} />
					</div>
					<CardTitle className={`text-lg font-bold ${styles.titleColor}`}>
						{service.label}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-5 pt-0 text-center flex flex-col flex-grow justify-between">
					<p className="text-muted-foreground text-xs mb-3">
						{service.description || ''}
					</p>
					<p className={`text-xl font-bold ${styles.iconColor}`}>{displayPrice}</p>
				</CardContent>
			</Card>
		</motion.div>
	)
}

const AdditionalServicesSection = ({ onCarDetailPage = false }) => {
	const [services, setServices] = useState<AdditionalService[]>([])
	const [loading, setLoading] = useState(true)

	const params = useParams()
	const slug = params?.slug as string | undefined
	const carId = slug ? parseCarIdFromSlug(slug) : undefined

	useEffect(() => {
		const fetchServices = async () => {
			try {
				setLoading(true)
				if (onCarDetailPage && carId) {
					// Загружаем услуги для конкретной машины
					const carServices = await getCarServices(carId)
					setServices(carServices)
				} else {
					// Загружаем все активные услуги
					const allServices = await getAllAdditionalServices()
					setServices(allServices)
				}
			} catch (error) {
				console.error('Error fetching services:', error)
				setServices([])
			} finally {
				setLoading(false)
			}
		}

		fetchServices()
	}, [onCarDetailPage, carId])

	const gridClasses = onCarDetailPage
		? 'grid-cols-1 md:grid-cols-2 gap-6'
		: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8'

	const sectionVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1, delayChildren: 0.2 },
		},
	};

	return (
		<div className="container py-12 md:py-16">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.2 }}
				transition={{ duration: 0.6, ease: "easeOut" as const }}
				className="text-center mb-10 md:mb-12"
			>
				<h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
					Дополнительные Услуги
				</h2>
				<p className="text-md text-muted-foreground max-w-2xl mx-auto">
					Сделайте вашу поездку еще более комфортной с нашими опциями.
				</p>
			</motion.div>

			{loading ? (
				<div className="flex justify-center items-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : services.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground">Дополнительные услуги пока не доступны</p>
				</div>
			) : (
				<motion.div
					className={`grid ${gridClasses}`}
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
				>
					{services.map((service) => (
						<ServiceCard key={service.id} service={service} />
					))}
				</motion.div>
			)}
		</div>
	)
}

export default AdditionalServicesSection;
