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
import { SPredicate } from "src/app/util/querying/s-predicate.model";
import { OrderEvent } from "src/app/util/order-event.model";
import { PagingAndSorting } from "src/app/util/querying/paging-and-sorting.model";
import { SPredicateBuilder } from "src/app/util/querying/s-predicate-builder.service";
import { QueryParameter } from "src/app/util/querying/query-parameter.model";
import { Page } from 'src/app/util/querying/page.model';
import { ExpenseReportDTO } from '../../dtos/expenses/expense-report-dto.model';
import { StringUtils } from 'src/app/util/string/string-utils';
import { MessageNotifierService } from 'src/app/dialogs/notifications/message-notifier.service';
import { ExpenseReportDetailsDTO } from '../../dtos/expenses/expense-report-details-dto.model';
import { ExpenseReportElementDTO } from '../../dtos/expenses/expense-report-element-dto.model';
import { DateUtils } from 'src/app/util/dates/date-utils';


@Injectable()
export class MyExpenseReportsDetailsService implements ResetableService {
     
    dataAreLoaded: boolean = false;

    creationMode: boolean = false;
    expenseReportId: number = null;

    status: string = null;
    title: string = null;
    location: string = null;
    dateOfExpence: Date = null;

    description: string = null;
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
            this.status = this.currentReport.status;
        }
    }

    
    resetData() {
        this.currentReport = null;
        this.expenses = [];

        this.creationMode = false;
        this.expenseReportId = null;

        //report data
        this.title = null;
        this.location = null;
        this.dateOfExpence = null;
        this.status = null;
        
        //report element to add data
        this.resetExpenseReportElementData();
    }

    resetExpenseReportElementData(){
        this.description = null;
        this.amount = null;
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

        if(routeParams.expenseReportId=='NEW'){
            this.expenseReportId = null;
            this.creationMode = true;
        }else{
            this.expenseReportId = routeParams.expenseReportId;
            this.creationMode = false;
        }
        
        return this.loadReport();
    }

    private loadReport(): Observable<any> {
        if(this.expenseReportId==null){
            return of(true);
        }

        return Observable.create(
            (observer) => {
                forkJoin(
                    this.loadMyExpenseReportsDetailsCall()
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

    realodAllMyExpenseReports(): Observable<any> {
        return this.loadMyExpenseReportsDetailsCall();
    }

    private loadMyExpenseReportsDetailsCall(): Observable<any> {
        let params = new HttpParams();
        params = params.append('expenseId', this.expenseReportId+'');

        return this.datasource.sendGetRequest<GenericResponse<ExpenseReportDetailsDTO>>(
            this.backendUrlsSrv.getFindMyExpenseReportsDetailsUrl(), params, true
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
    


    addNewExpenseReportDetails(expenseReportId: number, description: string, amount: number, expenseReportElemFile: File){
        let addReportElement = {
            description: description,
            amount: amount,
            expenseReportId: expenseReportId
        }
        let formData: FormData = new FormData();
        formData.append('attachment', expenseReportElemFile);
        formData.append('info', JSON.stringify(addReportElement));


        return this.datasource.uploadWithPost(this.backendUrlsSrv.getAddExpenseReportElementUrl(), formData)
    }

    createNewExpenseReport(title: string, location: string, dateOfExpence: Date, 
                                ) {
        let addRequestReport = {
            dateOfExpence: dateOfExpence,
            location: StringUtils.trim(location),
            title: StringUtils.trim(title)
        };
    
        return this.datasource.makePostJsonObject(this.backendUrlsSrv.getCreateExpenseReportUrl(), addRequestReport);
    }

    updateExpenseReport(reportId: number, title: string, location: string, dateOfExpence: Date) {
        let updateReq = {
            expenseReportId: reportId,
            title: StringUtils.trim(title),
            location: StringUtils.trim(location),
            dateOfExpence: dateOfExpence,
        };

        return this.datasource.makePostJsonObject(this.backendUrlsSrv.getUpdateMyExpenseReportUrl(), updateReq);
    }
   

    deleteExpenseReportElement(elem: ExpenseReportElementDTO) {
        let params: HttpParams = new HttpParams();
        params = params.append('reportElementId', elem.id+'');

        return this.datasource.sendDeleteRequest(this.backendUrlsSrv.getDeleteExpenseReportElementUrl(), params);
    }
      
    downloadExpenseElement(elem: ExpenseReportElementDTO) {
        let params: HttpParams = new HttpParams();
        params = params.append('reportElementId', elem.id+'');

        return this.datasource.sendGetRequest(this.backendUrlsSrv.getDownloadExpenseReportElementUrl(), params)
    }

}