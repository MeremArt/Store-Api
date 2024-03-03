import { Schema, Document, model } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  featured: boolean;
  rating: number;
  createdAt: Date;
  company: "ikea" | "liddy" | "caressa" | "marcos";
}

const productSchema: Schema<IProduct> = new Schema({
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [20, "name can not be more than 20 characters"],
  },
  price: {
    type: Number,
    required: [true, `product price must be provided`],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
});

const Product = model<IProduct>("Product", productSchema);

export default Product;
