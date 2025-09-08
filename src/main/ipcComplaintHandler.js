import { ipcMain } from "electron";
import { prisma } from "../libs/prisma";

export const complaintHandlers = () => {
  ipcMain.handle("create-complaint", async (_, formData, id) => {
    try {
      if (!id) {
        return { status: false, message: "You are not authorized." };
      }

      const complaint = await prisma.complaint.create({
        data: {
          title: formData.title,
          overview: formData.overview,
          user: {
            connect: { id },
          },
          students: {
            create: [
              ...formData.complainants.map((c) => ({
                name: c.name,
                contact: c.contact,
                role: "COMPLAINANT",
                user: {
                  connect: {
                    id,
                  },
                },
              })),
              ...formData.respondents.map((r) => ({
                name: r.name,
                contact: r.contact,
                role: "RESPONDENT",
                user: {
                  connect: {
                    id,
                  },
                },
              })),
            ],
          },
        },
        include: {
          students: true,
        },
      });

      return {
        status: true,
        message: "Complaint has been created",
        data: complaint,
      };
    } catch (err) {
      console.error("Error creating complaint:", err);
      return {
        status: false,
        message: "Something went wrong. Try Again!",
        error: err.message,
      };
    }
  });

  ipcMain.handle(
    "update-complaint",
    async (_, { formData, id, complaintId }) => {
      try {
        if (!id) return { status: false, message: "You are not authorized." };

        const checkComplaint = await prisma.complaint.findUnique({
          where: { id: Number(complaintId) },
          include: { students: true },
        });

        const complainantsToUpdate = formData.complainants.filter((s) => s.id);
        const respondentsToUpdate = formData.respondents.filter((s) => s.id);
        const studentsToCreate = [
          ...formData.complainants
            .filter((s) => !s.id)
            .map((s) => ({ ...s, role: "COMPLAINANT" })),
          ...formData.respondents
            .filter((s) => !s.id)
            .map((s) => ({ ...s, role: "RESPONDENT" })),
        ];

        const updatedStudentIds = [
          ...complainantsToUpdate.map((s) => s.id),
          ...respondentsToUpdate.map((s) => s.id),
        ];

        const studentsToDisconnect = checkComplaint.students
          .filter((s) => !updatedStudentIds.includes(s.id))
          .map((s) => ({ id: s.id }));

        const complaint = await prisma.complaint.update({
          where: { id: Number(complaintId) },
          data: {
            title: formData.title,
            overview: formData.overview,
            status: formData.status,
            resolution: formData.resolution,
            user: { connect: { id } },
            students: {
              disconnect: studentsToDisconnect,
              update: [
                ...complainantsToUpdate.map((s) => ({
                  where: { id: s.id },
                  data: {
                    name: s.name,
                    contact: s.contact,
                    role: "COMPLAINANT",
                  },
                })),
                ...respondentsToUpdate.map((s) => ({
                  where: { id: s.id },
                  data: {
                    name: s.name,
                    contact: s.contact,
                    role: "RESPONDENT",
                  },
                })),
              ],
              create: studentsToCreate.map((s) => ({
                name: s.name,
                contact: s.contact,
                role: s.role,
              })),
            },
          },
          include: { students: true },
        });

        return {
          status: true,
          message: "Complaint has been updated.",
          data: complaint,
        };
      } catch (err) {
        console.error("Error updating complaint:", err);
        return {
          status: false,
          message: "Something went wrong. Try Again!",
          error: err.message,
        };
      }
    }
  );

  ipcMain.handle("delete-complaint", async (_, { id, complaintId }) => {
    try {
      if (!id) {
        return { status: false, message: "You are not authorized." };
      }

      await prisma.complaint.update({
        where: { id: Number(complaintId) },
        data: {
          students: {
            set: [],
          },
        },
      });

      const complaint = await prisma.complaint.delete({
        where: { id: Number(complaintId) },
      });

      return {
        status: true,
        message: "Complaint has been deleted.",
        data: complaint,
      };
    } catch (err) {
      console.error("Error deleting complaint:", err);
      return {
        status: false,
        message: "Something went wrong. Try Again!",
        error: err.message,
      };
    }
  });

  ipcMain.handle("get-overview-stats", async (_, { id }) => {
    try {
      if (!id) {
        return { status: false, message: "You are not authorized." };
      }
      const complaintsByStatus = await prisma.complaint.groupBy({
        by: ["status"],
        where: { userId: id },
        _count: {
          _all: true,
        },
      });
      const complaintTracks = await prisma.complaint.groupBy({
        by: ["createdAt"],
        where: { userId: id },
        _count: { _all: true },
        orderBy: { createdAt: "asc" },
        take: 5,
      });

      const topRespondents = await prisma.student.groupBy({
        by: ["name"],
        where: {
          role: "RESPONDENT",
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 5,
      });

      return {
        status: true,
        message: "Overview stats fetched successfully",
        data: {
          complaintsByStatus,
          complaintTracks,
          topRespondents,
        },
      };
    } catch (err) {
      console.error("Error fetching overview stats:", err);
      return {
        status: false,
        message: "Something went wrong. Try Again!",
        error: err.message,
      };
    }
  });

  ipcMain.handle(
    "get-complaints",
    async (_, { id, page = 1, limit = 10, search }) => {
      try {
        if (!id) {
          return { status: false, message: "You are not authorized." };
        }

        const skip = (page - 1) * limit;

        const where = {
          userId: id,
          ...(search && {
            OR: [
              { title: { contains: search } },
              { overview: { contains: search } },
              { students: { some: { name: { contains: search } } } },
            ],
          }),
        };

        const complaints = await prisma.complaint.findMany({
          where,
          include: {
            students: true,
          },
          skip,
          take: limit,
        });

        const total = await prisma.complaint.count({
          where,
        });

        return {
          status: true,
          message: "Complaints fetched successfully",
          data: {
            complaints,
            pagination: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            },
          },
        };
      } catch (err) {
        console.error("Error fetching complaints:", err);
        return {
          status: false,
          message: "Something went wrong. Try Again!",
          error: err.message,
        };
      }
    }
  );

  ipcMain.handle("get-complaint", async (_, { id, complaintId }) => {
    try {
      if (!id) {
        return { status: false, message: "You are not authorized." };
      }

      const complaint = await prisma.complaint.findFirst({
        where: {
          id: Number(complaintId),
        },
        include: {
          students: true,
        },
      });

      return {
        status: true,
        data: complaint,
      };
    } catch (err) {
      console.error("Error fetching complaint:", err);
      return {
        status: false,
        message: "Something went wrong. Try Again!",
        error: err.message,
      };
    }
  });
};
