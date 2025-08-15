import { Button, Card } from '@mui/material';
import React from 'react';
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import logo from "../../assets/logo2.jpg"; // Tu logo real

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

    const restaurantName =
    order.restaurant?.name || // Si viene como objeto
    order.food?.restaurant?.name || // Si está dentro del platillo
    "Restaurante desconocido"; // Valor por defecto

    // Convertir logo importado a Base64 y luego añadirlo
    const img = new Image();
    img.src = logo;
    img.onload = function () {
      // Logo
      doc.addImage(img, "JPEG", 10, 10, 50, 15);

      // Título
      doc.setFontSize(18);
      doc.text(`Factura - ${restaurantName}`, 70, 20);

      // Fecha
      const fecha = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Fecha: ${fecha}`, 70, 28);

      // Encabezados tabla
      const startY = 40;
      doc.setFontSize(12);
      doc.text("Platillo", 10, startY);
      doc.text("Precio Unitario", 80, startY);
      doc.text("Cantidad", 130, startY);
      doc.text("Total", 170, startY);

      // Línea debajo encabezados
      doc.line(10, startY + 2, 200, startY + 2);

      // Datos de la orden
      const platillo = order.food.name;
      const precio = order.food.price;
      const cantidad = order.quantity;
      const total = precio * cantidad;

      const rowY = startY + 12;
      doc.text(platillo, 10, rowY);
      doc.text(`${precio.toFixed(2)}`, 80, rowY);
      doc.text(`${cantidad}`, 130, rowY);
      doc.text(`${total.toFixed(2)}`, 170, rowY);

      // Línea debajo de la fila
      doc.line(10, rowY + 2, 200, rowY + 2);

      // Total general
      doc.setFontSize(14);
      doc.text(`Total a Pagar:  ${total.toFixed(2)}`, 10, rowY + 20);

      // Mensaje final
      doc.setFontSize(10);
      doc.text(`Gracias por tu compra en- ${restaurantName}`, 10, rowY + 30);

      // Guardar PDF
      doc.save(`Factura_${platillo}.pdf`);
    };
  };

  const exportExcel = () => {
  const total = order.food.price * order.quantity;

  // Datos en formato tabla
  const data = [
    ["Concepto", "Detalle"],          // Cabecera
    ["Platillo", order.food.name],
    ["Precio Unitario", order.food.price.toFixed(2)],
    ["Cantidad", order.quantity],
    ["Total", total.toFixed(2)],
  ];

  // Crear hoja
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Opcional: ancho de columnas
  worksheet["!cols"] = [
    { wch: 20 }, // Concepto
    { wch: 30 }, // Detalle
  ];

  // Opcional: negrita en la cabecera
  const headerStyle = { font: { bold: true } };
  ["A1", "B1"].forEach((cell) => {
    if (worksheet[cell]) worksheet[cell].s = headerStyle;
  });

  // Crear libro y añadir hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Factura");

  // Guardar archivo
  XLSX.writeFile(workbook, `Factura_${order.food.name}.xlsx`);
};


  return (
    <Card className='flex justify-between items-center p-5'>
      <div className='flex items-center space-x-8'>
        <img className='h-16 w-16' src={order.food.images[0]} alt="" />
        <div className='ml-4'>
          <p className="font-medium">{order.food.name}</p>
          <p className="text-white">₡{order.food.price}</p>
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
        <Button variant="outlined" color="primary" onClick={exportPDF}>
          PDF
        </Button>
        {/* <Button variant="outlined" color="success" onClick={exportExcel}>
          Excel
        </Button> */}
      </div>
    </Card>
  );
};

export default OrderCard;
