import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileAws3 } from './entities/file.entity';
import { FilesService } from './file.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([FileAws3])
  ],
  providers: [FilesService], 
  exports: [FilesService]
})
export class FilesModule {}
