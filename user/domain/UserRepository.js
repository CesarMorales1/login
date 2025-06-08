export default class UserRepository {
    async save(user) {
        throw new Error("Method must be implemented");
    }
    
    async findByUsername(username) {
        throw new Error("Method must be implemented");
    }
    
    async findByEmail(email) {
        throw new Error("Method must be implemented");
    }
    
    async existsByUsername(username) {
        throw new Error("Method must be implemented");
    }
    
    async existsByEmail(email) {
        throw new Error("Method must be implemented");
    }
}