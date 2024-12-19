import express from 'express'
import {registerUser,loginUser,userCredits,purchaseCredits } from '../controllers/userController.js'
import userAuth from '../middlewares.js/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/credits',userAuth, userCredits)
userRouter.post('/purchase-credits',userAuth ,purchaseCredits);
export default userRouter

//localhost:4000/api/user/register
//localhost:4000/api/user/login