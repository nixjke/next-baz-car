'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { getUnavailableDates } from '@/services/availabilityService'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Car,
	Star,
	Users,
	Zap,
	Fuel,
	Send,
	Baby,
	UserCheck,
	Gamepad2,
	ShoppingCart,
} from 'lucide-react'
import { USE_CART } from '@/config/featureFlags'
import { API_CONFIG } from "@/utils/constants";
import { generateCarSlug } from "@/utils/carSlug";
import {
	getCarTagBadgeStyle,
	normalizeCarTagColor,
	type CarTagColorKey,
} from '@/lib/carTagPalette'

type Car = {
	id: number
	name: string
	description?: string
	price: number
	old_price?: number
	is_popular?: boolean
	card_tag?: string
	card_tag_color?: CarTagColorKey
	rating?: number
	fuel_type?: string
	fuelType?: string
	images?: string[]
	specifications?: {
		seating?: string
		power?: string
		engine?: string
	}
	[key: string]: any
}

// Функция для получения правильного URL изображения
const getImageUrl = (imagePath: string | undefined): string => {
	if (!imagePath) return '/placeholder-car.jpg'
	
	// Если уже полный URL (http:// или https://), используем как есть
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath
	}
	
	// Если путь начинается с /uploads, это путь к изображению на бэкенде
	// carService.ts уже должен был преобразовать его в полный URL
	// Но на всякий случай проверяем и добавляем базовый URL бэкенда
	if (imagePath.startsWith('/uploads')) {
		const baseUrl = API_CONFIG.BASE_URL.replace('/api/v1', '')
		return `${baseUrl}${imagePath}`
	}
	
	// Для локальных путей (начинающихся с /) используем как есть
	if (imagePath.startsWith('/')) {
		return imagePath
	}
	
	// Для относительных путей добавляем /
	return `/${imagePath}`
}

// Функция для перевода типа топлива на русский
const getFuelTypeLabel = (fuelType: string | undefined): string => {
	if (!fuelType) return 'Бензин'
	
	const fuelTypeMap: Record<string, string> = {
		'petrol': 'Бензин',
		'gasoline': 'Бензин',
		'diesel': 'Дизель',
		'electric': 'Электрический',
		'hybrid': 'Гибрид',
		'plug-in-hybrid': 'Плагин-гибрид',
		'cng': 'КПГ',
		'lpg': 'СУГ',
		'бензин': 'Бензин',
		'дизель': 'Дизель',
		'электрический': 'Электрический',
		'гибрид': 'Гибрид',
	}
	
	const normalized = fuelType.toLowerCase().trim()
	return fuelTypeMap[normalized] || fuelType
}

const iconsMap = { Baby, UserCheck, Fuel, User: Users, Gamepad2: Gamepad2 }

const getImageToneBackground = (img: HTMLImageElement): { base: string; accent: string } | null => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    const size = 24
    canvas.width = size
    canvas.height = size
    ctx.drawImage(img, 0, 0, size, size)

    const { data } = ctx.getImageData(0, 0, size, size)
    let r = 0
    let g = 0
    let b = 0
    let count = 0

    for (let i = 0; i < data.length; i += 16) {
      const pr = data[i]
      const pg = data[i + 1]
      const pb = data[i + 2]
      const luminance = (pr * 299 + pg * 587 + pb * 114) / 1000

      // Skip extremes to avoid tinting from pure black/white areas.
      if (luminance < 18 || luminance > 238) continue

      r += pr
      g += pg
      b += pb
      count++
    }

    if (!count) return null

    const avgR = Math.round(r / count)
    const avgG = Math.round(g / count)
    const avgB = Math.round(b / count)

    return {
      base: `rgba(${avgR}, ${avgG}, ${avgB}, 0.24)`,
      accent: `rgba(${avgR}, ${avgG}, ${avgB}, 0.14)`,
    }
  } catch {
    return null
  }
}

