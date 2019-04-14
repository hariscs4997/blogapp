
var express=require("express"),
app=express(),
method=require("method-override"),
bodyparser=require("body-parser"),
sanitizer=require("express-sanitizer");
mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog",{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(method("_method"));
app.use(sanitizer());
var b=new mongoose.Schema({
title:String,
image:String,
body:String,
created:{type:Date,default:Date.now}
});

var blog=mongoose.model("blog",b);

/*blog.create({
    title:"First",
    image:"https://media.wired.com/photos/599b4cfd4fa6fc733c11e30d/master/pass/iStock-820873602.jpg",
    body:"best"
},function(err,blogs){
    if(err){
        console.log(err);
    }
    else{

    }
})
*/
app.get("/",function(req,res){
res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
blog.find({},function(err,blogs){
    if(err){
        console.log(err);
    }
    else{
        res.render("index",{blogs:blogs});
    }
})

});
app.get("/blogs/new",function(req,res){
res.render("new");
});
app.post("/blogs",function(req,res){
    req.blody.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    })
});
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
            if(err){
                console.log(err);
            }else{
                res.render("show",{blog:foundblog})
            }
    });
})
app.get("/blogs/:id/edit",function(req,res){
  blog.findById(req.params.id,function(err,foundblog){
      if(err){
          console.log(err);
      }else{
          console.log(foundblog);
          res.render("edit",{blog:foundblog});
      }
  })
})
app.put("/blogs/:id",function(req,res){
  //  req.blody.blog.body=req.sanitize(req.body.blog.body);
blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,found){
    if(err){
        console.log("heh");
          res.redirect("/blogs");
    }
    else{
        console.log(found);

res.redirect("/blogs/"+req.params.id);
    }
})
})
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndDelete(req.params.id,function(err,foundblog){
    if(err){
        res.redirect("/blogs");
    }
    else{
        res.redirect("/blogs");
    }
    })
})
app.listen(300);