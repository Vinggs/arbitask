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

  // 👇 NOTIFIKASI: TASK BARU (MANUAL) 👇
  if (user) {
    await prisma.notification.create({
      data: {
        title: "Task Manual Dibuat! 📝",
        message: `Sistem mulai melacak progres lu di game ${newTask.name}.`,
        type: "SYSTEM",
        userId: user.id,
      },
    });
  }

  revalidatePath("/tracking");
}

// 2. Fungsi Drop Task (Pengganti Delete)
export async function dropTask(formData: FormData) {
  const id = formData.get("id") as string;
  const userEmail = formData.get("userEmail") as string;

  // Ubah status jadi "Dropped" bukannya dihapus
  const task = await prisma.task.update({
    where: { id },
    data: {
      status: "Dropped",
    },
  });

  // 👇 NOTIFIKASI: TASK DI-DROP 👇
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user) {
      await prisma.notification.create({
        data: {
          title: "Quest Abandoned! 🏳️",
          message: `Lu memutuskan buat nge-drop task ${task.name}. Tenang aja, riwayatnya masih tersimpan di Log History buat evaluasi nanti.`,
          type: "SYSTEM",
          userId: user.id,
        },
      });
    }
  }

  revalidatePath("/tracking");
  revalidatePath("/");
}

// 3. Fungsi Claim Tier (Pengganti updateProgress)
export async function claimMilestone(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const milestoneId = formData.get("milestoneId") as string;
  const reward = parseFloat(formData.get("reward") as string);

  // Tandai tier udah diambil dan ambil datanya buat notif
  const milestone = await prisma.milestone.update({
    where: { id: milestoneId },
    data: { isClaimed: true },
  });

  // Tambahin duitnya ke Task utama dan ambil daftar tier buat ngecek tamat
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { milestones: true },
  });

  if (task) {
    const nilaiBaru = task.currentValue + reward;

    // Cek apakah semua tier sudah terclaim SEKARANG
    const allMilestonesClaimed = task.milestones.every((m) => m.isClaimed);
    const isCompleted = nilaiBaru >= task.targetValue || allMilestonesClaimed;

    await prisma.task.update({
      where: { id: taskId },
      data: {
        currentValue: nilaiBaru,
        status: isCompleted ? "Completed" : "In Progress",
      },
    });

    // 👇 NOTIFIKASI: MISI SELESAI 👇
    await prisma.notification.create({
      data: {
        title: "Misi Selesai! 🎯",
        message: `Mantap! Lu berhasil nyelesaiin misi '${milestone.description}' di ${task.name} dan dapet $${reward.toFixed(2)}.`,
        type: "TASK_UPDATE",
        userId: task.userId,
      },
    });

    // 👇 NOTIFIKASI: GAME TAMAT 👇
    if (isCompleted) {
      await prisma.notification.create({
        data: {
          title: "Game Tamat! 🏆",
          message: `GGWP! Lu berhasil namatin semua misi di game ${task.name}. Waktunya withdraw dolar lu ke PayPal atau lanjut gass game lain!`,
          type: "ACHIEVEMENT",
          userId: task.userId,
        },
      });
    }
  }

  revalidatePath("/tracking");
}

// -------------------------------------------------
// 4. FITUR BARU: Auto-Track dari Dashboard
// -------------------------------------------------
export async function autoTrackTask(formData: FormData) {
  const name = formData.get("gameName") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const offerwall = formData.get("offerwall") as string;
  const targetValue = parseFloat(formData.get("usdValue") as string);
  const userEmail = formData.get("userEmail") as string;

  if (!userEmail) throw new Error("User belum login!");

  // 1. CEK DUPLIKAT
  const existingTask = await prisma.task.findFirst({
    where: {
      name: name,
      offerwall: offerwall,
      status: "In Progress",
      user: { email: userEmail },
    },
  });

  if (existingTask) {
    console.log("Task sudah ada di tracking, skip pembuatan!");
    return;
  }

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
      milestones: {
        create: milestonesToCreate,
      },
    },
  });

  // 👇 NOTIFIKASI: TASK BARU (AUTO TRACK) 👇
  if (user) {
    await prisma.notification.create({
      data: {
        title: "Task Baru Terlacak! 🎮",
        message: `Sistem mulai melacak progres lu di game ${newTask.name}. Selesaikan misinya sebelum deadline 30 hari!`,
        type: "SYSTEM",
        userId: user.id,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/tracking");
}

// -------------------------------------------------
// 5. FITUR: Verifikasi Milestone dengan Gambar
// -------------------------------------------------
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
    const allMilestonesClaimed = task.milestones.every((m) => m.isClaimed);
    const isCompleted = nilaiBaru >= task.targetValue || allMilestonesClaimed;

    await prisma.task.update({
      where: { id: taskId },
      data: {
        currentValue: nilaiBaru,
        status: isCompleted ? "Completed" : "In Progress",
      },
    });

    // 👇 NOTIFIKASI: MISI SELESAI (DENGAN GAMBAR) 👇
    await prisma.notification.create({
      data: {
        title: "Misi Tervalidasi! ✅",
        message: `Bukti verifikasi lu buat misi '${milestone.description}' di ${task.name} udah diterima dan nambah $${milestone.reward.toFixed(2)}.`,
        type: "TASK_UPDATE",
        userId: task.userId,
      },
    });

    // 👇 NOTIFIKASI: GAME TAMAT 👇
    if (isCompleted) {
      await prisma.notification.create({
        data: {
          title: "Game Tamat! 🏆",
          message: `GGWP! Lu berhasil namatin semua misi di game ${task.name}. Waktunya withdraw dolar lu ke PayPal atau lanjut gass game lain!`,
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

// -------------------------------------------------
// 6. FITUR BARU: Ambil Total Saldo User
// -------------------------------------------------
export async function getUserBalance(email: string) {
  try {
    const result = await prisma.task.aggregate({
      where: {
        user: { email: email },
      },
      _sum: {
        currentValue: true,
      },
    });

    return result._sum.currentValue || 0;
  } catch (error) {
    console.error("Gagal ngambil saldo:", error);
    return 0;
  }
}
