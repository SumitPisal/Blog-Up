const {Router, urlencoded} = require('express');
const express = require('express')
const multer = require('multer')
const router = Router();
const path = require('path');
const Blog = require('../models/blog')
const app = express();
const Comment = require('../models/comment');

app.use(express.urlencoded({extended:false}));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
     return cb(null, path.resolve('./images'))
    },
    filename: function (req, file, cb) {
      return cb(null,`${file.originalname}`)
    },
  })
  const upload = multer({storage});

  app.use(express.json());


router.post('/add-new',upload.single('coverImage'),async (req,res) => {
    const {title,body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy:req.user_id,
        coverImgUrl:`images/${req.file.filename}`,
    });
    return res.redirect('/');
});

router.get('/add-new',(req,res) => {
    return res.render('addblog',{
        user:req.user,
    });
});

router.get('/:id',async (req,res) => {
   const blog = await Blog.findById(req.params.id).populate("createdBy"); 
   const comments = await Comment.find({blogId : req.params.id}).populate("createdBy");
   return res.render('blog',{
      user:req.user,
      blog,
      comments,
   });
});

router.post('/comment/:blogId',async (req,res) => {
    await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;        