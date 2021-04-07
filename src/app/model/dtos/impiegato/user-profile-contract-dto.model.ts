import { UserLevelDTO } from '../profile/user-level.dto';

export class UserProfileContractDTO {
    public id ?: number;
	public workDayHours ?: number;
	public level ?: UserLevelDTO;
	public hiringDate ?: Date;
	public employmentOffice ?: string;
	public vacationDays ?: number;
	public leaveHours ?: number;
}