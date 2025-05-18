const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
// mongoose.connect("mongodb://127.0.0.1/movieBackend").then(()=>{
//     console.log("Database connected successfully")
// }).catch(()=>{
//     console.log("unable to connect ")
// })

mongoose.connect(process.env.MONGODB_CONNECT_URL,{
    serverSelectionTimeoutMS: 5000, // Increase timeout
    ssl: true, // Enable SSL
    tlsAllowInvalidCertificates: true, 
    family:4
}).then(()=>{
    console.log("Database connected successfully in production")
}).catch((err)=>{
    console.log("unable to connect ",err)
})