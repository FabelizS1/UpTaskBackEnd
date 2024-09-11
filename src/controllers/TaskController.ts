import type {Request, Response} from 'express'
import Task from '../models/Task'

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            
            //const { projectId } = req.params
            //const project = await Project.findById(projectId)  Donde Project es el modelo de Project.ts
            //task.project = project.id    Donde se crea el project ID
            //await task.save()  Salvar la tarea
            //await  req.project.save()  Salvar el project y que se vean las tareas en project
            //Luego todo esto se cambia por el promises


            const task = new Task(req.body)    //// Se usa req porque la informacion del projecto viene del Request que viene de project.ts  y es projectExists
            task.project = req.project.id      //Donde se crea el project ID
            req.project.tasks.push(task.id)  // Hace un arrray de tareas donde almacena el ID
            //await project.save()  Para salvar en project y que se vea en los projects
            await Promise.allSettled([task.save(), req.project.save() ])  // Este se ejecuta si todos los promises se cumplen
            //projectExists
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {

            // Se puede hacer Task.findById({}) y donde la informacion que va a dentro es la del where 
            // Donde es project y req.project.id es el id que viene de project.ts  - projectExists
            const tasks = await Task.find({project: req.project.id}).populate('project') /// De donde se usa project para traer la informacion del Project.ts
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {


            const task = await Task.findById(req.task.id)   //Traia la tarea por el id
                            .populate({path: 'completedBy.user', select: 'id name email'}) // en el campo de completedby, se le pone .user para que traiga la informacion del usuario se van a mostrar los campos de id, name e email
                            .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email' }}) // Aqui hace 2 populated para mostrar la informacion de las notes y createdBy con la informacion del usuario

            if (!task){
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: 'Hubo un error'})
            } 

            //console.log(task.project.toString()) // Donde se coloca toString porque asi trae el valor y no un new ObjectId
            //console.log(req.project.id)


            // Esto se sustituye y se pone en taskBelongsToProject que esta en middleware/task
            /*if (task.project.toString() != req.project.id) { // Validar que no sea igual el id del proyecto
                const error = new Error('Accion no valida')
                return res.status(400).json({ error: error.message })
            }*/
                            
            res.json(task)  // Aqui se envia la respuesta
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {


            console.log("Actualizado1")


            const {taskId} = req.params

            //Si uso asi findByIdAndUpdate(taskId, req.body) entonces va a eliminar antes the validar lo que sale abajo entonces
            // se cambia findOne o findById
            const task = await Task.findById(taskId)

            /*
            Todo esto esta en el middleware taskBelongsToProject
            if (!task){
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: 'Hubo un error'})
            } 

            if (task.project.toString() != req.project.id) { 
                const error = new Error('Accion no valida')
                return res.status(400).json({ error: error.message })
            }*/


            task.name = req.body.name
            task.description = req.body.description

            await task.save()
            //await req.task.save()
            res.send("Tarea Actualizada Correctamente")
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {

            const { taskId } = req.params
            const task = await Task.findById(taskId, req.body)

            if (!task){
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: 'Hubo un error'})
            } 

            task.deleteOne()  ///Para eliminar el task y con el de abajo se elimina el id del listado de task de project
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== taskId)  // Aqui seria solo la opcion de task porque tasks es un array con varias opciones
            //await task.deleteOne()  Se cambia por el de abajo
            //await req.project.save()
            await Promise.allSettled([ req.task.deleteOne(), req.project.save() ])
            res.send("Tarea Eliminada Correctamente")


            /*req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString() )
            await Promise.allSettled([ req.task.deleteOne(), req.project.save() ])
            res.send("Tarea Eliminada Correctamente")*/
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }



    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status

            const data = {  // Esta es la data que se tiene que pasar el user y el status
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data)
            await req.task.save()
            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    
    /*static updateStatus = async (req: Request, res: Response) => {
        try {

            const {taskId} = req.params

            const task = await Task.findById(taskId)

            if (!task){
                const error = new Error('Tarea no encontrada')
                return res.status(404).json({error: 'Hubo un error'})
            } 

            const {status} = req.body
            req.task.status = status

            if (status === 'pending'){  /// Esto si la tarea no esta tomada
                req.task.completedBy = null
            }else{
                req.task.completedBy = req.user.id
            }

            await req.task.save()
            res.send("Tarea Actualizada")



            const { status } = req.body
            req.task.status = status
            const data = {
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data)
            await req.task.save()
            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }*/
}