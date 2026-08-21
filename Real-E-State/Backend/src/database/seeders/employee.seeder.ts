import logger from '../../config/logger';
import { Employee } from '../../modules/employees/employee.model';

export const seedEmployees = async (agencies: any[]) => {
  logger.info('Seeding Employees...');
  await Employee.deleteMany({});
  const agency1 = agencies[0];
  const agency2 = agencies[1];

  const employees = await Employee.create([
    {
      employeeCode: 'EMP001',
      firstName: 'Alice',
      lastName: 'Johnson',
      mobileNo: '5551234567',
      email: 'alice@acme.com',
      department: 'Logistics',
      designation: 'Warehouse Manager',
      joiningDate: new Date('2022-01-15'),
      gender: 'female',
      agencyId: agency1._id,
    },
    {
      employeeCode: 'EMP002',
      firstName: 'Bob',
      lastName: 'Williams',
      mobileNo: '5559876543',
      email: 'bob@acme.com',
      department: 'Sales',
      designation: 'Sales Rep',
      joiningDate: new Date('2023-03-01'),
      gender: 'male',
      agencyId: agency1._id,
    },
    {
      employeeCode: 'STK001',
      firstName: 'Happy',
      lastName: 'Hogan',
      mobileNo: '5550001111',
      email: 'happy@stark.com',
      department: 'Security',
      designation: 'Head of Security',
      joiningDate: new Date('2010-05-01'),
      gender: 'male',
      agencyId: agency2._id,
    },
  ]);

  return employees;
};
