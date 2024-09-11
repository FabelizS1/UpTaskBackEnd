import jwt from 'jsonwebtoken'
import Types from 'mongoose'

type UserPayload = {
    id: Types.ObjectId  // Como se le pasa un objeto se coloca como Types.ObjectId
}

export const generateJWT = (id: UserPayload) => {

    // El json web token se esta generando con el id que sale de UserPayload
    const token = jwt.sign(id, process.env.JWT_SECRET, { // Con sign se genera el json web token, el parametro de JWT_SECRET es una variable de entorno esta se va a utilizar para generar y validar el token
        expiresIn: '180d' // Tiempo de validez del json web token
    })
    return token
}