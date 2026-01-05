import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

router.post("/register", (req,res)=>{
  const {name,email,password} = req.body;
  bcrypt.hash(password,10,(err,hash)=>{
    db.query("INSERT INTO users(name,email,password) VALUES(?,?,?)",
    [name,email,hash],
    err=>{
      if(err) res.json(err);
      else res.json({message:"Registered"});
    });
  });
});

router.post("/login",(req,res)=>{
  const {email,password}=req.body;
  db.query("SELECT * FROM users WHERE email=?",[email],(err,data)=>{
    if(err) res.json(err);
    if(!data.length) return res.json({message:"User not found"});

    bcrypt.compare(password,data[0].password,(err,result)=>{
      if(!result) return res.json({message:"Wrong password"});

      const token = jwt.sign({id:data[0].id},"secret");
      res.json({token});
    });
  });
});

export default router;
