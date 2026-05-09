const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")

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
  const generalPassword = await bcrypt.hash("@Password123",10)
  console.log(generalPassword)
  const data=[
   { username: "Mario Plumber", email: "mario@test.com", role: "Expert", phone: "1234567890", city: "Delhi", bio: "Expert plumber with 10 years experience.", price: 500, experience: 10, rating: 4.8, category: "Plumber" },
    { username: "Luigi Electric", email: "luigi@test.com", role: "Expert", phone: "1234567891", city: "Mumbai", bio: "Fixing lights and fans professionally.", price: 300, experience: 5, rating: 4.2, category: "Electrician" },
    { username: "Yoshi Cleaner", email: "yoshi@test.com", role: "Expert", phone: "1234567892", city: "Delhi", bio: "Deep cleaning for homes and offices.", price: 800, experience: 2, rating: 3.5, category: "Cleaner" },
    { username: "Toad Painter", email: "toad@test.com", role: "Expert", phone: "1234567893", city: "Bangalore", bio: "Colorful wall painting services.", price: 1200, experience: 8, rating: 4.9, category: "Painter" },
    { username: "Bowser Repairs", email: "bowser@test.com", role: "Expert", phone: "1234567894", city: "Mumbai", bio: "Heavy duty carpentry work.", price: 600, experience: 15, rating: 2.5, category: "Carpenter" },
    { username: "Peach Pest", email: "peach@test.com", role: "Expert", phone: "1234567895", city: "Delhi", bio: "Eco-friendly pest control.", price: 400, experience: 4, rating: 4.5, category: "Pest Control" },
    { username: "Wario Electric", email: "wario@test.com", role: "Expert", phone: "1234567896", city: "Bangalore", bio: "Cheap electrical fixes.", price: 150, experience: 20, rating: 1.5, category: "Electrician" },
    { username: "Zelda Plumber", email: "zelda@test.com", role: "Expert", phone: "1234567897", city: "Pune", bio: "Premium plumbing services.", price: 900, experience: 7, rating: 5.0, category: "Plumber" },
  ]
  for (const exp of data) {
    const user = await prisma.user.upsert({
      where: { email: exp.email },
      update: {},
      create: {
        username: exp.username,
        email: exp.email,
        password: generalPassword,
        phoneNumber: exp.phone,
        role: "Expert"
      }
    })

    const category = await prisma.category.findUnique({ where: { name: exp.category } })
    await prisma.expert.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        categoryId: category.id,
        bio: exp.bio,
        city: exp.city,
        priceStart: exp.price,
        experience: exp.experience,
        rating: exp.rating
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