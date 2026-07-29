"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Fungsi Tambah Task + Milestones (Manual)
export async function addTask(formData: FormData) {
  const name = formData.get("name") as string;
  const offerwall = formData.get("offerwall") as string;
  const targetValue = parseFloat(formData.get("targetValue") as string);
  const deadline = new Date(formData.get("deadline") as string);

  const userEmail = formData.get("userEmail") as string;
  if (!userEmail) throw new Error("User belum login!");

  const milestonesJson = formData.get("milestones") as string;
  const milestones = JSON.parse(milestonesJson || "[]");

  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  const newTask = await prisma.task.create({
    data: {
      name,
      offerwall,
      targetValue,
      currentValue: 0,
      deadline,
      user: { connect: { email: userEmail } },
      milestones: {
        create: milestones.map((m: any) => ({
          description: m.description,
          reward: parseFloat(m.reward),
        })),
      },
    },
  });

  if (user) {
    await prisma.notification.create({
      data: {
        title: "manualTitle", // Panggil JSON key
        message: "manualMsg", // Panggil JSON key
        type: "SYSTEM",
        userId: user.id,
      },
    });
  }

  revalidatePath("/tracking");
}

// 2. Fungsi Drop Task
export async function dropTask(formData: FormData) {
  const id = formData.get("id") as string;
  const userEmail = formData.get("userEmail") as string;

  const task = await prisma.task.update({
    where: { id },
    data: { status: "Dropped" },
  });

  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user) {
      await prisma.notification.create({
        data: {
          title: "dropTitle",
          message: "dropMsg",
          type: "SYSTEM",
          userId: user.id,
        },
      });
    }
  }

  revalidatePath("/tracking");
  revalidatePath("/");
}

// 3. Fungsi Claim Tier
export async function claimMilestone(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const milestoneId = formData.get("milestoneId") as string;
  const reward = parseFloat(formData.get("reward") as string);

  const milestone = await prisma.milestone.update({
    where: { id: milestoneId },
    data: { isClaimed: true },
  });

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { milestones: true },
  });

  if (task) {
    const nilaiBaru = task.currentValue + reward;

    // Cek tamat (abaikan tier yang di-skip)
    const activeMilestones = task.milestones.filter((m: any) => !m.isSkipped);
    const allMilestonesClaimed =
      activeMilestones.length > 0 &&
      activeMilestones.every((m: any) => m.isClaimed);
    const isCompleted = nilaiBaru >= task.targetValue || allMilestonesClaimed;

    await prisma.task.update({
      where: { id: taskId },
      data: {
        currentValue: nilaiBaru,
        status: isCompleted ? "Completed" : "In Progress",
      },
    });

    await prisma.notification.create({
      data: {
        title: "claimTitle",
        message: "claimMsg",
        type: "TASK_UPDATE",
        userId: task.userId,
      },
    });

    if (isCompleted) {
      await prisma.notification.create({
        data: {
          title: "tamatTitle",
          message: "tamatMsg",
          type: "ACHIEVEMENT",
          userId: task.userId,
        },
      });
    }
  }

  revalidatePath("/tracking");
}

// 4. Auto-Track dari Dashboard
export async function autoTrackTask(formData: FormData) {
  const name = formData.get("gameName") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const offerwall = formData.get("offerwall") as string;
  const targetValue = parseFloat(formData.get("usdValue") as string);
  const userEmail = formData.get("userEmail") as string;

  if (!userEmail) throw new Error("User belum login!");

  const existingTask = await prisma.task.findFirst({
    where: {
      name: name,
      offerwall: offerwall,
      status: "In Progress",
      user: { email: userEmail },
    },
  });

  if (existingTask) return;

  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  const milestonesJson = formData.get("milestones") as string;
  const originalMilestones = JSON.parse(milestonesJson || "[]");

  const milestonesToCreate = originalMilestones.map((m: any) => ({
    description: m.description,
    reward: parseFloat(m.reward),
  }));

  const newTask = await prisma.task.create({
    data: {
      name,
      imageUrl,
      offerwall,
      targetValue,
      currentValue: 0,
      deadline,
      user: { connect: { email: userEmail } },
      milestones: { create: milestonesToCreate },
    },
  });

  if (user) {
    await prisma.notification.create({
      data: {
        title: "autoTitle",
        message: "autoMsg",
        type: "SYSTEM",
        userId: user.id,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/tracking");
}

// 5. Verifikasi Milestone dengan Gambar
export async function verifyMilestone(
  taskId: string,
  milestoneId: string,
  evidenceUrl: string,
) {
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
  });

  if (!milestone) throw new Error("Tier tidak ditemukan");

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      isClaimed: true,
      evidenceUrl: evidenceUrl,
    },
  });

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { milestones: true },
  });

  if (task) {
    const nilaiBaru = task.currentValue + milestone.reward;
    const activeMilestones = task.milestones.filter((m) => !m.isSkipped);
    const allMilestonesClaimed =
      activeMilestones.length > 0 && activeMilestones.every((m) => m.isClaimed);
    const isCompleted = nilaiBaru >= task.targetValue || allMilestonesClaimed;

    await prisma.task.update({
      where: { id: taskId },
      data: {
        currentValue: nilaiBaru,
        status: isCompleted ? "Completed" : "In Progress",
      },
    });

    await prisma.notification.create({
      data: {
        title: "verifiedTitle",
        message: "verifiedMsg",
        type: "TASK_UPDATE",
        userId: task.userId,
      },
    });

    if (isCompleted) {
      await prisma.notification.create({
        data: {
          title: "tamatTitle",
          message: "tamatMsg",
          type: "ACHIEVEMENT",
          userId: task.userId,
        },
      });
    }
  }

  revalidatePath(`/tracking/${taskId}`);
  revalidatePath("/tracking");
  revalidatePath("/");
}

