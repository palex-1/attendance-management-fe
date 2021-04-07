import { ImpiegatoTinyDTO } from "../impiegato/impiegato-tiny-dto.model";
import { WorkTaskDTO } from './work-task-dto.model';

export class IncaricoDetailsDTO {

    constructor(public task ?: WorkTaskDTO, public projectManager ?:ImpiegatoTinyDTO,
                            public deliveryManager ?:ImpiegatoTinyDTO , public accountManager?:ImpiegatoTinyDTO,
                                public qaReviewer ?:ImpiegatoTinyDTO){

    }
}