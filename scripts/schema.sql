-- AgriFinance MySQL schema
-- Targets MySQL 8 (Aiven). Run once before seed.ts.
-- Drops in reverse dependency order so re-running is safe.

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS repayment_schedule;
DROP TABLE IF EXISTS disbursement_schedule;
DROP TABLE IF EXISTS loan_applications;
DROP TABLE IF EXISTS loan_programs;
DROP TABLE IF EXISTS application_form_fields;
DROP TABLE IF EXISTS dashboard_snapshots;
DROP TABLE IF EXISTS platform_users;
DROP TABLE IF EXISTS farms;
DROP TABLE IF EXISTS auth_users;
DROP TABLE IF EXISTS cooperatives;
DROP TABLE IF EXISTS banks;

SET FOREIGN_KEY_CHECKS = 1;

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
  size      DECIMAL(10,2),
  owner_id  VARCHAR(64),
  CONSTRAINT fk_farms_owner FOREIGN KEY (owner_id) REFERENCES auth_users(id) ON DELETE SET NULL
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
  cooperative_id           VARCHAR(64),
  bank_id                  VARCHAR(64),
  status                   VARCHAR(32)  NOT NULL,
  currency                 VARCHAR(8),
  loan_amount_min          DECIMAL(14,2),
  loan_amount_max          DECIMAL(14,2),
  term_months              INT,
  interest_rate            DECIMAL(6,3),
  type_of_financing        VARCHAR(128),
  grace_period_months      INT,
  crops                    JSON,
  country                  VARCHAR(128),
  regions                  JSON,
  description              TEXT,
  application_deadline     VARCHAR(32),
  payment_frequency        VARCHAR(64),
  conditions_requirements  TEXT,
  application_process      JSON,
  CONSTRAINT fk_lp_coop FOREIGN KEY (cooperative_id) REFERENCES cooperatives(id) ON DELETE SET NULL,
  CONSTRAINT fk_lp_bank FOREIGN KEY (bank_id)        REFERENCES banks(id)        ON DELETE SET NULL
);

CREATE TABLE loan_applications (
  id                     VARCHAR(64) PRIMARY KEY,
  submission_date        VARCHAR(32),
  applicant_name         VARCHAR(255),
  applicant_email        VARCHAR(255),
  applicant_phone        VARCHAR(64),
  applicant_national_id  VARCHAR(64),
  loan_program_id        VARCHAR(64),
  loan_program_title     VARCHAR(255),
  loan_program_logo      TEXT,
  bank_name              VARCHAR(255),
  bank_logo              TEXT,
  amount                 DECIMAL(14,2),
  currency               VARCHAR(8),
  status                 VARCHAR(32) NOT NULL,
  farm                   JSON,
  farm_reports           JSON,
  additional_questions   JSON,
  documents              JSON,
  loan_details           JSON,
  CONSTRAINT fk_la_lp FOREIGN KEY (loan_program_id) REFERENCES loan_programs(id) ON DELETE SET NULL
);

CREATE TABLE disbursement_schedule (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  application_id  VARCHAR(64) NOT NULL,
  number          INT NOT NULL,
  amount          DECIMAL(14,2),
  date            VARCHAR(32),
  transaction_id  VARCHAR(64),
  status          VARCHAR(32),
  CONSTRAINT fk_ds_app FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
);

CREATE TABLE repayment_schedule (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  application_id  VARCHAR(64) NOT NULL,
  installment     INT NOT NULL,
  due_date        VARCHAR(32),
  principal       DECIMAL(14,2),
  interest        DECIMAL(14,2),
  total           DECIMAL(14,2),
  transaction_id  VARCHAR(64),
  status          VARCHAR(32),
  CONSTRAINT fk_rs_app FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
);

CREATE TABLE activity_log (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  application_id  VARCHAR(64) NOT NULL,
  user            VARCHAR(128),
  action          VARCHAR(255),
  date_time       VARCHAR(64),
  ip_address      VARCHAR(64),
  CONSTRAINT fk_al_app FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
);

CREATE TABLE application_form_fields (
  id          VARCHAR(64) PRIMARY KEY,
  parent_id   VARCHAR(64),
  label       VARCHAR(255) NOT NULL,
  type        VARCHAR(32)  NOT NULL,
  mandatory   BOOLEAN NOT NULL DEFAULT FALSE,
  subdata     JSON,
  sort_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_aff_parent FOREIGN KEY (parent_id) REFERENCES application_form_fields(id) ON DELETE CASCADE
);

CREATE TABLE dashboard_snapshots (
  period  ENUM('month','quarter','year') PRIMARY KEY,
  data    JSON NOT NULL
);
