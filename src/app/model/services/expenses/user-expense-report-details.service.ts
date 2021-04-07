import { Injectable } from "@angular/core";
import { ResetableService } from "../resetable-service.model";
import { ChainExceptionHandler } from "../../../util/exceptions/chain-exception-handler.service";
import { forkJoin, of, Observable, throwError } from "rxjs";
import { Params, Router } from "@angular/router";
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { RestDataSource } from "../../rest.datasource";
import { GenericResponse } from "../../dtos/generic-response.model";
import { map, catchError } from "rxjs/operators";
import { BackendUrlsService } from "../../backend-urls.service";
import { SPredicateBuilder } from "src/app/util/querying/s-predicate-builder.service";
import { ExpenseReportDTO } from '../../dtos/expenses/expense-report-dto.model';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ExpenseReportDetailsDTO } from '../../dtos/expenses/expense-report-details-dto.model';
import { ExpenseReportElementDTO } from '../../dtos/expenses/expense-report-element-dto.model';
import { DateUtils } from 'src/app/util/dates/date-utils';
import { UserProfileDTO } from '../../dtos/profile/user-profile.dto';


@Injectable()
export class UserExpenseReportsDetailsService implements ResetableService {
  
     
    dataAreLoaded: boolean = false;

    expenseReportId: number = null;

    title: string = null;
    location: string = null;
    dateOfExpence: Date = null;

    status: string = null;
    inChargeBy: string = null;
    madeBy: string = null;
    processedBy: string = null;
    amountAccepted: number = null;
    amount: number = null;


    currentReport: ExpenseReportDTO = null;
    expenses: ExpenseReportElementDTO[] = [];
    

    constructor(private exceptionHandler: ChainExceptionHandler, private router: Router, private backendUrlsSrv: BackendUrlsService,
                  private datasource: RestDataSource, private predicateBuider: SPredicateBuilder,
                    private notifier: MessageNotifierService) {

    }

    reset(): void {
        this.dataAreLoaded = false;
        this.resetData();
    }

    initializeFields() {
        if(this.currentReport!=null){
            this.title = this.currentReport.title;
            this.location = this.currentReport.location;
            this.dateOfExpence = this.currentReport.dateOfExpence;
            this.amount = this.currentReport.amount;
            this.amountAccepted = this.currentReport.amountAccepted;
            this.inChargeBy = this.buildNameSurnameAndEmail(this.currentReport.processingBy);
            this.madeBy =  this.buildNameSurnameAndEmail(this.currentReport.madeBy);
            this.processedBy = this.buildNameSurnameAndEmail(this.currentReport.processedBy);
            this.status = this.currentReport.status;
        }
    }

    buildNameSurnameAndEmail(user: UserProfileDTO){
        let res = '';
        if(user==null){
            return res;
        }
        if(user.name!=null){
            res = user.name+'';
        }
        if(user.surname!=null){
            res = res+' '+user.surname;
        }
        if(user.email!=null){
            res = res+' - '+user.email;
        }

        return res;
    }
    
    resetData() {
        this.currentReport = null;
        this.expenses = [];


        //report data
        this.title = null;
        this.location = null;
        this.dateOfExpence = null;
        this.amount = null;
        this.amountAccepted = null;
        this.inChargeBy = null;
        this.madeBy = null;
        this.processedBy = null;
    }

    areDataLoaded(): boolean {
        return false; //always refresh
    }

    onResolveFailure(error: HttpErrorResponse): void {
    }



    loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
        if (this.dataAreLoaded && !forceReload) {//always reload
            return of(true);
        }

        this.resetData();

        this.expenseReportId = routeParams.expenseReportId;
       
        return this.loadReport();
    }

    private loadReport(): Observable<any> {
        if(this.expenseReportId==null){
            return of(true);
        }

        return Observable.create(
            (observer) => {
                forkJoin(
                    this.loadUserExpenseReportsDetailsCall()
                )
                    .subscribe(
                        (successful) => {
                            this.dataAreLoaded = true;
                            observer.next(true);
                            observer.complete();
                        },
                        (error: HttpErrorResponse) => {
                            if(error.status==ChainExceptionHandler.NOT_FOUND || error.status==ChainExceptionHandler.BAD_DATA){
                                this.router.navigateByUrl('dashboard/myExpenseReport');
                            }
                            this.dataAreLoaded = false;
                            this.exceptionHandler.manageErrorWithLongChain(error.status);
                            observer.next(false);
                            observer.complete();
                        }
                    );
            }
        );
    }

    realodAllExpenseReports(): Observable<any> {
        return this.loadUserExpenseReportsDetailsCall();
    }

    private loadUserExpenseReportsDetailsCall(): Observable<any> {
        let params = new HttpParams();
        params = params.append('reportElementId', this.expenseReportId+'');

        return this.datasource.sendGetRequest<GenericResponse<ExpenseReportDetailsDTO>>(
            this.backendUrlsSrv.getFindUserExpenseReportsDetailsUrl(), params, true
        ).pipe(
            map(
                (response: GenericResponse<ExpenseReportDetailsDTO>) => {
                    this.currentReport = response.data.report;
                    if(this.currentReport!=null){
                        this.currentReport.dateOfExpence = DateUtils.buildDateFromStrOrDate(this.currentReport.dateOfExpence);
                    }

                    this.expenses = response.data.expenses;

                    this.initializeFields();

                    return true;
                }
            ),
            catchError((err) => {
                return throwError(err);
            })
        )
    }
    

    updateExpenseReport(reportId: number, status: string, notes: string) {
        let updateReq = {
            expenseReportId: reportId,
            status: status,
            notes: notes
        };

        return this.datasource.makePostJsonObject(this.backendUrlsSrv.getUpdateExpenseReportUrl(), updateReq).pipe(
            map(
                (response: GenericResponse<ExpenseReportDTO>) => {
                    this.currentReport = response.data;

                    console.log(this.currentReport)
                    if(this.currentReport!=null){
                        this.currentReport.dateOfExpence = DateUtils.buildDateFromStrOrDate(this.currentReport.dateOfExpence);
                    }

                    this.initializeFields();

                    return response;
                }
            ),
            catchError((err) => {
                return throwError(err);
            })
        );
    }
   
    downloadExpenseElement(elem: ExpenseReportElementDTO) {
        let params: HttpParams = new HttpParams();
        params = params.append('reportElementId', elem.id+'');

        return this.datasource.sendGetRequest(this.backendUrlsSrv.getDownloadExpenseReportOfUserElementUrl(), params)
    }

    acceptExpenseReportElement(currentSelectedExpenseReportElementId: number): Observable<GenericResponse<ExpenseReportElementDTO>>{
        let params: HttpParams = new HttpParams();
        params = params.append('reportElementId', currentSelectedExpenseReportElementId+'');

        return this.datasource.makePostJsonObject(this.backendUrlsSrv.getExpenseAcceptElementUrl(), {}, params)
    }

    refuseExpenseReportElement(currentSelectedExpenseReportElementId: number): Observable<GenericResponse<ExpenseReportElementDTO>>{
        let params: HttpParams = new HttpParams();
        params = params.append('reportElementId', currentSelectedExpenseReportElementId+'');

        return this.datasource.makePostJsonObject(this.backendUrlsSrv.getExpenseRefuseElementUrl(), {}, params)
    }
}