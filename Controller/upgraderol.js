const tenent = require("../models/tenent");
const User = require("../models/User");

const upgraderole = async(req,res)=>{
    try{
        console.log("upgrade start")
        const slug = req.params;
        const adminid =req.user.id;
        console.log("admin main ",adminid);
        const userdata = await User.findOne({_id:adminid});
        console.log(userdata);
        if(userdata.role !== "ADMIN"){
            return res.status(401).json({
                success:false,
                message:"Only Admin can Upgrade "
            })
        }
        const tenant = await tenent.findOne({_id:userdata.tenantId});
        if(tenant.plan === 'PRO'){
            return res.status(400).json({
                success:false,
                message:"Tenant is already on pro"
            })
        }
        const updatedTenant = await tenent.findOneAndUpdate({_id:userdata.tenantId},{plan:"PRO", upgradedAt: new Date()},{new:true});
        return res.status(200).json({
            success: true,
            message: `Tenant plan upgraded to successfully`,
            data: {
                tenantId: updatedTenant._id,
                slug: updatedTenant.slug,
                name: updatedTenant.name,
                previousPlan: tenant.plan,
                newPlan: updatedTenant.plan,
                upgradedAt: updatedTenant.upgradedAt,
               
            }
        });

     } catch (error) {
        console.error('Upgrade role error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = { upgraderole };