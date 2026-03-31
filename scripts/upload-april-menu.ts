import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const menuData = [
    { date: "2026-04-01", dayOfWeek: "수요일", menu: "현미밥, 미역국, 두부강된장, 모듬나물, 김치/과일" },
    { date: "2026-04-02", dayOfWeek: "목요일", menu: "휴일" },
    { date: "2026-04-03", dayOfWeek: "금요일", menu: "휴일" },
    { date: "2026-04-06", dayOfWeek: "월요일", menu: "참치김치찌개, 두부조림, 새송이버섯전, 구운김, 김치/과일" },
    { date: "2026-04-07", dayOfWeek: "화요일", menu: "잡곡밥, 감자탕, 투론, 깡콩나물, 김치/과일" },
    { date: "2026-04-08", dayOfWeek: "수요일", menu: "현미밥, 콩국수, 양념치킨, 무피클, 김치/과일" },
    { date: "2026-04-09", dayOfWeek: "목요일", menu: "휴일" },
    { date: "2026-04-10", dayOfWeek: "금요일", menu: "어묵탕, 떡볶이, 야채고로케, 단무지, 김치/과일" },
    { date: "2026-04-13", dayOfWeek: "월요일", menu: "두부된장국, 카레라이스, 계란말이, 아차라, 김치/과일" },
    { date: "2026-04-14", dayOfWeek: "화요일", menu: "배춧국, 닭강정, 어묵볶음, 양배추샐러드, 김치/과일" },
    { date: "2026-04-15", dayOfWeek: "수요일", menu: "된장국, 족발, 무생채, 야채쌈, 김치/과일" },
    { date: "2026-04-16", dayOfWeek: "목요일", menu: "잡곡밥, 미역국, 닭갈비, 잡채, 김치/과일" },
    { date: "2026-04-17", dayOfWeek: "금요일", menu: "흰밥, 시니강, 치킨구이, 앤살라다, 김치/과일" },
    { date: "2026-04-20", dayOfWeek: "월요일", menu: "계란국, 짜장, 군만두, 단무지, 김치/과일" },
    { date: "2026-04-21", dayOfWeek: "화요일", menu: "소고기미역국, 생선구이, 계란찜, 깻잎장아찌, 김치/과일" },
    { date: "2026-04-22", dayOfWeek: "수요일", menu: "된장국, 김치두루치기, 두부찜, 김자반, 김치/과일" },
    { date: "2026-04-23", dayOfWeek: "목요일", menu: "현미밥, 닭개장, 어묵잡채, 미역무침, 김치/과일" },
    { date: "2026-04-24", dayOfWeek: "금요일", menu: "우동국물, 라볶이, 영양달걀, 단무지무침, 김치/과일" },
    { date: "2026-04-27", dayOfWeek: "월요일", menu: "어묵국, 콩나물비빔밥, 계란후라이, 알감자조림, 김치/과일" },
    { date: "2026-04-28", dayOfWeek: "화요일", menu: "현미밥, 순두부찌개, 햄볶음, 콩나물무침, 김치/과일" },
    { date: "2026-04-29", dayOfWeek: "수요일", menu: "녹두찹쌀밥, 닭백숙, 부추겉절이, 야채쌈장, 김치/과일" },
    { date: "2026-04-30", dayOfWeek: "목요일", menu: "볶음밥, 야채스프, 폭찹스테이크, 그린샐러드, 김치/과일" },
  ];

  console.log("Cleaning up existing meals for April 2026...");
  const deleteCount = await prisma.schoolMeal.deleteMany({
    where: {
      date: {
        startsWith: "2026-04",
      },
    },
  });
  console.log(`Deleted ${deleteCount.count} existing records.`);

  console.log("Uploading April 2026 meals...");
  await prisma.schoolMeal.createMany({
    data: menuData,
  });

  console.log("Done! Uploaded 22 meal entries.");
}

main()
  .catch((e) => {
    console.error("Error seeding meals:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
