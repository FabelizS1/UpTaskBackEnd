import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'   // Con la referencia de PopulatedDoc se puede acceder a la informacion como un join en este caso seria a Projects relacionado con la tarea
import Task, { ITask } from './Task'
import { IUser } from './User'
import Note from './Note'

/*
Para traer la informacion del documento, este es el type de type script y el schemq es el de mongoose
export type ProjectType = Document & {
    projectName: string
    description:string
    clientName:string
}

Cambiarlo a interface como el de abajo
*/


export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]  // Aqui se hace el join con Task a traves de ITask, un proyecto puede tener multiples tareas por eso usa []
    manager: PopulatedDoc<IUser & Document>  //Este es el usuario, se importa el usuario
    team: PopulatedDoc<IUser & Document>[]   // Este es un arreglo de Usuarios para mostrar la informacion
}

const ProjectSchema: Schema = new Schema({  /// Esquema para crear el moongose en DB
    projectName: {
        type: String,
        required: true,
        trim: true   /// Con esto se agrega el trim
        //unique: true  es para definir que el valor es unico
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [   // Se le debe agregar cochetes porque es un arreglo
        {
            type: Types.ObjectId,  // El ID
            ref: 'Task'             // Task que es el otro archivo
        }
    ],
    manager: {
        type: Types.ObjectId,   // Con la referencia a User
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId, 
            ref: 'User'  // Con referencia a la tabla de usuario
        }
    ],
}, {timestamps: true})  /// Con esto se crea un valor que dice cuando se actualizo

// Middleware
ProjectSchema.pre('deleteOne', {document: true}, async function() {
    const projectId = this._id
    if(!projectId) return

    const tasks = await Task.find({ project: projectId })  // Todas las tareas

    for(const task of tasks) {
        await Note.deleteMany({ task: task.id})  // Ir eliminando las notas
    }

    await Task.deleteMany({project: projectId})  // Para eliminar todas las tareas
}) 

const Project = mongoose.model<IProject>('Project', ProjectSchema) // Aqui se dice que se quiere tener estas caracteristicas IProject en los proyectos unido al esquema
export default Project