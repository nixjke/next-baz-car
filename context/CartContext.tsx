'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { type Car } from '@/data/mockCars'
import { serviceFees, additionalServicesConfig, deliveryOptionsData } from '@/config/bookingOptions'

export type DeliveryOption = {
	id: string
	label: string
	price: number
}

export type CartItem = {
	id: string
	car: Car
	pickupDate: string // YYYY-MM-DD
	returnDate: string // YYYY-MM-DD
	deliveryOption: DeliveryOption
	youngDriver: boolean
	childSeat: boolean
	personalDriver: boolean
	ps5: boolean
	transmission: boolean
	name: string
	phone: string
	email?: string
	rentalDays: number
	dailyPrice: number
	totalPrice: number
}

type CartContextType = {
	cartItems: CartItem[]
	addToCart: (item: Omit<CartItem, 'id' | 'totalPrice' | 'rentalDays' | 'dailyPrice'>) => void
	removeFromCart: (itemId: string) => void
	updateCartItem: (itemId: string, updates: Partial<CartItem>) => void
	clearCart: () => void
	getCartTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'bazcar_cart'

// Функция расчёта цены позиции (как в baz-car)
const calculateItemPrice = (item: Omit<CartItem, 'id' | 'totalPrice' | 'rentalDays' | 'dailyPrice'>): {
	totalPrice: number
	rentalDays: number
	dailyPrice: number
} => {
	if (!item.car || typeof item.car.price === 'undefined') {
		return { totalPrice: 0, rentalDays: 0, dailyPrice: 0 }
	}

	let rentalDays = 0
	let currentDailyPrice = item.car.price

	if (item.pickupDate && item.returnDate) {
		const pickup = new Date(item.pickupDate)
		const ret = new Date(item.returnDate)
		if (ret > pickup) {
			const diffTime = Math.abs(ret.getTime() - pickup.getTime())
			rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
			if (rentalDays === 0 && diffTime > 0) rentalDays = 1

			if (rentalDays >= 3 && item.car.price_3plus_days) {
				currentDailyPrice = item.car.price_3plus_days
			} else if (rentalDays > 0) {
				currentDailyPrice = item.car.price
			}
		}
	}

	const rentalCost = currentDailyPrice * rentalDays
	const deliveryCost = item.deliveryOption?.price || 0

	let additionalServicesCost = 0

	// Молодой водитель
	if (item.youngDriver && serviceFees.youngDriver) {
		additionalServicesCost += serviceFees.youngDriver
	}

	// Остальные услуги
	additionalServicesConfig.forEach(service => {
		// PS5 только для Li L7 (car.id === 3)
		if (service.id === 'ps5' && item.car.id !== 3) {
			return
		}

		if (item[service.id as keyof typeof item]) {
			const serviceCost = service.feeType === 'daily' ? service.fee * rentalDays : service.fee
			additionalServicesCost += serviceCost
		}
	})

	const totalPrice = rentalCost + deliveryCost + additionalServicesCost

	return {
		totalPrice,
		rentalDays,
		dailyPrice: currentDailyPrice,
	}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const { toast } = useToast()
	const [mounted, setMounted] = useState(false)

	// Загрузка из localStorage при монтировании
	useEffect(() => {
		setMounted(true)
		if (typeof window !== 'undefined') {
			try {
				const stored = localStorage.getItem(STORAGE_KEY)
				if (stored) {
					const parsed = JSON.parse(stored)
					setCartItems(parsed)
				}
			} catch (error) {
				// Ошибка загрузки корзины из localStorage
			}
		}
	}, [])

	// Сохранение в localStorage при изменении
	useEffect(() => {
		if (!mounted || typeof window === 'undefined') return
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
		} catch (error) {
			// Ошибка сохранения корзины в localStorage
		}
	}, [cartItems, mounted])

	const addToCart = useCallback((item: Omit<CartItem, 'id' | 'totalPrice' | 'rentalDays' | 'dailyPrice'>) => {
		// Валидация
		if (!item.name || !item.phone || !item.pickupDate || !item.returnDate) {
			setTimeout(() => {
				toast({
					title: 'Неполные данные',
					description: 'Пожалуйста, укажите имя, телефон и даты аренды.',
					variant: 'destructive',
				})
			}, 0)
			return
		}

		setCartItems(prevItems => {
			// Проверка на дубликаты
			const existingItemIndex = prevItems.findIndex(
				i =>
					i.car.id === item.car.id &&
					i.pickupDate === item.pickupDate &&
					i.returnDate === item.returnDate &&
					i.deliveryOption.id === item.deliveryOption.id &&
					i.youngDriver === item.youngDriver &&
					i.childSeat === item.childSeat &&
					i.personalDriver === item.personalDriver &&
					i.ps5 === item.ps5 &&
					i.transmission === item.transmission
			)

			if (existingItemIndex > -1) {
				setTimeout(() => {
					toast({
						title: 'Уже в корзине',
						description: 'Эта конфигурация автомобиля уже добавлена. Вы можете изменить её на странице корзины.',
					})
				}, 0)
				return prevItems
			}

			const { totalPrice, rentalDays, dailyPrice } = calculateItemPrice(item)

			const newItem: CartItem = {
				...item,
				id: Date.now().toString(),
				totalPrice,
				rentalDays,
				dailyPrice,
			}

			setTimeout(() => {
				toast({
					title: 'Добавлено в корзину!',
					description: `${item.car.name} добавлен в вашу корзину.`,
				})
			}, 0)

			return [...prevItems, newItem]
		})
	}, [toast])

	const removeFromCart = useCallback((itemId: string) => {
		setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
		setTimeout(() => {
			toast({
				title: 'Удалено из корзины',
				description: 'Товар удалён из вашей корзины.',
			})
		}, 0)
	}, [toast])

	const updateCartItem = useCallback((itemId: string, updates: Partial<CartItem>) => {
		setCartItems(prevItems =>
			prevItems.map(item => {
				if (item.id === itemId) {
					const updatedItem = { ...item, ...updates }
					// Пересчитываем цену при обновлении
					const { totalPrice, rentalDays, dailyPrice } = calculateItemPrice(updatedItem)
					return { ...updatedItem, totalPrice, rentalDays, dailyPrice }
				}
				return item
			})
		)
		setTimeout(() => {
			toast({
				title: 'Корзина обновлена',
				description: 'Информация о товаре в корзине обновлена.',
			})
		}, 0)
	}, [toast])

	const clearCart = useCallback(() => {
		setCartItems([])
		setTimeout(() => {
			toast({
				title: 'Корзина очищена',
				description: 'Все товары удалены из вашей корзины.',
			})
		}, 0)
	}, [toast])

	const getCartTotal = useCallback(() => {
		return cartItems.reduce((total, item) => total + item.totalPrice, 0)
	}, [cartItems])

	const value: CartContextType = {
		cartItems,
		addToCart,
		removeFromCart,
		updateCartItem,
		clearCart,
		getCartTotal,
	}

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}

