import { PersonalDocumentTypeDTO } from './personal-document-type-dto.model';

export class PersonalDocumentDTO {
    public id ?: number;
	public personalDocumentType ?: PersonalDocumentTypeDTO;
	public uploadDate ?: Date;
	public editable ?: boolean;
}