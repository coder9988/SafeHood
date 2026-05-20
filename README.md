# SafeHood - Neighborhood Safety & Incident Reporting System

SafeHood is a full stack college project where residents can report neighborhood incidents, upload photo evidence, track report status, receive notifications, read announcements, comment on updates, and admins can manage reports.

## Tech Stack

- Backend: Laravel 11 REST API
- Auth: Laravel Sanctum
- Database: PostgreSQL
- Frontend: React, Vite, React Router, Axios
- Styling: Tailwind CSS

## Folder Structure

```text
backend/
  app/Http/Controllers/Api/
  app/Models/
  database/migrations/
  database/seeders/
  routes/api.php
frontend/
  src/api/
  src/components/
  src/context/
  src/data/
  src/pages/
docs/
  api-routes.md
  postgresql-schema.sql
  sample-api-responses.md
```

## Prerequisites

Ask your friends to install these first:

- PHP 8.2 or newer
- Composer
- Node.js 18 or newer
- PostgreSQL
- Git, optional but useful

On Windows, they can use XAMPP/Herd for PHP and the official PostgreSQL installer for the database.

## Full Setup For Friends

### 1. Get the project

```bash
git clone <your-repo-url>
cd Laravel
```

If you share the project as a ZIP file, extract it and open the extracted `Laravel` folder in VS Code.

### 2. Create PostgreSQL database

Open PostgreSQL/pgAdmin and create a database:

```sql
CREATE DATABASE neighborhood_safety;
```

Remember the PostgreSQL username and password. They must be added in `backend/.env`.

### 3. Backend setup

Go to the backend folder:

```bash
cd backend
composer install
cp .env.example .env
```

On Windows PowerShell, if `cp` does not work:

```powershell
Copy-Item .env.example .env
```

Open `backend/.env` and update database values:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=neighborhood_safety
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
```

Then run:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
```

Start the Laravel API:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Keep this terminal open. The API will run at:

```text
http://127.0.0.1:8000/api
```

### 4. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the frontend URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Demo Login

After running `php artisan migrate --seed`, these accounts are available:

```text
Admin:
jainmudit616@gmail.com / password

Resident:
resident@safety.test / password
```

Users can also register from the app. New registered users become residents by default.

## Optional API URL

The frontend already uses this by default:

```text
http://localhost:8000/api
```

If needed, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

## Main Features

- User login/register
- Resident dashboard with stats, recent incidents, and notifications
- Incident reporting form with optional photo evidence upload and anonymous reporting
- My Reports page with search and status badges
- Community feed with announcements, incident updates, uploaded evidence, and comments
- Notification dropdown with unread count and click-through navigation
- Admin dashboard with totals, report status changes, search/filtering, evidence links, and announcement publishing
- PostgreSQL schema, seed data, API route list, and sample API responses

## What File Upload Is For

The file upload field is for optional incident evidence. For example, a resident can attach a photo of a broken street light, unsafe road, suspicious vehicle, or other visible issue. This helps the admin verify the report instead of relying only on text.

Uploaded files are stored by Laravel in `storage/app/public` and served through:

```text
backend/public/storage
```

That is why `php artisan storage:link` is required.

## API Notes

Protected routes require a Bearer token:

```text
Authorization: Bearer YOUR_SANCTUM_TOKEN
```

Incident statuses:

```text
Reported
In Progress
Resolved
```

## Common Problems

### Frontend says "Could not connect or login"

Make sure the backend server is running:

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

### Images do not show

Run this in the backend folder:

```bash
php artisan storage:link
```

### `npm` is blocked on Windows

Use `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Database connection error

Check `backend/.env` and confirm:

- PostgreSQL is running
- Database name is `neighborhood_safety`
- `DB_USERNAME` and `DB_PASSWORD` are correct
- Migrations were run with `php artisan migrate --seed`
