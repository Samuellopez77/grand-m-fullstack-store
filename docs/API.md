# API Reference

Base URL (local dev): `http://localhost:3000/api`

All responses are JSON. Errors follow the shape:
```json
{ "error": "<message>" }
```

## Health

### `GET /api/health`

Returns server liveness/uptime info.

**Response `200`**
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-09-21T12:00:00.000Z"
}
```

---

<!-- TODO: document each new endpoint here as it's built, same format:
     method + path, description, request body (if any), response shape,
     possible error responses. -->