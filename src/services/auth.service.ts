import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types/user.types';
import { UserService } from './user.service';

export class AuthService {
  private userService: UserService;
  private readonly JWT_SECRET: string;

  constructor() {
    this.userService = new UserService();
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  async register(registrationData: Omit<User, 'id_usuario'>): Promise<User> {
    const existingUser = await this.userService.getUserByUsername(registrationData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const userToCreate: Omit<User, 'id_usuario'> = {
      ...registrationData,
      password: hashedPassword
    };

    return this.userService.createUser(userToCreate);
  }

  async login(credentials: { username: string; password: string }): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await this.userService.getUserByUsername(credentials.username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.userService.validatePassword(user, credentials.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id_usuario, username: user.username },
      this.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword as Omit<User, 'password'> };
  }

  async getCurrentUser(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }
} 