import bcrypt from "bcrypt";

export const passhash = async (opass) => {
  try {
    const saltRounds = 10;
    const hashedpass = await bcrypt.hash(opass, saltRounds);
    return hashedpass;
  } catch (error) {
    console.log(error);
  }
};

export const matchpass = async (opass, npass) => {
  try {
    const res = bcrypt.compare(opass, npass);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const generateToken = async (app,uid) => {
  try {
    const token = await app.jwt.sign({uid},{ expiresIn: '1d'}); 
    return token;
  } catch (error) {
    console.log(error);
  }
};
