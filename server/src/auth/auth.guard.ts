import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookie = this.validateRequest(request);
  
    try {
      const user = await this.usersService.getUserById(cookie.id);
  
      if (!user) {
        throw new UnauthorizedException('Invalid authentication');
      }
  
      // Attach user to request
      request.user = user;  
      return true;
      
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication');
    }
  }
  

  private validateRequest(request: Request): any {
    const token = request.cookies['token'];
    if (!token) {
      return null;
    }
    const user = this.validateToken(token);
    return user;
  }

  private validateToken(token: string): any {
    try {
      const decoded = jwt.verify(token, 'nisim');
      return decoded;
    } catch (err) {
      return null;
    }
  }
}
