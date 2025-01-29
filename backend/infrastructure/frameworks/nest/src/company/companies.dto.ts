export class CreateCompanyDto {
  name: string;
  type: string;
}

export class UpdateCompanyDto extends CreateCompanyDto {}
