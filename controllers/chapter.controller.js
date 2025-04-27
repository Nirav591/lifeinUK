const pool = require('../config/db');

const addChapter = async (req, res) => {
    try {
        const { name, description } = req.body;
        const icon = req.file ? req.file.filename : null;

        if (!icon) {
            return res.status(400).json({ message: 'Icon image is required' });
        }

        // Check if chapter with same name already exists
        const [existingChapter] = await pool.query('SELECT * FROM chapters WHERE name = ?', [name]);
        if (existingChapter.length > 0) {
            return res.status(400).json({ message: 'Chapter already exists with this name' });
        }

        // Insert new chapter
        await pool.query(
            'INSERT INTO chapters (name, description, icon) VALUES (?, ?, ?)',
            [name, description, icon]
        );

        res.status(201).json({ message: 'Chapter added successfully' });
    } catch (error) {
        console.error('Add Chapter Error:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const getChapters = async (req, res) => {
    try {
        const [chapters] = await pool.query('SELECT id, name, description, icon, created_at FROM chapters');
        res.status(200).json(chapters);
    } catch (error) {
        console.error('Get Chapters Error:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const updateChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const icon = req.file ? req.file.filename : null;

        const [chapter] = await pool.query('SELECT * FROM chapters WHERE id = ?', [id]);
        if (chapter.length === 0) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Prepare update query
        const fields = [];
        const values = [];

        if (name) {
            fields.push('name = ?');
            values.push(name);
        }
        if (description) {
            fields.push('description = ?');
            values.push(description);
        }
        if (icon) {
            fields.push('icon = ?');
            values.push(icon);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        values.push(id); // where id = ?

        await pool.query(`UPDATE chapters SET ${fields.join(', ')} WHERE id = ?`, values);

        res.status(200).json({ message: 'Chapter updated successfully' });
    } catch (error) {
        console.error('Update Chapter Error:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;

        const [chapter] = await pool.query('SELECT * FROM chapters WHERE id = ?', [id]);
        if (chapter.length === 0) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        await pool.query('DELETE FROM chapters WHERE id = ?', [id]);
        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        console.error('Delete Chapter Error:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

module.exports = { addChapter , getChapters,updateChapter,deleteChapter };