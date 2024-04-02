/* -------------------------
        mooc CONTEXT
---------------------------- */

CREATE TABLE mooc__users (
	id UUID PRIMARY KEY,
	name VARCHAR(255),
	email VARCHAR(255),
	profile_picture VARCHAR(255),
	status VARCHAR(255),
	finished_courses TEXT
);
