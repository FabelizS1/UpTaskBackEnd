import mongoose, { Schema, Document, Types } from "mongoose" 

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}

const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'  // Busca la informacion del modelo de User
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: '10m' // El usuario tendra 10 minutos para ingresar sino expira el token
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token