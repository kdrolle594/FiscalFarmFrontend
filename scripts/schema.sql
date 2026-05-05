-- AgriFinance Postgres schema (Supabase).
-- Run once before seed.ts. Drops in reverse dependency order so re-running is safe.

DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS repayment_schedule CASCADE;
DROP TABLE IF EXISTS disbursement_schedule CASCADE;
DROP TABLE IF EXISTS loan_applications CASCADE;
DROP TABLE IF EXISTS loan_programs CASCADE;
DROP TABLE IF EXISTS application_form_fields CASCADE;
DROP TABLE IF EXISTS dashboard_snapshots CASCADE;
DROP TABLE IF EXISTS platform_users CASCADE;
DROP TABLE IF EXISTS farms CASCADE;
DROP TABLE IF EXISTS auth_users CASCADE;
DROP TABLE IF EXISTS cooperatives CASCADE;
DROP TABLE IF EXISTS banks CASCADE;

CREATE TABLE banks (
  id                  VARCHAR(64)  PRIMARY KEY,
  title               VARCHAR(255) NOT NULL,
  logo                TEXT,
  swift_code          VARCHAR(32),
  contact_first_name  VARCHAR(128),
  contact_last_name   VARCHAR(128),
  contact_email       VARCHAR(255),
  contact_phone       VARCHAR(64),
  endpoint_url        TEXT,
  api_key             TEXT,
  admin_username      VARCHAR(255),
  admin_password      VARCHAR(255),
  require_2fa         BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE cooperatives (
  id                 VARCHAR(64)  PRIMARY KEY,
  name               VARCHAR(255) NOT NULL,
  organisation_type  VARCHAR(64)  NOT NULL DEFAULT 'Cooperative',
  created_at         VARCHAR(32)
);

CREATE TABLE auth_users (
  id              VARCHAR(64)  PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(32)  NOT NULL,
  organisation    VARCHAR(255),
  avatar          TEXT
);

CREATE TABLE farms (
  id        VARCHAR(64)  PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  country   VARCHAR(128),
  province  VARCHAR(128),
  village   VARCHAR(128),
  address   VARCHAR(255),
  size      NUMERIC(10,2),
  owner_id  VARCHAR(64) REFERENCES auth_users(id) ON DELETE SET NULL
);

CREATE TABLE platform_users (
  id               VARCHAR(64)  PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  organisation     VARCHAR(255),
  organisation_id  VARCHAR(64),
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       VARCHAR(32)
);

CREATE TABLE loan_programs (
  id                       VARCHAR(64)  PRIMARY KEY,
  title                    VARCHAR(255) NOT NULL,
  logo                     TEXT,
  cooperative_id           VARCHAR(64) REFERENCES cooperatives(id) ON DELETE SET NULL,
  bank_id                  VARCHAR(64) REFERENCES banks(id)        ON DELETE SET NULL,
  status                   VARCHAR(32)  NOT NULL,
  currency                 VARCHAR(8),
  loan_amount_min          NUMERIC(14,2),
  loan_amount_max          NUMERIC(14,2),
  term_months              INT,
  interest_rate            NUMERIC(6,3),
  type_of_financing        VARCHAR(128),
  grace_period_months      INT,
  crops                    JSONB,
  country                  VARCHAR(128),
  regions                  JSONB,
  description              TEXT,
  application_deadline     VARCHAR(32),
  payment_frequency        VARCHAR(64),
  conditions_requirements  TEXT,
  application_process      JSONB
);

CREATE TABLE loan_applications (
  id                     VARCHAR(64) PRIMARY KEY,
  submission_date        VARCHAR(32),
  applicant_name         VARCHAR(255),
  applicant_email        VARCHAR(255),
  applicant_phone        VARCHAR(64),
  applicant_national_id  VARCHAR(64),
  loan_program_id        VARCHAR(64) REFERENCES loan_programs(id) ON DELETE SET NULL,
  loan_program_title     VARCHAR(255),
  loan_program_logo      TEXT,
  bank_name              VARCHAR(255),
  bank_logo              TEXT,
  amount                 NUMERIC(14,2),
  currency               VARCHAR(8),
  status                 VARCHAR(32) NOT NULL,
  farm                   JSONB,
  farm_reports           JSONB,
  additional_questions   JSONB,
  documents              JSONB,
  loan_details           JSONB
);

CREATE TABLE disbursement_schedule (
  id              SERIAL PRIMARY KEY,
  application_id  VARCHAR(64) NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
  number          INT NOT NULL,
  amount          NUMERIC(14,2),
  date            VARCHAR(32),
  transaction_id  VARCHAR(64),
  status          VARCHAR(32)
);

CREATE TABLE repayment_schedule (
  id              SERIAL PRIMARY KEY,
  application_id  VARCHAR(64) NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
  installment     INT NOT NULL,
  due_date        VARCHAR(32),
  principal       NUMERIC(14,2),
  interest        NUMERIC(14,2),
  total           NUMERIC(14,2),
  transaction_id  VARCHAR(64),
  status          VARCHAR(32)
);

CREATE TABLE activity_log (
  id              SERIAL PRIMARY KEY,
  application_id  VARCHAR(64) NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
  "user"          VARCHAR(128),
  action          VARCHAR(255),
  date_time       VARCHAR(64),
  ip_address      VARCHAR(64)
);

CREATE TABLE application_form_fields (
  id          VARCHAR(64) PRIMARY KEY,
  parent_id   VARCHAR(64) REFERENCES application_form_fields(id) ON DELETE CASCADE,
  label       VARCHAR(255) NOT NULL,
  type        VARCHAR(32)  NOT NULL,
  mandatory   BOOLEAN NOT NULL DEFAULT FALSE,
  subdata     JSONB,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE dashboard_snapshots (
  period  VARCHAR(16) PRIMARY KEY CHECK (period IN ('month','quarter','year')),
  data    JSONB NOT NULL
);
