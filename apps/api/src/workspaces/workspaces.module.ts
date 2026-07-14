import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';

@Module({
  providers: [WorkspacesService]
})
export class WorkspacesModule {}
