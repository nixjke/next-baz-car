'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// bookingOptions удален - данные будут загружаться из API
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	CalendarIcon,
	AlertTriangle,
	Truck,
	Users2,
	CreditCard,
	Tag,
	ShoppingCart,
	Baby,
	UserCheck,
	User,
	Fuel,
	Gamepad2,
	Settings,
	LucideIcon,
	Loader2,
} from 'lucide-react'
import { getCarServices, type AdditionalService } from '@/services/carService'
import { useCart } from '@/context/CartContext'
import { deliveryOptionsData } from '@/config/bookingOptions'
import { useRouter } from 'next/navigation'
import { type Car } from '@/data/mockCars'

type IconKey =
	| 'CalendarIcon'
	| 'AlertTriangle'
	| 'Truck'
	| 'Users2'
	| 'CreditCard'
	| 'Tag'
	| 'ShoppingCart'
	| 'Baby'
	| 'UserCheck'
	| 'User'
	| 'Fuel'
	| 'Gamepad2'
	| 'Settings'

const iconsMap: Record<IconKey, LucideIcon> = {
	CalendarIcon,
	AlertTriangle,
	Truck,
	Users2,
	CreditCard,
	Tag,
	ShoppingCart,
	Baby,
	UserCheck,
	User,
	Fuel,
	Gamepad2,
	Settings,
}

// Маппинг ID услуги -> компонент иконки (как в AdditionalServicesSection)
const iconsMapById: Record<number, LucideIcon> = {
	1: User,        // Молодой водитель
	2: Baby,        // Детское кресло
	3: UserCheck,   // Личный водитель
	4: Gamepad2,    // PlayStation 5
	5: Settings,    // Передача руля
}

type FormData = {
	dateRange: {
		from: Date | undefined
		to: Date | undefined
	}
	name: string
	email: string
	phone: string
	deliveryOption: string
	youngDriver: boolean
	childSeat: boolean
	personalDriver: boolean
	ps5: boolean
	transmission: boolean
	[key: string]: any
}

const initialFormData: FormData = {
	dateRange: {
		from: undefined,
		to: undefined,
	},
	name: '',
	email: '',
	phone: '',
	deliveryOption: 'pickup',
	youngDriver: false,
	childSeat: false,
	personalDriver: false,
	ps5: false,
	transmission: false,
}

type FormInputGroupProps = {
	id: string
	name: string
	label: string
	type: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	required?: boolean
	min?: string
	placeholder?: string
	icon?: IconKey
}

const FormInputGroup = ({
	id,
	name,
	label,
	type,
	value,
	onChange,
	required,
	min,
	placeholder,
	icon: IconKey,
}: FormInputGroupProps) => {
	const IconComponent = IconKey ? iconsMap[IconKey] : undefined
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center text-sm font-medium text-foreground">
        {IconComponent && <IconComponent className="h-4 w-4 mr-2 text-primary" />}
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        placeholder={placeholder}
        className="border-border/70 focus:border-primary focus:ring-primary/50"
      />
    </div>
  );
};

type DeliveryOption = {
	id: string
	label: string
	price: number
	iconKey: IconKey
}

type DeliveryOptionsGroupProps = {
	value: string
	onChange: (value: string) => void
	options: DeliveryOption[]
}

const DeliveryOptionsGroup = ({
	value,
	onChange,
	options,
}: DeliveryOptionsGroupProps) => (
  <div className="space-y-3 pt-4 mt-4 border-t border-border/50">
    <Label className="flex items-center text-sm font-medium text-foreground mb-1">
      <Truck className="h-4 w-4 mr-2 text-primary" /> Опции доставки
    </Label>
    <RadioGroup
      name="deliveryOption"
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-1 sm:grid-cols-3 gap-2"
    >
		{options.map((option: DeliveryOption) => {
			const IconComponent = iconsMap[option.iconKey]
        return (
          <Label
            key={option.id}
            htmlFor={`delivery-${option.id}`}
            className={`flex flex-col items-center justify-center rounded-md border-2 p-3 hover:border-primary cursor-pointer transition-all ${value === option.id ? "border-primary bg-primary/5 shadow-md" : "border-border/50"}`}
          >
            <RadioGroupItem value={option.id} id={`delivery-${option.id}`} className="sr-only" />
            {IconComponent && <IconComponent className={`h-5 w-5 mb-1.5 ${value === option.id ? "text-primary" : "text-muted-foreground"}`} />}
            <span className="text-xs font-medium">{option.label}</span>
            <span className={`text-xxs ${value === option.id ? "text-primary" : "text-muted-foreground"}`}>
              {option.price > 0 ? `+${option.price.toLocaleString('ru-RU')} ₽` : "Бесплатно"}
            </span>
          </Label>
        );
      })}
    </RadioGroup>
  </div>
);

