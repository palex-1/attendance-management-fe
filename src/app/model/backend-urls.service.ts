import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BackendConfigService } from './services/configs/backend-config.service';


@Injectable()
export class BackendUrlsService {
         
  constructor(private backendConfigService: BackendConfigService) {
  }

  get baseURL(){
    if(!this.backendConfigService.getBackendUrl().endsWith('/')){
      return this.backendConfigService.getBackendUrl()+'/';
    }
    return this.backendConfigService.getBackendUrl();
  }

  getLoginUrl(){
      return this.baseURL+environment.LOGIN_BASE_PATH;
  }

  getCompleteOTPLoginUrl(): string {
    return this.baseURL+environment.COMPLETE_OTP_LOGIN_PATH;
  }

  getChangePasswordUrl(){
    return this.baseURL+environment.CHANGE_PASSWORD_PATH;
  }

  getForcePasswordChangeToLogin(){
  return this.baseURL+environment.FORCE_CHANGE_PASSWORD_TO_LOGIN_PATH;
  }

  getRequestChangePasswordUrl(){
    return this.baseURL+environment.REQUEST_CHANGE_PASSWORD_PATH;
  }

  getCompleteChangePasswordUrl(){
    return this.baseURL+environment.COMPLETE_CHANGE_PASSWORD_PATH;
  }

  getLoadAuthoritiesUrl(){
    return this.baseURL+environment.LOAD_AUTHORITIES_URL;
  }

  getCheckAuthenticationUrl(){
    return this.baseURL+environment.CHECK_AUTHENTICATION_URL;
  }

  getSuccLoginLogsUrl(){
    return this.baseURL+environment.SUCC_LOGIN_LOGS_URL;
  }

  getImpiegatoChangeEmailUrl(){
    return this.baseURL+environment.IMPIEGATO_CHANGE_EMAIL_URL;
  }

  getImpiegatoConfirmEmailUrl(){
    return this.baseURL+environment.IMPIEGATO_CONFIRM_EMAIL_URL;
  }
  
  getIncaricoDetailsUrl(){
    return this.baseURL+environment.INCARICO_DETAILS_URL;
  }
  
  getIncaricoUrl(){
    return this.baseURL+environment.INCARICO_URL
  }

  getDisattivaIncaricoUrl(){
    return this.baseURL+environment.DISATTIVA_INCARICO_URL
  }

  getSediLavorativeUrl(){
    return this.baseURL+environment.SEDI_LAVORATIVE_URL
  }

  getSediLavorativeTipoSediUrl(){
    return this.baseURL+environment.SEDI_LAVORATIVE_TIPO_SEDI_URL;
  }

  getLoggingPathError(){
    return this.baseURL+environment.LOGGING_PATH_ERROR;
  }

  getLoggingPathWarn(){
    return this.baseURL+environment.LOGGIN_PATH_WARN;
  }
    
  getLoggingPathInfo(){
    return this.baseURL+environment.LOGGIN_PATH_INFO;
  }
    
  getLoggingPathDebug(){
    return this.baseURL+environment.LOGGIN_PATH_DEBUG;
  }

  getTeamIncaricoUrl(){
    return this.baseURL+environment.TEAM_INCARICO_URL;
  }

  getAllImpiegatiNotOfIncaricoUrl(){
    return this.baseURL+environment.IMPIEGATI_NOT_OF_TEAM_INCARICO;
  }

  getTeamIncaricoPermissionGrantedUrl(){
    return this.baseURL+environment.TEAM_INCARICO_PERMISSION_GRANTES_URL;
  }
  
  getTeamIncaricoAddSimpleComponentGrantedUrl(){
    return this.baseURL+environment.TEAM_INCARICO_ADD_SIMPLE_COMPONENTS;
  }

  getTeamIncaricoUpdateSpecialRoleUrl(){
    return this.baseURL+environment.TEAM_INCARICO_UPDATE_SPECIAL_ROLE;
  }

  getTeamIncaricoDeleteSpecialComponentUrl(){
    return this.baseURL+environment.TEAM_INCARICO_DELETE_SPECIAL_COMPONENT;
  }

