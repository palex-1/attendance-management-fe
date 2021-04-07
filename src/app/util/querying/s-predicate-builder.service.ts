import { Injectable } from "@angular/core";
import { QueryParameter } from "./query-parameter.model";
import { HttpParams } from "@angular/common/http";
import { SPredicate } from "./s-predicate.model";
import { PagingAndSorting } from "./paging-and-sorting.model";

@Injectable()
export class SPredicateBuilder {
    
  
   
    constructor(){
    }

    buildPredicate(queryParameters : QueryParameter[], pagingAndSorting: PagingAndSorting): SPredicate{
        let params: HttpParams = new HttpParams();
        if(queryParameters!=null){
            for(let i = 0; i<queryParameters.length; i++){
                if(queryParameters[i].name!=null && queryParameters[i].value!=null){
                    params = params.append(queryParameters[i].name, queryParameters[i].value);
                }
            }
        }

        if(pagingAndSorting!=null){
            if(pagingAndSorting.page!=null){
                params = params.append('page', pagingAndSorting.page+'');
            }
            if(pagingAndSorting.size!=null){
                params = params.append('size', pagingAndSorting.size+'');
            }
            if(pagingAndSorting.sortBy!=null){
                let sort: string = pagingAndSorting.sortBy;
                if(pagingAndSorting.dir!=null){
                    sort = sort+","+pagingAndSorting.dir;
                }else{
                    sort = sort+",asc";
                }
                params = params.append('sort', sort);
            }
        }

        return new SPredicate(params);
    }


    addNumberQueryParamForFilter(key: string, filterValue: number, queryParameters: QueryParameter[]) {
        if(key==null || filterValue==null){
            return;
        }

        let filter: QueryParameter = new QueryParameter(key, filterValue+'');
        queryParameters.push(filter);
    }

    addStringQueryParamForFilter(key: string, filterValue: string, queryParameters: QueryParameter[]) {
        if(key==null || filterValue==null || filterValue==''){
            return;
        }

        let filter: QueryParameter = new QueryParameter(key, filterValue);
        queryParameters.push(filter);
    }
    addBooleanQueryParamForFilter(key: string, filterValue: boolean, queryParameters: QueryParameter[]) {
        if(key==null || filterValue==null){
            return;
        }
        let filter: QueryParameter = new QueryParameter(key, filterValue+'');
        queryParameters.push(filter);
    }


    addDateQueryParamForFilter(queryId: string, date: Date, queryParameters: QueryParameter[]) {
        if(date==null){
            return;
        }
        let queryP: QueryParameter = new QueryParameter(queryId, date.toISOString());

        queryP.value = date.toISOString();

        queryParameters.push(queryP);
    }

}