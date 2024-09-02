import mongoose from "mongoose"

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

export default mongoose.model("url",UrlSchema)