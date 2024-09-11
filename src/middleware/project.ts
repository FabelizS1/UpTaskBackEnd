import type { Request, Response, NextFunction } from 'express'
import Project, { IProject } from '../models/Project'

declare global {   ////Permite reescribir el scope global, porque con esto a la interfaz se le puede agregar un nuevo valor que seria project
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function projectExists( req: Request, res: Response, next: NextFunction ) {
    try {
        const { projectId } = req.params    /// Validar si un proyecto existe
        const project = await Project.findById(projectId)
        if(!project) {
            const error = new Error('Proyecto no encontrado')
            return res.status(404).json({error: error.message})
        }
        req.project = project  /// Si el request existe se le pasa el projecto
        next()  /// Ir al siguiente middleware
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}