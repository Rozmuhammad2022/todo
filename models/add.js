import { model, Schema } from "mongoose";

let count = new Schema({
    name:{type:String, required:true},
    count:{type:Number, required:true},
    img:{type:String, required:true},
},
    {
        timestamps:true
    }
);

export default model("count", count);