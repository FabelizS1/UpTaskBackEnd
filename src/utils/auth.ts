import bcrypt from 'bcrypt'


//Convertir la clave a hashear
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

//Validar elpassword contra el de base de datos
export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcrypt.compare(enteredPassword, storedHash) // Donde enteredPassword es el password que ingresa el usuario y storedHash es el password hasheado
}