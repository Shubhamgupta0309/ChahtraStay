import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
const router = Router()
router.get("/",(req,res)=>{
    res.status(200).json({
        message:"Welcome in user routes"
    })
})
router.use("/signup",registerUser)
router.use("/login",loginUser)
export default router