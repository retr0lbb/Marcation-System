import {hash, compare} from "bcrypt"

const hashRounds = 8;

export const hashPassword = async (pass: string): Promise<string> => {
    const hashedPass = await hash(pass, hashRounds)

    return hashedPass
}

export const compareHashedPassword = async(hashPass: string, otherPass: string): Promise<boolean> => {
    const isComparable = await compare(hashPass, otherPass)

    console.log(hashPass, otherPass)


    return isComparable
}