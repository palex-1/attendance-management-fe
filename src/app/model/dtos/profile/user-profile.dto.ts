import { PermissionUserGroupLabel } from "./permission-user-group-label.dto";
import { CompanyDTO } from "../company/company.dto";
import { UserLevelDTO } from "./user-level.dto";

export class UserProfileDTO {
    public id ?: number;
    public name ?: string;
    public email ?: string;
    public surname ?: string;
    public birthDate ?: Date;
    public phoneNumber ?: string;
    public sex ?: string;
    public nickname ?: string;
    public cf ?: string;
    public employmentDate ?: Date;
    public userProfileImageDownloadToken ?: string;
    public permissionGroupLabel ?: PermissionUserGroupLabel;
    public company ?: CompanyDTO;

    public accountLocked ?: boolean;
    public accountDisabled ?: boolean;
}