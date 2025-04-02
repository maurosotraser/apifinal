import { User } from '../models/user.model';
import { UserService } from './user.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService {
  private userService: UserService;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  constructor() {
    this.userService = new UserService();
  }

  async register(registerData: Omit<User, 'id_usuario'>): Promise<User> {
    const existingUser = await this.userService.getUserByUsername(registerData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const userToCreate: Omit<User, 'id_usuario'> = {
      ...registerData,
      hash_password: await bcrypt.hash(registerData.hash_password, 10),
      ind_estado: registerData.ind_estado || 'S',
      inserted_by: registerData.inserted_by || 'system',
      inserted_at: registerData.inserted_at || new Date(),
      updated_by: null,
      updated_at: null
    };

    return this.userService.createUser(userToCreate);
  }

  async login(username: string, password: string): Promise<{ user: Omit<User, 'hash_password'>; token: string }> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.hash_password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id_usuario, username: user.username },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { hash_password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getCurrentUser(userId: number): Promise<Omit<User, 'hash_password'>> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { hash_password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'hash_password'>;
  }
} 