// 6. Ambil Total Saldo User
export async function getUserBalance(email: string) {
  try {
    const result = await prisma.task.aggregate({
      where: { user: { email: email } },
      _sum: { currentValue: true },
    });
    return result._sum.currentValue || 0;
  } catch (error) {
    return 0;
  }
}

// 7. Tambah Game ke Katalog
export async function addGameToCatalog(formData: FormData) {
  // ... (SAMA SEPERTI SEBELUMNYA) ...
  const gameName = formData.get("gameName") as string;
  const platform = formData.get("platform") as string;
  const offerwall = formData.get("offerwall") as string;
  const category = formData.get("category") as string;
  const requirement = formData.get("requirement") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const usdValue = parseFloat(formData.get("usdValue") as string);
  const rawCoins = parseInt(formData.get("rawCoins") as string, 10);
  const isHighest = formData.get("isHighest") === "true";

  const milestonesRaw = formData.get("milestones") as string;
  let milestones = [];
  if (milestonesRaw) {
    try {
      milestones = JSON.parse(milestonesRaw);
    } catch (e) {}
  }

  await prisma.catalogOffer.create({
    data: {
      gameName,
      platform,
      offerwall,
      category,
      requirement,
      imageUrl: imageUrl || null,
      usdValue,
      rawCoins,
      isHighest,
      milestones: {
        create: milestones.map((m: any) => ({
          description: m.description,
          reward: parseFloat(m.reward),
        })),
      },
    },
  });

  revalidatePath("/katalog");
  revalidatePath("/");
}

// 8. Update Game di Katalog (Dari Admin)
export async function updateOfferAction(formData: FormData) {
  // ... (SAMA SEPERTI SEBELUMNYA) ...
  const id = formData.get("id") as string;
  const gameName = formData.get("gameName") as string;
  const platform = formData.get("platform") as string;
  const offerwall = formData.get("offerwall") as string;
  const requirement = formData.get("requirement") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const usdValue = parseFloat(formData.get("usdValue") as string);
  const rawCoins = parseInt(formData.get("rawCoins") as string, 10);

  const milestonesRaw = formData.get("milestones") as string;
  let milestones = [];
  if (milestonesRaw) {
    try {
      milestones = JSON.parse(milestonesRaw);
    } catch (e) {}
  }

  await prisma.catalogOffer.update({
    where: { id: id },
    data: {
      gameName,
      platform,
      offerwall,
      requirement,
      imageUrl: imageUrl || null,
      usdValue,
      rawCoins,
      milestones: {
        deleteMany: {},
        create: milestones.map((m: any) => ({
          description: m.description,
          reward: parseFloat(m.reward),
        })),
      },
    },
  });

  revalidatePath("/katalog");
  revalidatePath("/");
  revalidatePath("/admin/edit-game");
}

// 9. FITUR BARU: Skip Milestone
export async function skipMilestone(taskId: string, milestoneId: string) {
  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { isSkipped: true },
  });

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { milestones: true },
  });

  if (task) {
    const activeMilestones = task.milestones.filter((m) => !m.isSkipped);
    const isCompleted =
      activeMilestones.length > 0 && activeMilestones.every((m) => m.isClaimed);

    if (isCompleted) {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: "Completed" },
      });
      await prisma.notification.create({
        data: {
          title: "tamatTitle",
          message: "tamatMsg",
          type: "ACHIEVEMENT",
          userId: task.userId,
        },
      });
    }
  }
  revalidatePath(`/tracking/${taskId}`);
  revalidatePath("/tracking");
}
