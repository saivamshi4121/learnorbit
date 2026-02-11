USE cyberorbit365;
DELETE FROM users WHERE email='instructor@learnorbit.com';
INSERT INTO users (name, email, password_hash, role) 
VALUES ('Instructor', 'instructor@learnorbit.com', '$2b$10$2JHvSia3UzOUSOCu.8XcyODic5D4UTdp0bLPf09inj5aZ9zvAh9gm', 'instructor');
