import RegisterUserUseCase from '../../application/RegisterUserUseCase.js';
import PrismaUserRepository from '../../../user/infrastructure/PrismaUserRepository.js';

export default class AuthController {
    constructor() {
        this.userRepository = new PrismaUserRepository();
        this.registerUserUseCase = new RegisterUserUseCase(this.userRepository);
    }

    async register(req, res, next) {
        try {
            const userData = req.body;
            const result = await this.registerUserUseCase.execute(userData);
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            next(error); // Pasar el error al middleware de manejo de errores
        }
    }
}