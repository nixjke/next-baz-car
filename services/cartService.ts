import axiosInstance from '@/utils/axios'
import { API_CONFIG } from '@/utils/constants'
import { type CartItem } from '@/context/CartContext'

export type CartBookingRequest = {
	items: Array<{
		car_id: number
		pickup_date: string
		return_date: string
		delivery_option_id?: string
		additional_service_ids?: string[]
	}>
	customer_name: string
	customer_phone: string
	customer_email?: string
	qr_code?: string
	discount_percent?: number
}

export type CartBookingResponse = {
	total_price: number
	whatsapp_link: string
	items_count: number
	breakdown: {
		subtotal: number
		discount_amount: number
		discount_percent: number
		items: Array<{
			car_id: number
			car_name: string
			item_total: number
		}>
	}
}

// Маппинг service_id для дополнительных услуг
const SERVICE_ID_MAP: Record<string, string> = {
	youngDriver: 'youngDriver',
	childSeat: 'childSeat',
	personalDriver: 'personalDriver',
	ps5: 'ps5',
	transmission: 'transmission',
}

/**
 * Преобразует CartItem в формат для API
 */
const cartItemToApiFormat = (item: CartItem) => {
	const additionalServiceIds: string[] = []

	if (item.youngDriver) additionalServiceIds.push('youngDriver')
	if (item.childSeat) additionalServiceIds.push('childSeat')
	if (item.personalDriver) additionalServiceIds.push('personalDriver')
	if (item.ps5) additionalServiceIds.push('ps5')
	if (item.transmission) additionalServiceIds.push('transmission')

	return {
		car_id: item.car.id,
		pickup_date: item.pickupDate,
		return_date: item.returnDate,
		delivery_option_id: item.deliveryOption.id,
		additional_service_ids: additionalServiceIds.length > 0 ? additionalServiceIds : undefined,
	}
}

/**
 * Создаёт заказ из корзины и получает WhatsApp ссылку
 */
export const createCartBooking = async (
	cartItems: CartItem[],
	customerInfo: {
		name: string
		phone: string
		email?: string
	},
	qrCodeData?: {
		code: string
		discount: number
	}
): Promise<CartBookingResponse> => {
	if (cartItems.length === 0) {
		throw new Error('Корзина пуста')
	}

	// Используем контактную информацию из первой позиции, если не указана отдельно
	const finalCustomerInfo = {
		name: customerInfo.name || cartItems[0].name,
		phone: customerInfo.phone || cartItems[0].phone,
		email: customerInfo.email || cartItems[0].email,
	}

	const requestData: CartBookingRequest = {
		items: cartItems.map(cartItemToApiFormat),
		customer_name: finalCustomerInfo.name,
		customer_phone: finalCustomerInfo.phone,
		customer_email: finalCustomerInfo.email,
	}

	// Добавляем QR-код скидки, если есть
	if (qrCodeData) {
		requestData.qr_code = qrCodeData.code
		requestData.discount_percent = qrCodeData.discount
	}

	try {
		// Используем /booking/cart, так как в Python API роутер booking подключен с префиксом /booking
		const response = await axiosInstance.post<CartBookingResponse>(
			`/booking/cart`,
			requestData
		)
		return response.data
	} catch (error: any) {
		throw new Error(
			error.response?.data?.detail || error.message || 'Не удалось создать заказ'
		)
	}
}

