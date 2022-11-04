const mongoose = require("mongoose")

const UrlSchema = new mongoose.Schema({

    urlCode:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    longUrl:{
        type:String,
        required:true
    },
    shortUrl : {
        type:String,
        required:true,
        unique:true
    }
})

module.exports = mongoose.model("url",UrlSchema)