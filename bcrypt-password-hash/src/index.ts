import bcrypt from "bcrypt";
import { register, login } from "./auth";

async function hashPassword() {
  try {
    const userPassword = "johnthe454";

    // generate salt with strength of 10
    const salt = await bcrypt.genSalt(10);
    // hash the the password
    const hashedPassword = await bcrypt.hash("userPassword", salt);
    console.log("Hashed password:", hashedPassword);
  } catch (error) {
    console.error("Error hashing password", error);
  }
}

hashPassword();

async function main() {
  // register some users
  const reg1 = await register("Alice", "alicia23");
  console.log(`Register alice`, reg1);
  const reg2 = await register("henri", "Emmanuel225");
  console.log("register Henri", reg2);

  // Try to register duplicate

  const reg3 = await register("alice", "ag453");
  console.log("duplicated alice", reg3);

  // Test logins
  const login1 = await login("Alice", "alicia23");
  console.log(`Alice correct password:`, login1);

  const login2 = await login("Alice", "wrong password");
  console.log(`Alice wrong password:`, login2);

  const login3 = await login("charlie", "pass3434");
  console.log(`Non-existent user :`, login3);
}
main();
