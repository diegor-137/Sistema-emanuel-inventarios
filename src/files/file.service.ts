import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { FileAws3 } from './entities/file.entity';
import { AWS_PUBLIC_BUCKET_NAME } from '../config/constants';
import { Propagation, runOnTransactionRollback, Transactional } from 'typeorm-transactional-cls-hooked';
 
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileAws3)
    private fileRepository: Repository<FileAws3>,
    private readonly configService: ConfigService
  ) {}
 
  @Transactional({propagation: Propagation.MANDATORY})
  async uploadPublicFile(dataBuffer: Buffer, filename: string, nombre:string) {
    const s3 = new S3();
    const uploadResult = await s3.upload({
      ACL: 'public-read',
      Bucket: this.configService.get<string>(AWS_PUBLIC_BUCKET_NAME),
      Body: dataBuffer,
      Key: `${uuid()}-${nombre}-${filename}`
    }, (e)=>console.log(e)).promise();
 
    const newFile = this.fileRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location
    });
    await this.fileRepository.save(newFile);
    runOnTransactionRollback(()=>{
      s3.deleteObject({
        Bucket: this.configService.get<string>(AWS_PUBLIC_BUCKET_NAME),
        Key: uploadResult.Key,
      }).promise();
    })    
    return newFile;
  }

  @Transactional({propagation: Propagation.MANDATORY})
  async deletePublicFile(fileId: number) {
    const file = await this.fileRepository.findOne({ id: fileId });
    const s3 = new S3();
    await s3.deleteObject({
      Bucket: this.configService.get<string>(AWS_PUBLIC_BUCKET_NAME),
      Key: file.key,
    }).promise();
    await this.fileRepository.delete(fileId);
  }
}