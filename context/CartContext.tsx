'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { type Car } from '@/data/mockCars'

export type DeliveryOption = {
	id: string
	label: string
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
}

type CartContextType = {
	cartItems: CartItem[]
	addToCart: (item: Omit<CartItem, 'id'>) => void
	removeFromCart: (itemId: string) => void
	updateCartItem: (itemId: string, updates: Partial<CartItem>) => void
	clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'bazcar_cart'

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

	const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
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

			const newItem: CartItem = {
				...item,
				id: Date.now().toString(),
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
					return { ...item, ...updates }
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

	const value: CartContextType = {
		cartItems,
		addToCart,
		removeFromCart,
		updateCartItem,
		clearCart,
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

