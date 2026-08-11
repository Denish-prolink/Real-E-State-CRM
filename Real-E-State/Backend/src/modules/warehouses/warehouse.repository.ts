import { type IWarehouse, Warehouse } from './warehouse.model';

export const createWarehouse = async (data: Partial<IWarehouse>): Promise<IWarehouse> => {
  const warehouse = new Warehouse(data);
  return await warehouse.save();
};

export const getWarehouses = async (companyId: string, search?: string): Promise<IWarehouse[]> => {
  const filter = search
    ? {
        companyId,
        $or: [
          { warehouseCode: { $regex: search, $options: 'i' } },
          { warehouseName: { $regex: search, $options: 'i' } },
          { warehouseType: { $regex: search, $options: 'i' } },
        ],
      }
    : { companyId };
  return await Warehouse.find(filter).populate('manager').sort({ createdAt: -1 });
};

export const getWarehouseById = async (
  id: string,
  companyId: string,
): Promise<IWarehouse | null> => {
  return await Warehouse.findOne({ _id: id, companyId }).populate('manager');
};

export const getWarehouseByCode = async (
  warehouseCode: string,
  companyId: string,
): Promise<IWarehouse | null> => {
  return await Warehouse.findOne({ warehouseCode, companyId });
};

export const updateWarehouse = async (
  id: string,
  data: Partial<IWarehouse>,
  companyId: string,
): Promise<IWarehouse | null> => {
  return await Warehouse.findOneAndUpdate({ _id: id, companyId }, data, { new: true }).populate(
    'manager',
  );
};

export const deleteWarehouse = async (
  id: string,
  companyId: string,
): Promise<IWarehouse | null> => {
  return await Warehouse.findOneAndDelete({ _id: id, companyId });
};
