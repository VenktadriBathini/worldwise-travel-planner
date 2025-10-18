# 🌍 WorldTraveller Backend

Express.js + PostgreSQL backend for the **WorldTraveller** project — a trip planner and travel diary app.

---

## 🚀 Features

- **Authentication**
  - Register & login with email + password
  - JWT-based access/refresh tokens
- **Trips**
  - Create, update, delete trips
  - Store metadata: start/end points, budget, relation type, members
- **Trip Points**
  - Ordered waypoints along a trip
  - Each point stores coordinates, optional notes, and arrival date
- **Saved Places**
  - User can save interesting places (hotel, food, gas, sights, etc.) at each point
  - Stores cost, address, and notes

---

## 🗄️ Database Design

Database: **PostgreSQL**  
Extensions: `uuid-ossp`, `citext`

### Tables

#### `app_user`
- `id` (UUID, PK)
- `email` (citext, unique)
- `password_hash` (text)
- `display_name` (text)
- `avatar_url` (text, optional)
- `created_at`, `updated_at`

#### `trip`
- `id` (UUID, PK)
- `owner_id` (FK → app_user.id)
- `title`, `description`
- `start_date`, `end_date`
- `start_point_name`, `start_lat`, `start_lng`
- `end_point_name`, `end_lat`, `end_lng`
- `total_members` (int)
- `relation_type` (text)
- `planned_budget_amt` (numeric)
- `planned_budget_ccy` (char(3), default `USD`)
- `created_at`, `updated_at`

#### `trip_point`
- `id` (UUID, PK)
- `trip_id` (FK → trip.id)
- `ordinal` (int, order of points)
- `name`
- `lat`, `lng`
- `arrive_on` (date, optional)
- `notes` (text, optional)
- `created_at`, `updated_at`

#### `saved_place`
- `id` (UUID, PK)
- `trip_point_id` (FK → trip_point.id)
- `user_id` (FK → app_user.id)
- `name` (text)
- `category` (text, free text)
- `lat`, `lng`
- `address`, `url`
- `locked_cost_amt`, `locked_cost_ccy`
- `notes`
- `created_at`, `updated_at`

---

## 📂 Project Structure

