CREATE TABLE clients (
    id          SERIAL PRIMARY KEY,
    last_name   varchar(255),
    first_name  varchar(255) NOT NULL,
    email       varchar(511),
    phone       varchar(31)
);
