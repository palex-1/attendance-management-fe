import { DocumentDTO } from '../document-dto.model';

export class ExpenseReportElementDTO {
    public id ?: number;
	public description ?: string;
	public amount ?: number;
	public accepted ?: boolean;
	public attachment ?: DocumentDTO;
    public expenseReportId ?: number;
}