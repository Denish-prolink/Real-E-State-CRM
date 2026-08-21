import { Product } from '../products/product.model';

export const getLowStockProducts = async (agencyId: string, userId: string) => {
  const products = await Product.find({
    agencyId,
    quantity: { $lte: 10 },
    status: 'Active',
  })
    .select('title category quantity lowStockReadBy')
    .sort({ quantity: 1 })
    .lean();

  let unreadCount = 0;

  const mappedProducts = products.map((product) => {
    const isRead =
      product.lowStockReadBy &&
      product.lowStockReadBy.some((id) => id.toString() === userId.toString());
    if (!isRead) {
      unreadCount++;
    }
    const { lowStockReadBy, ...rest } = product as any;
    return {
      ...rest,
      isRead,
    };
  });

  return { products: mappedProducts, count: unreadCount };
};

export const markNotificationAsRead = async (
  agencyId: string,
  userId: string,
  productId: string,
) => {
  return Product.findOneAndUpdate(
    { _id: productId, agencyId, quantity: { $lte: 10 } },
    { $addToSet: { lowStockReadBy: userId } },
  );
};

export const markAllNotificationsAsRead = async (agencyId: string, userId: string) => {
  return Product.updateMany(
    { agencyId, quantity: { $lte: 10 } },
    { $addToSet: { lowStockReadBy: userId } },
  );
};
