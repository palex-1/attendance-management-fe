import { UserLevelDTO } from './user-level.dto';
import { UserProfileDTO } from './user-profile.dto';
import { UserProfileContractDTO } from '../impiegato/user-profile-contract-dto.model';

export class HomeDTO {
    public lastUpdateDate ?: Date;
    
    public contractInfo ?: UserProfileContractDTO;
	public userProfile ?: UserProfileDTO;
}