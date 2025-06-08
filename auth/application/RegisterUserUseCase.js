import { ValidationError, DuplicateError, BusinessRuleError } from '../../errors/index.js';
import User from '../../user/domain/User.js';
import { createHashPassword } from '../../helper/bcryptHandler.js';

export default class RegisterUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userData) {
        const { username, password, email, nombre, telephone } = userData;

        // Validaciones de dominio
        this.validateUserData({ username, password, email, nombre, telephone });

        // Verificar duplicados
        await this.checkDuplicates(username, email);

        // Crear usuario
        const hashedPassword = await createHashPassword(password);
        
        const user = new User({
            username,
            password: hashedPassword,
            email,
            nombre,
            telephone
        });

        // Guardar usuario
        const savedUser = await this.userRepository.save(user);

        // Retornar sin la contraseña
        return {
            username: savedUser.username,
            email: savedUser.email,
            nombre: savedUser.nombre,
            telephone: savedUser.telephone
        };
    }

    validateUserData({ username, password, email, nombre, telephone }) {
        if (!username || username.trim().length === 0) {
            throw new ValidationError('username', 'Username is required');
        }

        if (username.length > 10) {
            throw new ValidationError('username', 'Username must be 10 characters or less');
        }

        if (!password) {
            throw new ValidationError('password', 'Password is required');
        }

        if (!User.validatePassword(password)) {
            throw new ValidationError('password', 'Password must be at least 10 characters long, contain at least one number and at least 2 special characters');
        }

        if (!email) {
            throw new ValidationError('email', 'Email is required');
        }

        if (!User.validateEmail(email)) {
            throw new ValidationError('email', 'Invalid email format');
        }

        if (nombre && !User.validateNombre(nombre)) {
            throw new ValidationError('nombre', 'Name must contain only letters');
        }

        if (telephone && !User.validaTelephone(telephone)) {
            throw new ValidationError('telephone', 'Telephone must be exactly 11 digits');
        }
    }

    async checkDuplicates(username, email) {
        const [usernameExists, emailExists] = await Promise.all([
            this.userRepository.existsByUsername(username),
            this.userRepository.existsByEmail(email)
        ]);

        if (usernameExists) {
            throw new DuplicateError('User', 'username', username);
        }

        if (emailExists) {
            throw new DuplicateError('User', 'email', email);
        }
    }
}