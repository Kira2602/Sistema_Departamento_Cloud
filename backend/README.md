# Backend Auth with Supabase

## Environment
Create a `.env` file with:

```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
# Optional for admin operations only (do not use in frontend)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Install

```
npm install
```

## Run

```
npm run start
```

## Endpoints
- POST `/auth/signup` { email, password, data? }
- POST `/auth/signin` { email, password }
- POST `/auth/signout`
- GET `/auth/user` with header `Authorization: Bearer <access_token>`
- GET `/auth/protected` with header `Authorization: Bearer <access_token>`

Use the `access_token` returned by `/auth/signin` in Authorization header to call protected routes. 