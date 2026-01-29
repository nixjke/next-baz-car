// Автоматическое определение API URL на основе окружения
// Приоритет: NEXT_PUBLIC_API_BASE_URL > NEXT_PUBLIC_DEV_API_URL (dev only) > дефолтные значения
const getApiBaseUrl = (): string => {
  // Если явно указан URL через переменную окружения - используем его (имеет наивысший приоритет)
  // Эта переменная должна быть установлена во время сборки (next build)
  // Используется в production и development
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // В dev режиме можно указать альтернативный сервер через NEXT_PUBLIC_DEV_API_URL
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_DEV_API_URL
  ) {
    return process.env.NEXT_PUBLIC_DEV_API_URL;
  }
  
  // Автоматическое определение на основе NODE_ENV
  // Дефолтный production URL (используется если NEXT_PUBLIC_API_BASE_URL не установлен)
  if (process.env.NODE_ENV === 'production') {
    return 'https://baz-car-server.online/api/v1';
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

export const QR_CODE_STORAGE_KEY = 'bazcar_qr_code' 