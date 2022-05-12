import { UserProfileDTO } from '../profile/user-profile.dto';

export class WorkTaskSummaryDTO {
    public userProfile ?: UserProfileDTO;
	public workedHours ?: number;
    public totalCost ?: number;
}