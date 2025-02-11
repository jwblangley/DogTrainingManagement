CREATE TABLE clients (
    id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    active      BOOLEAN DEFAULT TRUE,
    last_name   VARCHAR(255),
    first_name  VARCHAR(255) NOT NULL,
    email       VARCHAR(511),
    phone       VARCHAR(31)
);

CREATE TABLE dogs (
    id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    active      BOOLEAN DEFAULT TRUE,
    pet_name    VARCHAR(255) NOT NULL,
    owner_id    INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    dob         DATE,
    breed       VARCHAR(255),
    sex         VARCHAR(63),
    notes       VARCHAR(2047)
);

CREATE TABLE instructors (
    id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    active      BOOLEAN DEFAULT TRUE,
    last_name   VARCHAR(255),
    first_name  VARCHAR(255) NOT NULL,
    email       VARCHAR(511),
    phone       VARCHAR(31)
);
