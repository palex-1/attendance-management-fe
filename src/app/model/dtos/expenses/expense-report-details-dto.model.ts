import { ExpenseReportDTO } from './expense-report-dto.model';
import { ExpenseReportElementDTO } from './expense-report-element-dto.model';

export class ExpenseReportDetailsDTO {
    public report ?: ExpenseReportDTO;
	public expenses ?: ExpenseReportElementDTO[];
}