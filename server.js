const express = require('express')
const {Pool} = require('pg')
require('dotenv').config()

const app = express()    
app.use(express.json())
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

app.get("/users", async (req, res) => {
    try {
        const allUsers = await pool.query(
            'SELECT * FROM Users'
        )
        res.json(allUsers.rows)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }  
})

app.get('/users/:user_id/posts', async (req, res) => {
    const {user_id} = req.params
    try {
        const userPosts = await pool.query(
            'SELECT * FROM Posts WHERE user_id = $1',
            [user_id]
        )
        res.json(userPosts.rows)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

app.post("/users", async (req, res) => {
    const {username, email} = req.body
    try {
        const newUser = await pool.query(
            `INSERT INTO Users (username, email) VALUES ($1, $2) RETURNING *`,
            [username, email]
        )
        res.json(newUser.rows[0])
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }  
})

app.post("/posts", async (req, res) => {
    const {title, content, user_id} = req.body
    try {
        const newPost = await pool.query(
            'INSERT INTO Posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, content, user_id]
        )
        res.json(newPost.rows[0])
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})