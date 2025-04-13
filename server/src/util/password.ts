import { compare } from "bcryptjs";


export async function comparePassword(password,hashed){
    try{
        const match = await compare(password,hashed)
        return match
    }catch(err){
        throw err
    }
}
