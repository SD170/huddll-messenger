const app = require("express")();
const {Pool} = require("pg");


const pool = new Pool({
    "host": 'localhost',
    "port": 5432,
    "user":"super_sd17",
    "password" : "sd17",
    "database" : "huddllDB"
})

app.get("/users", async (req, res) => {

    //return all rows
    const results = await pool.query(`SELECT * FROM users`)
    console.table(results.rows)
    //send it to the wire
    res.send({"rows": results.rows})
})

app.get("/available_users", async (req, res) => {

    //return all rows
    const results = await pool.query(`SELECT * FROM users WHERE availability_status = TRUE`)
    console.table(results.rows)
    //send it to the wire
    res.send({"rows": results.rows})
})

app.get("/messagenger", async (req, res) => {

    //return all rows
    const results = await pool.query(
        `SELECT u1.username, m.sender, u2.username, mr.receiver_user_id, m.message_content, mr.is_read, m.sent_time, mr.receive_time,m.message_id
        FROM messages m
		INNER JOIN message_receive mr ON mr.message_id = m.message_id
		INNER JOIN users u1 ON u1.user_id = m.sender
		INNER JOIN users u2 ON u2.user_id = mr.receiver_user_id
        WHERE (m.sender=1 AND mr.receiver_user_id = 3) OR (m.sender=3 AND mr.receiver_user_id = 1)
		ORDER BY m.sent_time DESC;`
    )
    console.table(results.rows)
    //send it to the wire
    res.send({"messages": results.rows})
})

app.post("/messagenger", async (req, res) => {

    const senderId = req.body.senderId;
    const receiverId = req.body.senderId;
    //return all rows
    const results = await pool.query(
        `SELECT u1.username, m.sender, u2.username, mr.receiver_user_id, m.message_content, mr.is_read, m.sent_time, mr.receive_time,m.message_id
        FROM messages m
		INNER JOIN message_receive mr ON mr.message_id = m.message_id
		INNER JOIN users u1 ON u1.user_id = m.sender
		INNER JOIN users u2 ON u2.user_id = mr.receiver_user_id
        WHERE (m.sender= ${senderId} AND mr.receiver_user_id = ${receiverId}) 
        OR (m.sender=${receiverId} AND mr.receiver_user_id = ${senderId})
		ORDER BY m.sent_time DESC;`
    )
    console.table(results.rows)
    //send it to the wire
    res.send({"messages": results.rows})
})

app.listen(2021, () => console.log("Listening on port 2021"))
