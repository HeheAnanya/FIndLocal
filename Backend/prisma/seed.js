const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
async function main(){
    const services = [
    { name: "Plumber", icon: "🔧" },
    { name: "Electrician", icon: "💡" },
    { name: "Cleaner", icon: "🧹" },
    { name: "Painter", icon: "🎨" },
    { name: "Carpenter", icon: "🔨" },
    { name: "Pest Control", icon: "🕷️" }
  ]
  console.log("🌱 Seeding categories...")
  for (let i of services){
    await prisma.category.upsert({
        where:{
            name:i.name
        },
        update:{},
        create:{
            name:i.name
        }
    })
  }
  console.log("✅ Categories seeded successfully!")
}
main().catch((e)=>{
    console.log(e)
    process.exit(1)
}).finally(async()=>{
    await prisma.$disconnect()
})