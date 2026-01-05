import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";  // ✅ FIXED: * as → default import

// Supported countries: India, USA, UK, Canada, Australia

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  country: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);  // ✅ Works now
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (this: IUser, password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
