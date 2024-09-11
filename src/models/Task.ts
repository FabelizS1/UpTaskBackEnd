import mongoose, {Schema, Document, Types} from 'mongoose'
import Note from './Note'

const taskStatus = {  /// Estos son los estatus
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const  /// Con este as const queda en read only

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus] // Con keyof typeof taskStatus se toman los valos de taskStatus que estan despues del = es decir pending, onHold, etc 

export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId  // Donde Types.ObjectId es el tipo de dato del ID en moongoDB
    status: TaskStatus       /// Hay 5 estados de las tareas y estos serian los de TaskStatus de arriba
    completedBy: {
        user: Types.ObjectId,  // Usuario que esta creando al usuario
        status: TaskStatus
    }[] // Es un arreglo de completedBy
    notes: Types.ObjectId[]
}

export const TaskSchema : Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: {  // Este nombre es el que se usa en el populate cuando se hace la relacion del Join en el controller para el get All
        type: Types.ObjectId,
        ref: 'Project'  /// Donde Es el nombre del proyecto que lo relaciona que es el del archivo Project.ts
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),  // Con taskStatus que son los estatus de arriba
        default: taskStatus.PENDING   // Este es el valor default
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,  // Guarda la referencia del usuario
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, {timestamps: true})   /// Con esto se crea un valor que dice cuando se actualizo

// Middleware
TaskSchema.pre('deleteOne', {document: true}, async function() { // Esto se va a ejecutar cuando se elimine una tarea
    //console.log(this)
    //console.log(this.getQuery()._id)

    const taskId = this._id
    if(!taskId) return
    await Note.deleteMany({task: taskId}) // Para eliminar todas las tareas de nota
})

const Task = mongoose.model<ITask>('Task', TaskSchema)   /// Para conectar al squema de la interface
export default Task