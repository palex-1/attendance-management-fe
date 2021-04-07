export class WorkTaskDTO {
    public id ?: number;
    public taskCode ?: string;
    public taskDescription ?: string;
    public clientVat ?: string;
    public billable ?: boolean;
    public activationDate ?: Date;
    public deactivationDate ?: Date;
    public isEnabledForAllUsers ?: boolean;    
    public isAbsenceTask ?: boolean;  
    public currentUserCanSeeDetails ?: boolean;
}