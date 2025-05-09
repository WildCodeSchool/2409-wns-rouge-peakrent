import { dataSource } from "../src/config/db";
import { User } from "../src/entities/User";
import { Profile } from "../src/entities/Profile";
import { hashPassword } from "../src/helpers/helpers";
import { RoleType } from "../src/types";

export const seedUsers = async () => {
  const userRepo = dataSource.getRepository(User);

  const users = [
    {
      email: "admin@peakrent.com",
      password: "Aadmin123!",
      firstname: "Admin",
      lastname: "User",
      role: RoleType.ADMIN,
    },
    {
      email: "client@example.com",
      password: "Client123!",
      firstname: "Jean",
      lastname: "Dupont",
      role: RoleType.USER,
    },
  ];

  for (const user of users) {
    const exists = await userRepo.findOne({ where: { email: user.email } });
    if (!exists) {
      const hashedPassword = await hashPassword(user.password);
      const newUser = userRepo.create({
        ...user,
        password: hashedPassword,
      });
      await userRepo.save(newUser);

      const profileRepo = dataSource.getRepository(Profile);
      const profile = profileRepo.create({
        id: newUser.id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        role: newUser.role,
      });
      await profileRepo.save(profile);
    }
  }

  console.log("✅ Users seeded.");
};
