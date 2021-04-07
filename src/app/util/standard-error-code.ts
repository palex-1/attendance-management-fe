


const INVALID_OTP_CODE_CONST: number = 4;
const TWO_FA_REQUIRED_CODE_CONST: number = 5;
const MUST_CHANGE_PASSWORD_CONST :number = 6;
const EXPIRED_OTP_CODE_CONST :number = 7;
const MAX_OTP_ATTEMPT_REACHED_CONST: number = 8;

const UNSUPPORTED_FILE_EXTENSIONS_CONST = 395;
const USER_NOT_FOUND_CONST = 396;

const INVALID_CF_CONST: number = 399;
const INVALID_BIRTH_DATE_CONST: number = 400;
const INVALID_PHONE_NUMBER_CONST: number = 401;
const INVALID_EMAIL_CONST: number = 402;
const USERNAME_ALREADY_REGISTRED_CONST: number = 403;
const MAIL_ALREADY_REGISTRED_CONST: number = 404;
const PHONE_NUMBER_ALREADY_REGISTERED_CONST : number = 405;
const PERMISSION_GROUP_NOT_EXISTS_CONST: number = 406;
const COMPANY_NOT_EXISTS_CONST: number = 407;
const ERROR_SENDING_EMAIL_PLEASE_CHECK_IT_CONST: number = 408;
const USER_LEVEL_NOT_FOUND_CONST: number = 409;
const SUBMISSION_FOR_THIS_DATE_IS_LOCKED_CONST: number = 410;
const WORK_TASK_NOT_FOUND_CONST: number = 411;
const TOTAL_WORKED_HOURS_REACHES_THE_LIMIT_CONST: number = 412;
const UPDATED_AN_ALREADY_ADDED_TASK_CONST: number = 413;
const THIS_TASK_IS_NOT_EDITABLE_CONST: number = 414;
const USER_IS_NOT_PART_OF_THE_TEAM_CONST: number = 415;
const THE_TASK_IS_ENABLED_FOR_ALL_USER_CONST: number = 416;
const TASK_IN_NOT_YET_ENABLED_CONST: number = 417;
const ALREADY_EXISTS_A_PAYOUT_IN_MONTH_AND_DATE_CONST: number = 418;
const FISCAL_CODE_OF_USER_IS_NOT_FOUND_IN_PAYCHECK_CONST: number = 419;
const ALREADY_EXIST_THIS_PERSONAL_DOCUMENT_FOR_USER_CONST = 420;
const PERSONAL_DOCUMENT_IN_NOT_EDITABLE_CONST = 421;
const NOT_ENOUGHT_WORKED_HOURS_TO_REQUEST_FOOD_VOUCHER_CONST = 422;

const USER_CANNOT_DISABLE_ENABLE_HIMSELF_CONST = 424; 

const USER_IS_NOT_AN_EMPLOYEE_CONST = 429;

const REPORT_CANNOT_BE_MODIFIED_CONST = 431;
const EXPENSE_REPORT_NOT_IN_PROCESSING_STATUS_CONST = 432;

const TOO_MUCH_ABSENCE_TASK_ADDED_IN_THIS_DAY_CONST = 434;

const ONLY_ADMIN_CAN_ADD_ADMIN_CONST = 435;

export class StandardErrorCode {

    /** Invalid fiscal code */
    public static get INVALID_CF(): number{
        return INVALID_CF_CONST;
    } 
    /** Invalid Birth Date */
    public static get INVALID_BIRTH_DATE(): number {
        return INVALID_BIRTH_DATE_CONST;
    }
    /** Invalid Phone Number */
    public static get INVALID_PHONE_NUMBER(): number {
        return INVALID_PHONE_NUMBER_CONST;
    }

    /** Invalid Email */
    public static get INVALID_EMAIL(): number {
        return INVALID_EMAIL_CONST;
    }

    /** Username is already registered */
    public static get USERNAME_ALREADY_REGISTRED(): number {
        return USERNAME_ALREADY_REGISTRED_CONST;
    }

    /** Mail address is already used */
    public static get MAIL_ALREADY_REGISTRED(): number {
        return MAIL_ALREADY_REGISTRED_CONST;
    }

    /** Phone number is already registered */
    public static get PHONE_NUMBER_ALREADY_REGISTERED(): number {
        return PHONE_NUMBER_ALREADY_REGISTERED_CONST;
    }

    /** Permission group not exists */
    public static get PERMISSION_GROUP_NOT_EXISTS(): number {
        return PERMISSION_GROUP_NOT_EXISTS_CONST;
    }

    /** Company not exists */
    public static get COMPANY_NOT_EXISTS(): number {
        return COMPANY_NOT_EXISTS_CONST;
    }

    /** Error sending email please check it */
    public static get ERROR_SENDING_EMAIL_PLEASE_CHECK_IT(): number {
        return ERROR_SENDING_EMAIL_PLEASE_CHECK_IT_CONST;
    }
    
    /** Must Change Password */
    public static get MUST_CHANGE_PASSWORD(): number {
        return MUST_CHANGE_PASSWORD_CONST;
    }

    /** Two factor authentication required */
    public static get TWO_FA_REQUIRED_CODE(): number {
        return TWO_FA_REQUIRED_CODE_CONST;
    }

