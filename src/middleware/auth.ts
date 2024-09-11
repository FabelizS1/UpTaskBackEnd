import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
    namespace Express {
        interface Request {
            user?: IUser   // Este es un parametro adicional que se le agrega a user
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    console.log("req.headers.authorization: " + req.headers.authorization)
    //next()

    const bearer = req.headers.authorization
    if(!bearer) {  // Si no envia el bearer
        const error = new Error('No Autorizado')
        return res.status(401).json({error: error.message})
    }

    // Con la , se emite el primer valor y toma el 1
    const [, token] = bearer.split(' ')  //Esto es con arrow destructoring y es lo mismo que const token = bearer.split(' ')[1]
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)  // Con Verify se verifica el token, aqui se usa process.env.JWT_SECRET y es la misma de sign del jwt.ts
        
        if(typeof decoded === 'object' && decoded.id) {  /// Con esto valida que decode sea un objeto y tenga un parametro de id
            const user = await User.findById(decoded.id).select('_id name email') // Validar que en user el decoded.id que es el id este registrado en User, donde .select('_id name email')   son solo los valores  que se quieren
            if(user) {
                req.user = user
                next()
            } else {
                res.status(500).json({error: 'Token No Válido'})
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Token No Válido'})
    }

}
