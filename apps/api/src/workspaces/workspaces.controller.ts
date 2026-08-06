import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { WorkspacesService } from './workspaces.service';
import { AuthService } from '../auth/auth.service';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(
    private workspacesService: WorkspacesService,
    private authService: AuthService,
  ) {}

  @Get('mine')
  getMine(@CurrentUser() user: { userId: string }) {
    return this.workspacesService.getMyWorkspaces(user.userId);
  }

  @Get('current')
  getCurrent(@CurrentUser() user: { workspaceId?: string }) {
    return this.workspacesService.getCurrentWorkspace(user.workspaceId!);
  }

  @Post('invite')
  invite(@Body('email') email: string, @CurrentUser() user: { userId: string; workspaceId?: string }) {
    return this.workspacesService.inviteMember(user.workspaceId!, user.userId, email);
  }

  @Post('switch')
  async switch(
    @Body('workspaceId') workspaceId: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    await this.workspacesService.verifyMembership(user.userId, workspaceId);
    return this.authService.issueTokenForWorkspace(user.userId, user.email, workspaceId);
  }
}