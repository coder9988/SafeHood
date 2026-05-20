# API Routes

Base URL: `http://localhost:8000/api`

## Public

| Method | Route | Description |
| --- | --- | --- |
| POST | `/register` | Create resident account |
| POST | `/login` | Login and return Sanctum token |

## Authenticated

| Method | Route | Description |
| --- | --- | --- |
| GET | `/me` | Current user |
| POST | `/logout` | Revoke current token |
| GET | `/incidents` | List incidents with search/status filter |
| POST | `/incidents` | Create incident with optional image |
| GET | `/incidents/{id}` | Show one incident |
| PUT/PATCH | `/incidents/{id}` | Update own incident |
| DELETE | `/incidents/{id}` | Delete own incident |
| GET | `/my-incidents` | Current user's reports |
| GET | `/announcements` | Community announcements |
| POST | `/incidents/{id}/comments` | Add comment |
| GET | `/notifications` | Current user's notifications |

## Admin

| Method | Route | Description |
| --- | --- | --- |
| GET | `/admin/stats` | Total incidents, users, pending reports |
| GET | `/admin/incidents` | Incident management list |
| PATCH | `/admin/incidents/{id}/status` | Change report status |
