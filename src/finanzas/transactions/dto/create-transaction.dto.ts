import { IsArray, IsNumber} from "class-validator";

export class CreateTransactionDto {

    @IsArray()
    concepto: definition[]
}

class definition{
    message:any
}