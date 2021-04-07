import { UserProfileDTO } from "./user-profile.dto";
import { UserProfileAddressDTO } from "./user-profile-address.dto";

export class UserProfileInfoDTO {
    public userProfile ?: UserProfileDTO;
	public domicile ?: UserProfileAddressDTO;
	public residence ?: UserProfileAddressDTO;
}