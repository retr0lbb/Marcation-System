import { error } from "console"

export default class ValidationError extends Error{
    constructor(errors: any){
        super("Validation Error")
        this.name = "Validation Error"
    }   
}