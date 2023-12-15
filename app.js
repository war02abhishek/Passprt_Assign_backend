import express from "express"
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"
import { createCanvas, loadImage } from 'canvas';
import { v4 as uuidv4 } from 'uuid';


const __dirname = path.resolve();
const app=express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const server=app.listen(4000, () => {
  console.log("Server is running on  http://localhost:" + 4000);
});

app.get('/',(req,res)=>{
      res.send(' hello ticket generator ')
})


// Serve static files from the "public" directory
app.use(express.static('public'));
app.post('/generate-ticket', async (req, res) => {
  try {
    const { experienceName, date, numberOfPersons, customerName } = req.body;
    console.log(req.body);

    // Create a canvas
    const canvas = createCanvas(500, 1000);//canvas behind it
    const ctx = canvas.getContext('2d');
    const bookingId = uuidv4();

    // Load an image (optional)
    const image = await loadImage('./test2.jpg');
    ctx.drawImage(image, 0, 0, 500, 1000);//orignal image ke dimensions

    // Add custom text including user details
    ctx.font = '21px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`${bookingId || '#bookingId'}`, 20, 30);
    ctx.fillText(`${experienceName || 'No experienceName provided'}`, 50, 310);
    ctx.fillText(`${date || 'No date provided'}`, 50, 420);
    ctx.fillText(`${customerName || 'John Doe'}`, 50, 520);
    ctx.fillText(`${numberOfPersons || '#noOfPerson'}`, 410, 520);

    // Convert the canvas to a Base64 string
    const base64Image = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');

    // Send the Base64 image in the response
    res.status(200).json({ base64Image });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
