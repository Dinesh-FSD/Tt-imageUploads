const path = require('path');
const multer = require('multer');

let fileStorageEngine = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename : (req,file,cb)=>{
        let ext = path.extname(file.originalname)
        // cb(null,Date.now()+"-"+ file.originalname)
        cb( null,Date.now() + ext )
    }
})

const upload = multer({ 
    storage : fileStorageEngine ,
    fileFilter : (req,file,cb)=>{
        if(
            file.mimetype == "image/png" || 
            file.mimetype == "image/jpg" || 
            file.mimetype == "image/jpeg"
        ){
            cb(null,true);
        }else{
            console.log("only jpeg,jpg and png files are supported");
            cb(null,false);
        }
    },
    limits :{
        fileSize : 1024 *1024 *10
    }
});

module.exports = upload