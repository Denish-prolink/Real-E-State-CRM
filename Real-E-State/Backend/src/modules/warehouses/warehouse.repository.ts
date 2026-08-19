import { type IWarehouse, Warehouse } from './warehouse.model';

export const createWarehouse = async (data: Partial<IWarehouse>): Promise<IWarehouse> => {
  const warehouse = new Warehouse(data);
  return await warehouse.save();
};

export const getWarehouses = async (agencyId: string | undefined, search?: string): Promise<IWarehouse[]> => {
  const filter = search
    ? {
        agencyId,
        $or: [
          { warehouseCode: { $regex: search, $options: 'i' } },
          { warehouseName: { $regex: search, $options: 'i' } },
          { warehouseType: { $regex: search, $options: 'i' } },
        ],
      }
    : { agencyId };
  return await Warehouse.find(filter).populate('manager').sort({ createdAt: -1 });
};

export const getWarehouseById = async (
  id: string,
  agencyId: string | undefined,
): Promise<IWarehouse | null> => {
  return await Warehouse.findOne({ _id: id, agencyId }).populate('manager');
};

export const getWarehouseByCode = async (
  warehouseCode: string,
  agencyId: string | undefined,
): Promise<IWarehouse | null> => {
  return await Warehouse.findOne({ warehouseCode, agencyId });
};

export const updateWarehouse = async (
  id: string,
  data: Partial<IWarehouse>,
  agencyId: string | undefined,
): Promise<IWarehouse | null> => {
  return await Warehouse.findOneAndUpdate({ _id: id, agencyId }, data, { new: true }).populate(
    'manager',
  );
};

export const deleteWarehouse = async (
  id: string,
  agencyId: string | undefined,
): Promise<IWarehouse | null> => {
  return await Warehouse.findOneAndDelete({ _id: id, agencyId });
};
