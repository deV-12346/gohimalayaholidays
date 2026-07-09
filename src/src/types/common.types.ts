export interface sendOTPProps {
    email:string,
    phoneNumber:string,
    customerName:string,
    dob:string
}

export interface verifyAccountProps {
    email:string;
    otp:string;
    packageId:string;
    destinationId:string;
    totalPersons:number;
    travelDate:string;
    totalPrice:number;
}