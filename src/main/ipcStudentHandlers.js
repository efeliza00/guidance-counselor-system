import { ipcMain } from "electron";
import { prisma } from "../libs/prisma";
export const studentHandlers = () => {
  ipcMain.handle(
    "get-students",
    async (_, { id, page = 1, limit = 10, search }) => {
      try {
        if (!id) {
          return { status: false, message: "You are not authorized." };
        }
        const skip = (page - 1) * limit;

        const where = {
          userId: id,
          ...(search && {
            OR: [{ name: { contains: search } }],
          }),
        };

        const students = await prisma.student.findMany({
          where,
          take: 10,
          skip,
          take: limit,
        });
        const total = await prisma.student.count({
          where,
        });

        return {
          status: true,
          message: "Students fetched successfully",
          data: {
            students,
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            },
          },
        };
      } catch (err) {
        console.error("Error fetching students:", err);
        return {
          status: false,
          message: "Something went wrong. Try Again!",
          error: err.message,
        };
      }
    }
  );
};
