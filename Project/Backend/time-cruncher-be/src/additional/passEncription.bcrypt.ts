const bcrypt = require('bcrypt')
export async function encryptPassword(passString, rounds){
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(passString, salt);
}
export async function comparePassword(newPass, hash){
  return await bcrypt.compare(newPass, hash);
}