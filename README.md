This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The API will automatically connect to `http://localhost:8080/api/v1` in development mode.

### Production Build

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The API will automatically connect to `http://91.229.11.172:8080/api/v1` in production mode.

The production server will run on port 3000 by default. You can change it by setting the `PORT` environment variable:
```bash
PORT=3000 npm start
```

## Environment Variables

The project automatically determines the API base URL:

- **Development** (`npm run dev`): automatically uses `http://localhost:8080/api/v1`
- **Production** (`npm run build`): automatically uses `http://91.229.11.172:8080/api/v1`

You can override the default behavior by creating `.env.local` or `.env.production` files with:
```
NEXT_PUBLIC_API_BASE_URL=http://your-custom-url/api/v1
```

The logic in `utils/constants.ts` will:
1. First check for `NEXT_PUBLIC_API_BASE_URL` environment variable
2. If not set, use production URL when `NODE_ENV === 'production'`
3. Otherwise, use development URL (localhost)

## API Configuration

All API requests are configured through `utils/constants.ts` which reads from `NEXT_PUBLIC_API_BASE_URL` environment variable. The API endpoints include:

- Cars: `/api/v1/cars/`
- Bookings: `/api/v1/bookings/`
- QR Verification: `/api/v1/qr/`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
