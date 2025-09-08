import { ipcMain } from "electron";
import { prisma } from "../libs/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "../libs/jwt";

export const authHandler = () => {
  ipcMain.handle("create-account", async (_, formData) => {
    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const user = await prisma.user.findFirst({
        where: {
          username: formData.username,
        },
      });

      if (user) {
        return {
          message: "User already exist!",
          status: false,
        };
      }
      const res = await prisma.user.create({
        data: {
          username: formData.username,
          password: hashedPassword,
          profile: {
            create: { email: formData.email },
          },
        },
      });

      return {
        message: "Account has been created!",
        status: true,
        user: res,
      };
    } catch (error) {
      return {
        message: "Something went wrong!",
        status: false,
        error: error.message,
      };
    }
  });

  ipcMain.handle("login-account", async (_, formData) => {
    try {
      if (!formData) {
        return {
          message: "Username and password are required",
          status: false,
        };
      }

      const user = await prisma.user.findFirst({
        where: {
          username: formData.username,
        },
        include: {
          profile: {
            select: {
              email: true,
            },
          },
        },
      });

      if (!user) {
        return {
          message: `User does not exist. Try Again!`,
          status: false,
        };
      }

      const checkUser = await bcrypt.compare(formData.password, user.password);

      if (!checkUser) {
        return {
          message: `Invalid username or password. Try Again!`,
          status: false,
        };
      }

      const token = await signIn({
        id: user.id,
        username: user.username,
        email: user.profile.email,
      });
      return {
        message: `Welcome, ${user.username}!`,
        status: true,
        token,
      };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        message: "Something went wrong!",
        status: false,
        error: error.message || String(error), // ✅ Only return a serializable string
      };
    }
  });
};
