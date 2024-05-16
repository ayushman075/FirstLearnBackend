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


const port = process.env.PORT||8000;
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

