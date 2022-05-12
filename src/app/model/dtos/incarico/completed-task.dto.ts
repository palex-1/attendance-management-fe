import { WorkTaskDTO } from './work-task-dto.model';
import { UserProfileDTO } from '../profile/user-profile.dto';

export class CompletedTaskDTO {
    public id ?: number;
	public workedHours ?: number;
	public day ?: Date;
	public smartworked ?: boolean;
	public editable ?: boolean;
	public taskCode ?: WorkTaskDTO
	public userProfile ?: UserProfileDTO;
	public activityDescription ?: string;
	public totalCost ?: number;
}