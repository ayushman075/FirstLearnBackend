import dotenv from "dotenv";
import express from 'express';
const app = express();
import connectDB from "./src/db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
  path:'.env'
});

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,
  limit:"16kb"
}));
app.use(express.static("public"));
app.use(cookieParser())


//route import 
import {userRouter} from './src/routes/user.routes.js'
import { batchRouter } from "./src/routes/batch.routes.js";
import { subscribeRouter } from "./src/routes/subscribe.routes.js";
import { materialRouter } from "./src/routes/material.routes.js";
import { assignmentRouter } from "./src/routes/assignment.route.js";
import { announcementRouter } from "./src/routes/announcement.route.js";


//route declaration
app.use("/api/v1/user",userRouter)
app.use("/api/v1/batch",batchRouter)
app.use("/api/v1/subscribe",subscribeRouter)
app.use("/api/v1/material",materialRouter)
app.use("/api/v1/assignment",assignmentRouter)
app.use("/api/v1/announcement",announcementRouter)

const port = process.env.PORT||3005;
connectDB().then((res)=>
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
).catch(()=>{
//error handling start
console.log("Error connecting to database !!")
//error handling end
});

app.get('/', (req, res) => {
  res.send('Welcome to Firstlearn, on this line you are taking to Firstlearn server !!');
});

