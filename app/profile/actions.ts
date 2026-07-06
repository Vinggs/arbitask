"use server";

import { prisma } from "@/lib/prisma";

export async function getProfileStats(email: string) {
  try {
    // Cari user berdasarkan email beserta semua task-nya
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tasks: true },
    });

    if (!user) return { taskCount: 0, totalYield: 0 };

    // Hitung jumlah task
    const taskCount = user.tasks.length;

    // Hitung total USD value dari semua targetValue task
    const totalYield = user.tasks.reduce(
      (acc, task) => acc + task.targetValue,
      0,
    );

    return { taskCount, totalYield };
  } catch (error) {
    console.error("Gagal narik data profil:", error);
    return { taskCount: 0, totalYield: 0 };
  }
}

// Tambahin ini di bawah fungsi getProfileStats yang udah ada
export async function updateUserProfile(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
) {
  try {
    const fullName = `${firstName} ${lastName}`.trim();

    await prisma.user.update({
      where: { email },
      data: {
        name: fullName,
        phone: phone, // Simpen nomor HP ke kolom baru tadi
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Gagal update profil:", error);
    return { success: false };
  }
}

// --- Tambahin di bawah fungsi updateUserProfile ---

export async function getUserNotifications(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return [];

    // Tarik semua pesan, urutkan dari yang paling baru
    return await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Gagal narik notifikasi:", error);
    return [];
  }
}

export async function markAllNotificationsAsRead(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false };

    // Update semua pesan yang belum dibaca jadi terbaca
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal update notifikasi:", error);
    return { success: false };
  }
}
