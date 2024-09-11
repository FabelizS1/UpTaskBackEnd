import type { Request, Response } from 'express'
import Note, {INote} from '../models/Note'
import { Types } from 'mongoose'

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => { // Donde req: Request<{}, {}, INote>   donde {} es el tipo de dato de param directory,  el 2do es el res body que va a ser el INote y el 3ro es el request. body, el 4to es request.query

        const { content } = req.body

        const note = new Note()
        note.content = content
        note.createdBy = req.user.id 
        note.task = req.task.id


        console.log("NOTE:::")
        console.log("note.content: ", note.content)
        console.log("note.createdBy: ", note.createdBy)
        console.log("note.task: ", note.task)


        req.task.notes.push(note.id)
        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota Creada Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {

        try {
            const notes = await Note.find({task: req.task.id})  // Manda el task que esta en el parametro de task: req.task.id
            res.json(notes)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }

    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {  // <NoteParams> Es el tipo de dato de request

        const { noteId } = req.params
        const note = await Note.findById(noteId)

        if(!note) {
            const error = new Error('Nota no encontrada')
            return res.status(404).json({error: error.message})
        }

        if(note.createdBy.toString() !== req.user.id.toString()) {  // Si el usuario es distinto al que esta autenticado
            const error = new Error('Acción no válida')
            return res.status(401).json({error: error.message})
        }

        req.task.notes = req.task.notes.filter( note => note.toString() !== noteId.toString())

        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Nota Eliminada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}