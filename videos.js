import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null,"uploads/"),
  filename: (req,file,cb)=> cb(null,Date.now()+"-"+file.originalname)
});

const upload = multer({storage});

function auth(req,res,next){
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.json({message:"Not Authenticated"});
  jwt.verify(token,"secret",(err,user)=>{
    if(err) return res.json(err);
    req.user = user;
    next();
  });
}

router.post("/upload", auth, upload.single("video"), (req,res)=>{
  const {title,privacy} = req.body;
  db.query(
    "INSERT INTO videos(user_id,title,filename,privacy) VALUES(?,?,?,?)",
    [req.user.id,title,req.file.filename,privacy],
    err=>{
      if(err) res.json(err);
      else res.json({message:"Uploaded"});
    }
  );
});

router.get("/public",(req,res)=>{
  db.query("SELECT * FROM videos WHERE privacy='public'",(err,data)=>{
    res.json(data);
  });
});

router.get("/my", auth,(req,res)=>{
  db.query("SELECT * FROM videos WHERE user_id=?",[req.user.id],(err,data)=>{
    res.json(data);
  });
});

router.get("/:id",(req,res)=>{
  db.query("UPDATE videos SET views=views+1 WHERE id=?",[req.params.id]);
  db.query("SELECT * FROM videos WHERE id=?",[req.params.id],(err,data)=>{
    res.json(data[0]);
  });
});

export default router;
