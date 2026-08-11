import type { Order } from "../types/order.types";

export const printOrder = (order: Order) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const discountAmount =
    order.discountType === "percentage"
      ? (order.items.reduce((sum, item) => sum + item.total, 0) * order.discountValue) / 100
      : order.discountValue;

  const subtotal = order.items.reduce((sum, item) => sum + item.total, 0);

  const itemsHtml = order.items
    ?.map(
      (item) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px; font-weight: 500; color: #1e293b;">
        ${(item.product as { title?: string } | null)?.title || "Unknown Product"}
      </td>
      <td style="padding: 12px; color: #64748b;">${item.sku || "-"}</td>
      <td style="padding: 12px; color: #64748b; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; color: #64748b; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 12px; font-weight: 600; color: #1e293b; text-align: right;">₹${item.total.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const htmlContent = `
    <html>
      <head>
        <title>Order Invoice - ${order._id}</title>
        <style>
          @media print {
            body {
              background-color: white !important;
              color: black !important;
              padding: 0 !important;
            }
            .no-print {
              display: none !important;
            }
            .invoice-card {
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
          }
          body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 40px;
            color: #334155;
            background-color: #f8fafc;
          }
          .invoice-card {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 24px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            color: #0f172a;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .header-meta {
            text-align: right;
            font-size: 14px;
            color: #64748b;
          }
          .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #475569;
            margin-bottom: 12px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
          }
          .info-box {
            background: #f8fafc;
            border: 1px solid #f1f5f9;
            padding: 16px;
            border-radius: 8px;
          }
          .info-box p {
            margin: 4px 0;
            font-size: 14px;
          }
          .info-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
          }
          th {
            background: #f1f5f9;
            color: #475569;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            text-align: left;
            padding: 12px;
          }
          .totals {
            width: 300px;
            margin-left: auto;
            margin-top: 20px;
            font-size: 14px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            color: #475569;
          }
          .totals-row.final {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            border-top: 2px solid #f1f5f9;
            padding-top: 12px;
            margin-top: 8px;
          }
          .footer-note {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="header">
            <div>
              <h1>${order.orderType === "sell" ? "Tax Invoice (Sales)" : "Purchase Order"}</h1>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Order ID: ${order._id}</p>
            </div>
            <div class="header-meta">
              <p style="margin: 0; font-weight: 600; color: #0f172a;">Date</p>
              <p style="margin: 4px 0 0 0;">${new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}</p>
            </div>
          </div>

          <div class="grid">
            <div class="info-box">
              <div class="section-title">${order.orderType === "sell" ? "Customer Details" : "Supplier Details"}</div>
              <p><span class="info-label">Name:</span> <strong style="color: #0f172a;">${order.contact?.name || "N/A"}</strong></p>
              ${order.contact?.email ? `<p><span class="info-label">Email:</span> ${order.contact.email}</p>` : ""}
              ${order.contact?.mobileNo ? `<p><span class="info-label">Mobile:</span> ${order.contact.mobileNo}</p>` : ""}
            </div>
            <div class="info-box">
              <div class="section-title">Delivery Details</div>
              <p style="white-space: pre-wrap; font-size: 13px; line-height: 1.5;">${order.deliveryAddress || "N/A"}</p>
            </div>
          </div>

          <table style="width: 100%; text-align: left;">
            <thead>
              <tr>
                <th style="width: 45%;">Product Description</th>
                <th style="width: 20%;">SKU</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 12%; text-align: right;">Unit Price</th>
                <th style="width: 13%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>GST & Charges:</span>
              <span>₹${order.gstAndCharges.toFixed(2)}</span>
            </div>
            ${
              discountAmount > 0
                ? `
            <div class="totals-row" style="color: #dc2626;">
              <span>Discount (${order.discountType === "percentage" ? `${order.discountValue}%` : "₹"}):</span>
              <span>-₹${discountAmount.toFixed(2)}</span>
            </div>
            `
                : ""
            }
            <div class="totals-row final">
              <span>Total Amount:</span>
              <span>₹${order.finalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer-note">
            Thank you for your business!
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 100);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
