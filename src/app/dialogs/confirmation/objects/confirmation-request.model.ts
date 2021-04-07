export class ConfirmationRequest{

    constructor(public title: string, public mess: string, public confirmationCallback: () => any, public rejectCallback: () => any){

    }
}