import type { Request, Response } from 'express'
import User from '../models/User'
import Project from '../models/Project'

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        // Find user
        const user = await User.findOne({email}).select('id email name')  // De aqui solo se toma los campos de id, email y name
        if(!user) {
            const error = new Error('Usuario No Encontrado')
            return res.status(404).json({error: error.message})
        }
        res.json(user)
    }

    static getProjecTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',  // Con este populate se va a traer la informacion del team, pero no todos los campos
            select: 'id email name' // Con este select se traen solo estos campos no los demas
        })
        res.json(project.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body 

        // Find user
        const user = await User.findById(id).select('id')  // Selecciono el id
        if(!user) {
            const error = new Error('Usuario No Encontrado')
            return res.status(404).json({error: error.message})
        }

        if(req.project.team.some(team => team.toString() === user.id.toString())) { // Validar que ya existe el miembro del equipo
            const error = new Error('El usuario ya existe en el proyecto')
            return res.status(409).json({error: error.message})
        }

        req.project.team.push(user.id)  // Agregar el id
        await req.project.save() // Guardar el project

        res.send('Usuario agregado correctamente')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params

        if(!req.project.team.some(team => team.toString() ===  userId)) {
            const error = new Error('El usuario no existe en el proyecto')
            return res.status(409).json({error: error.message})
        }

        req.project.team = req.project.team.filter( teamMember => teamMember.toString() !==  userId) // Toma todos menos este id
        await req.project.save()
        res.send('Usuario eliminado correctamente')
    }
}