  getTeamIncaricoDeleteSimpleComponentUrl(){
    return this.baseURL+environment.TEAM_INCARICO_DELETE_SIMPLE_COMPONENT
  }

  getUserProfile(){
    return this.baseURL+environment.USER_PROFILE;
  }

  getUserProfileInfo(): string {
    return this.baseURL+environment.USER_PROFILE_INFO;
  }

  getUpdateUserProfile() {
    return this.baseURL+environment.USER_PROFILE; //same of user profile but is a post
  }

  getUploadProfileImage(): string {
    return this.baseURL+environment.USER_PROFILE_UPLOAD_IMAGE;
  }

  getUpdateProfileDomicile(): string {
    return this.baseURL+environment.USER_PROFILE_UPDATE_DOMICILE;
  }
  getUpdateProfileResidence(): string {
    return this.baseURL+environment.USER_PROFILE_UPDATE_RESIDENCE;
  }
  
  buildUrlForUserProfileImageLink(userProfileImageDownloadToken: string) {
    return this.baseURL+environment.PROFILE_IMAGE_LINK+'/?downloadToken='+userProfileImageDownloadToken
  }
  
  getAllUsers(): string {
    return this.baseURL+environment.FIND_ALL_USERS;
  }

  getAllPermissionUserGroup(): string {
    return this.baseURL+environment.FIND_ALL_PERMISSIONS_GROUP;
  }

  getAllCompanies(): string {
    return this.baseURL+environment.FIND_ALL_COMPANIES;
  }

  getAllUserLevels(): string {
    return this.baseURL+environment.FIND_ALL_USER_LEVELS;
  }

  inviteUserProfile(): string {
    return this.baseURL+environment.INVITE_USER;
  }

  getEmployeeDetails(): string {
    return this.baseURL+environment.EMPLOYEE_DETAILS;
  }

  getUpdateEmployeeDomicile(): string {
    return this.baseURL+environment.UPDATE_EMPLOYEE_DOMICILE;
  }
  
  getUpdateEmployeeResidence(): string {
    return this.baseURL+environment.UPDATE_EMPLOYEE_RESIDENCE;
  }

  getUpdateEmployeeProfile(): string {
    return this.baseURL+environment.UPDATE_EMPLOYEE_PROFILE;
  }

  getUpdateOtherProfileInfo(): string {
    return this.baseURL+environment.UPDATE_EMPLOYEE_OTHER_INFO;
  }

  getUpdateUsernameProfileInfo(): string {
    return this.baseURL+environment.UPDATE_EMPLOYEE_USERNAME;
  }

  buildEmployeeWorkTasksEndpoint(employeeId: any): string {
    return this.baseURL+environment.EMPLOYEE_WORK_TASK_FIND_ALL+'/'+employeeId;
  }
  
  getMyCompletedTaskOfDayEndpoint(): string {
    return this.baseURL+environment.MY_COMPLETED_WORK_TASK_FIND_ALL;
  }

  getAddNewMyTaskEndpoint(): string {
    return this.baseURL+environment.MY_COMPLETED_WORK_TASK_ADD;
  }

  getDeleteMyTaskEndpoint(): string {
    return this.baseURL+environment.MY_COMPLETED_WORK_TASK_DELETE;
  }

  getFindCompletedTaskOfMonthEndpoint(): string {
    return this.baseURL+environment.MY_COMPLETED_WORK_TASK_OF_MONTH;
  }

  getFindSpecialTasksEndpoint(): string {
    return this.baseURL+environment.FIND_SPECIAL_TASKS_CONFIG;
  }

  getUserContractInfoEndpoint(): string {
    return this.baseURL+environment.FIND_MY_CONTRACT_INFO;
  }

  getFindAllMyEnabledTasksEndpoint(): string {
    return this.baseURL+environment.FIND_MY_TASK_ENABLE;
  }

  getAllEmployeePaycheckEndpoint(): string {
    return this.baseURL+environment.FIND_ALL_EMPLOYEE_PAYCHECKS;
  }

