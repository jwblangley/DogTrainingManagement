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
    'Boris',
    1,
    '2017-05-04',
    'Jackapoo',
    'Male (neutered)',
    'Smol'
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
    'Rosa',
    2,
    '2014-05-04',
    'Labradoodle',
    'Female (neutered)',
    'best girl'
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
    title,
    notes
) VALUES (
    '2025-02-10T17:30',
    'How to sit for beginners',
    'Step 1: sit, Step 2: success!'
);

INSERT INTO session_instructors (
    session_id,
    instructor_id
) VALUES (
    1,
    1
);

INSERT INTO session_dogs (
    session_id,
    dog_id
) VALUES (
    1,
    1
);
INSERT INTO session_dogs (
    session_id,
    dog_id
) VALUES (
    1,
    2
);
INSERT INTO session_dogs (
    session_id,
    dog_id
) VALUES (
    1,
    3
);
