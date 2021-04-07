export class GrantedPermissionsDTO {
    
    constructor(public readPermission?: boolean, public updatePermission ?: boolean,
	                public creationPermission ?: boolean, public deletePermission ?: boolean){

                    }
}