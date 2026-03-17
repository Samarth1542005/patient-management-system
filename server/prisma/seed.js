const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const nmcDoctors = [
    { nmcNumber: "MH-2019-12345", doctorName: "Rajesh Kumar", specialization: "Cardiology", council: "Maharashtra Medical Council" },
    { nmcNumber: "MH-2017-98765", doctorName: "Priya Sharma", specialization: "Dermatology", council: "Maharashtra Medical Council" },
    { nmcNumber: "DL-2020-11223", doctorName: "Anil Mehta", specialization: "Neurology", council: "Delhi Medical Council" },
    { nmcNumber: "KA-2018-44556", doctorName: "Sunita Rao", specialization: "Pediatrics", council: "Karnataka Medical Council" },
    { nmcNumber: "TN-2021-77889", doctorName: "Vikram Nair", specialization: "Orthopedics", council: "Tamil Nadu Medical Council" },
    { nmcNumber: "MH-2016-33210", doctorName: "Sneha Joshi", specialization: "Gynecology", council: "Maharashtra Medical Council" },
    { nmcNumber: "GJ-2019-55678", doctorName: "Ramesh Patel", specialization: "General Medicine", council: "Gujarat Medical Council" },
    { nmcNumber: "WB-2020-22334", doctorName: "Amitabh Das", specialization: "Psychiatry", council: "West Bengal Medical Council" },
    { nmcNumber: "RJ-2018-66789", doctorName: "Kavita Singh", specialization: "Ophthalmology", council: "Rajasthan Medical Council" },
    { nmcNumber: "MH-2022-99001", doctorName: "Suresh Desai", specialization: "ENT", council: "Maharashtra Medical Council" },
  ];

  for (const doctor of nmcDoctors) {
    await prisma.nMCRegistry.upsert({
      where: { nmcNumber: doctor.nmcNumber },
      update: {},
      create: doctor,
    });
  }

  console.log("✅ NMC Registry seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });