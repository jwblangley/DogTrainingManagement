CREATE TABLE clients (
    id          SERIAL PRIMARY KEY,
    last_name   varchar(255) NOT NULL,
    first_name  varchar(255),
    email       varchar(511),
    phone       varchar(31)
);
