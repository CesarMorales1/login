import bcrypt from "bcrypt";

const saltRounds = 10;

export async function createHashPassword(plainPassword, rounds = saltRounds) {
    try {
        return await bcrypt.hash(plainPassword, rounds);
    } catch (error) {
        throw new Error("Error creating password hash");
    }
}

export async function compareHashPassword(plainPassword, hash) {
    try {
        return await bcrypt.compare(plainPassword, hash);
    } catch (error) {
        throw new Error("Error comparing password hash");
    }
}