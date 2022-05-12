import { TemporalRangeDTO } from "./temporal-range-dto.model";

export class WorkTaskBudgetSummaryDTO {
    public humanCostSummary ?: number[];
    public expensesCostSummary ?: number[];
    public totalBudget ?: number;
    public taskCreationDays ?: number;
    public temporalRangeBinSummary ?: TemporalRangeDTO[];
}