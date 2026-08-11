import { Employee, type IEmployee } from './employee.model';

export const createEmployee = async (
  data: Partial<IEmployee> & { companyId: string },
): Promise<IEmployee> => {
  const employee = new Employee(data);
  return await employee.save();
};

export const getEmployees = async (companyId: string, search?: string): Promise<IEmployee[]> => {
  const filter = search
    ? {
        companyId,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { employeeCode: { $regex: search, $options: 'i' } },
          { mobileNo: { $regex: search, $options: 'i' } },
        ],
      }
    : { companyId };
  return await Employee.find(filter).sort({ createdAt: -1 });
};

export const getEmployeeById = async (id: string, companyId: string): Promise<IEmployee | null> => {
  return await Employee.findOne({ _id: id, companyId });
};

export const getEmployeeByCode = async (
  employeeCode: string,
  companyId: string,
): Promise<IEmployee | null> => {
  return await Employee.findOne({ employeeCode, companyId });
};

export const updateEmployee = async (
  id: string,
  data: Partial<IEmployee>,
  companyId: string,
): Promise<IEmployee | null> => {
  return await Employee.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteEmployee = async (id: string, companyId: string): Promise<IEmployee | null> => {
  return await Employee.findOneAndDelete({ _id: id, companyId });
};
