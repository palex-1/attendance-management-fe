import { ImpiegatoSmallDTO } from "../impiegato/impiegato-small-dto.model";

export class ComponenteIncaricoDTO {
    constructor(public impiegato ?: ImpiegatoSmallDTO, public ruolo ?: string) {

    }
}