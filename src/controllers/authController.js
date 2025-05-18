
const authUser=require('../models/authModel')
const nodemailer = require('nodemailer');
exports.register = async (req, res) => {
    try {
        const UserData = new authUser({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
           
        });
        const User = await UserData.save();
        res.status(201).send({ mssg: 'Data registered Successfully',user:User });
    } catch (e) {
        console.error(e);
        res.status(401).send({ mssg: 'Data does not added' });
    }
};
const generateRandomCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};
exports.login = async (req, res) => {
    try {
      const phone = req.body.phone;
      const userLoginObj = await authUser.findOne({ phone: phone });
      console.log('user login obj',userLoginObj)
  
      if (!userLoginObj) {
        res.status(400).send({ mssg: "user login obj does not exist", response: 400 });
        return;
      }
     else{
        const randomCode = generateRandomCode(); 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'aayushtapadia28@gmail.com',
                pass: 'azye qakf tdgf zevj'
            }
        });
        const mailOptions = {
            from: 'aayushtapadia28@gmail.com',
            to: userLoginObj.email,
            subject: `Hey ${userLoginObj.firstName}`,
            html: `<h1 style="text-Align:center; font-size:30px;font-weight:bold">Bollywood Hungama</h1>
            <hr style="color:grey;"/>
            <p style="padding-top:1rem;font-size:0.9rem">Dear ${userLoginObj.firstName}, your Login Otp is 
            <span style="font-weight:bold;font-size:0.9rem">${randomCode}</span></p>`
        };

        // Send the email
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', result);
        res.status(200).json({ mssg: "Email sent successfully" ,phone:phone,otp:randomCode});
     }
    } catch (e) {
      res.status(400).send({ mssg: "Wrong login details. Please try again.", response: 400 });
    }
  };
  exports.compareLoginWithOtp=async (req,res)=>{
    try{
     const OTP=req.body.otp
     const phone=req.body.phone
    const loginObj=await authUser.findOne({phone:phone})
     const token = await loginObj.generateAuthToken();
      res.status(201).send({mssg:'Login Successfully',token:token,loginUserObj:loginObj}) 
    }catch(e){
        res.status(400).send({mssg:"Wrong login details. Please try again.",response:400})
    }
}
exports.compareLoginWithOtp=async (req,res)=>{
    try{
     const OTP=req.body.otp
     const phone=req.body.phone
    const loginObj=await authUser.findOne({phone:phone})
     const token = await loginObj.generateAuthToken();
      res.status(201).send({mssg:'Login Successfully',token:token,loginUserObj:loginObj}) 
    }catch(e){
        res.status(400).send({mssg:"Wrong login details. Please try again.",response:400})
    }
}
exports.addToPlayList=async (req,res)=>{
    try{
    const playListObj=req.body
    console.log('playlist obj',playListObj)
     const phone=req.body.phone
     console.log('phone in playlist',phone)
    const loginObj=await authUser.findOne({phone:phone})
    loginObj.playList.push({
     movieId:playListObj.MovieId,
     title:playListObj.Title,
     genres:playListObj.Genres,
     rating:playListObj.Rating,
     time:playListObj.Time,
     description:playListObj.Description,
     directors:playListObj.Directors,
     starring:playListObj.Starring,
     date:playListObj.Date,
     heading:playListObj.Heading,
     imageUrl:playListObj.ImageUrl,
     trailerImage:playListObj.TrailerImage,
     trailerUrl:playListObj.TrailerUrl,
     id:playListObj.Id
    })
    const finalLoginObj=await loginObj.save()
      res.status(201).send({mssg:'playlist added Successfully',playListArray:finalLoginObj.playList}) 
    }catch(e){
        res.status(400).send({mssg:"Wrong login details. Please try again.",response:400})
    }
}
exports.getToPlayList=async (req,res)=>{
    try{
  const id=req.params.id      
  const phone = req.query.phone;
  const playlistObj=await authUser.findOne({phone:phone})
  const playListArray=playlistObj.playList
  res.status(201).send({mssg:'playlist get Successfully',playListArray:playListArray}) 
    }catch(e){
        res.status(400).send({mssg:"Wrong login details. Please try again.",response:400})
    }
}
exports.deleteToPlayList=async (req,res)=>{
    try{
  const id=req.params.id      
  const phone=req.body.phone
  const playlistObj=await authUser.findOne({phone:phone})
  const playListArray=playlistObj.playList
  const title=req.body.title
  const updatedUser = await authUser.findOneAndUpdate(
    { phone: phone },
    {
      $pull: {
        playList: { title: title } // remove the object where Title matches
      }
    },
    { new: true } // returns the updated document
  );
  if (!updatedUser) {
    return res.status(404).send({ mssg: "User not found", response: 404 });
  }
  res.status(201).send({mssg:'playlist get Successfully',playListArray:updatedUser.playList}) 
    }catch(e){
        res.status(400).send({mssg:"Wrong login details. Please try again.",response:400})
    }
}
exports.deleteProfile=async (req,res)=>{
  try{  
const phone = req.body.phone;
const playlistObj=await authUser.findOne({phone:phone})
const deletedUser = await authUser.findByIdAndDelete(playlistObj._id);
if (!deletedUser) {
  return res.status(404).json({ msg: "User not found" });
}
res.status(201).send({mssg:'delete profile Successfully',deleteUserObj:deletedUser}) 
  }catch(e){
      res.status(400).send({mssg:"Wrong login details. Please try again.",response:400})
  }
}
exports.getAllUser=async (req,res)=>{
  try{
const id=req.params.id
console.log('user in all id',id)      
const allUserData=await authUser.find()
const finalAllUser=allUserData.filter((item)=>item._id.toString()!==id)
res.status(201).send({mssg:'get all user Successfully',getAllUserArray:finalAllUser}) 
  }catch(e){
      res.status(400).send({mssg:"Wrong login details. Please try again.",response:400})
  }
}