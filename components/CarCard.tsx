'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Car,
	Star,
	Users,
	Zap,
	Fuel,
	Send,
	Baby,
	UserCheck,
	CreditCard,
	Tag,
	Gamepad2,
	ShoppingCart,
} from 'lucide-react'
import { USE_CART } from '@/config/featureFlags'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_CONFIG } from "@/utils/constants";
import { generateCarSlug } from "@/utils/carSlug";

type Car = {
	id: number
	name: string
	description?: string
	price: number
	price_3plus_days?: number
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

const CarCardImage = ({ car }: { car: Car }) => (
  <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden group">
    <img    
      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
      alt={`${car?.name || 'Автомобиль'} - автомобиль в аренду`}
     src={getImageUrl(car?.images?.[0])} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex space-x-2">
      <Badge 
        variant="outline"
        className="shadow-md bg-background/80 text-foreground text-xs px-2.5 py-1 border-primary/50"
      >
        <Fuel className="h-3 w-3 mr-1 text-primary" />{getFuelTypeLabel(car.fuel_type || car.fuelType)}
      </Badge>
    </div>
  </div>
);

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
}: {
	car: Car
	onQuickBook: (e: React.MouseEvent) => void
	onAddToCart: (e: React.MouseEvent) => void
	showAddToCart: boolean
}) => {
  const displayPrice = car?.price || car?.price_3plus_days || 0;
  return (
    <CardFooter className="p-3 sm:p-4 border-t border-border/50 flex flex-col items-stretch space-y-2 sm:space-y-3 bg-secondary/40">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-muted-foreground text-xxs sm:text-xs">От </span>
          <span className="text-lg sm:text-2xl font-bold text-primary">{displayPrice.toLocaleString('ru-RU')} ₽</span>
          <span className="text-muted-foreground text-xxs sm:text-xs">/день</span>
        </div>
        <div className="flex gap-2">
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
				<CarCardFooterActions car={car} onQuickBook={handleQuickBook} onAddToCart={handleAddToCart} showAddToCart={USE_CART} />
			</Card>
		</motion.div>
	)
}

export { CarCard };