import type {Request, Response} from 'express'
import Project from '../models/Project'


export class ProjectController { 
    static createProject = async (req: Request, res: Response) => {

        //res.send("Creando Proyecto...")

        const project = new Project(req.body)

        project.manager = req.user.id

        console.log(req.user)  /// Imprimir el valor de user de auth.ts

        /*if(true) {  /// Si no consigue el proyecto devuelve un error que seria el siguiente
            const error = new Error('Proyecto no encontrado')
            return res.status(404).json({error: error.message})
        }*/

        // Asigna un manager
        /////////////project.manager = req.user.id
        try {
            await project.save()  //salvar el 
            //res.json(project)
            res.send('Proyecto Creando Correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {

        //res.send('Todos los proyectos')


        try {

            const projects = await Project.find({     //Con este trae toda la informacion Project.find({})
                $or: [  // Estas son las condiciones de busqueda
                    {manager: {$in: req.user.id}},     //Aqui adentro se hace el where de la consulta, recupero el where con el middleware tiene el id del token
                    {team: {$in: req.user.id}}  // Tambien puedes ser parte del team para ver los proyectos
                ]
            })

            /*const projects = await  Project.find({})*/

            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            
            const project = await Project.findById(id).populate('tasks')  /// Donde busca por el id

            if(!project) {  /// Si no consigue el proyecto devuelve un error que seria el siguiente
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) { //Puede ser el manager o el colaborador que este en el team
                const error = new Error('Acción no válida')
                return res.status(404).json({error: error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        //const { id } = req.params
        try {  
        
            //const project = await Project.findById(id)  //await Project.findByIdAndUpdate(id, req.body)
            //const project = await Project.findByIdAndUpdate(id, req.body)
            //await project.save()

            /*if(!project) {  /// Si no consigue el proyecto devuelve un error que seria el siguiente
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Solo el manager puede actualizar un proyecto')
                return res.status(404).json({error: error.message})
            }*/

            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description

            await req.project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {

        //const {projectId} = req.params
        try {

            /*console.log("req.params id: ", req.params)

            console.log("encontro project id: ", projectId)

            const project = await Project.findById(projectId)

            console.log("encontro project: ", project)

            if(!project) {  /// Si no consigue el proyecto devuelve un error que seria el siguiente
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Solo el manager puede eliminar un proyecto')
                return res.status(404).json({error: error.message})
            }*/

            await req.project.deleteOne()  /// Elimina
            res.send('Proyecto Eliminado')
        } catch (error) {
            console.log(error)
        }
    }
}