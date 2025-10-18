CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE app_user (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email          CITEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  display_name   TEXT,
  avatar_url     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trip (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id            UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  start_date          DATE,
  end_date            DATE,
  start_point_name    TEXT,
  start_lat           DECIMAL(9,6),
  start_lng           DECIMAL(9,6),
  end_point_name      TEXT,
  end_lat             DECIMAL(9,6),
  end_lng             DECIMAL(9,6),
  total_members       INTEGER CHECK (total_members >= 1),
  relation_type       TEXT,
  planned_budget_amt  NUMERIC(12,2),
  planned_budget_ccy  CHAR(3) DEFAULT 'USD',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trip_point (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    UUID NOT NULL REFERENCES trip(id) ON DELETE CASCADE,
  ordinal    INTEGER NOT NULL,
  name       TEXT,
  lat        DECIMAL(9,6) NOT NULL,
  lng        DECIMAL(9,6) NOT NULL,
  arrive_on  DATE,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id, ordinal)
);

CREATE TABLE saved_place (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_point_id   UUID NOT NULL REFERENCES trip_point(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  category        TEXT,
  lat             DECIMAL(9,6),
  lng             DECIMAL(9,6),
  address         TEXT,
  url             TEXT,
  locked_cost_amt NUMERIC(12,2),
  locked_cost_ccy CHAR(3) DEFAULT 'USD',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trip_owner         ON trip(owner_id);
CREATE INDEX idx_point_trip_ord     ON trip_point(trip_id, ordinal);
CREATE INDEX idx_saved_place_point  ON saved_place(trip_point_id);
CREATE INDEX idx_saved_place_user   ON saved_place(user_id);
