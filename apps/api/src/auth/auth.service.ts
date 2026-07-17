import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
      },
    });

    // Every new user gets their own workspace, and becomes its OWNER
    const workspace = await this.prisma.workspace.create({
      data: {
        name: dto.name ? `${dto.name}'s workspace` : 'My workspace',
        members: {
          create: { userId: user.id, role: 'OWNER' },
        },
      },
    });

    return this.signToken(user.id, user.email, workspace.id);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Same error for "no such user" and "wrong password" — see Security Corner below
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const membership = await this.prisma.workspaceMember.findFirst({
      where: { userId: user.id },
    });

    return this.signToken(user.id, user.email, membership?.workspaceId);
  }

  private signToken(userId: string, email: string, workspaceId?: string) {
    const payload = { sub: userId, email, workspaceId };
    return { access_token: this.jwtService.sign(payload) };
  }
}
