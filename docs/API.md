# API Documentation

## Base URL

```
Production: https://api.disasterwatch.com/v1
Development: http://localhost:3000/v1
```

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Disasters

#### Get Disaster Feed

```http
GET /disasters
```

Query Parameters:
- `lat` (number): Latitude for location-based filtering
- `lng` (number): Longitude for location-based filtering
- `radius` (number): Search radius in kilometers
- `type` (string): Disaster type (earthquake, flood, fire, etc.)
- `severity` (string): Minimum severity level (low, medium, high, critical)
- `start_date` (ISO date): Filter disasters after this date
- `end_date` (ISO date): Filter disasters before this date

Response:
```json
{
  "disasters": [
    {
      "id": "string",
      "type": "string",
      "severity": "string",
      "location": {
        "lat": number,
        "lng": number,
        "address": "string"
      },
      "description": "string",
      "created_at": "string",
      "updated_at": "string",
      "status": "string"
    }
  ],
  "meta": {
    "total": number,
    "page": number,
    "per_page": number
  }
}
```

#### Report Disaster

```http
POST /disasters
```

Request Body:
```json
{
  "type": "string",
  "severity": "string",
  "location": {
    "lat": number,
    "lng": number,
    "address": "string"
  },
  "description": "string",
  "media": [
    {
      "type": "string",
      "url": "string"
    }
  ]
}
```

### Weather

#### Get Weather Data

```http
GET /weather
```

Query Parameters:
- `lat` (number): Latitude
- `lng` (number): Longitude
- `units` (string): 'metric' or 'imperial'

Response:
```json
{
  "current": {
    "temp": number,
    "feels_like": number,
    "humidity": number,
    "wind_speed": number,
    "conditions": "string"
  },
  "forecast": [
    {
      "date": "string",
      "temp_high": number,
      "temp_low": number,
      "conditions": "string"
    }
  ]
}
```

### Emergency Services

#### Get Nearby Facilities

```http
GET /emergency/facilities
```

Query Parameters:
- `lat` (number): Latitude
- `lng` (number): Longitude
- `type` (string): Facility type (hospital, fire_station, police, shelter)
- `radius` (number): Search radius in kilometers

Response:
```json
{
  "facilities": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "location": {
        "lat": number,
        "lng": number,
        "address": "string"
      },
      "phone": "string",
      "operating_hours": "string",
      "distance": number
    }
  ]
}
```

### User Management

#### Create User Profile

```http
POST /users
```

Request Body:
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "phone": "string",
  "emergency_contacts": [
    {
      "name": "string",
      "relationship": "string",
      "phone": "string"
    }
  ]
}
```

#### Update User Profile

```http
PUT /users/{userId}
```

Request Body:
```json
{
  "name": "string",
  "phone": "string",
  "notification_preferences": {
    "push_enabled": boolean,
    "email_enabled": boolean,
    "sms_enabled": boolean,
    "quiet_hours": {
      "start": "string",
      "end": "string"
    }
  }
}
```

## Error Handling

All endpoints follow the same error response format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common Error Codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Websocket API

Connect to real-time updates:
```
wss://api.disasterwatch.com/v1/ws
```

Events:
```javascript
// Subscribe to disaster updates
{
  "type": "subscribe",
  "channel": "disasters",
  "filters": {
    "types": ["earthquake", "flood"],
    "severity": "high",
    "location": {
      "lat": number,
      "lng": number,
      "radius": number
    }
  }
}

// Receive disaster updates
{
  "type": "disaster_update",
  "data": {
    // Disaster object
  }
}
``` 