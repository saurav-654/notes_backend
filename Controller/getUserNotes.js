const note = require("../models/note");
const tenent = require("../models/tenent");
const User = require("../models/User");

const getUserNotes = async (req, res) => {
    try {
        console.log("getnotes started ----------------------")
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        
        const tenant = await tenent.findById(tenantId);
        console.log("------------------------------")
        console.log(tenant);
        console.log("------------------------------")
        console.log(tenantId);
        
        const userdata = await User.findOne({ _id: userId });
        console.log("-----------------------------");
        console.log(userdata);
        
        // Create the filter object for consistent querying
        const filter = {
            ownerId: userId,    // Only notes created by this user
            tenantId: tenantId  // Only notes from this tenant
        };
        
        // Fetch all notes
        const notes = await note.find(filter)
            .sort({ createdAt: -1 })  // Most recent first
            .lean(); // Use lean() for better performance when you don't need Mongoose document methods
        
        console.log(`Fetched ${notes.length} notes`);
        console.log(notes);
        
        return res.status(200).json({
            success: true,
            message: "Notes retrieved successfully",
            data: {
                notes: notes,
                user: userdata,
                tenant: tenant
            }
        });
        
    } catch (error) {
        console.error(`Get notes error:`, error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { getUserNotes };