  getUploadPaycheckEndpoint(): string {
    return this.baseURL+environment.FIND_UPLOAD_PAYCHECK_ENDPOINT;
  }

  buildDownloadDocumentPath(tokenDownload: string): string {
    return this.baseURL+environment.DOWNLOAD_DOCUMENT_PATH+'?downloadToken='+tokenDownload
  }
  
  getDownloadPaycheckUrl(): string {
    return this.baseURL+environment.DOWNLOAD_USER_PAYCHECK;
  }

  getDeletePaycheckUrl(): string {
    return this.baseURL+environment.DELETE_USER_PAYCHECK;
  }

  getAllMyPaycheckEndpoint(): string {
    return this.baseURL+environment.FIND_ALL_MY_PAYCHECK_ENDPOINT;
  }

  getDownloadMyPaycheckUrl(): string {
    return this.baseURL+environment.DOWNLOAD_MY_PAYCHECK;
  }
  
  getAllEmployeePersonalDocumentEndpoint(): string {
    return this.baseURL+environment.FIND_ALL_PERSONAL_DOCUMENT_OF_USER;
  }
  
  getFindAllNotUploadedDocumentTypeOfUser(): string {
    return this.baseURL+environment.FIND_ALL_NOT_UPLOADED_DOCUMENT_TYPE_OF_USER;
  }

  getFindAllPersonalDocumentType(): string {
    return this.baseURL+environment.FIND_ALL_DOCUMENT_TYPE;
  }

  getUploadPersonalDocumentOfUserEndpoint(): string {
    return this.baseURL+environment.UPLOAD_USER_DOCUMENT;
  }
  
  getDeletePersonalDocument(): string {
    return this.baseURL+environment.DELETE_PERSONAL_DOCUMENT_OF_USER;
  }

  getDownloadPersonalDocument(): string {
    return this.baseURL+environment.DOWNLOAD_PERSONAL_DOCUMENT_OF_USER;
  }
  
  getDisablePersonalDocumentEdit(): string {
    return this.baseURL+environment.DISABLE_PERSONAL_DOCUMENT_EDIT;
  }

  getEnablePersonalDocumentEdit(): string {
    return this.baseURL+environment.ENABLE_PERSONAL_DOCUMENT_EDIT;
  }

  getAllMyPersonalDocumentEndpoint(): string {
    return this.baseURL+environment.FIND_ALL_MY_PERSONAL_DOCUMENT;
  }

  getFindAllMyNotUploadedDocumentType(): string {
    return this.baseURL+environment.FIND_ALL_MY_NOT_UPLOADED_DOCUMENT_TYPE;
  }

  getUploadMyPersonalDocumentEndpoint(): string {
    return this.baseURL+environment.UPLOAD_MY_DOCUMENT;
  }

  getDownloadMyPersonalDocument(): string {
    return this.baseURL+environment.DOWNLOAD_MY_PERSONAL_DOCUMENT;
  }

  getDeleteMyPersonalDocument(): string {
    return this.baseURL+environment.DELETE_MY_PERSONAL_DOCUMENT;
  }  

  getFindMyFoodVoucherRequest(): string {
    return this.baseURL+environment.FIND_FOOD_VOUCHER_REQUEST;
  }
 
  getCreateMyFoodVoucherRequest(): string {
    return this.baseURL+environment.CREATE_FOOD_VOUCHER_REQUEST;
  }

  getDeleteMyFoodVoucherRequest(): string {
    return this.baseURL+environment.DELETE_FOOD_VOUCHER_REQUEST;
  }
  
  getCheckIfFoodVoucherAreEnabledEndpoint(): string {
    return this.baseURL+environment.CHECK_FOOD_VOUCHER_ARE_ENABLED;
  }

  buildTaskSummaryEndpoint(taskId: number): string {
    return this.baseURL+environment.TASK_SUMMARY_ENDPOINT+'/'+taskId;
  }

  buildTaskSummaryDetailsEndpoint(taskId: number): string {
    return this.baseURL+environment.TASK_SUMMARY_DETAILS_ENDPOINT+'/'+taskId;
  }

