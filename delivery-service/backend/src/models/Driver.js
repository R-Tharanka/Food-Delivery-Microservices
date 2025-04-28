import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DriverSchema = new mongoose.Schema({
  // Identity
  name: { 
    type: String, 
    required: [true, 'Driver name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Invalid email format'
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    select: false
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: (phone) => /^[0-9]{10,15}$/.test(phone),
      message: 'Invalid phone number (10-15 digits)'
    }
  },

  // Vehicle Information
  vehicleType: {
    type: String,
    enum: {
      values: ['bike', 'car', 'truck'],
      message: 'Vehicle type must be bike, car, or truck'
    },
    required: [true, 'Vehicle type is required']
  },
  location: {
    type: {
      type: String, // default: "Point"
      enum: ["Point"]
    },
    coordinates: [Number, Number] // longitude, latitude
  },
  
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    uppercase: true,
    validate: {
      validator: (num) => /^[A-Z0-9-]{3,15}$/.test(num),
      message: 'Invalid vehicle number format'
    }
  },

  // Operational Data
  status: {
    type: String,
    enum: ['available', 'on-delivery', 'offline'],
    default: 'available'
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

DriverSchema.index({ location: "2dsphere" });

// Password Hashing Middleware
DriverSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password Comparison Method
DriverSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    console.error('Password comparison error:', err);
    return false;
  }
};


const Driver = mongoose.model("Driver", DriverSchema);
export default Driver;