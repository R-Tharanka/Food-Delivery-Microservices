import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Restaurant Schema
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true, 
    },
    contactNumber: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String, 
      required: true,
    },
    admin: {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the restaurant document
restaurantSchema.pre('save', async function (next) {
  if (this.isModified('admin.password')) {
    const salt = await bcrypt.genSalt(10);
    this.admin.password = await bcrypt.hash(this.admin.password, salt);
  }
  next();
});

// Method to compare password for login
restaurantSchema.methods.compareAdminPassword = async function (password) {
  return await bcrypt.compare(password, this.admin.password);
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
