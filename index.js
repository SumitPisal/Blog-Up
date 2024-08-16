const express = require('express')
const app = express();
const path = require('path');
app.set('view engine','ejs');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const {chechforAuthentication}  = require('./middlewares/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');

mongoose.connect("mongodb://127.0.0.1:27017/blog").then((e) => console.log('mongodb connected'));
app.set('views',path.resolve('./views'))
app.use(express.urlencoded({extended:false}));

//the below line of code is used to say that the image is being statically served and server do not take 
// it as a route
app.use('/images', express.static(path.join(__dirname, 'images')));

//app.use(express.json());
app.use(cookieParser());
app.use(chechforAuthentication("token")); 
//app.use(express.static(path.resolve('./images')));
app.get('/',async (req,res) => {
   const allBlogs = await Blog.find({});
   return res.render('home',{
      blogs:allBlogs,
      user:req.user,
   });
});

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(8004,() => console.log('ok bhai'));
// partials in ejs are basically components that can be used in different pages to avoid repetative pages
// all the varialbles that we send from backend are stored in locals object , that is we can access 
// those variables in frontend using this locals object