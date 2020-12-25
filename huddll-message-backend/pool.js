const express = require('express');
const app = express();

const {Pool} = require("pg");


//cors
const cors = require('cors');
app.use(cors());

//needed to communicate with frontend specially post.
app.use(express.json());
app.use(express.urlencoded({extended:false}));


const pool = new Pool({
    "host": 'localhost',
    "port": 5432,
    "user":"super_sd17",
    "password" : "sd17",
    "database" : "huddllDB"
})

//for setting up table and basic datas.
pool.query(`
    DROP TABLE IF EXISTS users, messages, group_, message_receive, group_user CASCADE;

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

    INSERT INTO 
        users (user_id, name, username, mail_id, password, availability_status)
    VALUES
        (1,'Ronaldo', 'cr7', 'cr7@cr7.com', 'iamronaldo','yes'),
        (2,'messi', 'lm10', 'lm10@lm10.com', 'iammessi','no'),
        (3,'neymar', 'nj10', 'nj10@nj10.com', 'iamneymar','yes'),
        (4,'mbappe', 'km7', 'km7@km7.com', 'iammbappe','no'),
        (5,'lewandowski', 'rl9', 'rl9@rl9.com', 'iamlewandowski','yes'),
        (6,'salah', 'ms10', 'ms10@ms10.com', 'iamsalah','yes'),
        (7,'kane', 'hk10', 'hk10@hk10.com', 'iamkane','yes');
    `)
console.log('done');


app.get("/users", async (req, res) => {

    //return all rows
    const results = await pool.query(`SELECT * FROM users`)
    console.table(results.rows)
    //send it to the wire
    res.send({"rows": results.rows})
})

app.get("/available_users", async (req, res) => {

    //return all rows
    const results = await pool.query(`SELECT user_id, name, username FROM users WHERE availability_status = TRUE`)
    console.table(results.rows)
    //send it to the wire
    res.send({"rows": results.rows})
})

app.post("/messagenger_view", async (req, res) => {

    // console.log(req.body.textReceiver,'bodyyy');
    const receiver_id = req.body.textReceiver;
    const sender_id = req.body.textSender;
    //return all rows
    const results = await pool.query(
        `SELECT u1.username AS sender_username, m.sender AS sender_user_id, u2.username AS receiver_username, mr.receiver_user_id, m.message_content, mr.is_read, m.sent_time, mr.receive_time,m.message_id
        FROM messages m
		INNER JOIN message_receive mr ON mr.message_id = m.message_id
		INNER JOIN users u1 ON u1.user_id = m.sender
		INNER JOIN users u2 ON u2.user_id = mr.receiver_user_id
        WHERE (m.sender=${sender_id} AND mr.receiver_user_id = ${receiver_id}) OR (m.sender=${receiver_id} AND mr.receiver_user_id = ${sender_id})
		ORDER BY m.sent_time ASC;`
    )
    console.table(results.rows)
    //send it to the wire
    res.send({"messages": results.rows})
})

app.post("/messagenger_create", async(req, res) => {

    const {message_id,sender_id,message_body,message_receive_id,receiver_id,is_read,sent_time,receive_time} = req.body;
    //return all rows
    const temp_msg_1 = message_body.replace("'", " ");
    // const clean_message_body = temp_msg_1.replace(""", "\"");
    console.log('yooo',message_id,sender_id,message_body,message_receive_id,receiver_id,is_read);
    await pool.query(
        `INSERT INTO 
        messages (message_id, sender, message_content, sent_time)
        VALUES
        (${message_id},${sender_id}, '${temp_msg_1}', '${sent_time}');

        INSERT INTO 
        message_receive (message_receive_id, receiver_user_id, message_id, is_read, receive_time)
        VALUES
        (${message_receive_id},${receiver_id}, ${message_id}, ${is_read}, '${receive_time}');`,
    )
    // console.table(results.rows)
    //send it to the wire
    // console.log(response,'response')
    res.send({"alert": "Message sent successfully"});
})

app.listen(2021, () => console.log("Listening on port 2021"))
