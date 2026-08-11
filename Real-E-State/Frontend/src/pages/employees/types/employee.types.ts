export interface Employee {
  _id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  gender: 'male' | 'female' | 'other' | '';
  dob?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddEmployeePayload = Omit<Employee, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateEmployeePayload = Partial<AddEmployeePayload>;
