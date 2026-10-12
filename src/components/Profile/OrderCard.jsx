import { Button, Card } from '@mui/material';
import React from 'react';
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import logo from "../../assets/logo2.jpg";

const OrderCard = ({ order, status }) => {

  const getStatusColor = () => {
    switch (status) {
      case 'COMPLETADO':
        return 'success';
      case 'PENDIENTE':
        return 'warning';
      case 'ENTREGADO':
        return 'info';
      default:
        return 'primary';
    }
  };

const exportPDF = () => {
  const doc = new jsPDF();
                        // Take the name of the first item in the order                       
  const restaurantName = order.items[0]?.food?.restaurant?.name || "Restaurante desconocido"; // Default value
  const delivery = order.deliveryAddress || {}; 
  const img = new Image();
  img.src = logo;
  img.onload = function () {

    // Logo and title
    doc.addImage(img, "JPEG", 10, 10, 50, 15);
    doc.setFontSize(18);
    doc.text(`Factura - ${restaurantName}`, 70, 20);

    // Date
    const fecha = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 70, 28);

    // Delivery address
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Dirección de Entrega:", 10, 38);
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(`Nombre: ${delivery.fullName || "Desconocido"}`, 10, 44);
    doc.text(`Calle: ${delivery.streetAddress || "Desconocido"}`, 10, 50);
    doc.text(`Ciudad: ${delivery.city || "Desconocido"}`, 10, 56);
    doc.text(`Provincia: ${delivery.state || "Desconocido"}`, 10, 62);
    doc.text(`Código Postal: ${delivery.postalCode || "Desconocido"}`, 10, 68);

    // Table headers
    const startY = 78;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold"); 
    doc.text("Platillo", 10, startY);
    doc.text("Precio Unitario", 80, startY);
    doc.text("Cantidad", 130, startY);
    doc.text("Total", 170, startY);
      doc.setFont(undefined, "normal");
    doc.line(10, startY + 2, 200, startY + 2);

    // Table body
    let rowY = startY + 12;
    let subtotal = 0;
    order.items.forEach((item) => {
      const totalItem = item.totalPrice || item.food.price * item.quantity;
      subtotal += totalItem;
      doc.text(item.food.name, 10, rowY);
      doc.text(`${item.food.price.toFixed(2)}`, 80, rowY);
      doc.text(`${item.quantity}`, 130, rowY);
      doc.text(`${totalItem.toFixed(2)}`, 170, rowY);
      rowY += 8;
    });

    doc.line(10, rowY, 200, rowY);

    // Totals and additional charges
    const iva = subtotal * 0.13;
    const expressFee = 500;
    const platformFee = 200;
    const totalPayable = subtotal + iva + expressFee + platformFee;

    // Column positions
const leftColX = 10;   
const rightColX = 185;  

doc.setFontSize(12);
rowY += 10;

// Subtotal
doc.text("Subtotal:", leftColX, rowY, { align: "left" });
doc.text(subtotal.toFixed(2), rightColX, rowY, { align: "right" });
rowY += 6;

// IVA
doc.text("IVA (13%):", leftColX, rowY, { align: "left" });
doc.text(iva.toFixed(2), rightColX, rowY, { align: "right" });
rowY += 6;

// Express
doc.text("Express:", leftColX, rowY, { align: "left" });
doc.text(expressFee.toFixed(2), rightColX, rowY, { align: "right" });
rowY += 6;

// Platform
doc.text("Tasa de plataforma:", leftColX, rowY, { align: "left" });
doc.text(platformFee.toFixed(2), rightColX, rowY, { align: "right" });
rowY += 6;

// Dividing line
doc.setDrawColor(0);
doc.line(leftColX, rowY, rightColX, rowY);
rowY += 8;

doc.setFontSize(14);
doc.setFont(undefined, "bold");
doc.text("Total a Pagar:", leftColX, rowY, { align: "left" });
doc.text(totalPayable.toFixed(2), rightColX, rowY, { align: "right" });
doc.setFont(undefined, "normal");

//final message
doc.setFontSize(10);
doc.text(`Gracias por tu compra en ${restaurantName} !`, 10, rowY + 20);

    // Save PDF
    doc.save(`Factura_${restaurantName}.pdf`);
  };
};


  const exportExcel = () => {
  const data = [
    ["Platillo", "Precio Unitario", "Cantidad", "Total"]
  ];

  order.items.forEach(item => {
    const totalItem = item.totalPrice || item.food.price * item.quantity;
    data.push([
      item.food.name,
      item.food.price.toFixed(2),
      item.quantity,
      totalItem.toFixed(2)
    ]);
  });

 // Add grand total
  data.push(["", "", "Total a Pagar", order.totalAmount.toFixed(2)]);

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  worksheet["!cols"] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Factura");

  const restaurantName = order.items[0]?.food?.restaurant?.name || "Restaurante";

  XLSX.writeFile(workbook, `Factura_${restaurantName}.xlsx`);
};

  return (
    <Card className='flex flex-col p-5 space-y-4'>
      <div className='flex items-center space-x-8'>
        <img className='h-16 w-16' src={order.items[0].food.images[0]} alt="" />
        <div>
          {order.items.map((item) => (
            <div key={item.id} className='mb-1'>
              <p className="font-medium">{item.quantity} {item.food.name}</p>
            </div>
          ))}
          <p className="font-bold text-white mt-2">Total Pagado: ₡{order.totalAmount?.toFixed(2)}</p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          className="cursor-not-allowed"
          variant="contained"
          color={getStatusColor()}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          {status}
        </Button>
        <Button variant="outlined" color="primary" onClick={exportPDF}>Descargar PDF</Button>
        {/* <Button variant="outlined" color="success" onClick={exportExcel}>Excel</Button> */}
      </div>
    </Card>
  );
};

export default OrderCard;
