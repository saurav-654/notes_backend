const note = require("../models/note");

const deleteNote = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const { noteId } = req.params;

        // Find and delete the note
        const deletedNote = await note.findOneAndDelete({
            noteId: noteId,
            tenantId: tenantId
        });

        if (!deletedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            data: {
                deletedNoteId: noteId,
                deletedNote: deletedNote
            }
        });

    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { deleteNote };