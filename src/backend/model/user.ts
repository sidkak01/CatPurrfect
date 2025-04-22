import { compare, genSalt, hash } from 'bcryptjs';
import { model, Schema } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
  role: string;

  isModified(password: string): boolean;
  comparePassword(password: string, callback: (err: any, isMatch: boolean) => void): void;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, lowercase: true, trim: true },
  username: { type: String },
  password: { type: String },
  role: { type: String }
});

userSchema.pre<IUser>('save', function (next): void {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    hash(user.password, salt, (error, hashedPassword) => {
      if (error) {
        return next(error);
      }

      user.password = hashedPassword;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: (err: any, isMatch: boolean) => void
): void {
  compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err, false);
    }
    callback(null, isMatch);
  });
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  }
});

const User = model<IUser>('User', userSchema);

export type { IUser };
export default User;
