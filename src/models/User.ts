import mongoose, { Schema, Document } from "mongoose" 

export interface IUser extends Document {  // Para crear el schema
    email: string
    password: string
    name: string
    confirmed: boolean
}

const userSchema: Schema = new Schema({  /// Este es el schema para crear la tabla de mongoose
    email : {
        type: String,
        required: true,
        lowercase: true,
        unique: true  // Que no haya usuarios duplicados
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    confirmed: {  // Cuando el usuario confirme el correo que queda en true
        type: Boolean,
        default: false
    },
})

const User = mongoose.model<IUser>('User', userSchema)
export default User