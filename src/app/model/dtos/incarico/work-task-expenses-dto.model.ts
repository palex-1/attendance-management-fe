import { WorkTaskDTO } from "./work-task-dto.model";

export class WorkTaskExpensesDTO {
    public id ?: number;
    public title ?: string;
    public description ?: string;
    public expenseType ?: string;
    public day ?: Date;
    public amount ?: number;
    public workTask ?: WorkTaskDTO;
}