const express = require("express");
const patientRoutes = require('./backend/routes/patients.js')
const physicianRoutes = require('./backend/routes/patients.js')
const mongoose = require("mongoose")

const app = express();
const port = 3001

//middleware
app.use(express.json());

app.use((req, res, next) =>{
  console.log(req.path, req.method)
  next()
})

app.use('/api/patients',patientRoutes)

app.use('/api/physicians',physicianRoutes)

//connect to databse
mongoose.connect("mongodb+srv://comp413:comp413@comp413-border-detectio.pf1mqdq.mongodb.net/?retryWrites=true&w=majority&appName=comp413-border-detection")
.then(()=> {
  app.listen(port, () => {
    console.log("Server is running on port " + port);
  });
})
.catch((error)=>{
  console.log(error)
})

module.exports = app;