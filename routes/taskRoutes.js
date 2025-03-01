const express = require('express');
const { createClient } = require('@supabase/supabase-js');
// const authenticate = require('../middleware/authMiddleware');

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Create Task
router.post('/create-task', async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            console.log("Missing details");
        } else {
            const { data, error } = await supabase.from('tasks').insert([{ title, description }]);
            if (error) return res.status(400).json({ error: error.message });
            res.json({ message: 'Task created successfully', data:data });
        }
    } catch (error) {
        console.log("Error : ", error);
        res.json({ error: error.message })
    }
});

// Get Tasks
router.get('/get-task', async (req, res) => {
    try {
        const { data, error } = await supabase.from('tasks').select('*');
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (error) {
        console.log("Error : ", error);
        res.json({ error: error.message })
    }
});

// Update Task
router.put('/update-task/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        
        // Check if there is at least one field to update
        if (!title && !description) {
            return res.status(400).json({ error: 'No fields provided to update' });
        }

        // Create an update object dynamically
        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;

        // Perform the update
        const { data, error } = await supabase
            .from('tasks')
            .update(updateFields)
            .eq('id', req.params.id);

        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Task updated successfully', data });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Delete Task
router.delete('/delete-task/:id', async (req, res) => {
    try {
        const { data, error } = await supabase.from('tasks').delete().eq('id', req.params.id);
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.log("Error : ", error);
        res.json({ error: error.message })
    }
});

module.exports = router;
