# Smart Retail Platform — API Integration Reference

This document describes every backend endpoint the frontend consumes, the expected request shape, response schema, and integration notes for the backend developer.

All routes are relative to `VITE_API_BASE_URL` (default: `http://localhost:8000/api`).  
Authentication uses **Bearer JWT** passed in the `Authorization` header on every protected request.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Inventory](#inventory)
3. [Demand Forecasting](#demand-forecasting)
4. [Analytics](#analytics)
5. [Suppliers](#suppliers)
6. [Purchase Orders](#purchase-orders)
7. [Notifications](#notifications)
8. [Profile](#profile)
9. [Settings](#settings)
10. [Users & RBAC](#users--rbac)
11. [Reports & Export](#reports--export)
12. [Health Check](#health-check)
13. [Error Response Format](#error-response-format)

---

## Authentication

### POST `/auth/login`

**Request**
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Response `200`**
```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "admin",
    "storeName": "My Store"
  }
}
```

---

### POST `/auth/register`

**Request**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Secret123",
  "storeName": "My Store"
}
```

**Response `201`** — same shape as `/auth/login`

---

### GET `/auth/me` *(protected)*

**Response `200`**
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin",
  "phone": "+1 555 000 0000",
  "storeName": "My Store"
}
```

---

### POST `/auth/logout` *(protected)*

**Response `200`** — empty body or `{ "message": "Logged out" }`

---

## Inventory

### GET `/inventory` *(protected)*

Query params: `?search=`, `?category=`, `?status=`, `?sortBy=name&sortOrder=asc`, `?page=1&pageSize=10`

**Response `200`**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Laptop Pro 15",
      "sku": "ELE0001",
      "category": "Electronics",
      "quantity": 120,
      "price": 899.99,
      "supplier": "Tech Supplies Inc",
      "reorderLevel": 50
    }
  ],
  "total": 47,
  "page": 1,
  "pageSize": 10
}
```

---

### POST `/inventory` *(protected)*

**Request** — same fields as item object above (omit `id`)

**Response `201`** — created item with `id`

---

### PUT `/inventory/:id` *(protected)*

**Request** — partial or full item fields

**Response `200`** — updated item

---

### DELETE `/inventory/:id` *(protected)*

**Response `204`** — no content

---

## Demand Forecasting

### GET `/forecast/demand` *(protected)*

Query params: `?timeframe=30days|60days|90days`

**Response `200`**
```json
{
  "revenue":    { "current": 125400, "forecast": 138900, "accuracy": 87 },
  "units":      { "current": 3245,   "forecast": 3580,   "accuracy": 91 },
  "stockNeeded":{ "current": 850,    "forecast": 935,    "accuracy": 85 },
  "productForecasts": [
    { "name": "Product A", "current": 120, "forecast": 145, "change": 20.8, "trend": "up", "confidence": 89 }
  ],
  "historicalData": [
    { "month": "Jan", "actual": 4200, "forecast": 4100 }
  ]
}
```

---

### GET `/forecast/recommendations` *(protected)*

**Response `200`**
```json
[
  {
    "product": "Product A",
    "action": "Increase stock by 35 units",
    "priority": "high",
    "reason": "High demand forecast"
  }
]
```

---

## Analytics

### GET `/analytics/dashboard` *(protected)*

**Response `200`**
```json
{
  "totalProducts": 1247,
  "lowStock": 23,
  "totalRevenue": 125430,
  "forecastAccuracy": 87
}
```

---

### GET `/analytics/sales` *(protected)*

Query params: `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Response `200`**
```json
{
  "totalRevenue": 125430,
  "totalOrders": 348,
  "avgOrderValue": 360,
  "growthRate": 12.4,
  "series": [
    { "date": "2026-05-01", "revenue": 4200, "orders": 14 }
  ]
}
```

---

## Suppliers

### GET `/suppliers` *(protected)*

Query params: `?search=`, `?status=active|inactive`, `?sortBy=name`

**Response `200`**
```json
{
  "suppliers": [
    {
      "id": 1,
      "name": "ABC Distributors",
      "contact": "John Smith",
      "email": "john@abc.com",
      "phone": "+1 234 567 8901",
      "location": "New York, USA",
      "products": 45,
      "rating": 4.5,
      "totalOrders": 127,
      "onTimeDelivery": 95,
      "active": true
    }
  ],
  "total": 12
}
```

---

### GET `/suppliers/:id/performance` *(protected)*

**Response `200`**
```json
{
  "supplierId": 1,
  "onTimeDelivery": 95,
  "qualityRating": 4.5,
  "responseTime": "2 days",
  "returnRate": 1.2,
  "monthlyOrders": [
    { "month": "Jan", "orders": 12, "onTime": 11 }
  ]
}
```

---

## Purchase Orders

### GET `/purchase-orders` *(protected)*

Query params: `?status=Pending|Approved|Shipped|Delivered|Cancelled`, `?supplierId=`, `?page=1`

**Response `200`**
```json
{
  "orders": [
    {
      "id": "PO-2026-001",
      "supplier": "ABC Distributors",
      "supplierId": 1,
      "status": "Pending",
      "items": [{ "product": "Laptop Pro 15", "quantity": 50, "unitPrice": 899.99 }],
      "totalAmount": 44999.50,
      "orderDate": "2026-06-01",
      "expectedDelivery": "2026-06-10"
    }
  ],
  "total": 24
}
```

---

### PATCH `/purchase-orders/:id/status` *(protected)*

**Request** `{ "status": "Approved" }`

**Response `200`** — updated order

---

## Notifications

### GET `/notifications` *(protected)*

Query params: `?category=inventory|sales|supplier|forecast|order`, `?unread=true`, `?page=1`

**Response `200`**
```json
{
  "notifications": [
    {
      "id": "notif_1",
      "type": "alert",
      "category": "inventory",
      "priority": "high",
      "title": "Low Stock Alert",
      "message": "Smart Watch has 8 units left (below reorder level of 25)",
      "read": false,
      "createdAt": "2026-06-03T10:00:00Z"
    }
  ],
  "unreadCount": 3,
  "total": 18
}
```

---

### PATCH `/notifications/:id/read` *(protected)*

**Response `200`** — `{ "id": "notif_1", "read": true }`

---

### GET `/notifications/settings` *(protected)*

**Response `200`**
```json
{
  "lowStockAlerts": true,
  "orderUpdates": true,
  "demandSpikes": false,
  "supplierAlerts": true,
  "emailDigest": false
}
```

---

## Profile

### GET `/profile` *(protected)*

**Response `200`** — same as `/auth/me`

---

### PUT `/profile` *(protected)*

**Request**
```json
{ "name": "Jane Doe", "phone": "+1 555 000 0000", "storeName": "My Store" }
```

**Response `200`** — updated user object

---

### PUT `/profile/password` *(protected)*

**Request**
```json
{ "currentPassword": "oldpass", "newPassword": "NewPass1", "confirmPassword": "NewPass1" }
```

**Response `200`** — `{ "message": "Password updated successfully" }`

---

## Settings

### GET `/settings` *(protected)*

**Response `200`**
```json
{
  "store": { "currency": "USD", "timezone": "UTC-5", "lowStockThreshold": 20 },
  "notifications": { "lowStock": true, "orders": true, "forecasts": false },
  "dashboard": { "defaultDateRange": "30days", "showForecast": true },
  "system": { "autoBackup": true, "sessionTimeout": 30 }
}
```

---

### PUT `/settings/:section` *(protected)*

`section` = `store` | `notifications` | `dashboard` | `system`

**Request** — partial settings object for that section

**Response `200`** — updated section object

---

## Users & RBAC

### GET `/users` *(protected — admin only)*

**Response `200`**
```json
{
  "users": [
    {
      "id": 2,
      "name": "Bob Manager",
      "email": "bob@example.com",
      "role": "manager",
      "status": "active",
      "permissions": { "inventory": ["read","write"], "reports": ["read"] },
      "lastLogin": "2026-06-02T08:30:00Z"
    }
  ],
  "total": 8
}
```

**Roles**: `admin` | `manager` | `analyst` | `staff`

---

### PATCH `/users/:id/role` *(protected — admin only)*

**Request** `{ "role": "manager" }`

---

### PATCH `/users/:id/permissions` *(protected — admin only)*

**Request**
```json
{
  "permissions": {
    "inventory": ["read", "write"],
    "reports": ["read"],
    "users": []
  }
}
```

---

## Reports & Export

### GET `/reports/sales` *(protected)*

Query params: `?startDate=&endDate=&category=&supplier=&status=`

**Response `200`** — array of sales transaction objects (see Reports page mock data for shape)

---

### GET `/reports/:type/export/csv` *(protected)*

`type` = `sales` | `inventory` | `forecast`

**Response `200`** — `Content-Type: text/csv`, binary stream

---

### GET `/reports/:type/export/pdf` *(protected)*

**Response `200`** — `Content-Type: application/pdf`, binary stream

---

## Health Check

### GET `/health`

**Response `200`** — `{ "status": "ok", "timestamp": "2026-06-03T10:00:00Z" }`  
**Response `503`** — `{ "status": "degraded", "message": "Database unreachable" }`

No authentication required.

---

## Error Response Format

All error responses from the backend should follow this shape so the frontend interceptors can extract `message` consistently:

```json
{
  "message": "Human-readable error description",
  "code": "OPTIONAL_ERROR_CODE",
  "details": {}
}
```

| HTTP Status | Frontend behaviour |
|---|---|
| `400` | Displays `message` in form / toast |
| `401` | Clears token, redirects to `/login` |
| `403` | Shows "Access denied" toast |
| `404` | Shows empty state or inline error |
| `422` | Displays field-level validation errors |
| `5xx` | Shows "A server error occurred" toast |
