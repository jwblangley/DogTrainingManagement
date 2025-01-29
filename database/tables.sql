CREATE TABLE clients (
    id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    last_name   VARCHAR(255),
    first_name  VARCHAR(255) NOT NULL,
    email       VARCHAR(511),
    phone       VARCHAR(31)
);

CREATE TABLE dogs (
    id          SERIAL PRIMARY KEY,
    owner_id    INTEGER REFERENCES clients(id),
    pet_name    VARCHAR(255) NOT NULL,
    breed       VARCHAR(255),
    notes       VARCHAR(2047)
);
