const express = require("express");
const router = express.Router();
const fs = require("fs");
const upload = require("../middleware/upload");
const Users = require("../models/userModel");

router.get("/", (req, res) => {
  Users.find()
    .sort({ createdAt: -1 })
    .then((data) => {
      res.render("userList", { result: data });
    })
    .catch((err) => console.log(err));
});

router.get("/create-user", (req, res) => {
  res.render("createUser.ejs");
});

router.get("/about", (req, res) => {
  res.render("about.ejs");
});

// find all user in the db
router.get("/userList", (req, res) => {
  Users.find()
    .sort({ createdAt: -1 })
    .then((data) => {
      res.render("userList", { result: data });
    })
    .catch((err) => console.log(err));
});

//  to display all the values ;
router.get("/edit-user/:id", (req, res) => {
  console.log(req.params.id);
  Users.findById(req.params.id)
    .then((data) => {
      res.render("editUser", { result: data });
    })
    .catch((err) => console.log(err));
});

router.post("/multiple-form", upload.array("images"), (req, res) => {
  // console.log(req.files);
  const User = new Users({
    User_name: req.body.User_name,
  });

  if (req.files) {
    let data = [];
    for (let i = 0; i < req.files.length; i++) {
      // console.log(req.files[i].filename);
      data.push({
        _id: i,
        Url: req.files[i].filename,
        Desc: req.body.User_desc[i],
      });
    }
    User.avatar = data;
  }

  User.save()
    .then((data) => {
      res.redirect("/user/userList");
    })
    .catch((err) => console.log(err));
});

// get an individual details for a user
router.get("/:id", (req, res) => {
  // console.log(req.params.id);
  Users.findById(req.params.id)
    .then((data) => {
      res.render("userDetails", { result: data });
    })
    .catch((err) => console.log(err));
});

// edit a single order  details
router.post("/edit-user/:id", upload.array("images"), async (req, res) => {
  console.log("old image id :" + req.body.old_Desc);
  console.log("old image url :", req.body.old_avatar);
  console.log("user selected images :" + req.body.sel_imgUrl);

  // if (req.body.index.sel_imgUrl.length > 1) {
  //   var index = req.body.sel_imgUrl.map((i) => Number(i));
  // } else {
  //   index = parseInt(req.body.index);
  // }
  var index =  req.body.sel_imgUrl;
  console.log(index);
  let id = req.params.id;
  var data = [];
  var result = [];
  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      // console.log(req.files[i].filename);
      data.push({
        Url: req.files[i].filename,
        Desc: req.body.old_Desc[i],
      });
      result.push(req.files[i].filename);
    }
  }
  console.log("data in push",data[0].Url);
  console.log("result length ;",result.length );
  if (result.length > 1) {
    const User = await Users.findOne({ _id: id});
    User.avatar.forEach((ele,i) => {
      console.log("result in push :",result[i]);
      console.log(ele);
      console.log("the value in i :",i);
          Users.updateOne( { _id: id, "avatar.Url": index[i] }, { $set:{"avatar.$.Url": result[i]} })
          .then(data=>{
            res.redirect("/user/userList");
          }).catch(err=>{
            console.log(err);
          });
    })

    // index.forEach((ele,i)=>{
    //     Users.updateOne( { _id: id, "avatar._id": ele }, { $set:{"avatar.$.Url":data[i].Url} })

    // })
      // try {
      //   for (let i = 0; i < index.length; i++) {
      //     const file = req.body.old_avatar[i];
      //     const filepath = file.trim();
      //     // console.log("imagepath :",file);
      //     fs.unlinkSync("./uploads/" + filepath);
      //   }
      // } catch (err) {
      //   console.log(err);
      // }
    
  } else {
    try {
      const update = await Users.updateOne(
        { _id: id, "avatar.Url": index },  
        {
          $set: {
            "avatar.$.Url": result,
          },
        }
      ).then((datas) => {
        res.redirect("/user/userList");
        // try {
        //   // for(let i=0;i< req.body.old_Url.length;i++){
        //   const file = req.body.old_avatar[0];
        //   const filepath = file.trim();
        //   // console.log("imagepath :",file);
        //   fs.unlinkSync("./uploads/" + filepath);
        //   // }
        // } catch (err) {
        //   console.log(err);
        // }
      });
    } catch (err) {
      console.log(err);
    }
  }
});

// delete an individual user
router.delete("/del/:id", (req, res) => {
  console.log(req.params.id);
  Users.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.json({ redirect: "/user/userList" });
    })
    .catch((err) => console.log(err));
});

// delete a individual image from the user
router.delete("/user-del/:id", (req, res) => {
  console.log(req.body.data);
  let id = req.params.id;
  let data = req.body.data;
  // res.json({ redirect: "/user/userList" });
    Users.updateOne({ _id: id }, { "$pull": {"avatar":{"Url": data} } }, { safe: true, multi:true })
    .then((data) => {
      res.json({ redirect: "/user/userList" });
    })
    .catch((err) => console.log(err)); 
});

module.exports = router;