type AdditionalServiceCheckboxProps = {
	id: string
	checked: boolean
	onCheckedChange: (checked: boolean) => void
	label: string
	fee: number
	feeType?: string
	icon: IconKey
	carId: number
}

const AdditionalServiceCheckbox = ({
	id,
	checked,
	onCheckedChange,
	label,
	fee,
	feeType = 'fixed',
	icon: IconKey,
	carId,
}: AdditionalServiceCheckboxProps) => {
	if (id === 'ps5' && carId !== 3) {
		return null
	}
	const IconComponent = iconsMap[IconKey]

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        name={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center">
        {IconComponent && <IconComponent className="h-4 w-4 mr-1.5 text-primary/80" />}
        {label}
        <span className="text-primary font-semibold ml-1">
          (+{fee.toLocaleString('ru-RU')} ₽{feeType === "daily" ? "/день" : ""})
        </span>
      </Label>
    </div>
  );
};

type PriceDetailsProps = {
	rentalDays: number
	dailyPrice: number
	deliveryOptionId: string
	additionalServicesSelected: Record<string, boolean>
	services: AdditionalService[]
}

const PriceDetails = ({
	rentalDays,
	dailyPrice,
	deliveryOptionId,
	additionalServicesSelected,
	services,
}: PriceDetailsProps) => {
	const deliveryCost = 0 // Будет загружаться из API
	const rentalCost = dailyPrice * rentalDays

	let additionalServicesCostTotal = 0
	// Подсчитываем стоимость выбранных дополнительных услуг
	services.forEach((service) => {
		if (additionalServicesSelected[service.service_id]) {
			if (service.fee_type === 'daily') {
				additionalServicesCostTotal += service.fee * rentalDays
			} else {
				additionalServicesCostTotal += service.fee
			}
		}
	})

	const totalAmount = rentalCost + deliveryCost + additionalServicesCostTotal

  return (
    <>
      <div className="space-y-1 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Аренда ({rentalDays} дн. x {dailyPrice.toLocaleString('ru-RU')} ₽):</span>
          <span className="font-semibold text-foreground">{rentalCost.toLocaleString('ru-RU')} ₽</span>
        </div>
        {rentalDays >= 3 && (
          <div className="flex justify-start items-center text-xs text-green-600">
            <Tag className="h-3 w-3 mr-1"/><span>Применена скидка за аренду от 3-х дней</span>
          </div>
        )}
        {deliveryCost > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Доставка:</span>
            <span className="text-foreground">+{deliveryCost.toLocaleString('ru-RU')} ₽</span>
          </div>
        )}
        {services.map((service) => {
          if (additionalServicesSelected[service.service_id]) {
            const serviceCost = service.fee_type === 'daily' ? service.fee * rentalDays : service.fee
            return (
              <div key={service.id} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{service.label}:</span>
                <span className="text-foreground">+{serviceCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            )
          }
          return null
        })}
      </div>

      {totalAmount > 0 && (
        <div className="flex justify-between items-center mb-4 border-t border-dashed border-border/50 pt-3">
          <span className="text-md font-medium text-foreground flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />Итого за позицию:
          </span>
          <span className="text-xl font-bold text-primary">{totalAmount.toLocaleString('ru-RU')} ₽</span>
        </div>
      )}
    </>
  );
};

type BookingFormProps = {
	car: Car
	price: number
	price3PlusDays?: number
}

