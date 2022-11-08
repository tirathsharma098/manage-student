import { Admin } from "./entity/admin";
import bcrypt from "bcrypt";
import AppDataSource from "./database/dbRunner";
// username123 tim
const admin = { username: "username001", password: "tim" };

const addAdmin = async () => {
    try {
        const adminRepo = AppDataSource.getRepository(Admin);
        const newAdmin: Admin = new Admin();
        newAdmin.username = admin.username;
        const hashedPassword = await bcrypt.hash(admin.password, 12);
        newAdmin.password = hashedPassword;
        const resultsAdmin = await adminRepo.save(newAdmin);
        console.log(">> AFTER STORING ADMIN GOT RESULTS: ", resultsAdmin);
    } catch (err) {
        console.log(">> ERROR OCCURED WHILE ADDING ADMIN: ", err);
    }
};

AppDataSource.initialize()
    .then(async(data) => {
        await addAdmin();
        AppDataSource.destroy();
    })
    .catch((error) =>
        console.log(">> ERROR OCCURED WHILE INITIALIZING DATASOURCE: ", error)
    );

