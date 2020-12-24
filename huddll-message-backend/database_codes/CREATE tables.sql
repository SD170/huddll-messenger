DROP TABLE IF EXISTS users ;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS group_;
DROP TABLE IF EXISTS message_receive;
DROP TABLE IF EXISTS group_user;



CREATE TABLE users(
	user_id INT PRIMARY KEY,
	name VARCHAR ( 200 ) NOT NULL,
	username VARCHAR ( 200 ) UNIQUE NOT NULL,
	mail_id VARCHAR ( 200 ) UNIQUE NOT NULL,
	password VARCHAR ( 200 ) NOT NULL,
	availability_status BOOL
);

CREATE TABLE messages(
   	message_id INT PRIMARY KEY,
   	sender INT,
	message_content VARCHAR(800),
	sent_time TIMESTAMP,
	FOREIGN KEY(sender) 
	  	REFERENCES users(user_id)
	  		ON DELETE CASCADE
);

CREATE TABLE group_(
   	group_id INT PRIMARY KEY,
   	invite_link char(200),
	group_name char(200),
	total_member INT
);



CREATE TABLE message_receive(
   	message_receive_id INT PRIMARY KEY,
   	receiver_user_id INT,
	receiver_user_group_id INT,
	message_id INT,
	is_read BOOL,
	receive_time TIMESTAMP,
	FOREIGN KEY(receiver_user_id) 
	  	REFERENCES users(user_id)
	  		ON DELETE SET NULL,
	FOREIGN KEY(receiver_user_group_id) 
		REFERENCES group_(group_id)
			ON DELETE SET NULL,
	FOREIGN KEY(message_id) 
		REFERENCES messages(message_id)
			ON DELETE SET NULL
);

CREATE TABLE group_user(
   	group_id INT,
   	user_id INT,
	FOREIGN KEY(group_id) 
		REFERENCES group_(group_id)
			ON DELETE SET NULL,
	FOREIGN KEY(user_id) 
		REFERENCES users(user_id)
			ON DELETE SET NULL
);

