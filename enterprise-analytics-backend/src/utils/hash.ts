import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashed: string
) => {
  console.log("Comparing password:", password, "with hash:", hashed);
  // console.log("bcrypt version:", bcrypt.compare(password, hashed));
  
  const isMatch = await bcrypt.compare(password, hashed);
console.log("Password match:", isMatch);
return isMatch;

};
