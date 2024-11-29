class MobilesDto {
  mobileType: string;
  mobile: string;
}
class EmailDto {
  emailType: string;
  email: string;
}
class AddressDto {
  addressType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}
export class CreatePersonDto {
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  dob: Date;
  gender: 'Male' | 'Female';
  mobiles: MobilesDto[];
  emails: EmailDto[];
  addresses: AddressDto[];
}
