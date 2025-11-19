// Автоматическое определение API URL на основе окружения
const getApiBaseUrl = (): string => {
  // Если явно указан URL через переменную окружения - используем его
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Автоматическое определение на основе NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'http://91.229.11.172:8080/api/v1';
  }
  
  // По умолчанию для development
  return 'http://localhost:8080/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    QR_VERIFY: '/qr/',
    BOOKINGS: '/bookings/',
    CARS: '/cars/'
  }
};

// Функция для получения базового URL сервера (без /api/v1)
export const getServerBaseUrl = (): string => {
  const apiUrl = API_CONFIG.BASE_URL;
  return apiUrl.replace('/api/v1', '');
}; 