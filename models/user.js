const {Schema , model} = require('mongoose');
const {createHmac,randomBytes} = require('crypto');
const {createJwtToken} = require('../services/authentication')
//createaHmac from crypto plugin is used to hash the password
const userSchema = new Schema(
{
    fullName : {
        type:String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    salt : {
        type :String,
    }, //here salt is used for the password hashing purpose
    password:{
        type:String,
        required:true,
    },
    profileImageUrl :{
        type:String,
        default:'../images/defaulte_2.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        //enum means either of the values can only be assigned if not so then mongoose throws error
        default:"USER",
    },
},
    {timestamps:true}
);

// the below userSchema function runs when request is send to login page
userSchema.pre("save",function (next) {
    const user=this; // here this contains all the info of user who has sent request to login
    if(!user.isModified("password")) return;
    // this isModified is used to check if password is set new or changed if not no need to hash the password
    const salt = randomBytes(16).toString();
    // here salt contains a token like 16 character unique value for each user
    const hashedPassword = createHmac('sha256',salt).update(user.password).digest('hex');
    this.salt = salt;
    this.password = hashedPassword;
    next();
});
// when we write normal function this keyword is used to take all information of user's sent request
userSchema.static("matchPassword",async function(email,password) {
    const user = await this.findOne({email});
    if(!user) throw new Error('User Invalid');
    const hashedPassword = user.password;
    const salt = user.salt;
    const userProvidedHash = createHmac("sha256",salt).update(password).digest('hex');
    if(hashedPassword !== userProvidedHash) throw new Error('User Invalid');
    
    const token = createJwtToken(user);
    return token;
})

const User = model('user',userSchema);
module.exports = User;