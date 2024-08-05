import mongoose from "mongoose";

const carSchema = new mongoose.Schema({

    car_name : {
      type : String,
      required : true
    },

    manufacturing_year : {
        type : Number,
        required : true
    },

    price : {
        type : Number,
        required : true
    }

}
,{
    timestamps : true
});

export const Car = mongoose.model("Car",carSchema);