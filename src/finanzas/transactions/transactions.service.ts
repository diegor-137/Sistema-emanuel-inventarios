import { Injectable } from '@nestjs/common';
import { runOnTransactionRollback, Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntityRepository } from './entities/transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {

  //constructor(readonly transactionEntityRepository:TransactionEntityRepository){}
  constructor(
    @InjectRepository(TransactionEntity)
    readonly transactionEntityRepository:Repository<TransactionEntity>){}
  
  @Transactional()
  async create(createTransactionDto: CreateTransactionDto) {
    console.log(createTransactionDto.concepto[0].message);
    console.log(createTransactionDto.concepto[1].message);
    const one = await this.transactionEntityRepository.save(createTransactionDto.concepto[0]);
    const two = await this.transactionEntityRepository.save(createTransactionDto.concepto[1]);
    runOnTransactionRollback((v)=> console.log(v));
    return null;
    //return this.transactionEntityRepository.save(createTransactionDto);
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
