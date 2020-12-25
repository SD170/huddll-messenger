SELECT u1.username, m.sender, u2.username, mr.receiver_user_id, m.message_content, mr.is_read, m.sent_time, mr.receive_time,m.message_id
        FROM messages m
		INNER JOIN message_receive mr ON mr.message_id = m.message_id
		INNER JOIN users u1 ON u1.user_id = m.sender
		INNER JOIN users u2 ON u2.user_id = mr.receiver_user_id
        WHERE m.sender=1 AND mr.receiver_user_id = 3 AND m.sender=3 AND mr.receiver_user_id = 1
		ORDER BY m.sent_time ASC;