  enableAccountEndpoint(): string {
    return this.baseURL+environment.ENABLE_USER_ACCOUNT;
  }
  disableAccountEndpoint(): string {
    return this.baseURL+environment.DISABLE_USER_ACCOUNT;
  }

  getDeleteUserLevelUrl(): string {
    return this.baseURL+environment.DELETE_USER_ACCOUNT;
  }

  getUpdateUserLevelUrl(): string {
    return this.baseURL+environment.UPDATE_USER_ACCOUNT;
  }
  
  getAddUserLevelUrl(): string {
    return this.baseURL+environment.ADD_USER_LEVELS;
  }

  getAllUserLevelsEndpoint(): string {
    return this.baseURL+environment.FIND_ALL_PAGINATED_USER_LEVELS;
  }
    
  getHomeEndpoint(): string {
    return this.baseURL+environment.HOME_ENDPOINT;
  }

  getFindAllTurnstile(): string {
    return this.baseURL+environment.FIND_ALL_TURNSTILE;
  }

  getAddTurnstileUrl(): string {
    return this.baseURL+environment.ADD_TURNSTILE;
  }

  findTurnstileDetailsUrl(): string {
    return this.baseURL+environment.FIND_TURNSTILE_DETAILS;
  }

  changeTurnstileSecretUrl(): string {
    return this.baseURL+environment.CHANGE_TURNSTILE_SECRET;
  }

  updateTurnstileUrl(): string {
    return this.baseURL+environment.UPDATE_TURNSTILE;
  }

  deleteUserAttendanceUrl(): string {
    return this.baseURL+environment.DELETE_USER_ATTENDANCE;
  }

  createUserAttendanceUrl(): string {
    return this.baseURL+environment.CREATE_USER_ATTENDANCE;
  }

  getLoadAllTurnstileAttendancesUrl(): string {
    return this.baseURL+environment.FIND_ALL_USER_ATTENDANCE;
  }

  getFindUserCompletedTaskOfMonthEndpoint(): string {
    return this.baseURL+environment.FIND_USER_COMPLETED_TASK_OF_MONTH;
  }

  getFindAllAttendanceOfMonthEndpoint(): string {
    return this.baseURL+environment.FIND_ALL_ATTENDANCE_OF_MONTH;
  }

  getGenerateBadgeUrl(): string {
    return this.baseURL+environment.GENERATE_BADGE_URL;
  }

  getCompanyIdBadgeUrl(): string {
    return this.baseURL+environment.COMPANY_ID_BADGE_URL;
  }

  getDownloadReportUrl(): string {
    return this.baseURL+environment.DOWNLOAD_REPORT_URL;
  }

  getDeleteReportUrl(): string {
    return this.baseURL+environment.DELETE_REPORT_URL;
  }

  getFindAllReportsUrl(): string {
    return this.baseURL+environment.FIND_ALL_REPORT_URL;
  } 

  getCreateReportUrl(){
    return this.baseURL+environment.CREATE_REPORT_URL;
  }

  getUrlUpdateLogoImage(){
    return this.baseURL+environment.UPDATE_COMPANY_BADGE_LOGO_IMAGE_URL;
  }

  getUrlForLogoImageLink() {
    return this.baseURL+environment.COMPANY_BADGE_LOGO_IMAGE_URL;
  }
       
  getAllSettingAreaUrl(): string {
    return this.baseURL+environment.FIND_ALL_SETTING_AREA;
  }

  getAllGlobalConfigsOfAreaUrl(): string {
    return this.baseURL+environment.FIND_ALL_GLOBAL_CONFIGS_OF_AREA;
  }

  getCreateSettingUrl(): string {
    return this.baseURL+environment.CREATE_SETTING_URL;
  }

  getUpdateValueSettingUrl(): string {
    return this.baseURL+environment.UPDATE_SETTING_VALUE_URL;
  }

  getDeleteConfigUrl(): string {
    return this.baseURL+environment.DELETE_CONFIG_URL;
  }

  getDeleteConfigAreaUrl(): string {
    return this.baseURL+environment.DELETE_CONFIG_AREA_URL;
  }

