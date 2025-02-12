INSERT INTO clients (
    active,
    first_name,
    last_name,
    email,
    phone
) VALUES (
    TRUE,
    'John',
    'Smith',
    'johnsmith@example.com',
    '+441234567890'
);

INSERT INTO clients (
    active,
    first_name,
    last_name,
    email,
    phone
) VALUES (
    FALSE,
    'Jane',
    'Smith',
    'janesmith@example.com',
    '+441234567890'
);

INSERT INTO dogs (
    active,
    pet_name,
    owner_id,
    dob,
    breed,
    sex,
    notes
) VALUES (
    TRUE,
    'Kito',
    1,
    '2016-05-04',
    'Unknown Terrier',
    'Male (neutered)',
    'A good boi'
);

INSERT INTO instructors (
    active,
    first_name,
    last_name,
    email,
    phone
) VALUES (
    TRUE,
    'Jane',
    'Doe',
    'janedoe@example.com',
    '+449876543210'
);

INSERT INTO sessions (
    date_time,
    title
) VALUES (
    '2025-02-10T17:30',
    'How to sit for beginners'
);
