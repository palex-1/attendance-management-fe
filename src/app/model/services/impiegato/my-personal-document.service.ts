import { Injectable } from '@angular/core';
import { ResetableService } from '../resetable-service.model';
import { OrderEvent } from 'src/app/util/order-event.model';
import { RestDataSource } from '../../rest.datasource';
import { BackendUrlsService } from '../../backend-urls.service';
import { ChainExceptionHandler } from 'src/app/util/exceptions/chain-exception-handler.service';
import { SPredicateBuilder } from 'src/app/util/querying/s-predicate-builder.service';
import { PaycheckDTO } from '../../dtos/impiegato/paycheck-dto.model';
import { HttpErrorResponse, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { SPredicate } from 'src/app/util/querying/s-predicate.model';
import { GenericResponse } from '../../dtos/generic-response.model';
import { map, catchError } from 'rxjs/operators';
import { Page } from 'src/app/util/querying/page.model';
import { QueryParameter } from 'src/app/util/querying/query-parameter.model';
import { PagingAndSorting } from 'src/app/util/querying/paging-and-sorting.model';
import { DateUtils } from 'src/app/util/dates/date-utils';
import { PersonalDocumentDTO } from '../../dtos/impiegato/personal-document-dto.model';
import { PersonalDocumentTypeDTO } from '../../dtos/impiegato/personal-document-type-dto.model';
import { TicketDownloadDTO } from '../../dtos/ticket-download.dto';

const DEFAULT_PAGE_SIZE: number = 5;

@Injectable()
export class MyPersonalDocumentService implements ResetableService {
 

  public currentSortBy: OrderEvent = new OrderEvent("", "");

  dataAreLoaded: boolean = false;

  public totalElements: number = 0;
  public totalPages: number = 0;
  public numberOfElements: number = 0;
  public pageIndex: number = 0;
  public currentPageSize: number = DEFAULT_PAGE_SIZE;
  public currentLoadedData: PersonalDocumentDTO[] = [];

  public currentNotUploadedTypeOfDocument: PersonalDocumentTypeDTO[] = [];
  public currentAllDocumentType: PersonalDocumentTypeDTO[] = [];

  public documentTypeFilter: string = null;

  constructor(private datasource: RestDataSource, private backendUrlsSrv: BackendUrlsService,
                private exceptionHandler: ChainExceptionHandler,  private predicateBuider: SPredicateBuilder) { 
  }

  reset(): void {
    this.dataAreLoaded = false;
    this.resetFilters();
    this.resetPagingAndData();
  }

  resetFilters() {
    this.documentTypeFilter = '';
  }

  resetPagingAndData(){
    this.totalElements = 0;
    this.totalPages = 0;
    this.numberOfElements = 0;
    this.pageIndex = 0;
    this.currentPageSize = DEFAULT_PAGE_SIZE;
    this.currentLoadedData = [];
    this.currentSortBy = new OrderEvent('', '');
    this.currentNotUploadedTypeOfDocument = [];
  }

  areDataLoaded(): boolean {
    return this.dataAreLoaded;
  }

  onResolveFailure(error: HttpErrorResponse): void {
  }

  loadInitialInformation(routeParams: Params, forceReload: boolean = false): Observable<boolean> {
    if (this.dataAreLoaded && !forceReload) {
      return of(true);
    }
    return Observable.create(
      (observer) => {
        forkJoin(
          this.loadMyPersonalDocument(this.buildQueryPredicate()),
          this.loadMyNotUploadedDocumentType(),
          this.loadAllPersonalDocumentType()
        )
          .subscribe(
            (successful) => {
              this.dataAreLoaded = true;
              observer.next(true);
              observer.complete();
            },
            error => {

              this.dataAreLoaded = false;
              this.exceptionHandler.manageErrorWithLongChain(error.status);
              observer.next(false);
              observer.complete();
            }
          );
      }
    );
  }
  

  loadAllPersonalDocumentType(): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<PersonalDocumentTypeDTO[]>>
    (this.backendUrlsSrv.getFindAllPersonalDocumentType())
    .pipe(
      map((response: GenericResponse<PersonalDocumentTypeDTO[]>) => {
        this.currentAllDocumentType = response.data;

        return true;
      }),
      catchError((err) =>  {
        return throwError(err); 
      })
    )
  }
  
  loadMyNotUploadedDocumentType(): Observable<any>{
    let params: HttpParams = new HttpParams();

    return this.datasource.sendGetRequest<GenericResponse<PersonalDocumentTypeDTO[]>>
    (this.backendUrlsSrv.getFindAllMyNotUploadedDocumentType(), params)
    .pipe(
      map((response: GenericResponse<PersonalDocumentTypeDTO[]>) => {
        this.currentNotUploadedTypeOfDocument = response.data;

        return true;
      }),
      catchError((err) =>  {
        return throwError(err); 
      })
    )
  }

  realodPersonalDocument(): Observable<any>{
    return this.loadMyPersonalDocument(this.buildQueryPredicate());
  }

  private loadMyPersonalDocument(predicate: SPredicate): Observable<any>{
    return this.datasource.sendGetRequest<GenericResponse<any>>(
                    this.backendUrlsSrv.getAllMyPersonalDocumentEndpoint(), predicate.params, true)
    .pipe(
        map((response: GenericResponse<Page<PaycheckDTO>>) => {
          this.numberOfElements = response.data.numberOfElements;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;

          this.currentLoadedData = response.data.content;

          for(let i=0; i<this.currentLoadedData.length; i++){
            if(this.currentLoadedData[i].uploadDate!=null){
              this.currentLoadedData[i].uploadDate = DateUtils.buildDateFromStrOrDate(this.currentLoadedData[i].uploadDate);
            }
          }
          
          return true;
        }),
        catchError((err) =>  {
          return throwError(err); 
        })
      );
  }

  buildQueryPredicate(): SPredicate {
    let pagingAndSorting = new PagingAndSorting(this.pageIndex, this.currentPageSize, this.currentSortBy.getSortBy(), this.currentSortBy.getDir());

    return this.predicateBuider.buildPredicate(this.buildFilters(), pagingAndSorting);
  }

  private buildFilters(): QueryParameter[]{
    let queryParameters: QueryParameter[] = [];
    this.predicateBuider.addStringQueryParamForFilter("documentType", this.documentTypeFilter, queryParameters);

    return queryParameters;
  }



  uploadNewPersonalDocument(personalDocumentModalFile: File, selectedDocumentTypeId: number) : Observable<HttpEvent<any>>{
      let addRequest = {
        documentTypeId: selectedDocumentTypeId
      };

      let formData: FormData = new FormData();
      formData.append('document', personalDocumentModalFile);
      formData.append('info', JSON.stringify(addRequest));
  
      return this.datasource.uploadWithPost(this.backendUrlsSrv.getUploadMyPersonalDocumentEndpoint(), formData)
      .pipe(
          map(event=>{
            if(event instanceof HttpResponse){
              this.currentLoadedData.unshift(event.body.data);
            }
            return event;
          })
        );
  }

  downloadPersonalDocument(doc: PersonalDocumentDTO) {
    let params: HttpParams = new HttpParams();
    params = params.append('personalDocumentId', doc.id+'');

    return this.datasource.sendGetRequest<GenericResponse<TicketDownloadDTO>>(this.backendUrlsSrv.getDownloadMyPersonalDocument(), params)
  }

  deletePersonalDocument(doc: PersonalDocumentDTO) {
    let params: HttpParams = new HttpParams();
    params = params.append('personalDocumentId', doc.id+'');

    return this.datasource.sendDeleteRequest(this.backendUrlsSrv.getDeleteMyPersonalDocument(), params)
  }
  

}
