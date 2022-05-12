// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//PATHS FOR MICROSERVICES
// const CORE_PATH = 'core/';
// const AUTH_PATH = 'auth/';

//PATHS FOR NO MICROSERVICES
const CORE_PATH = '';
const AUTH_PATH = '';


export const environment = {
  production: false,
  apiUrl: window["env"]["apiUrl"] || "default",

  log_in_console_enabled: window["env"]["debug"] || false,
  log_in_backend_enabled: window["env"]["debug"] || false,

  frontend_version: "2.0.0",
  primary_product_color: '#68b1f0',


  TOKEN_LOC_STRING_MAP: "auth_token_loc",
  TOKEN_SESS_STRING_MAP: "auth_token_sess",
  MUST_CHANGE_PASSWORD_STRING_MAP: 'must_reset_password',
  TWO_FA_IN_PROGRESS_STRING_MAP: 'two_fa_in_progress',
  TOKEN_GOING_TO_EXPIRE_THRESHOLD_MILLISECONDS: 1800000,
  AUTH_HEADER: "Authorization",

  LOGGING_PATH_ERROR: CORE_PATH+"fe-logging/error",
  LOGGIN_PATH_WARN: CORE_PATH+"fe-logging/warn",
  LOGGIN_PATH_INFO: CORE_PATH+"fe-logging/info",
  LOGGIN_PATH_DEBUG: CORE_PATH+"fe-logging/debug",

  LOGIN_BASE_PATH: AUTH_PATH+"authentication",
  COMPLETE_OTP_LOGIN_PATH: AUTH_PATH+"authentication/complete",
  CHANGE_PASSWORD_PATH: AUTH_PATH+"authDetails/changePsw",
  FORCE_CHANGE_PASSWORD_TO_LOGIN_PATH: AUTH_PATH+"authDetails/changePswForLogin",
  REQUEST_CHANGE_PASSWORD_PATH: AUTH_PATH+"authDetails/requestChangePassword",
  COMPLETE_CHANGE_PASSWORD_PATH: AUTH_PATH+"authDetails/completeChangePassword",
  LOAD_AUTHORITIES_URL: AUTH_PATH+"authentication/myAuthorities",
  CHECK_AUTHENTICATION_URL: AUTH_PATH+'checkAuthentication/loggedUser',
  SUCC_LOGIN_LOGS_URL: AUTH_PATH+"succLoginLogs",
  FIND_ALL_USERS: AUTH_PATH+"users/findAll",
  FIND_ALL_PERMISSIONS_GROUP: AUTH_PATH+'registrationUtil/findAllPermissionGroupLabels',
  FIND_ALL_COMPANIES:AUTH_PATH+'registrationUtil/findAllCompanies',
  FIND_ALL_USER_LEVELS: AUTH_PATH+'registrationUtil/findAllUserLevels',

  INVITE_USER: AUTH_PATH+'registration/insertUser',
  EMPLOYEE_DETAILS: AUTH_PATH+'users/findUserDetails',
  UPDATE_EMPLOYEE_DOMICILE: AUTH_PATH+'users/updateDomicileAddress',
  UPDATE_EMPLOYEE_RESIDENCE: AUTH_PATH+'users/updateResidenceAddress',
  UPDATE_EMPLOYEE_PROFILE: AUTH_PATH+'users/updateProfile',
  UPDATE_EMPLOYEE_OTHER_INFO: AUTH_PATH+'users/updateOtherProfileInfo',
  UPDATE_EMPLOYEE_USERNAME: AUTH_PATH+'users/updateUserEmail',
  UPDATE_EMPLOYEE_PROFILE_IMAGE: AUTH_PATH+"users/image", 
  
  EMPLOYEE_WORK_TASK_FIND_ALL: CORE_PATH+'userProfile/allTasksOfUser',
  FIND_MY_TASK_ENABLE: CORE_PATH+'userProfile/allMyTasksEnabled',

  FIND_ALL_MY_PAYCHECK_ENDPOINT: CORE_PATH+'paycheck/findAllMyPaychecks',
  FIND_ALL_EMPLOYEE_PAYCHECKS: CORE_PATH+'paycheck/findAllPaychecksOfUser',
  FIND_UPLOAD_PAYCHECK_ENDPOINT: CORE_PATH+'paycheck/uploadPayckeck',
  DOWNLOAD_MY_PAYCHECK: CORE_PATH+'paycheck/downloadMyPaycheck',
  DOWNLOAD_USER_PAYCHECK: CORE_PATH+'paycheck/downloadUserPaycheck',
  DELETE_USER_PAYCHECK: CORE_PATH+'paycheck/deleteUserPaycheck',


  FIND_ALL_PERSONAL_DOCUMENT_OF_USER: CORE_PATH+'personalDocuments/findAllDocumentsOfUser',
  FIND_ALL_MY_PERSONAL_DOCUMENT: CORE_PATH+'personalDocuments/findAllMyDocuments',
  FIND_ALL_DOCUMENT_TYPE: CORE_PATH+'personalDocuments/findAllDocumentType',
  FIND_ALL_MY_NOT_UPLOADED_DOCUMENT_TYPE: CORE_PATH+'personalDocuments/findAllMyNotUploadedDocumentType',
  FIND_ALL_NOT_UPLOADED_DOCUMENT_TYPE_OF_USER: CORE_PATH+'personalDocuments/findAllNotUploadedDocumentTypeOfUser',
  UPLOAD_MY_DOCUMENT: CORE_PATH+'personalDocuments/uploadMyDocument',
  UPLOAD_USER_DOCUMENT: CORE_PATH+'personalDocuments/uploadUserDocument',
  DOWNLOAD_MY_PERSONAL_DOCUMENT: CORE_PATH+'personalDocuments/downloadMyDocument',
  DOWNLOAD_PERSONAL_DOCUMENT_OF_USER: CORE_PATH+'personalDocuments/downloadUserDocument',
  DELETE_MY_PERSONAL_DOCUMENT: CORE_PATH+'personalDocuments/deleteMyDocument',
  DELETE_PERSONAL_DOCUMENT_OF_USER: CORE_PATH+'personalDocuments/deleteUserDocument',
  DISABLE_PERSONAL_DOCUMENT_EDIT: CORE_PATH+'personalDocuments/disableEdit',
  ENABLE_PERSONAL_DOCUMENT_EDIT: CORE_PATH+'personalDocuments/enableEdit',

  FIND_FOOD_VOUCHER_REQUEST: CORE_PATH+'foodVoucher/findByDate',
  CREATE_FOOD_VOUCHER_REQUEST: CORE_PATH+'foodVoucher/create',
  DELETE_FOOD_VOUCHER_REQUEST: CORE_PATH+'foodVoucher/delete',
  CHECK_FOOD_VOUCHER_ARE_ENABLED: CORE_PATH+'foodVoucher/foodVoucherEnabled',

  DOWNLOAD_DOCUMENT_PATH: CORE_PATH+'documents/download-file',

  MY_COMPLETED_WORK_TASK_FIND_ALL: CORE_PATH+'myTasks/findAll', 
  MY_COMPLETED_WORK_TASK_ADD: CORE_PATH+'myTasks/create',
  MY_COMPLETED_WORK_TASK_DELETE: CORE_PATH+'myTasks/delete',
  MY_COMPLETED_WORK_TASK_OF_MONTH: CORE_PATH+'myTasks/findCompletedTaskOfMonth',

  INCARICO_DETAILS_URL: CORE_PATH+'workTaskDetails',
  TASK_SUMMARY_ENDPOINT: CORE_PATH+'workTaskDetails/summary',
  TASK_SUMMARY_DETAILS_ENDPOINT: CORE_PATH+'workTaskDetails/summary/details',

  ENABLE_USER_ACCOUNT: AUTH_PATH+'manageAccounts/enableProfile',
  DISABLE_USER_ACCOUNT: AUTH_PATH+'manageAccounts/disableProfile',

  DELETE_USER_ACCOUNT: CORE_PATH+"userLevels/delete",
  UPDATE_USER_ACCOUNT: CORE_PATH+"userLevels/update",
  ADD_USER_LEVELS: CORE_PATH+"userLevels/create",
  FIND_ALL_PAGINATED_USER_LEVELS: CORE_PATH+"userLevels/findAll",

  FIND_ALL_TURNSTILE: CORE_PATH+"turnstile/findAll",
  ADD_TURNSTILE: CORE_PATH+"turnstile/create",
  FIND_TURNSTILE_DETAILS: CORE_PATH+'turnstile/findDetails',
  CHANGE_TURNSTILE_SECRET: CORE_PATH+'turnstile/changeSecret',
  UPDATE_TURNSTILE: CORE_PATH+'turnstile/update',

  EXPORT_ATTENDANCE: CORE_PATH+'attendance/exportAttendanceOfDay',
  DELETE_USER_ATTENDANCE: CORE_PATH+'attendance/delete',
  CREATE_USER_ATTENDANCE: CORE_PATH+'attendance/create',
  CREATE_USER_SWITCHED_ATTENDANCE: CORE_PATH+'attendance/switch',
  FIND_ALL_USER_ATTENDANCE: CORE_PATH+'attendance/findAll',

  FIND_USER_COMPLETED_TASK_OF_MONTH: CORE_PATH+'userTask/findCompletedTaskOfMonth',
  FIND_ALL_ATTENDANCE_OF_MONTH: CORE_PATH+'userTask/findAllAttendanceOfMonth',

  GENERATE_BADGE_URL: AUTH_PATH+'badges/generate', 
  COMPANY_ID_BADGE_URL: AUTH_PATH+'badges/companyId', 

  DOWNLOAD_REPORT_URL: CORE_PATH+'reports/download',
  DELETE_REPORT_URL: CORE_PATH+'reports/delete',
  FIND_ALL_REPORT_URL: CORE_PATH+'reports/findAll',
  CREATE_REPORT_URL: CORE_PATH+'reports/create',

  UPDATE_COMPANY_BADGE_LOGO_IMAGE_URL: CORE_PATH+'configs/imageLogo',
  COMPANY_BADGE_LOGO_IMAGE_URL: CORE_PATH+'configs/downloadImageLogo',
  FIND_ALL_SETTING_AREA: CORE_PATH+'configs/findAllAreas',
  FIND_ALL_GLOBAL_CONFIGS_OF_AREA: CORE_PATH+'configs/findAllSettingsOfArea',
  CREATE_SETTING_URL: CORE_PATH+'configs/create',
  UPDATE_SETTING_VALUE_URL: CORE_PATH+'configs/updateValue',
  DELETE_CONFIG_URL: CORE_PATH+'configs/delete',
  DELETE_CONFIG_AREA_URL: CORE_PATH+'configs/deleteArea',

  FIND_WORK_TRANSFER_REQUEST_URL: CORE_PATH+'workTransfer/findByDate',
  DELETE_WORK_TRANSFER_REQUEST_URL: CORE_PATH+'workTransfer/delete',
  CREATE_OR_UPDATE_TRANSFER_REQUEST_URL: CORE_PATH+'workTransfer/createOrUpdate',

  FIND_ADD_USER_EXPENSE_REPORT_URL: CORE_PATH+'expenseReport/findAllExpenseReportOfUsers',
  FIND_ALL_MY_EXPENSE_REPORT_URL: CORE_PATH+'expenseReport/findAllMyExpenseReport',
  CREATE_EXPENSE_REPORT_URL: CORE_PATH+'expenseReport/create',
  UPDATE_EXPENSE_REPORT_URL: CORE_PATH+'expenseReport/updateExpenseReport',
  UPDATE_MY_EXPENSE_REPORT_URL: CORE_PATH+'expenseReport/update',
  ADD_EXPENSE_REPORT_ELEMENT_URL: CORE_PATH+'expenseReport/addNewReportElementToMyReport',
  FIND_MY_EXPENSE_REPORT_DETAILS_URL: CORE_PATH+'expenseReport/findMyExpenseReportDetails',
  DELETE_EXPENSE_REPORT_ELEMENT_URL: CORE_PATH+'expenseReport/deleteReportElement',
  DELETE_EXPENSE_REPORT_URL: CORE_PATH+'expenseReport/deleteReport',
  DOWNLOAD_EXPENSE_REPORT_ELEMENT_URL: CORE_PATH+'expenseReport/downloadExpenseOfReportAttachment',
  DOWNLOAD_EXPENSE_REPORT_ELEMENT_OF_USER_URL: CORE_PATH+'expenseReport/downloadExpenseOfUserReportAttachment',
  FIND_USER_EXPENSE_REPORT_DETAILS_URL: CORE_PATH+'expenseReport/findUserExpenseReportDetails',
  ACCEPT_EXPENSE_REPORT_ELEMENT_URL: CORE_PATH+'expenseReport/acceptExpenseReportElement',
  REFUSE_EXPENSE_REPORT_ELEMENT_URL: CORE_PATH+'expenseReport/refuseExpenseReportElement',

  REQUEST_HOURS_CALCULATION_COMPLETION_LOCK_URL: CORE_PATH + "locks/requestHoursCalculationExecution",
  DELETE_TASK_COMPLETION_LOCK_URL: CORE_PATH + "locks/delete",
  CREATE_TASK_COMPLETION_LOCK_URL: CORE_PATH + "locks/create",
  FIND_ALL_TASK_COMPLETION_LOCK_URL: CORE_PATH + "locks/findAll",

  HOME_ENDPOINT: CORE_PATH+"home",

  FIND_SPECIAL_TASKS_CONFIG: CORE_PATH+'specialTasks/findAll',

  PROFILE_IMAGE_LINK: AUTH_PATH+"myProfile/downloadProfileImage",
  USER_PROFILE: AUTH_PATH+"myProfile",
  FIND_MY_CONTRACT_INFO: AUTH_PATH+"myProfile/myContractDetails",
  USER_PROFILE_UPLOAD_IMAGE: AUTH_PATH+'myProfile/image',
  USER_PROFILE_UPDATE_RESIDENCE: AUTH_PATH+'myProfile/updateMyResidenceAddress',
  USER_PROFILE_UPDATE_DOMICILE: AUTH_PATH+'myProfile/updateMyDomicileAddress',
  USER_PROFILE_INFO: AUTH_PATH+"myProfile/allPersonalData", 
  IMPIEGATO_CHANGE_EMAIL_URL: CORE_PATH+"impiegato/changeEmail",
  IMPIEGATO_CONFIRM_EMAIL_URL:  CORE_PATH+"impiegato/confirmEmailChange",
  

  
  TEAM_INCARICO_URL: CORE_PATH+'teamIncarico',
  IMPIEGATI_NOT_OF_TEAM_INCARICO: CORE_PATH+'teamIncarico/allImpiegatiNotOf',
  TEAM_INCARICO_ADD_SIMPLE_COMPONENTS: CORE_PATH+'teamIncarico/simpleComponents',
  TEAM_INCARICO_UPDATE_SPECIAL_ROLE: CORE_PATH+'teamIncarico/createSpecialComponent',
  TEAM_INCARICO_DELETE_SPECIAL_COMPONENT: CORE_PATH+'teamIncarico/deleteSpecialComponent',
  TEAM_INCARICO_DELETE_SIMPLE_COMPONENT: CORE_PATH+'teamIncarico/deleteStandardComponent',
  TEAM_INCARICO_PERMISSION_GRANTES_URL: CORE_PATH+'teamIncarico/permissionsGranted',

  TASK_EXPENSES_FIND_ALL_URL: CORE_PATH+'task-expenses',
  TASK_EXPENSES_ADD_URL: CORE_PATH+'task-expenses',
  TASK_EXPENSES_UPDATE_URL: CORE_PATH+'task-expenses',
  TASK_EXPENSES_DELETE_URL: CORE_PATH+'task-expenses',
  TASK_EXPENSES_PERMISSION_GRANTES_URL: CORE_PATH+'task-expenses/permissionsGranted',
  TASK_EXPENSES_TYPES_FIND_ALL_URL: CORE_PATH+'task-expenses/expensesTypes/findAll',

  BUDGET_SUMMARY_PERMISSION_GRANTED_URL: CORE_PATH+'budget-summary/permissionsGranted',
  BUDGET_SUMMARY_CREATE_URL: CORE_PATH+'budget-summary',
  
  INCARICO_URL: CORE_PATH+"task",
  DISATTIVA_INCARICO_URL: CORE_PATH+"task/deactivate",
  SEDI_LAVORATIVE_URL: CORE_PATH+"sede",
  SEDI_LAVORATIVE_TIPO_SEDI_URL: CORE_PATH+"sede/tipoSedi",

  FIND_ALL_EMPLOYMENT_OFFICE_URL: CORE_PATH+"sede/findAllEmploymentOffice",

  FIND_ALL_COMPANIES_URL: CORE_PATH+"company/findAll",
  ADD_COMPANY_URL: CORE_PATH+"company",
  UPDATE_COMPANY_URL: CORE_PATH+"company",
  DELETE_COMPANY_URL: CORE_PATH+"company/delete"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
