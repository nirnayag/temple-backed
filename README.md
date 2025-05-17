# Temple Management Backend

This is the backend API for the Temple Management System, built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/temple
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Devotees

- `GET /api/devotees` - Get all devotees
- `GET /api/devotees/:id` - Get devotee by ID
- `POST /api/devotees` - Create new devotee
- `PATCH /api/devotees/:id` - Update devotee
- `DELETE /api/devotees/:id` - Delete devotee
- `POST /api/devotees/:id/donations` - Add donation to devotee

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register/:devoteeId` - Register devotee for event
- `DELETE /api/events/:id/register/:devoteeId` - Unregister devotee from event

## Models

### Devotee
- name
- email
- phone
- address
- dateOfBirth
- memberSince
- membershipType (regular, lifetime, vip)
- donationHistory

### Event
- title
- description
- date
- startTime
- endTime
- location
- eventType (puja, festival, discourse, community, other)
- priest
- registeredDevotees
- isActive 