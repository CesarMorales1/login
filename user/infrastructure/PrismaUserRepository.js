import { PrismaClient } from '@prisma/client';
import UserRepository from '../domain/UserRepository.js';
import User from '../domain/User.js';
import { DatabaseError, NotFoundError } from '../../errors/index.js';

const prisma = new PrismaClient();

export default class PrismaUserRepository extends UserRepository {
    async save(user) {
        try {
            const userData = await prisma.user.create({
                data: {
                    username: user.username,
                    password: user.password,
                    info: {
                        create: {
                            email: user.email,
                            nombre: user.nombre,
                            telephone: user.telephone
                        }
                    }
                },
                include: {
                    info: true
                }
            });

            return this.mapToUser(userData);
        } catch (error) {
            throw new DatabaseError('create user', error);
        }
    }

    async findByUsername(username) {
        try {
            const userData = await prisma.user.findUnique({
                where: { username },
                include: { info: true }
            });

            if (!userData) {
                throw new NotFoundError('User', username);
            }

            return this.mapToUser(userData);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('find user by username', error);
        }
    }

    async findByEmail(email) {
        try {
            const userData = await prisma.user.findFirst({
                where: {
                    info: { email }
                },
                include: { info: true }
            });

            if (!userData) {
                throw new NotFoundError('User', email);
            }

            return this.mapToUser(userData);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('find user by email', error);
        }
    }

    async existsByUsername(username) {
        try {
            const count = await prisma.user.count({
                where: { username }
            });
            return count > 0;
        } catch (error) {
            throw new DatabaseError('check username existence', error);
        }
    }

    async existsByEmail(email) {
        try {
            const count = await prisma.user.count({
                where: {
                    info: { email }
                }
            });
            return count > 0;
        } catch (error) {
            throw new DatabaseError('check email existence', error);
        }
    }

    mapToUser(userData) {
        return new User({
            username: userData.username,
            password: userData.password,
            email: userData.info?.email,
            nombre: userData.info?.nombre,
            telephone: userData.info?.telephone
        });
    }
}