const BookingForm = ({
	car,
	price,
	price3PlusDays,
}: BookingFormProps) => {
	const { toast } = useToast()
	const { addToCart } = useCart()
	const router = useRouter()
	const [formData, setFormData] = useState<FormData>(initialFormData)
	const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([])
	const [loadingServices, setLoadingServices] = useState(true)

	// Загружаем дополнительные услуги для машины
	useEffect(() => {
		const fetchServices = async () => {
			try {
				setLoadingServices(true)
				const services = await getCarServices(car.id)
				// Фильтруем услуги: показываем только те, которые указаны в car.additional_services
				const carServiceIds = car.additional_services || []
				const filteredServices = services.filter(service => 
					carServiceIds.includes(service.id)
				)
				setAdditionalServices(filteredServices)
			} catch (error) {
				setAdditionalServices([])
			} finally {
				setLoadingServices(false)
			}
		}

		fetchServices()
	}, [car.id, car.additional_services])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

	const handleDeliveryChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryOption: value }));
  };

	const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

	// Обработчик изменения диапазона дат (логика бронирования удалена)
	const handleDateRangeChange = (
		range: { from: Date | undefined; to?: Date | undefined } | undefined
	) => {
		if (!range?.from) {
			setFormData((prev) => ({
				...prev,
				dateRange: { from: undefined, to: undefined },
			}))
			return
		}

		// Если выбрана только начальная дата
		if (range.from && !range.to) {
			setFormData((prev) => ({
				...prev,
				dateRange: { from: range.from, to: undefined },
			}))
			return
		}

		// Если выбраны обе даты, сохраняем диапазон
		if (range.from && range.to) {
			setFormData((prev) => ({
				...prev,
				dateRange: { from: range.from, to: range.to },
			}))
		}
	}

  const calculateCurrentItemTotal = useCallback(() => {
    let total = 0;
    let rentalDays = 0;
    let currentDailyPrice = price;

		if (formData.dateRange.from && formData.dateRange.to) {
			const diffTime = Math.abs(
				formData.dateRange.to.getTime() - formData.dateRange.from.getTime()
			)
			rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (rentalDays === 0 && diffTime > 0) rentalDays = 1;

      if (rentalDays >= 3 && price3PlusDays) {
        currentDailyPrice = price3PlusDays;
      } else if (rentalDays > 0) {
        currentDailyPrice = price;
      }
    }

    // Подсчитываем стоимость выбранных дополнительных услуг
    additionalServices.forEach((service) => {
      if ((formData as any)[service.service_id]) {
        if (service.fee_type === 'daily') {
          total += service.fee * rentalDays
        } else {
          total += service.fee
        }
      }
    })

    // Доставка будет загружаться из API (пока 0)
    const deliveryCost = 0
    const rentalCost = currentDailyPrice * rentalDays
    total = rentalCost + deliveryCost + total

    return { totalAmount: total, days: rentalDays, dailyPrice: currentDailyPrice };
  }, [formData, price, price3PlusDays, additionalServices]);

  const { totalAmount: currentItemTotal, days: rentalDays, dailyPrice } = useMemo(() => calculateCurrentItemTotal(), [calculateCurrentItemTotal]);


  const validateForm = useCallback(() => {
    if (!formData.dateRange.from || !formData.dateRange.to || !formData.name || !formData.phone) {
		toast({
			title: 'Ошибка валидации',
			description:
				'Пожалуйста, заполните все обязательные поля (Даты, Имя, Телефон).',
			variant: 'destructive',
		})
      return false;
    }

    if (formData.dateRange.to <= formData.dateRange.from) {
		toast({
			title: 'Ошибка в датах',
			description: 'Дата возврата должна быть позже даты получения.',
			variant: 'destructive',
		})
      return false;
    }
    return true;
  }, [formData.dateRange, formData.name, formData.phone, toast]);

	const handleAddToCart = (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		const selectedDeliveryOption = deliveryOptionsData.find(
			opt => opt.id === formData.deliveryOption
		) || deliveryOptionsData[0]

		// Преобразуем service_id в boolean поля
		// Используем динамические поля из formData, так как service_id могут быть разными
		const cartItem = {
			car: car,
			pickupDate: formData.dateRange.from!.toISOString().split('T')[0],
			returnDate: formData.dateRange.to!.toISOString().split('T')[0],
			name: formData.name,
			email: formData.email || undefined,
			phone: formData.phone,
			deliveryOption: {
				id: selectedDeliveryOption.id,
				label: selectedDeliveryOption.label,
				price: selectedDeliveryOption.price,
			},
			// Используем значения из formData, которые могут быть установлены через service_id
			youngDriver: formData.youngDriver || (formData as any)['youngDriver'] || false,
			childSeat: formData.childSeat || (formData as any)['childSeat'] || false,
			personalDriver: formData.personalDriver || (formData as any)['personalDriver'] || false,
			ps5: formData.ps5 || (formData as any)['ps5'] || false,
			transmission: formData.transmission || (formData as any)['transmission'] || false,
		}

		addToCart(cartItem)
		
		// Сбрасываем форму
		setFormData(initialFormData)
		
		// Опционально: перенаправляем в корзину
		// router.push('/cart')
	}

	return (
		<motion.div 
			className="booking-form p-6 lg:p-8 shadow-xl rounded-lg bg-card border border-border/30"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" as const }}
		>
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center md:text-left">Оформить аренду</h3>

	<form className="space-y-5" onSubmit={handleAddToCart}>
        <div className="space-y-1.5">
          <Label className="flex items-center text-sm font-medium text-foreground">
            <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
            Период аренды<span className="text-destructive ml-0.5">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!formData.dateRange.from && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateRange.from ? (
                  formData.dateRange.to ? (
                    <>
                      {format(formData.dateRange.from, "d MMMM yyyy", { locale: ru })} -{" "}
                      {format(formData.dateRange.to, "d MMMM yyyy", { locale: ru })}
                    </>
                  ) : (
                    format(formData.dateRange.from, "d MMMM yyyy", { locale: ru })
                  )
                ) : (
                  <span>Выберите даты</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={formData.dateRange.from}
                selected={formData.dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={1}
                locale={ru}
              />
            </PopoverContent>
          </Popover>
        </div>

		<FormInputGroup
			id="name"
			name="name"
			label="Полное имя"
			type="text"
			placeholder="Иванов Иван Иванович"
			value={formData.name}
			onChange={handleChange}
			required
			icon="User"
		/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
		<FormInputGroup
			id="phone"
			name="phone"
			label="Номер телефона"
			type="tel"
			placeholder="+7 (999) 000-00-00"
			value={formData.phone}
			onChange={handleChange}
			required
		/>
		<FormInputGroup
			id="email"
			name="email"
			label="Email адрес"
			type="email"
			placeholder="example@mail.ru"
			value={formData.email}
			onChange={handleChange}
		/>
        </div>

		{/* Опции доставки будут загружаться из API */}
		<DeliveryOptionsGroup
			value={formData.deliveryOption}
			onChange={handleDeliveryChange}
			options={[]}
		/>

        <div className="space-y-3 pt-4 mt-4 border-t border-border/50">
          <Label className="flex items-center text-sm font-medium text-foreground mb-1">
            Дополнительные опции
          </Label>
          {loadingServices ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : additionalServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Дополнительные услуги не доступны</p>
          ) : (
            additionalServices.map((service) => {
              // Используем ID услуги для маппинга иконки
              const IconComponent = iconsMapById[service.id] || Settings
              // Маппинг компонента иконки на имя для передачи в AdditionalServiceCheckbox
              const iconNameMap: Record<number, IconKey> = {
                1: 'User',
                2: 'Baby',
                3: 'UserCheck',
                4: 'Gamepad2',
                5: 'Settings',
              }
              const iconName = iconNameMap[service.id] || 'Settings'
              return (
                <AdditionalServiceCheckbox
                  key={service.id}
                  id={service.service_id}
                  checked={(formData as any)[service.service_id] || false}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange(service.service_id, checked)
                  }
                  label={service.label}
                  fee={service.fee}
                  feeType={service.fee_type}
                  icon={iconName}
                  carId={car.id}
                />
              )
            })
          )}
        </div>

        <div className="pt-5 border-t border-border/50">
          {rentalDays > 0 && (
            <PriceDetails
              rentalDays={rentalDays}
              dailyPrice={dailyPrice}
              deliveryOptionId={formData.deliveryOption}
              additionalServicesSelected={formData}
              services={additionalServices}
            />
          )}

          <Button type="submit" className="w-full text-base py-3 shadow-lg bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <ShoppingCart className="h-5 w-5 mr-2" /> Добавить в корзину
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Вы сможете просмотреть и оформить все выбранные авто из корзины.
          </p>
        </div>
		</form>
		</motion.div>
	)
}

export default BookingForm;
