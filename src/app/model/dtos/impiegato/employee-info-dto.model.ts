import { UserProfileDTO } from "../profile/user-profile.dto";
import { UserProfileAddressDTO } from "../profile/user-profile-address.dto";
import { UserProfileContractDTO } from './user-profile-contract-dto.model';

export class EmployeeInfoDTO {
    public userProfile ?: UserProfileDTO;
	public domicile ?: UserProfileAddressDTO;
	public residence ?: UserProfileAddressDTO;
	public contractInfo ?: UserProfileContractDTO;
}