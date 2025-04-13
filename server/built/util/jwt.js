import jwt from "jsonwebtoken";
export async function JWT(email) {
    const key = process.env.JWT_KEY;
    try {
        return await jwt.sign({ email }, key, { expiresIn: "3d" });
    }
    catch (err) {
        console.log(err);
    }
}
