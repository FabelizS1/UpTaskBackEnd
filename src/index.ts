import colors from 'colors'
import server from './server'

const port = process.env.PORT || 4000  // El puerto sino el 4000

server.listen(port, () => {
    console.log( colors.cyan.bold( `REST API funcionando en el puerto ${port}` ))  // Para cambiar el color colors.cyan.bold
})

