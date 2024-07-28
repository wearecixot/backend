# Calorcity Backend
Calorcity is a web aplication that encourages sustainable living by rewarding users for eco-friendly activities such as running, biking, and using public transportation.

## Feature
- Activity tracking for running, cycling, and public transport usage
- Point system for eco-friendly activities
- Rewards redemption from partner merchants
- User profile management
- Tiered reward system

## Technology Stack
- Nest.js
- Typescript.ts
- Axios

## Pre Requisite
- Postgres 16
- Node.js v >= 20  

### .env
```
STRAVA_CLIENT_ID=strava-client-id
STRAVA_CLIENT_SECRET=strava-client-secret
```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
