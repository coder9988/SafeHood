# Sample API Responses

## Login

```json
{
  "user": {
    "id": 1,
    "name": "Riya Sharma",
    "email": "resident@safety.test",
    "role": "resident"
  },
  "token": "1|sanctum-token-example"
}
```

## Create Incident

```json
{
  "message": "Incident reported",
  "incident": {
    "id": 5,
    "user_id": 1,
    "title": "Street light not working",
    "description": "Light near Gate 2 is off.",
    "category": "Infrastructure",
    "severity": "Medium",
    "location": "Gate 2",
    "image": "incidents/photo.jpg",
    "anonymous": false,
    "status": "Reported"
  }
}
```

## Admin Stats

```json
{
  "total_incidents": 12,
  "total_users": 45,
  "pending_reports": 4
}
```
