/**
 * @author Alessandro Pagliaro
 * 
 */
export interface GenericResponse<T> {
    code: number;
	version: string;
    //resourceId: string;
    message: string;
    data: T;
    subcode: number;
    operationIdentifier: string;
}