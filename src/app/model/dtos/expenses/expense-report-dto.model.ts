import { WorkTaskDTO } from '../incarico/work-task-dto.model';
import { UserProfileDTO } from '../profile/user-profile.dto';

export class ExpenseReportDTO {
    public id ?: number;
	public title ?: string;
	public dateOfExpence ?: Date;
	public amount ?: number;
	public amountAccepted ?: number;
	public notes ?: string;
	public status ?: string;
	public location ?: string;
	public madeBy ?: UserProfileDTO;
	public processedBy ?: UserProfileDTO;
	public processingBy ?: UserProfileDTO;
	public workTask ?: WorkTaskDTO;
}