  getFindWorkTransferRequestUrl(): string {
    return this.baseURL+environment.FIND_WORK_TRANSFER_REQUEST_URL;
  }

  getDeleteMyWorkTransferRequest(): string {
    return this.baseURL+environment.DELETE_WORK_TRANSFER_REQUEST_URL;
  }

  getCreateOrUpdateMyWorkTransferRequest(): string {
    return this.baseURL+environment.CREATE_OR_UPDATE_TRANSFER_REQUEST_URL;
  }

  getFindAllMyExpenseReportsUrl(): string {
    return this.baseURL+environment.FIND_ALL_MY_EXPENSE_REPORT_URL;
  }

  getCreateExpenseReportUrl(): string {
    return this.baseURL+environment.CREATE_EXPENSE_REPORT_URL;
  }

  getAddExpenseReportElementUrl(): string {
    return this.baseURL+environment.ADD_EXPENSE_REPORT_ELEMENT_URL;
  }

  getFindMyExpenseReportsDetailsUrl(): string {
    return this.baseURL+environment.FIND_MY_EXPENSE_REPORT_DETAILS_URL;
  }

  getUpdateMyExpenseReportUrl(): string {
    return this.baseURL+environment.UPDATE_MY_EXPENSE_REPORT_URL;
  }

  getDeleteExpenseReportElementUrl(): string {
    return this.baseURL+environment.DELETE_EXPENSE_REPORT_ELEMENT_URL;
  }

  getDownloadExpenseReportElementUrl(): string {
    return this.baseURL+environment.DOWNLOAD_EXPENSE_REPORT_ELEMENT_URL;
  }

  getDeleteExpenseReportUrl(): string {
    return this.baseURL+environment.DELETE_EXPENSE_REPORT_URL;
  }

  getFindAllUserExpenseReportsUrl(): string {
    return this.baseURL+environment.FIND_ADD_USER_EXPENSE_REPORT_URL;
  }

  getFindUserExpenseReportsDetailsUrl(): string {
    return this.baseURL+environment.FIND_USER_EXPENSE_REPORT_DETAILS_URL;
  }

  getDownloadExpenseReportOfUserElementUrl(): string {
    return this.baseURL+environment.DOWNLOAD_EXPENSE_REPORT_ELEMENT_OF_USER_URL;
  }

  getUpdateExpenseReportUrl(): string {
    return this.baseURL+environment.UPDATE_EXPENSE_REPORT_URL;
  }

  getExpenseRefuseElementUrl(): string {
    return this.baseURL+environment.REFUSE_EXPENSE_REPORT_ELEMENT_URL;
  }

  getExpenseAcceptElementUrl(): string {
    return this.baseURL+environment.ACCEPT_EXPENSE_REPORT_ELEMENT_URL;
  }

  getRequestHoursCalculationCompletionLockUrl(): string {
    return this.baseURL+environment.REQUEST_HOURS_CALCULATION_COMPLETION_LOCK_URL;
  }

  getDeleteTaskCompletionLockUrl(): string {
    return this.baseURL+environment.DELETE_TASK_COMPLETION_LOCK_URL;
  }
  
  getCreateTaskCompletionLockUrl(): string {
    return this.baseURL+environment.CREATE_TASK_COMPLETION_LOCK_URL;
  }
  
  getFindAllTaskCompletionsLocksUrl(): string {
    return this.baseURL+environment.FIND_ALL_TASK_COMPLETION_LOCK_URL;
  }
 
  getFindAllEmploymentOfficeUrl(): string {
    return this.baseURL+environment.FIND_ALL_EMPLOYMENT_OFFICE_URL;
  }


  getAllCompaniesEndpoint(): string {
    return this.baseURL+environment.FIND_ALL_COMPANIES_URL;
  }

  getAddCompanyUrl(): string {
    return this.baseURL+environment.ADD_COMPANY_URL;
  }

  getUpdateCompanyUrl(): string {
    return this.baseURL+environment.UPDATE_COMPANY_URL;
  }

  getDeleteCompanyUrl(): string {
    return this.baseURL+environment.DELETE_COMPANY_URL;
  }
  
}