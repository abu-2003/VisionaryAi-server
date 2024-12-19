import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const registerUser =async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.json({success:false,message:'Missing Details'})
        }
       const salt = await bcrypt.genSalt(10)
       const hashedPassword  = await bcrypt.hash(password,salt)

       const userData={
        name,
        email,
        password:hashedPassword
       }
       
    const newUser = new userModel(userData)
    const user = await newUser.save() 

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.json({success: true, token,user: {name:user.name}})

    } catch (error) {

        console.log(error)
        res.json({success:false,message: error.message})
    }
}
const loginUser = async(req,res)=>{
 try{
    const {email,password}= req.body;
    const user = await userModel.findOne({email})

    if(!user){
        return res.json({success:false,message:'User does not exist'})
    }
   const isMatch = await bcrypt.compare(password, user.password)

   if(isMatch){
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.json({success: true, token,user: {name:user.name}})

   }else{
    return res.json({success:false,message:'Invalid credentials'})
   }

 }catch(error){

        console.log(error)
        res.json({success:false,message: error.message})
 }
}

const userCredits = async (req,res)=>{
    try {
        const {userId}= req.body
        const user = await userModel.findById(userId)
 res.json({success:true,credits:user.creditBalance, user:{name:user.name}})
         

    } catch (error) {
        
        console.log(error.message)
        res.json({success:false,message: error.message})
    }
}
//

const purchaseCredits = async (req, res) => {
    try {
      const { userId, planId } = req.body;
      const user = await userModel.findById(userId);
  
      // Check if the user exists
      if (!user) {
        return res.json({ success: false, message: 'User not found' });
      }
  
      // Define the price and credits based on the planId
      const plans = [
        { id: 'Basic', price: 10, credits: 100 },
        { id: 'Advanced', price: 20, credits: 250 },
        { id: 'Business', price: 50, credits: 750 },
      ];
  
      const selectedPlan = plans.find((plan) => plan.id === planId);
  
      if (!selectedPlan) {
        return res.json({ success: false, message: 'Invalid plan' });
      }
  
      // Update the user's credit balance
      user.creditBalance += selectedPlan.credits;
      await user.save();
  
      res.json({
        success: true,
        credits: user.creditBalance,
        message: `Successfully purchased ${selectedPlan.credits} credits`,
      });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  export { registerUser, loginUser, userCredits, purchaseCredits };