    /** invalid otp code */
    public static get INVALID_OTP_CODE(): number {
        return INVALID_OTP_CODE_CONST;
    }

    /** Expired OTP code */
    public static get EXPIRED_OTP_CODE(): number {
        return EXPIRED_OTP_CODE_CONST;
    }

    /** Maximum otp code confirm attempt reached */
    public static get MAX_OTP_ATTEMPT_REACHED(): number {
        return MAX_OTP_ATTEMPT_REACHED_CONST;
    }
    
    /** User level not found */
    public static get USER_LEVEL_NOT_FOUND(): number {
        return USER_LEVEL_NOT_FOUND_CONST;
    }

    /** Submission for this date is locked */
    public static get SUBMISSION_FOR_THIS_DATE_IS_LOCKED(): number {
        return SUBMISSION_FOR_THIS_DATE_IS_LOCKED_CONST;
    }

    /** Work Task not found */
    public static get WORK_TASK_NOT_FOUND(): number {
        return WORK_TASK_NOT_FOUND_CONST;
    }

    /** Total Worked Hours reached the limit */
    public static get TOTAL_WORKED_HOURS_REACHES_THE_LIMIT(): number {
        return TOTAL_WORKED_HOURS_REACHES_THE_LIMIT_CONST;
    }

    /** Updated an already added task */
    public static get UPDATED_AN_ALREADY_ADDED_TASK(): number {
        return UPDATED_AN_ALREADY_ADDED_TASK_CONST;
    }

    /** This task is not editable */
    public static get THIS_TASK_IS_NOT_EDITABLE(): number {
        return THIS_TASK_IS_NOT_EDITABLE_CONST;
    }
    /** User is not part of the Team */
    public static get USER_IS_NOT_PART_OF_THE_TEAM(): number {
        return USER_IS_NOT_PART_OF_THE_TEAM_CONST;
    }

    /** The task is enabled for all users */
    public static get THE_TASK_IS_ENABLED_FOR_ALL_USER(): number {
        return THE_TASK_IS_ENABLED_FOR_ALL_USER_CONST;
    }
    /** The task is not yet enabled */
    public static get TASK_IN_NOT_YET_ENABLED(): number {
        return TASK_IN_NOT_YET_ENABLED_CONST;
    }

    /** Already exists a payout in this month and date */
    public static get ALREADY_EXISTS_A_PAYOUT_IN_MONTH_AND_DATE(): number {
        return ALREADY_EXISTS_A_PAYOUT_IN_MONTH_AND_DATE_CONST;
    }

    /** Fiscal code of user is not found in paycheck */
    public static get FISCAL_CODE_OF_USER_IS_NOT_FOUND_IN_PAYCHECK(): number {
        return FISCAL_CODE_OF_USER_IS_NOT_FOUND_IN_PAYCHECK_CONST;
    }

    /** Already exists this personal document for user */
    public static get ALREADY_EXIST_THIS_PERSONAL_DOCUMENT_FOR_USER(): number {
        return ALREADY_EXIST_THIS_PERSONAL_DOCUMENT_FOR_USER_CONST;
    }

    /** Personal document is not editable */
    public static get PERSONAL_DOCUMENT_IN_NOT_EDITABLE(): number {
        return PERSONAL_DOCUMENT_IN_NOT_EDITABLE_CONST;
    }

    /** Unsupported File extension */
    public static get UNSUPPORTED_FILE_EXTENSIONS(): number {
        return UNSUPPORTED_FILE_EXTENSIONS_CONST;
    }

    /** Not enought worked hours to request food voucher */
    public static get NOT_ENOUGHT_WORKED_HOURS_TO_REQUEST_FOOD_VOUCHER(): number {
        return NOT_ENOUGHT_WORKED_HOURS_TO_REQUEST_FOOD_VOUCHER_CONST;
    }

    /** The user cannot disable himself */
    public static get USER_CANNOT_DISABLE_ENABLE_HIMSELF(): number {
        return USER_CANNOT_DISABLE_ENABLE_HIMSELF_CONST;
    }

    /** User not found */
    public static get USER_NOT_FOUND(): number {
        return USER_NOT_FOUND_CONST;
    }

    /** User is not an employee */
    public static get USER_IS_NOT_AN_EMPLOYEE(): number {
        return USER_IS_NOT_AN_EMPLOYEE_CONST;
    }

    /** Report cannot be modified */
    public static get REPORT_CANNOT_BE_MODIFIED(): number {
        return REPORT_CANNOT_BE_MODIFIED_CONST;
    }
   
    /** Expense report is not in processing status */
    public static get EXPENSE_REPORT_NOT_IN_PROCESSING_STATUS(): number {
        return EXPENSE_REPORT_NOT_IN_PROCESSING_STATUS_CONST;
    }

    /** Too much absence task added in this day */
    public static get TOO_MUCH_ABSENCE_TASK_ADDED_IN_THIS_DAY(): number {
        return TOO_MUCH_ABSENCE_TASK_ADDED_IN_THIS_DAY_CONST;
    }

    /** Only Admin can add Admin */
    public static get ONLY_ADMIN_CAN_ADD_ADMIN(): number {
        return ONLY_ADMIN_CAN_ADD_ADMIN_CONST;
    }

}