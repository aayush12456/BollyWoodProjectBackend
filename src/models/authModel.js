const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {Schema}=mongoose
const playListSchema = new Schema({
  movieId: String,
  title: String,
  genres: String,
  rating: String,
  time: String,
  description: String,
  directors: String,
  starring: String,
  date: String,
  heading: String,
  imageUrl: String,
  trailerImage: String,
  trailerUrl: String,
  id: String
}, { _id: false });

const authModel = mongoose.Schema({
firstName:{
type: String,
required: true,
 minLength: 3,
},
lastName:{
    type: String,
    required: true,
     minLength: 3,
    },
email:{
    type: String,
    required: true,
    unique: [true, "Email is already present"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
},
phone:{
    type: String,
    required: true,
    unique: true,
    min: 10,
},
playList: [playListSchema] 
})

authModel.methods.generateAuthToken = async function () {
    try {
      // console.log('toke data',this._id);
      // const token = jwt.sign(
      //   { _id: this._id.toString() },
      //   process.env.registerData,
      //   {
      //     expiresIn: 3600,
      //   }
      // );
      const token = jwt.sign(
          { _id: this._id.toString() },
          'registerData',
          {
            expiresIn: 3600,
          }
        );
      return token;
    } catch (e) {
      res.status(400).send({ mssg: "token does not exist" });
    }
  };
  const registerUser = new mongoose.model("movieRegisterUser", authModel);
// const registerUser = new mongoose.model("ApnaPanUserDatas", authSchema);
module.exports = registerUser;