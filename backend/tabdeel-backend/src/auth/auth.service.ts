import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

/**
 * SECURITY WARNING: This service currently uses hardcoded credentials for demo purposes.
 * 
 * TODO: Implement proper authentication:
 * 1. Install bcrypt: npm install bcrypt @types/bcrypt
 * 2. Hash passwords before storing in database
 * 3. Use UsersService to validate credentials
 * 4. Compare hashed passwords using bcrypt.compare()
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    // Uncomment when implementing proper auth:
    // private usersService: UsersService,
  ) { }

  async login(username: string, password: string) {
    // TEMPORARY: Hardcoded credentials for demo
    // TODO: Replace with proper user validation
    if (username === 'admin' && password === '1234') {
      const payload = { username, sub: 1 };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  /* 
  // Proper implementation example:
  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  */
}