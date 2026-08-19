import { Employee, type IEmployee } from './employee.model';

export const createEmployee = async (
  data: Partial<IEmployee> & { agencyId: string | undefined },
): Promise<IEmployee> => {
  const employee = new Employee(data);
  return await employee.save();
};

export const getEmployees = async (agencyId: string | undefined, search?: string): Promise<IEmployee[]> => {
  const filter = search
    ? {
        agencyId,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { employeeCode: { $regex: search, $options: 'i' } },
          { mobileNo: { $regex: search, $options: 'i' } },
        ],
      }
    : { agencyId };
  return await Employee.find(filter).sort({ createdAt: -1 });
};

export const getEmployeeById = async (id: string, agencyId: string | undefined): Promise<IEmployee | null> => {
  return await Employee.findOne({ _id: id, agencyId });
};

export const getEmployeeByCode = async (
  employeeCode: string,
  agencyId: string | undefined,
): Promise<IEmployee | null> => {
  return await Employee.findOne({ employeeCode, agencyId });
};

export const updateEmployee = async (
  id: string,
  data: Partial<IEmployee>,
  agencyId: string | undefined,
): Promise<IEmployee | null> => {
  return await Employee.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteEmployee = async (id: string, agencyId: string | undefined): Promise<IEmployee | null> => {
  return await Employee.findOneAndDelete({ _id: id, agencyId });
};