const CarCardImage = ({ car }: { car: Car }) => {
  const resolvedTagColor = normalizeCarTagColor(car.card_tag_color)
  const resolvedTagStyle = getCarTagBadgeStyle(resolvedTagColor)
  const imageSrc = getImageUrl(car?.images?.[0])
  const [imageToneBackground, setImageToneBackground] = useState<{ base: string; accent: string } | null>(null)
  const topTagText =
    typeof car.card_tag === 'string' && car.card_tag.trim()
      ? car.card_tag.trim()
      : car.is_popular
        ? 'Популярный'
        : ''
  const hasTopTag = Boolean(topTagText)

  useEffect(() => {
    setImageToneBackground(null)
  }, [imageSrc])

  const containerBackgroundStyle = imageToneBackground
    ? {
        backgroundImage: `radial-gradient(circle at 18% 18%, ${imageToneBackground.accent} 0%, transparent 58%), linear-gradient(180deg, ${imageToneBackground.base} 0%, rgba(15,23,42,0.74) 100%)`,
      }
    : undefined

  return (
  <div
    className="relative aspect-[5/4] md:aspect-[4/3] overflow-hidden group bg-gradient-to-b from-slate-900/80 to-slate-800/80"
    style={containerBackgroundStyle}
  >
    <img
      className="absolute inset-0 h-full w-full scale-[1.16] object-cover opacity-45 blur-2xl saturate-125"
      alt=""
      aria-hidden="true"
      src={imageSrc}
      crossOrigin="anonymous"
      onLoad={(event) => {
        const tone = getImageToneBackground(event.currentTarget)
        setImageToneBackground((prev) => prev ?? tone)
      }}
    />
    {imageToneBackground && (
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 28% 24%, ${imageToneBackground.accent} 0%, transparent 60%)`,
        }}
      />
    )}
    <div className="absolute inset-0 z-[2] bg-gradient-to-b from-slate-950/15 via-slate-900/10 to-slate-950/30" />
    <img
      className="relative z-10 w-full h-full object-contain object-center p-1 sm:p-2 transition-transform duration-500 ease-in-out group-hover:scale-[1.03] [mask-image:radial-gradient(ellipse_80%_84%_at_center,rgba(0,0,0,1)_60%,rgba(0,0,0,0.9)_74%,rgba(0,0,0,0.45)_88%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_80%_84%_at_center,rgba(0,0,0,1)_60%,rgba(0,0,0,0.9)_74%,rgba(0,0,0,0.45)_88%,transparent_100%)] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-size:100%_100%]"
      alt={`${car?.name || 'Автомобиль'} - автомобиль в аренду`}
      src={imageSrc}
    />
    <div className="absolute inset-0 z-[11] bg-gradient-to-t from-black/45 via-black/10 to-black/0 opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>
    {hasTopTag && (
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20" style={{ marginTop: '-8px', marginLeft: '-12px' }}>
        <Badge
          variant="outline"
          style={resolvedTagStyle}
          className="shadow-sm text-[14px] font-bold leading-none tracking-[0.002em] px-3 py-[5px] border rounded-[4px] backdrop-blur-lg backdrop-saturate-150 whitespace-nowrap ring-1 ring-white/25 transition-none"
        >
          {topTagText}
        </Badge>
      </div>
    )}
    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 flex space-x-2">
      <Badge 
        variant="outline"
        className="shadow-md bg-background/80 text-foreground text-xs px-2.5 py-1 border-primary/50"
      >
        <Fuel className="h-3 w-3 mr-1 text-primary" />{getFuelTypeLabel(car.fuel_type || car.fuelType)}
      </Badge>
    </div>
  </div>
  )
}

const CarCardHeaderContent = ({ car }: { car: Car }) => (
  <CardHeader className="p-4 sm:p-5">
    <div className="flex justify-between items-start mb-0.5">
      <CardTitle className="text-lg sm:text-xl font-bold text-foreground leading-tight truncate pr-2">{car.name}</CardTitle>
      <div className="flex items-center text-xs sm:text-sm shrink-0">
        <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-400 fill-yellow-400 mr-1" />
        <span className="font-semibold text-muted-foreground">{car.rating}</span>
      </div>
    </div>
  </CardHeader>
);

const CarCardSpecs = ({ car }: { car: Car }) => {
    // Безопасная обработка данных
    const specs = car?.specifications || {};
    const seating = specs.seating || "5";
    const power = specs.power || "200";
    const engine = specs.engine || "ДВС";

    return (
      <div className="grid grid-cols-3 gap-x-2 sm:gap-x-3 gap-y-2 text-xs text-muted-foreground mb-3 sm:mb-4">
        {[
          { icon: Users, value: seating.toString().split(' ')[0], unit: "Мест" },
          { icon: Zap, value: power.toString().split(' ')[0], unit: "л.с." },
          { icon: Car, value: engine.toString().split(' ')[0], unit: "Двиг." }
        ].map((spec, index) => (
          <div key={index} className="flex flex-col items-center p-1.5 sm:p-2 bg-secondary/70 rounded-md">
            <spec.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mb-0.5 text-primary" />
            <span className="font-medium text-xs sm:text-sm">{spec.value}</span>
            <span className="text-xxs sm:text-xs">{spec.unit}</span>
          </div>
        ))}
    </div>
  );
};

const CarCardMainContent = ({ car }: { car: Car }) => (
  <CardContent className="p-4 sm:p-5 pt-0 flex-grow">
    <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
      {car.description || 'Комфортный автомобиль для аренды'}
    </p>
    <CarCardSpecs car={car} />
  </CardContent>
);

const CarCardFooterActions = ({
	car,
	onQuickBook,
	onAddToCart,
	showAddToCart,
	unavailableDates = [],
	loadingDates = false,
}: {
	car: Car
	onQuickBook: (e: React.MouseEvent) => void
	onAddToCart: (e: React.MouseEvent) => void
	showAddToCart: boolean
	unavailableDates?: string[]
	loadingDates?: boolean
}) => {
  const displayPrice = car?.price || 0;
  const hasOldPrice = Boolean(car?.old_price && car.old_price > 0 && car.old_price !== displayPrice);
  return (
    <CardFooter className="p-3 sm:p-4 border-t border-border/50 flex flex-col items-stretch space-y-2 sm:space-y-3 bg-secondary/40">
      <div className="flex justify-between items-center gap-2 sm:gap-3">
        <div className="min-w-0 flex-shrink">
          <div className="flex items-end gap-1 sm:gap-2 leading-none">
            <span className="text-muted-foreground text-xxs sm:text-xs pb-0.5">От</span>
            <span className="text-lg sm:text-xl font-bold text-primary whitespace-nowrap">
              {displayPrice.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-muted-foreground text-xxs sm:text-xs pb-0.5 whitespace-nowrap">/день</span>
          </div>
          {hasOldPrice && (
            <div className="mt-1 text-[13px] sm:text-[20px] text-orange-400/90 line-through whitespace-nowrap">
              {car.old_price?.toLocaleString('ru-RU')} ₽
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {showAddToCart && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onAddToCart}
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary text-xs sm:text-sm"
              aria-label="Добавить в корзину"
            >
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> В корзину
            </Button>
          )}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onQuickBook}
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary h-8 w-8 sm:h-9 sm:w-9"
            aria-label="Забронировать сразу"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardFooter>
  );
};



const CarCard = ({ car }: { car: Car }) => {
	const router = useRouter()
	const carSlug = generateCarSlug(car)
	const [unavailableDates, setUnavailableDates] = useState<string[]>([])
	const [loadingDates, setLoadingDates] = useState(true)

	useEffect(() => {
		const monthStr = format(new Date(), 'yyyy-MM')
		getUnavailableDates(car.id, monthStr)
			.then((dates) => {
				setUnavailableDates(dates)
			})
			.catch(() => setUnavailableDates([]))
			.finally(() => setLoadingDates(false))
	}, [car.id])
  
	const handleQuickBook = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		router.push(`/cars/${carSlug}?action=book`)
	}

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		router.push(`/cars/${carSlug}?action=add-to-cart`)
	}

	const handleCardClick = (e: React.MouseEvent) => {
		if (
			(e.target as HTMLElement).closest('button') ||
			(e.target as HTMLElement).closest('a')
		)
			return
		router.push(`/cars/${carSlug}`)
	}

	const cardMotionVariants = {
		hover: { 
			scale: 1.02,
			boxShadow: "0 20px 30px -10px hsla(var(--primary), 0.2)",
			transition: { duration: 0.3, ease: "easeOut" as const }
		},
		tap: { scale: 0.98 }
	};

	return (
		<motion.div 
			className="h-full cursor-pointer" 
			onClick={handleCardClick}
			whileHover="hover"
			whileTap="tap"
			variants={cardMotionVariants}
		>
			<Card className="car-card overflow-hidden h-full flex flex-col bg-card border border-border/60 rounded-xl shadow-lg">
				<CarCardImage car={car} />
				<CarCardHeaderContent car={car} />
				<CarCardMainContent car={car} />
				<CarCardFooterActions 
					car={car} 
					onQuickBook={handleQuickBook} 
					onAddToCart={handleAddToCart} 
					showAddToCart={USE_CART}
					unavailableDates={unavailableDates}
					loadingDates={loadingDates}
				/>
			</Card>
		</motion.div>
	)
}

export { CarCard };