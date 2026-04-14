# Water Tanker API - Complete Endpoint Documentation

**Base URL:** `http://localhost:5000`
**API Version:** `v1`
**Content-Type:** `application/json`

---

## 📋 Table of Contents

1. [Health Check](#1-health-check)
2. [Authentication](#2-authentication)
3. [Request Management](#3-request-management)
4. [Queue Management](#4-queue-management)
5. [Receipt Management](#5-receipt-management)
6. [Diesel Filling Management](#6-diesel-filling-management)
7. [Driver Management](#7-driver-management)
8. [Route Management](#8-route-management)
9. [Attendance Management](#9-attendance-management)

---

## 1. Health Check

### 1.1 Check Server Status

**Endpoint:** `GET /health`

**Request:**

```
GET http://localhost:5000/health
```

**Response (200):**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-04-14T10:30:00.000Z"
}
```

---

## 2. Authentication

### 2.1 Register New User (Member)

**Endpoint:** `POST /api/v1/auth/register`

**Request:**

```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json
```

**Body:**

```json
{
  "mobileNumber": "9876543210",
  "password": "Password123",
  "profile": {
    "name": "John Doe",
    "societyName": "Green Valley Society",
    "address": "123 Main Street, Apt 4B",
    "contactPerson": "John Doe"
  }
}
```

**Validation Rules:**

- `mobileNumber`: Exactly 10 digits, numeric only
- `password`: Minimum 6 characters, at least 1 uppercase letter, 1 number
- All `profile` fields are required

**Response (201):**

```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": {
      "_id": "69d61bf4c46959fd22ffeea9",
      "mobileNumber": "9876543210",
      "role": "member",
      "profile": {
        "name": "John Doe",
        "societyName": "Green Valley Society",
        "address": "123 Main Street, Apt 4B",
        "contactPerson": "John Doe"
      },
      "isActive": true,
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.2 Login (All Roles)

**Endpoint:** `POST /api/v1/auth/login`

**Request:**

```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json
```

**Body (Member/Manager/Fuel Manager):**

```json
{
  "mobileNumber": "9876543210",
  "password": "Password123"
}
```

**Body (Super Admin):**

```json
{
  "username": "admin",
  "password": "root"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "_id": "69d74a1b55680221be2120a1",
      "username": "admin",
      "role": "superAdmin",
      "profile": {
        "name": "Super Administrator",
        "societyName": "System",
        "address": "System",
        "contactPerson": "Super Administrator"
      },
      "isActive": true,
      "lastLoginAt": "2026-04-14T10:30:00.000Z",
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.3 Create Manager or Fuel Manager (Super Admin Only)

**Endpoint:** `POST /api/v1/auth/create-manager`
**Role Required:** `superAdmin`

**Request:**

```
POST http://localhost:5000/api/v1/auth/create-manager
Authorization: Bearer <superAdminAccessToken>
Content-Type: application/json
```

**Body (Create Manager):**

```json
{
  "mobileNumber": "9998887776",
  "password": "ManagerPass123",
  "role": "manager",
  "profile": {
    "name": "Manager User",
    "societyName": "Admin Office",
    "address": "Admin Office Address",
    "contactPerson": "Manager User"
  }
}
```

**Body (Create Fuel Manager):**

```json
{
  "mobileNumber": "9998887775",
  "password": "FuelPass123",
  "role": "fuelManager",
  "profile": {
    "name": "Fuel Manager",
    "societyName": "Fuel Station",
    "address": "Fuel Station Address",
    "contactPerson": "Fuel Manager"
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Manager created successfully.",
  "data": {
    "_id": "69d74b2c55680221be2120b2",
    "mobileNumber": "9998887776",
    "role": "manager",
    "profile": {
      "name": "Manager User",
      "societyName": "Admin Office",
      "address": "Admin Office Address",
      "contactPerson": "Manager User"
    },
    "isActive": true,
    "createdAt": "2026-04-14T10:35:00.000Z",
    "updatedAt": "2026-04-14T10:35:00.000Z"
  }
}
```

---

### 2.4 Refresh Access Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Request:**

```
POST http://localhost:5000/api/v1/auth/refresh
Content-Type: application/json
```

**Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.5 Get Current User Profile

**Endpoint:** `GET /api/v1/auth/profile`

**Request:**

```
GET http://localhost:5000/api/v1/auth/profile
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile fetched.",
  "data": {
    "user": {
      "_id": "69d61bf4c46959fd22ffeea9",
      "mobileNumber": "9876543210",
      "role": "member",
      "profile": {
        "name": "John Doe",
        "societyName": "Green Valley Society",
        "address": "123 Main Street, Apt 4B",
        "contactPerson": "John Doe"
      },
      "isActive": true,
      "lastLoginAt": "2026-04-14T10:30:00.000Z",
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  }
}
```

---

## 3. Request Management

### 3.1 Submit Water Tanker Request (Member)

**Endpoint:** `POST /api/v1/requests`
**Role Required:** `member`

**Request:**

```
POST http://localhost:5000/api/v1/requests
Authorization: Bearer <memberAccessToken>
Content-Type: application/json
```

**Body:**

```json
{
  "notes": "Need water tanker for building maintenance on April 15th"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Water tanker request submitted successfully.",
  "data": {
    "request": {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "userId": "69d61bf4c46959fd22ffeea9",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "notes": "Need water tanker for building maintenance on April 15th",
      "status": "pending",
      "queuePosition": 1,
      "tankerAssignment": null,
      "assignedAt": null,
      "assignedBy": null,
      "source": "",
      "destination": "",
      "kilometer": null,
      "roundTripKilometer": null,
      "completedAt": null,
      "cancelledAt": null,
      "cancelReason": "",
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  }
}
```

---

### 3.2 Get My Requests (Member)

**Endpoint:** `GET /api/v1/requests/my`
**Role Required:** `member`

**Request:**

```
GET http://localhost:5000/api/v1/requests/my?page=1&limit=10
Authorization: Bearer <memberAccessToken>
```

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page

**Response (200):**

```json
{
  "success": true,
  "message": "Requests fetched.",
  "data": [
    {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "userId": "69d61bf4c46959fd22ffeea9",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "notes": "Need water tanker for building maintenance",
      "status": "pending",
      "queuePosition": 1,
      "tankerAssignment": null,
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```

---

### 3.3 Get Request By ID

**Endpoint:** `GET /api/v1/requests/:id`
**Role Required:** Any authenticated user

**Request:**

```
GET http://localhost:5000/api/v1/requests/69d61bf4c46959fd22ffeeaa
Authorization: Bearer <accessToken>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Request fetched.",
  "data": {
    "request": {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "userId": "69d61bf4c46959fd22ffeea9",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "notes": "Need water tanker for building maintenance",
      "status": "pending",
      "queuePosition": 1,
      "tankerAssignment": null,
      "assignedAt": null,
      "assignedBy": null,
      "source": "",
      "destination": "",
      "kilometer": null,
      "roundTripKilometer": null,
      "completedAt": null,
      "cancelledAt": null,
      "cancelReason": "",
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  }
}
```

---

### 3.4 Get All Requests (Manager)

**Endpoint:** `GET /api/v1/requests`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/requests?status=pending&page=1&limit=20
Authorization: Bearer <managerAccessToken>
```

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page
- `status` (optional): Filter by status (`pending`, `completed`, `cancelled`)

**Response (200):**

```json
{
  "success": true,
  "message": "Requests fetched.",
  "data": [
    {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "userId": "69d61bf4c46959fd22ffeea9",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "notes": "Need water tanker for building maintenance",
      "status": "pending",
      "queuePosition": 1,
      "tankerAssignment": null,
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

---

### 3.5 Cancel Request

**Endpoint:** `PATCH /api/v1/requests/:id/cancel`
**Role Required:** Any authenticated user

**Request:**

```
PATCH http://localhost:5000/api/v1/requests/69d61bf4c46959fd22ffeeaa/cancel
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body:**

```json
{
  "cancelReason": "No longer needed"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Request cancelled.",
  "data": {
    "request": {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "status": "cancelled",
      "cancelledAt": "2026-04-14T12:00:00.000Z",
      "cancelReason": "No longer needed",
      "updatedAt": "2026-04-14T12:00:00.000Z"
    }
  }
}
```

---

## 4. Queue Management

**⚠️ All queue endpoints require `manager` or `superAdmin` role**

### 4.1 Get Queue (All Requests)

**Endpoint:** `GET /api/v1/queue`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/queue?page=1&limit=20&status=pending
Authorization: Bearer <managerAccessToken>
```

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page
- `status` (optional): Filter by status (`pending`, `completed`, `cancelled`). **No filter = returns all requests**

**Response (200):**

```json
{
  "success": true,
  "message": "Queue fetched.",
  "data": [
    {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "userId": {
        "_id": "69d61bf4c46959fd22ffeea9",
        "mobileNumber": "9876543210",
        "profile": {
          "name": "John Doe",
          "societyName": "Green Valley Society",
          "address": "123 Main Street, Apt 4B",
          "contactPerson": "John Doe"
        }
      },
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "notes": "Need water tanker for building maintenance",
      "status": "pending",
      "queuePosition": 1,
      "tankerAssignment": null,
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

---

### 4.2 Peek Next in Queue

**Endpoint:** `GET /api/v1/queue/next`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/queue/next
Authorization: Bearer <managerAccessToken>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Next request in queue.",
  "data": {
    "request": {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "userId": {
        "_id": "69d61bf4c46959fd22ffeea9",
        "mobileNumber": "9876543210",
        "profile": {
          "name": "John Doe",
          "societyName": "Green Valley Society"
        }
      },
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "notes": "",
      "status": "pending",
      "queuePosition": 1,
      "tankerAssignment": null,
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  }
}
```

---

### 4.3 Assign Tanker to Request

**Endpoint:** `PATCH /api/v1/queue/:id/assign`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
PATCH http://localhost:5000/api/v1/queue/69d61bf4c46959fd22ffeeaa/assign
Authorization: Bearer <managerAccessToken>
Content-Type: application/json
```

**Body:**

```json
{
  "tankerNumber": "WT-1234",
  "driverName": "Mike Johnson",
  "driverMobile": "9876543210",
  "dateTime": "2026-04-14T10:00:00Z"
}
```

**Validation Rules:**

- `tankerNumber`: Required, max 20 characters
- `driverName`: Required, max 100 characters
- `driverMobile`: Optional, exactly 10 digits (if provided)
- `dateTime`: Required, ISO 8601 format

**Response (200):**

```json
{
  "success": true,
  "message": "Tanker assigned successfully.",
  "data": {
    "request": {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "userId": "69d61bf4c46959fd22ffeea9",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "notes": "Need water tanker for building maintenance",
      "status": "pending",
      "queuePosition": 1,
      "tankerAssignment": {
        "tankerNumber": "WT-1234",
        "driverName": "Mike Johnson",
        "driverMobile": "9876543210",
        "dateTime": "2026-04-14T10:00:00.000Z"
      },
      "assignedAt": "2026-04-14T11:00:00.000Z",
      "assignedBy": "69d61bf4c46959fd22ffeea0",
      "completedAt": null,
      "cancelledAt": null,
      "cancelReason": "",
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T11:00:00.000Z"
    }
  }
}
```

---

### 4.4 Assign Source & Destination

**Endpoint:** `PATCH /api/v1/queue/:id/assign-source-destination`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
PATCH http://localhost:5000/api/v1/queue/69d61bf4c46959fd22ffeeaa/assign-source-destination
Authorization: Bearer <managerAccessToken>
Content-Type: application/json
```

**Body:**

```json
{
  "source": "Water Plant A, Sector 10",
  "destination": "Green Valley Society, Sector 25",
  "kilometers": 15.5
}
```

**Validation Rules:**

- `source`: Required, max 200 characters
- `destination`: Required, max 200 characters
- `kilometers`: Required, non-negative number
- `roundTripKilometer` is auto-calculated as `kilometers * 2`

**Response (200):**

```json
{
  "success": true,
  "message": "Source and destination assigned successfully.",
  "data": {
    "request": {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "source": "Water Plant A, Sector 10",
      "destination": "Green Valley Society, Sector 25",
      "kilometer": 15.5,
      "roundTripKilometer": 31,
      "updatedAt": "2026-04-14T11:30:00.000Z"
    }
  }
}
```

---

### 4.5 Complete Request

**Endpoint:** `PATCH /api/v1/queue/:id/complete`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
PATCH http://localhost:5000/api/v1/queue/69d61bf4c46959fd22ffeeaa/complete
Authorization: Bearer <managerAccessToken>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Request marked as completed.",
  "data": {
    "request": {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "status": "completed",
      "completedAt": "2026-04-14T14:30:00.000Z",
      "updatedAt": "2026-04-14T14:30:00.000Z"
    }
  }
}
```

---

### 4.6 Get Manager Report

**Endpoint:** `GET /api/v1/queue/report`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/queue/report?page=1&limit=50&startDate=2026-04-01T00:00:00Z&endDate=2026-04-30T23:59:59Z
Authorization: Bearer <managerAccessToken>
```

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50, max: 100): Items per page
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)

**Response (200):**

```json
{
  "success": true,
  "message": "Manager report generated successfully.",
  "data": [
    {
      "_id": "69d61bf4c46959fd22ffeeaa",
      "userId": "69d61bf4c46959fd22ffeea9",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "notes": "",
      "status": "completed",
      "queuePosition": 1,
      "tankerAssignment": {
        "tankerNumber": "WT-1234",
        "driverName": "Mike Johnson",
        "driverMobile": "9876543210",
        "dateTime": "2026-04-14T10:00:00.000Z"
      },
      "assignedAt": "2026-04-14T11:00:00.000Z",
      "completedAt": "2026-04-14T14:30:00.000Z",
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T14:30:00.000Z"
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 1,
  "meta": {
    "summary": {
      "total": 1,
      "pending": 0,
      "completed": 1,
      "cancelled": 0,
      "byStatus": {
        "completed": 1
      }
    }
  }
}
```

---

## 5. Receipt Management

**⚠️ All receipt endpoints require `manager` or `superAdmin` role**

### 5.1 Get All Receipts

**Endpoint:** `GET /api/v1/receipts`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/receipts?page=1&limit=20
Authorization: Bearer <managerAccessToken>
```

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page

**Response (200):**

```json
{
  "success": true,
  "message": "Receipts fetched.",
  "data": [
    {
      "_id": "69d61bf4c46959fd22ffeeac",
      "receiptNumber": "WTR-20260414-0001",
      "requestId": "69d61bf4c46959fd22ffeeaa",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "tankerNumber": "WT-1234",
      "driverName": "Mike Johnson",
      "driverMobile": "9876543210",
      "queuePosition": 1,
      "generatedBy": "69d61bf4c46959fd22ffeea0",
      "generatedAt": "2026-04-14T15:00:00.000Z",
      "printedAt": null,
      "printCount": 0,
      "createdAt": "2026-04-14T15:00:00.000Z",
      "updatedAt": "2026-04-14T15:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

---

### 5.2 Generate Receipt

**Endpoint:** `POST /api/v1/receipts/request/:requestId`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
POST http://localhost:5000/api/v1/receipts/request/69d61bf4c46959fd22ffeeaa
Authorization: Bearer <managerAccessToken>
```

_No body required_

**⚠️ Important:**

- Request must have a tanker assigned
- One receipt per request (unique constraint)
- Receipt number auto-generated: `{PREFIX}-{DATE}-{SEQUENCE}`

**Response (201):**

```json
{
  "success": true,
  "message": "Receipt generated successfully.",
  "data": {
    "receipt": {
      "_id": "69d61bf4c46959fd22ffeeac",
      "receiptNumber": "WTR-20260414-0001",
      "requestId": "69d61bf4c46959fd22ffeeaa",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "tankerNumber": "WT-1234",
      "driverName": "Mike Johnson",
      "driverMobile": "9876543210",
      "queuePosition": 1,
      "generatedBy": "69d61bf4c46959fd22ffeea0",
      "generatedAt": "2026-04-14T15:00:00.000Z",
      "printedAt": null,
      "printCount": 0,
      "createdAt": "2026-04-14T15:00:00.000Z",
      "updatedAt": "2026-04-14T15:00:00.000Z"
    }
  }
}
```

---

### 5.3 Get Receipt by Request ID

**Endpoint:** `GET /api/v1/receipts/request/:requestId`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/receipts/request/69d61bf4c46959fd22ffeeaa
Authorization: Bearer <managerAccessToken>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Receipt fetched.",
  "data": {
    "receipt": {
      "_id": "69d61bf4c46959fd22ffeeac",
      "receiptNumber": "WTR-20260414-0001",
      "requestId": "69d61bf4c46959fd22ffeeaa",
      "societyName": "Green Valley Society",
      "address": "123 Main Street, Apt 4B",
      "contactPerson": "John Doe",
      "mobileNumber": "9876543210",
      "tankerNumber": "WT-1234",
      "driverName": "Mike Johnson",
      "driverMobile": "9876543210",
      "queuePosition": 1,
      "generatedBy": {
        "_id": "69d61bf4c46959fd22ffeea0",
        "mobileNumber": "9998887776",
        "role": "manager",
        "profile": {
          "name": "Manager User",
          "societyName": "Office",
          "address": "Admin Office",
          "contactPerson": "Manager User"
        }
      },
      "generatedAt": "2026-04-14T15:00:00.000Z",
      "printedAt": null,
      "printCount": 0,
      "createdAt": "2026-04-14T15:00:00.000Z",
      "updatedAt": "2026-04-14T15:00:00.000Z"
    }
  }
}
```

---

### 5.4 Mark Receipt as Printed

**Endpoint:** `PATCH /api/v1/receipts/:id/printed`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
PATCH http://localhost:5000/api/v1/receipts/69d61bf4c46959fd22ffeeac/printed
Authorization: Bearer <managerAccessToken>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Receipt marked as printed.",
  "data": {
    "receipt": {
      "_id": "69d61bf4c46959fd22ffeeac",
      "receiptNumber": "WTR-20260414-0001",
      "printedAt": "2026-04-14T15:30:00.000Z",
      "printCount": 1,
      "updatedAt": "2026-04-14T15:30:00.000Z"
    }
  }
}
```

---

## 6. Diesel Filling Management

**⚠️ All diesel filling endpoints require `fuelManager` or `superAdmin` role**

### 6.1 Record Diesel Filling

**Endpoint:** `POST /api/v1/diesel-fillings`
**Role Required:** `fuelManager`, `superAdmin`

**Request:**

```
POST http://localhost:5000/api/v1/diesel-fillings
Authorization: Bearer <fuelManagerAccessToken>
Content-Type: application/json
```

**Body:**

```json
{
  "tankerNumber": "WT-1234",
  "dateTime": "2026-04-14T10:00:00Z",
  "dieselAmount": 5000,
  "liters": 150
}
```

**Validation Rules:**

- `tankerNumber`: Required, max 20 characters
- `dateTime`: Optional (defaults to current time), ISO 8601 format
- `dieselAmount`: Required, non-negative number
- `liters`: Required, non-negative number

**Response (201):**

```json
{
  "success": true,
  "message": "Diesel filling recorded successfully",
  "data": {
    "_id": "69d61bf4c46959fd22ffeead",
    "tankerNumber": "WT-1234",
    "dateTime": "2026-04-14T10:00:00.000Z",
    "dieselAmount": 5000,
    "liters": 150,
    "filledBy": "69d61bf4c46959fd22ffeea0",
    "tripsSinceLastFill": 12,
    "lastFillingDate": "2026-04-10T08:00:00.000Z",
    "createdAt": "2026-04-14T10:00:00.000Z",
    "updatedAt": "2026-04-14T10:00:00.000Z"
  }
}
```

---

### 6.2 Get All Diesel Fillings

**Endpoint:** `GET /api/v1/diesel-fillings`
**Role Required:** `fuelManager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/diesel-fillings?page=1&limit=20&tankerNumber=WT-1234&startDate=2026-04-01T00:00:00Z&endDate=2026-04-30T23:59:59Z
Authorization: Bearer <fuelManagerAccessToken>
```

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page
- `tankerNumber` (optional): Filter by specific tanker
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)

**Response (200):**

```json
{
  "success": true,
  "message": "Diesel fillings retrieved successfully",
  "data": [
    {
      "_id": "69d73f7cc67ab2ee91e9fcea",
      "tankerNumber": "WT-1234",
      "dateTime": "2026-04-14T10:00:00.000Z",
      "dieselAmount": 5000,
      "liters": 150,
      "filledBy": {
        "_id": "69d73cbc564ef77154956101",
        "mobileNumber": "9998887776",
        "role": "fuelManager",
        "profile": {
          "name": "Fuel Manager"
        }
      },
      "tripsSinceLastFill": 0,
      "lastFillingDate": null,
      "createdAt": "2026-04-14T05:56:12.724Z",
      "updatedAt": "2026-04-14T05:56:12.724Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 6.3 Get Diesel Filling by ID

**Endpoint:** `GET /api/v1/diesel-fillings/:id`
**Role Required:** `fuelManager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/diesel-fillings/69d73f7cc67ab2ee91e9fcea
Authorization: Bearer <fuelManagerAccessToken>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Diesel filling retrieved successfully",
  "data": {
    "_id": "69d73f7cc67ab2ee91e9fcea",
    "tankerNumber": "WT-1234",
    "dateTime": "2026-04-14T10:00:00.000Z",
    "dieselAmount": 5000,
    "liters": 150,
    "filledBy": {
      "_id": "69d73cbc564ef77154956101",
      "mobileNumber": "9998887776",
      "role": "fuelManager",
      "profile": {
        "name": "Fuel Manager"
      }
    },
    "tripsSinceLastFill": 0,
    "lastFillingDate": null,
    "createdAt": "2026-04-14T05:56:12.724Z",
    "updatedAt": "2026-04-14T05:56:12.724Z"
  }
}
```

---

### 6.4 Update Diesel Filling

**Endpoint:** `PUT /api/v1/diesel-fillings/:id`
**Role Required:** `fuelManager`, `superAdmin`

**Request:**

```
PUT http://localhost:5000/api/v1/diesel-fillings/69d73f7cc67ab2ee91e9fcea
Authorization: Bearer <fuelManagerAccessToken>
Content-Type: application/json
```

**Body (all fields optional):**

```json
{
  "dieselAmount": 5500,
  "liters": 160
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Diesel filling updated successfully",
  "data": {
    "_id": "69d73f7cc67ab2ee91e9fcea",
    "tankerNumber": "WT-1234",
    "dateTime": "2026-04-14T10:00:00.000Z",
    "dieselAmount": 5500,
    "liters": 160,
    "filledBy": "69d73cbc564ef77154956101",
    "tripsSinceLastFill": 0,
    "lastFillingDate": null,
    "createdAt": "2026-04-14T05:56:12.724Z",
    "updatedAt": "2026-04-14T06:30:00.000Z"
  }
}
```

---

### 6.5 Delete Diesel Filling

**Endpoint:** `DELETE /api/v1/diesel-fillings/:id`
**Role Required:** `fuelManager`, `superAdmin`

**Request:**

```
DELETE http://localhost:5000/api/v1/diesel-fillings/69d73f7cc67ab2ee91e9fcea
Authorization: Bearer <fuelManagerAccessToken>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Diesel filling deleted successfully"
}
```

---

### 6.6 Generate Diesel Report (with Trip Analysis)

**Endpoint:** `GET /api/v1/diesel-fillings/report`
**Role Required:** `fuelManager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/diesel-fillings/report?page=1&limit=20&tankerNumber=WT-1234&startDate=2026-04-01T00:00:00Z&endDate=2026-04-30T23:59:59Z
Authorization: Bearer <fuelManagerAccessToken>
```

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page
- `tankerNumber` (optional): Filter by specific tanker
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)

**Response (200):**

```json
{
  "success": true,
  "message": "Diesel report generated successfully",
  "data": [
    {
      "_id": "69d7473555680221be21205c",
      "tankerNumber": "WT-1234",
      "dateTime": "2026-04-14T10:00:00.000Z",
      "dieselAmount": 5000,
      "liters": 150,
      "filledBy": {
        "_id": "69d73cbc564ef77154956101",
        "mobileNumber": "9998887776",
        "role": "fuelManager",
        "profile": {
          "name": "Fuel Manager"
        }
      },
      "tripsSinceLastFill": 0,
      "lastFillingDate": "2026-04-14T10:00:00.000Z",
      "createdAt": "2026-04-14T06:29:09.984Z",
      "updatedAt": "2026-04-14T06:29:09.984Z",
      "trips": [
        {
          "completedAt": "2026-04-14T06:26:48.365Z",
          "societyName": "Green Valley Society",
          "address": "123 Main Street, Apt 4B",
          "tankerNumber": "WT-12345"
        }
      ],
      "tripCount": 1
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 6.7 Get Tanker Diesel Summary

**Endpoint:** `GET /api/v1/diesel-fillings/summary/:tankerNumber`
**Role Required:** `fuelManager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/diesel-fillings/summary/WT-1234
Authorization: Bearer <fuelManagerAccessToken>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Tanker diesel summary retrieved successfully",
  "data": {
    "tankerNumber": "WT-1234",
    "totalFillings": 2,
    "totalDieselAmount": 10000,
    "totalLiters": 300,
    "totalTripsRecorded": 0,
    "totalCompletedTrips": 1,
    "averageLitersPerTrip": 0,
    "lastFillingDate": "2026-04-14T10:00:00.000Z",
    "firstFillingDate": "2026-04-14T10:00:00.000Z"
  }
}
```

---

## 7. Driver Management

**⚠️ All driver endpoints require `manager` or `superAdmin` role**

### 7.1 Create Driver

**Endpoint:** `POST /api/v1/drivers`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
POST http://localhost:5000/api/v1/drivers
Authorization: Bearer <manager_or_superAdmin_token>
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Rajesh Kumar",
  "permanentAddress": "45 MG Road, Pune, Maharashtra 411001",
  "temporaryAddress": "12 FC Road, Pune, Maharashtra 411005",
  "mobileNumber": "9988776655",
  "status": "ACTIVE",
  "documents": ["driving_license.pdf", "aadhaar_card.pdf"]
}
```

**Validation Rules:**

- `name`: Required, max 100 characters
- `permanentAddress`: Required, max 300 characters
- `temporaryAddress`: Optional, max 300 characters
- `mobileNumber`: Required, exactly 10 digits
- `status`: Optional, must be `ACTIVE` or `BLOCK` (default: `ACTIVE`)
- `documents`: Optional, array of strings

**Response (201):**

```json
{
  "success": true,
  "message": "Driver created successfully",
  "data": {
    "_id": "69d61bf4c46959fd22ffeeae",
    "serialNumber": 1,
    "name": "Rajesh Kumar",
    "permanentAddress": "45 MG Road, Pune, Maharashtra 411001",
    "temporaryAddress": "12 FC Road, Pune, Maharashtra 411005",
    "mobileNumber": "9988776655",
    "status": "ACTIVE",
    "documents": ["driving_license.pdf", "aadhaar_card.pdf"],
    "createdAt": "2026-04-14T10:30:00.000Z",
    "updatedAt": "2026-04-14T10:30:00.000Z"
  }
}
```

---

### 7.2 Get All Drivers

**Endpoint:** `GET /api/v1/drivers`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/drivers?page=1&limit=20&status=ACTIVE
Authorization: Bearer <manager_or_superAdmin_token>
```

**Query Parameters:**

- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Items per page
- `status` (optional): Filter by status (`ACTIVE` or `BLOCK`)

**Response (200):**

```json
{
  "success": true,
  "message": "Drivers retrieved successfully",
  "data": [
    {
      "_id": "69d61bf4c46959fd22ffeeae",
      "serialNumber": 1,
      "name": "Rajesh Kumar",
      "permanentAddress": "45 MG Road, Pune, Maharashtra 411001",
      "temporaryAddress": "12 FC Road, Pune, Maharashtra 411005",
      "mobileNumber": "9988776655",
      "status": "ACTIVE",
      "documents": ["driving_license.pdf", "aadhaar_card.pdf"],
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

---

### 7.3 Get Driver By ID

**Endpoint:** `GET /api/v1/drivers/:id`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/drivers/69d61bf4c46959fd22ffeeae
Authorization: Bearer <manager_or_superAdmin_token>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Driver retrieved successfully",
  "data": {
    "_id": "69d61bf4c46959fd22ffeeae",
    "serialNumber": 1,
    "name": "Rajesh Kumar",
    "permanentAddress": "45 MG Road, Pune, Maharashtra 411001",
    "temporaryAddress": "12 FC Road, Pune, Maharashtra 411005",
    "mobileNumber": "9988776655",
    "status": "ACTIVE",
    "documents": ["driving_license.pdf", "aadhaar_card.pdf"],
    "createdAt": "2026-04-14T10:30:00.000Z",
    "updatedAt": "2026-04-14T10:30:00.000Z"
  }
}
```

---

### 7.4 Update Driver

**Endpoint:** `PUT /api/v1/drivers/:id`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
PUT http://localhost:5000/api/v1/drivers/69d61bf4c46959fd22ffeeae
Authorization: Bearer <manager_or_superAdmin_token>
Content-Type: application/json
```

**Body (all fields optional):**

```json
{
  "name": "Rajesh Kumar Updated",
  "permanentAddress": "789 New Address, Mumbai, Maharashtra 400001",
  "temporaryAddress": "",
  "mobileNumber": "9988776656",
  "status": "BLOCK",
  "documents": ["driving_license.pdf", "aadhaar_card.pdf", "pan_card.pdf"]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Driver updated successfully",
  "data": {
    "_id": "69d61bf4c46959fd22ffeeae",
    "serialNumber": 1,
    "name": "Rajesh Kumar Updated",
    "permanentAddress": "789 New Address, Mumbai, Maharashtra 400001",
    "temporaryAddress": "",
    "mobileNumber": "9988776656",
    "status": "BLOCK",
    "documents": ["driving_license.pdf", "aadhaar_card.pdf", "pan_card.pdf"],
    "updatedAt": "2026-04-14T11:00:00.000Z"
  }
}
```

---

### 7.5 Delete Driver (Soft Delete)

**Endpoint:** `DELETE /api/v1/drivers/:id`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
DELETE http://localhost:5000/api/v1/drivers/69d61bf4c46959fd22ffeeae
Authorization: Bearer <manager_or_superAdmin_token>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Driver deleted successfully"
}
```

---

## 8. Route Management

**⚠️ All route endpoints require `manager` or `superAdmin` role**

### 8.1 Create Route

**Endpoint:** `POST /api/v1/routes`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
POST http://localhost:5000/api/v1/routes
Authorization: Bearer <manager_or_superAdmin_token>
Content-Type: application/json
```

**Body:**

```json
{
  "source": "Water Plant A, Sector 10, Pune",
  "destination": "Green Valley Society, Sector 25, Pune",
  "distanceInKm": 15.5
}
```

**Validation Rules:**

- `source`: Required, max 200 characters
- `destination`: Required, max 200 characters
- `distanceInKm`: Required, non-negative number

**Response (201):**

```json
{
  "success": true,
  "message": "Route created successfully",
  "data": {
    "_id": "69d61bf4c46959fd22ffeeaf",
    "source": "Water Plant A, Sector 10, Pune",
    "destination": "Green Valley Society, Sector 25, Pune",
    "distanceInKm": 15.5,
    "createdAt": "2026-04-14T10:30:00.000Z",
    "updatedAt": "2026-04-14T10:30:00.000Z"
  }
}
```

---

### 8.2 Get All Routes

**Endpoint:** `GET /api/v1/routes`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/routes
Authorization: Bearer <manager_or_superAdmin_token>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Routes retrieved successfully",
  "data": [
    {
      "_id": "69d61bf4c46959fd22ffeeaf",
      "source": "Water Plant A, Sector 10, Pune",
      "destination": "Green Valley Society, Sector 25, Pune",
      "distanceInKm": 15.5,
      "createdAt": "2026-04-14T10:30:00.000Z",
      "updatedAt": "2026-04-14T10:30:00.000Z"
    }
  ]
}
```

---

### 8.3 Update Route

**Endpoint:** `PUT /api/v1/routes/:id`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
PUT http://localhost:5000/api/v1/routes/69d61bf4c46959fd22ffeeaf
Authorization: Bearer <manager_or_superAdmin_token>
Content-Type: application/json
```

**Body (all fields optional):**

```json
{
  "source": "Water Plant B, Sector 15, Pune",
  "destination": "Green Valley Society, Sector 25, Pune",
  "distanceInKm": 18.2
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Route updated successfully",
  "data": {
    "_id": "69d61bf4c46959fd22ffeeaf",
    "source": "Water Plant B, Sector 15, Pune",
    "destination": "Green Valley Society, Sector 25, Pune",
    "distanceInKm": 18.2,
    "updatedAt": "2026-04-14T11:00:00.000Z"
  }
}
```

---

### 8.4 Delete Route

**Endpoint:** `DELETE /api/v1/routes/:id`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
DELETE http://localhost:5000/api/v1/routes/69d61bf4c46959fd22ffeeaf
Authorization: Bearer <manager_or_superAdmin_token>
```

_No body required_

**Response (200):**

```json
{
  "success": true,
  "message": "Route deleted successfully"
}
```

---

## 9. Attendance Management

**⚠️ All attendance endpoints require `manager` or `superAdmin` role**

### 9.1 Get Driver Attendance (Trip Records)

**Endpoint:** `GET /api/v1/attendance/drives/:driverName`
**Role Required:** `manager`, `superAdmin`

**Request:**

```
GET http://localhost:5000/api/v1/attendance/drives/Mike%20Johnson
Authorization: Bearer <manager_or_superAdmin_token>
```

_No body required_

**⚠️ Note:** URL-encode the driver name if it contains spaces (e.g., `Mike%20Johnson`)

**Response (200):**

```json
{
  "success": true,
  "message": "Driver attendance retrieved successfully",
  "data": {
    "driverName": "Mike Johnson",
    "totalDrives": 5,
    "drives": [
      {
        "_id": "69d61bf4c46959fd22ffeeaa",
        "societyName": "Green Valley Society",
        "address": "123 Main Street, Apt 4B",
        "tankerNumber": "WT-1234",
        "completedAt": "2026-04-14T14:30:00.000Z",
        "status": "completed"
      }
    ]
  }
}
```

---

## 🔑 Role Summary

| Role            | Login Credentials                    | Permissions                                                                                                                                 |
| --------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **superAdmin**  | `username: admin` + `password: root` | Create Manager/Fuel Manager, manage drivers, routes, queue, receipts                                                                        |
| **member**      | `mobileNumber` + `password`          | Register, login, submit requests, view own requests, cancel requests                                                                        |
| **manager**     | `mobileNumber` + `password`          | All member permissions + manage queue, assign tankers, complete requests, generate receipts, manage drivers, manage routes, view attendance |
| **fuelManager** | `mobileNumber` + `password`          | Record diesel fillings, view diesel data, generate diesel reports, view tanker summaries                                                    |

---

## 🔐 Authentication Header

All authenticated requests require:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

---

## 📊 Request Status Values

| Status      | Description                                        |
| ----------- | -------------------------------------------------- |
| `pending`   | Request is in queue, waiting for tanker assignment |
| `completed` | Request has been completed                         |
| `cancelled` | Request has been cancelled                         |

---

## 🚨 Common Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden (Wrong Role)

```json
{
  "success": false,
  "message": "Access denied. Required role(s): manager."
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Request not found."
}
```

### 400 Validation Error

```json
{
  "success": false,
  "message": "Request validation failed.",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation message here"
    }
  ]
}
```

### 429 Rate Limit Exceeded

```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## 📋 Complete Postman Test Workflow

### **Step 1: Login as Super Admin**

```
POST http://localhost:5000/api/v1/auth/login
Body: { "username": "admin", "password": "root" }
```

Save the `accessToken` as `superAdmin_token`.

---

### **Step 2: Create Manager**

```
POST http://localhost:5000/api/v1/auth/create-manager
Authorization: Bearer {{superAdmin_token}}
Body:
{
  "mobileNumber": "9998887776",
  "password": "ManagerPass123",
  "role": "manager",
  "profile": {
    "name": "Manager User",
    "societyName": "Admin Office",
    "address": "Admin Office Address",
    "contactPerson": "Manager User"
  }
}
```

---

### **Step 3: Create Fuel Manager**

```
POST http://localhost:5000/api/v1/auth/create-manager
Authorization: Bearer {{superAdmin_token}}
Body:
{
  "mobileNumber": "9998887775",
  "password": "FuelPass123",
  "role": "fuelManager",
  "profile": {
    "name": "Fuel Manager",
    "societyName": "Fuel Station",
    "address": "Fuel Station Address",
    "contactPerson": "Fuel Manager"
  }
}
```

---

### **Step 4: Register Member**

```
POST http://localhost:5000/api/v1/auth/register
Body:
{
  "mobileNumber": "9876543210",
  "password": "Password123",
  "profile": {
    "name": "John Doe",
    "societyName": "Green Valley Society",
    "address": "123 Main Street, Apt 4B",
    "contactPerson": "John Doe"
  }
}
```

---

### **Step 5: Login as Member**

```
POST http://localhost:5000/api/v1/auth/login
Body: { "mobileNumber": "9876543210", "password": "Password123" }
```

Save the `accessToken` as `member_token`.

---

### **Step 6: Submit Water Tanker Request**

```
POST http://localhost:5000/api/v1/requests
Authorization: Bearer {{member_token}}
Body: { "notes": "Need water tanker for building maintenance" }
```

Save the `request._id` as `requestId`.

---

### **Step 7: Login as Manager**

```
POST http://localhost:5000/api/v1/auth/login
Body: { "mobileNumber": "9998887776", "password": "ManagerPass123" }
```

Save the `accessToken` as `manager_token`.

---

### **Step 8: View All Queue Items**

```
GET http://localhost:5000/api/v1/queue
Authorization: Bearer {{manager_token}}
```

---

### **Step 9: Assign Tanker**

```
PATCH http://localhost:5000/api/v1/queue/{{requestId}}/assign
Authorization: Bearer {{manager_token}}
Body:
{
  "tankerNumber": "WT-1234",
  "driverName": "Mike Johnson",
  "driverMobile": "9876543210",
  "dateTime": "2026-04-14T10:00:00Z"
}
```

---

### **Step 10: Assign Source & Destination**

```
PATCH http://localhost:5000/api/v1/queue/{{requestId}}/assign-source-destination
Authorization: Bearer {{manager_token}}
Body:
{
  "source": "Water Plant A, Sector 10",
  "destination": "Green Valley Society, Sector 25",
  "kilometers": 15.5
}
```

---

### **Step 11: Complete Request**

```
PATCH http://localhost:5000/api/v1/queue/{{requestId}}/complete
Authorization: Bearer {{manager_token}}
```

---

### **Step 12: Generate Receipt**

```
POST http://localhost:5000/api/v1/receipts/request/{{requestId}}
Authorization: Bearer {{manager_token}}
```

Save the `receipt._id` as `receiptId`.

---

### **Step 13: Mark Receipt as Printed**

```
PATCH http://localhost:5000/api/v1/receipts/{{receiptId}}/printed
Authorization: Bearer {{manager_token}}
```

---

### **Step 14: Login as Fuel Manager**

```
POST http://localhost:5000/api/v1/auth/login
Body: { "mobileNumber": "9998887775", "password": "FuelPass123" }
```

Save the `accessToken` as `fuelManager_token`.

---

### **Step 15: Record Diesel Filling**

```
POST http://localhost:5000/api/v1/diesel-fillings
Authorization: Bearer {{fuelManager_token}}
Body:
{
  "tankerNumber": "WT-1234",
  "dateTime": "2026-04-14T10:00:00Z",
  "dieselAmount": 5000,
  "liters": 150
}
```

---

### **Step 16: Create Driver**

```
POST http://localhost:5000/api/v1/drivers
Authorization: Bearer {{manager_token}}
Body:
{
  "name": "Rajesh Kumar",
  "permanentAddress": "45 MG Road, Pune, Maharashtra 411001",
  "temporaryAddress": "12 FC Road, Pune, Maharashtra 411005",
  "mobileNumber": "9988776655",
  "status": "ACTIVE",
  "documents": ["driving_license.pdf"]
}
```

---

### **Step 17: Create Route**

```
POST http://localhost:5000/api/v1/routes
Authorization: Bearer {{manager_token}}
Body:
{
  "source": "Water Plant A, Sector 10, Pune",
  "destination": "Green Valley Society, Sector 25, Pune",
  "distanceInKm": 15.5
}
```

---

### **Step 18: Get Driver Attendance**

```
GET http://localhost:5000/api/v1/attendance/drives/Mike%20Johnson
Authorization: Bearer {{manager_token}}
```
