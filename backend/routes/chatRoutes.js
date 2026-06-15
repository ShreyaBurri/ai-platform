const express = require("express");
const router = express.Router();

const { sql, pool } = require("../config/db");

/* CREATE CHAT */

router.post("/create-chat", async (req, res) => {

  try {

    const { title } = req.body;

    const result = await pool.request()
      .input("title", sql.VarChar, title)
      .query(`
        INSERT INTO chats (title)
        OUTPUT INSERTED.*
        VALUES (@title)
      `);

    res.json(result.recordset[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

/* GET ALL CHATS */

router.get("/chats", async (req, res) => {

  try {

    const result = await pool.request()
      .query(`
        SELECT *
        FROM chats
        ORDER BY created_at DESC
      `);

    res.json(result.recordset);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

/* SAVE MESSAGE */

router.post("/save-message", async (req, res) => {

  try {

    const { chatId, role, message } = req.body;

    await pool.request()
      .input("chatId", sql.Int, chatId)
      .input("role", sql.VarChar, role)
      .input("message", sql.NVarChar, message)
      .input("createdAt", sql.DateTime, new Date())
      .query(`
        INSERT INTO messages (
          chat_id,
          role,
          message,
          created_at
        )
        VALUES (
          @chatId,
          @role,
          @message,
          @createdAt
        )
      `);

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

/* GET MESSAGES */

router.get("/messages/:chatId", async (req, res) => {

  try {

    const { chatId } = req.params;

    const result = await pool.request()
      .input("chatId", sql.Int, chatId)
      .query(`
        SELECT
          id,
          role,
          message,
          created_at
        FROM messages
        WHERE chat_id = @chatId
        ORDER BY created_at ASC
      `);

    res.json(result.recordset);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

/* RENAME CHAT */

router.put("/rename-chat/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const { title } = req.body;

    await pool.request()
      .input("id", sql.Int, id)
      .input("title", sql.VarChar, title)
      .query(`
        UPDATE chats
        SET title = @title
        WHERE id = @id
      `);

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

/* DELETE CHAT */

router.delete("/delete-chat/:id", async (req, res) => {

  try {

    const { id } = req.params;

    /* DELETE MESSAGES FIRST */

    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM messages
        WHERE chat_id = @id
      `);

    /* DELETE CHAT */

    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        DELETE FROM chats
        WHERE id = @id
      `);

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  }

});

module.exports = router;
