import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; //Import autoTable explicitly.
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const Reportes = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { restaurant } = useSelector((store) => store); // 🔹 CAMBIO


  const fetchReport = async () => {
    if (!restaurant?.usersRestaurant?.id || !startDate || !endDate) return;

    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.get(
        `http://localhost:8080/api/admin/restaurant/${restaurant.usersRestaurant.id}/report`,
        {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
    setLoading(false);
  };


  //useEffect to dynamically update when dates change
  useEffect(() => {
    fetchReport(true);
  }, [startDate, endDate]);

  // Grand total
  const totalGeneral = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

  // Export to Excel
  const exportExcel = () => {
    const data = orders.map((order) => ({
      ID: order.id,
      Cliente: `${order.customer?.fullName}`,
      Total: order.totalAmount,
      Fecha: new Date(order.createdAt).toLocaleDateString("es-ES"),
    }));

    data.push({
      ID: "",
      Cliente: "TOTAL GENERAL",
      Total: orders
        .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0)
        .toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      Fecha: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ReporteVentas");

    const now = new Date();
    const fechaHora = `${now.toISOString().split("T")[0]}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

    XLSX.writeFile(workbook, `ReporteVentas_${fechaHora}.xlsx`);

  };

  // Export to PDF
  const exportPDF = () => {
    const totalGeneral = orders
      .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0)
      .toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 14, 20);

    const tableData = orders.map((order) => [
      order.id,
      `${order.customer?.fullName}`,
      `${parseFloat(order.totalAmount).toFixed(2)}`,
      new Date(order.createdAt).toLocaleDateString("es-ES"),
    ]);

    autoTable(doc, {
      head: [["ID", "Cliente", "Total", "Fecha"]],
      body: tableData,
      startY: 30,
      headStyles: {
        fillColor: [100, 159, 51], textColor: 255, fontStyle: 'bold',
      },
      foot: [
        [
          {
            content: "TOTAL GENERAL",
            colSpan: 2,
            styles: { halign: "right", fontStyle: "bold", fillColor: [100, 159, 51], textColor: 255 }
          },
          {
            content: `CRC ${totalGeneral}`,
            styles: { fontStyle: "bold", fillColor: [100, 159, 51], textColor: 255 }
          },
          {
            content: "",
            styles: { fillColor: [100, 159, 51] }
          }
        ]
      ],

    });

    const now = new Date();
    const fechaHora = `${now.toISOString().split("T")[0]}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
    doc.save(`ReporteVentas_${fechaHora}.pdf`);

  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography
          variant="h5"
          component="h2"
          className="mb-6 text-center font-bold"
        >
          Reporte de Ventas
        </Typography>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center pt-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Desde"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Hasta"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
              minDate={startDate}
            />
          </LocalizationProvider>

          {/* <Button
            variant="contained"
            onClick={fetchReport}
            className="bg-blue-600 hover:bg-blue-700 h-14 px-6"
            disabled={!startDate || !endDate}
          >
            Generar Reporte
          </Button> */}
        </div>

        {/* Export buttons */}
        {orders.length > 0 && (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            className="mb-4"
          >
            <Button variant="outlined" color="success" onClick={exportExcel}>
              Exportar Excel
            </Button>
            <Button variant="outlined" color="error" onClick={exportPDF}>
              Exportar PDF
            </Button>
          </Stack>
        )}

        {/* Results table */}
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <Typography
              variant="body1"
              className="text-center text-gray-500 py-8"
            >
              No hay órdenes en este rango de fechas.
            </Typography>
          ) : (
            <>
              <Table className="min-w-full">
                <TableHead className="bg-[#649f33]">
                  <TableRow>
                    <TableCell className="font-bold">Orden_ID</TableCell>
                    <TableCell className="font-bold">Cliente</TableCell>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer?.fullName}</TableCell>
                      <TableCell className="font-medium">
                        ₡ {parseFloat(order.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Dynamic grand total */}
              <Typography
                variant="h6"
                className="text-right mt-4 font-bold"
              >
                Total General: ₡ {orders
                  // reduce traverses array elements
                  .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0)
                  .toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </>
          )}
        </div>

      </Paper>
    </Container>
  );
};

export default Reportes;
