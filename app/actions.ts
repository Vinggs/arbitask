"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Fungsi Tambah Task + Milestones
export async function addTask(formData: FormData) {
  const name = formData.get("name") as string;
  const platform = formData.get("platform") as string;
  const offerwall = formData.get("offerwall") as string;
  const targetValue = parseFloat(formData.get("targetValue") as string);
  const deadline = new Date(formData.get("deadline") as string);

  // Ambil data tier
  const milestonesJson = formData.get("milestones") as string;
  const milestones = JSON.parse(milestonesJson || "[]");

  await prisma.task.create({
    data: {
      name,
      platform,
      offerwall,
      targetValue,
      currentValue: 0,
      deadline,
      milestones: {
        create: milestones.map((m: any) => ({
          description: m.description,
          reward: parseFloat(m.reward),
        })),
      },
    },
  });

  revalidatePath("/tracking");
}

// 2. Fungsi Hapus Task
export async function deleteTask(formData: FormData) {
  const id = formData.get("id") as string;

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/tracking");
}

// 3. Fungsi Claim Tier (Pengganti updateProgress)
export async function claimMilestone(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const milestoneId = formData.get("milestoneId") as string;
  const reward = parseFloat(formData.get("reward") as string);

  // Tandai tier udah diambil
  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { isClaimed: true },
  });

  // Tambahin duitnya ke Task utama
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (task) {
    const nilaiBaru = task.currentValue + reward;

    await prisma.task.update({
      where: { id: taskId },
      data: {
        currentValue: nilaiBaru,
        status: nilaiBaru >= task.targetValue ? "Completed" : "In Progress",
      },
    });
  }

  revalidatePath("/tracking");
}

// -------------------------------------------------
// 4. FITUR BARU: Auto-Track dari Dashboard
// -------------------------------------------------
export async function autoTrackTask(formData: FormData) {
  const name = formData.get("gameName") as string;
  const platform = formData.get("platform") as string;
  const offerwall = formData.get("offerwall") as string;
  const targetValue = parseFloat(formData.get("usdValue") as string);

  // 1. CEK DUPLIKAT: Jangan bikin kalau task ini sudah ada dan belum selesai
  const existingTask = await prisma.task.findFirst({
    where: {
      name: name,
      offerwall: offerwall,
      status: "In Progress",
    },
  });

  if (existingTask) {
    console.log("Task sudah ada di tracking, skip pembuatan!");
    return; // Berhenti di sini, jangan lanjut bikin baru
  }

  // Set default deadline 30 hari dari sekarang
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  // Tangkap data tier ASLI dari katalog
  const milestonesJson = formData.get("milestones") as string;
  const originalMilestones = JSON.parse(milestonesJson || "[]");

  // Format ulang untuk dimasukkan ke tabel Task
  const milestonesToCreate = originalMilestones.map((m: any) => ({
    description: m.description,
    reward: parseFloat(m.reward),
  }));

  await prisma.task.create({
    data: {
      name,
      platform,
      offerwall,
      targetValue,
      currentValue: 0,
      deadline,
      // Salin tier-tier tersebut ke task yang dilacak
      milestones: {
        create: milestonesToCreate,
      },
    },
  });

  // Refresh halaman utama dan tracking agar sinkron
  revalidatePath("/");
  revalidatePath("/tracking");
}
