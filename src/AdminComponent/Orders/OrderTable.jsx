import { Avatar, AvatarGroup, Box, Button, Card, CardHeader, Chip, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateOrderStatus } from "../../components/State/RestaurantOrder/restaurants.order.action"


const orderStatus = [
  { label: "Pendiente", value: "PENDIENTE" },
  { label: "Completado", value: "COMPLETADO" },
  // { label: "Out For Delivery", value: "EN CAMINO" },
  { label: "Entregado", value: "ENTREGADO" },
];

const OrderTable = ({ isDashboard, name }) => {
  const [anchorElMap, setAnchorElMap] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ status: "", sort: "" });
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurantsOrder } = useSelector((store) => store);
  const [anchorElArray, setAnchorElArray] = useState([]);
  const { id } = useParams();


  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateOrder = (orderId, orderStatus, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(updateOrderStatus({ orderId, orderStatus, jwt }));
  };

  // console.log("restaurants orders store ", restaurantsOrder)


  return (
    // OrderTable header
    <Box>
      <Card className='mt-1'>
        <CardHeader title={"Todas las Ordenes"}
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }} />
        {/* OrderTable body */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell> Id</TableCell>
                <TableCell align="">Imagen</TableCell>
                <TableCell align="">Cliente</TableCell>
                <TableCell align="">Precio</TableCell>
                <TableCell align="">Nombre</TableCell>
                <TableCell align="">Ingredientes</TableCell>
                <TableCell align="">Estado</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Actualizar</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {restaurantsOrder.orders.map((item, index) => (
                <TableRow
                  className="cursor-pointer"
                  key={item.name}
                  sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
                >

                  <TableCell component={"th"} scope='row'>{item.id}</TableCell>

                  <TableCell sx={{}}>
                    <AvatarGroup max={4} sx={{ justifyContent: "start" }}>
                      {item.items.map((orderItem) => (
                        <Avatar
                          alt={orderItem.food.name}
                          src={orderItem.food?.images[0]}
                        />
                      ))}
                    </AvatarGroup>{" "}
                  </TableCell>
                  {/* {item.customer?.email} */}
                  <TableCell sx={{}}>{item.customer?.fullName} </TableCell>

                  <TableCell> ₡ {item?.totalAmount}</TableCell>

                  <TableCell className="">
                    {item.items.map((orderItem) => (
                      <p>
                        {orderItem.food?.name}
                      </p>
                    ))}
                  </TableCell>

                  <TableCell className="space-y-2">
                    {item.items.map((orderItem) =>
                      <div className="flex gap-1 flex-wrap">
                        {orderItem.ingredients?.map((ingre) => (
                          <Chip label={ingre} />
                        ))}
                      </div>

                    )}
                  </TableCell>
                  {/* -------------------------------------------------------------------------------                  */}
                  {!isDashboard && <TableCell className="text-white">
                    <Chip
                      sx={{
                        color: "white !important",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                      label={item?.orderStatus}
                      size="small"
                      color={
                        item?.orderStatus === "PENDIENTE"
                          ? "error"
                          : item?.orderStatus === "ENTREGADO"
                            ? "success"
                            : item?.orderStatus === "COMPLETADO"
                              ? "info"
                              : "secondary"
                      }
                      className="text-white"
                    />
                  </TableCell>}

                  <TableCell
                    sx={{ textAlign: "center" }}
                    className="text-white"
                  >
                    <div>
                      <Button
                        id={`basic-button-${item?.id}`}
                        aria-controls={`basic-menu-${item.id}`}
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorElArray[index])}
                        onClick={(event) =>
                          handleUpdateStatusMenuClick(event, index)
                        }
                      >
                        Estado
                      </Button>
                      <Menu
                        id={`basic-menu-${item?.id}`}
                        anchorEl={anchorElArray[index]}
                        open={Boolean(anchorElArray[index])}
                        onClose={() => handleUpdateStatusMenuClose(index)}
                        MenuListProps={{
                          "aria-labelledby": `basic-button-${item.id}`,
                        }}
                      >
                        {orderStatus.map((s) => (
                          <MenuItem
                            key={s.value}
                            onClick={() =>

                              handleUpdateOrder(item.id, s.value, index)
                            }
                          >
                            {s.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default OrderTable
