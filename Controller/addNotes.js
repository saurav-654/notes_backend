const { generateCode } = require("../lib/auth");
const note = require("../models/note");
const tenent = require("../models/tenent");
const User = require("../models/User");

//This is first
const addNotes = async (req,res)=>{
    try{
        const {email,title,content}=req.body;
        const existinguser = await User.findOne({email});
        const count = await note.countDocuments({ ownerId:existinguser._id  });
        console.log(count);
        const checkPro= await tenent.findOne({_id:existinguser.tenantId})
        console.log(checkPro.plan)
        if(count === 3 && checkPro.plan !== "PRO"){
            return res.status(401).json({
                success:"false",
                message:"You cant add more than 3 notes"
            })
        }
        const code = generateCode();
        const data = {
            noteId:code,
            email,
            title,
            content,
            tenantId:existinguser.tenantId,
            ownerId:existinguser._id

        }
        const newNote = note(data);
        const savedNotes = await newNote.save();
        return res.status(201).json({
                success :"true",
                message:"Notes is added"
            })
            
        
    }catch(error){
        console.error('Add user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });

    }
}


module.exports ={addNotes};