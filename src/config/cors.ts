import { CorsOptions } from 'cors'



// Esto es para el manejo de cors en la api
export const corsConfig: CorsOptions = { // CorsOptions es el tipo de dato
    origin: function(origin, callback) {  // origin es el origen de la peticion y callback la respuesta

        console.log(process.argv)

        const whitelist = [process.env.FRONTEND_URL] // Donde FRONTEND_URL es el frontend de la url

        if(process.argv[2] === '--api') {    // Para que cuando se ejecute en modo de --api en la whitelist permita la opcion de undefined
            whitelist.push(undefined)
        }

        if(whitelist.includes(origin)) {  // Si la peticion viene de una de las url de la lista blanca es entonces permitida
            callback(null, true)  // Indica que si se quiere la conexion
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}