import mongoose from 'mongoose'
import colors from 'colors'
import { exit } from 'node:process';

export const connectDB = async () => {    // Conexion a Base de datos
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)  // Direccion para conectarse a la Base de Datos
        const url = `${connection.host}:${connection.port}`   //
        console.log(colors.magenta.bold(`MongoDB Conectado en: ${url}`))
    } catch (error) {
        // console.log(error.message)
        console.log( colors.red.bold('Error al conectar a MongoDB') )
        exit(1) // Con 1 quiere decir que el programa termino pero fallo
    }
}