const note = require("../models/note");

const editNote = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const { noteId } = req.params;
        const { title, content } = req.body;

        // Validation
        if (!title && !content) {
            return res.status(400).json({
                success: false,
                message: "At least title or content is required to update"
            });
        }

        // Find and update the note
        const updatedNote = await note.findOneAndUpdate(
            { 
                noteId: noteId, 
                tenantId: tenantId 
            },
            { 
                ...(title && { title }),
                ...(content && { content }),
                updatedAt: new Date()
            },
            { 
                new: true, // Return updated document
                runValidators: true // Run model validations
            }
        );

        if (!updatedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: updatedNote
        });

    } catch (error) {
        console.error('Edit note error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { editNote };