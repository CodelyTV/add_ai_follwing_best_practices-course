/* -------------------------
        mooc CONTEXT
---------------------------- */

CREATE TABLE mooc__users (
	id UUID PRIMARY KEY,
	name VARCHAR(255),
	email VARCHAR(255),
	profile_picture VARCHAR(255),
	status VARCHAR(255),
	suggested_courses TEXT
);

CREATE TABLE mooc__user_course_suggestions (
	user_id UUID PRIMARY KEY,
	completed_courses TEXT,
	suggested_courses TEXT
);
