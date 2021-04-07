import { TurnstileDTO } from './turnstile-dto.model';
import { UserProfileDTO } from '../profile/user-profile.dto';

export class UserAttendanceDTO {
    public id ?: number
	public type ?: string;
	public timestamp ?: Date;
	public turnstile ?: TurnstileDTO
	public userProfile ?: UserProfileDTO;
}