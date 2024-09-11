import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()  // Con esto se puede ir agregando varios routers

router.use(authenticate) // Donde authenticate es el middleware de autenticacion y se va a usar en todos los emdpoint

router.post('/',
    //authenticate,   se elimina de aqui porque se usa router.use(authenticate)
    ///Validador de los campos de texto, esto con express-validator
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),  //No debe ser vacio y se le agrega un mensaje
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),

    handleInputErrors,  /// Este es el middleware para validar los errores

    ProjectController.createProject  // Crear el proyecto
)

router.get('/', ProjectController.getAllProjects) // Aqui creo el endpoint y la conexion al controller y al metodo

router.get('/:id',       //// Obtener informacion por Id
    param('id').isMongoId().withMessage('ID no válido'),   // Validar que el ID no sea valido
    handleInputErrors,
    ProjectController.getProjectById
)





/** Routes for tasks */
router.param('projectId', projectExists) // En cada route donde se use projectId se le va a hacer la validacion  de projectExists   y en cada metodo se va a eliminar esto y se usa aqui




router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),  /// Validar el ID
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),

    /*param('id').isMongoId().withMessage('ID no válido'),  /// Validar el ID
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),*/

    handleInputErrors,  ///Este es el middleware para validar la entrada y salida de datos
    hasAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)


router.post('/:projectId/tasks',  //Aqui donde projectId es el Id del Proyecto y luego se escribe tasks
    hasAuthorization,
    //projectExists  Si existe el proyecto se va al controlador
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,  /// Para los errores
    TaskController.createTask  // Para ir a la controladora de createTask
)

router.get('/:projectId/tasks',
    //projectExists
    TaskController.getProjectTasks   
)



//Son middleware de comprobaciones
router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)  // Esto se ejecuta para validar que este la informacion en el validador



router.get('/:projectId/tasks/:taskId',       /////  
    //projectExists
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'), 
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status', 
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)
/** Routes for teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjecTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router   /// Aqui se exporta router