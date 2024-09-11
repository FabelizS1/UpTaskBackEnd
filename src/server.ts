import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'  // importar cors
import morgan from 'morgan'
import { corsConfig } from './config/cors'  // Importacion de configuracion de cors
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'

dotenv.config()  // Aqui toma las variables de dotenv
connectDB()      // Conectar a la Base de datos

const app = express()  /// Llamar a express para iniciar la aplicacion


app.use(cors(corsConfig))  // Para usar configuracion de cors, comentar si se quita la validacion de cors

// Logging
app.use(morgan('dev'))

// Leer datos de formularios  del json que se esta enviando
app.use(express.json()) 

// Routes
app.use('/api/auth', authRoutes)  // Todos los routes de auth
app.use('/api/projects', projectRoutes)  // Aqui se conecta los endpoints de route para poder ver las apis

export default app