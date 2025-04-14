CREATE TABLE IF NOT EXISTS exchange_rates (
    id SERIAL PRIMARY KEY,
    base_currency CHAR(3),
    target_currency CHAR(3),
    rate DECIMAL(14,6),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (base_currency, target_currency)
);