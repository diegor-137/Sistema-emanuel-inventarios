import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { TransactionEntity } from './transaction.entity';



@EntityRepository(TransactionEntity)
export class TransactionEntityRepository extends BaseRepository<TransactionEntity> {}