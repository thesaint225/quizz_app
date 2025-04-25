import bcrypt from "bcrypt";
import { User, AuthResult } from "./types";

const saltRounds = 10;
const users: User[] = [];

export async function register(
  userName: string,
  password: string
): Promise<AuthResult> {
  try {
    // check if user already exists
    if (users.some((u) => u.userName === userName)) {
      return {
        success: false,
        message: "UserName already exist",
      };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Store user (in memory instead of database )
    users.push({ userName, passwordHash });
    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error("Registration error", error);
    return {
      success: false,
      message: "Registration failed ",
    };
  }
}

export async function login(
  userName: string,
  password: string
): Promise<AuthResult> {
  try {
    // Find  user
    const user = users.find((u) => (u.userName = userName));

    if (!user) {
      return {
        success: false,
        message: "user not found ",
      };
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    return {
      success: isMatch,
      message: isMatch ? "Login successful" : "invalid password",
    };
  } catch (error) {
    console.error("Login error :", error);
    return {
      success: false,
      message: "Login failed",
    };
  }
}

export function getUsers(): User[] {
  return [...users];
}
