const note = require("../models/note");
const tenent = require("../models/tenent");
const User = require("../models/User");

const getNotes =async (req,res)=>{
    try{
      console.log("getnotes started ----------------------")
        const tenantId = req.user.tenantId;
        const userId = req.user.id;
        const tenant= await tenent.findById(tenantId);
        console.log("------------------------------")
        console.log(tenant);
        console.log("------------------------------")
        console.log(tenantId);
        const userdata = await User.findOne({_id:userId});
        console.log("-----------------------------");
        console.log(userdata);
        
        const notes = await note.find({tenantId }).sort({createdAt: -1});
        console.log(notes);
        return res.status(200).json({
            success: true,
            message: "Notes retrieved successfully",
            data:[ notes,userdata, tenant]
        });
    }catch(error){
        console.error(`Get notes error:`,  error);
        res.status(500).json(
            {
                success:false,
                message:'Internal server error'
            }
        )

    }
}

const getSpecificNote = async(req,res)=>{

try {
  const tenantId = req.user.tenantId;
  const { noteId } = req.params;          // <-- destructure

  console.log('Tenant:', tenantId, 'Note:', noteId);

  const noteDoc = await note.findOne({ tenantId, noteId }); // implicit AND

  if (!noteDoc) {
    return res.status(404).json({
      success: false,
      message: "Note not found"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Note is found",
    data: noteDoc
  });
} catch (error) {
  console.error("Get note error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}
}

module.exports = {getNotes,getSpecificNote};