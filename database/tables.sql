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

CREATE TABLE sessions (
    id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date_time   TIMESTAMP NOT NULL,
    title       VARCHAR(1023) NOT NULL,
    notes       VARCHAR(4095)
);

CREATE TABLE session_instructors (
    session_id      INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    instructor_id   INTEGER REFERENCES instructors(id) ON DELETE CASCADE
);

CREATE TABLE session_dogs (
    session_id  INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    dog_id      INTEGER REFERENCES dogs(id) ON DELETE CASCADE
);

CREATE TABLE income_expenses (
    id              INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    value           NUMERIC(12,2) NOT NULL, --  positive=income, negative=expense
    date            DATE NOT NULL DEFAULT NOW(),
    description     VARCHAR(255) NOT NULL,
    client_id       INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    instructor_id   INTEGER REFERENCES instructors(id) ON DELETE SET NULL,
    session_credits INTEGER
)
