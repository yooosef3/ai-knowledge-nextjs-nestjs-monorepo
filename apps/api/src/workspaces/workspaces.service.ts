import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async getMyWorkspaces(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
    });
    return memberships.map((m) => ({ id: m.workspace.id, name: m.workspace.name, role: m.role }));
  }

  async getCurrentWorkspace(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: { include: { user: { select: { id: true, email: true, name: true } } } } },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return {
      id: workspace.id,
      name: workspace.name,
      members: workspace.members.map((m) => ({ id: m.user.id, email: m.user.email, name: m.user.name, role: m.role })),
    };
  }

  async inviteMember(workspaceId: string, inviterUserId: string, inviteeEmail: string) {
    const inviterMembership = await this.prisma.workspaceMember.findFirst({
      where: { userId: inviterUserId, workspaceId },
    });
    if (!inviterMembership || !['OWNER', 'ADMIN'].includes(inviterMembership.role)) {
      throw new ForbiddenException('Only workspace owners or admins can invite members');
    }

    const invitee = await this.prisma.user.findUnique({ where: { email: inviteeEmail } });
    if (!invitee) {
      throw new NotFoundException('No user found with that email — they need to register first');
    }

    const existing = await this.prisma.workspaceMember.findFirst({
      where: { userId: invitee.id, workspaceId },
    });
    if (existing) {
      throw new ConflictException('This user is already a member of the workspace');
    }

    return this.prisma.workspaceMember.create({ data: { userId: invitee.id, workspaceId, role: 'MEMBER' } });
  }

  async verifyMembership(userId: string, workspaceId: string) {
    const membership = await this.prisma.workspaceMember.findFirst({ where: { userId, workspaceId } });
    if (!membership) throw new ForbiddenException('You are not a member of this workspace');
    return membership;
  }
}