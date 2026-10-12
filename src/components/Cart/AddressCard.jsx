import { Button, Card } from '@mui/material'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';


const AddressCard = ({item,showButton, handleSelectAddress}) => {
    
    return (
/**existing address */
        <Card className='flex space-x-5 w-64 p-5'>
            <LocationOnIcon />

            <div className="space-y-3 text-gray-500">
                <h1 className="font-semibold text-lg text-white">Direccion</h1>
                <p>
                    {/* Santa rita, rio cuarto, calle 771 */}
                    {item.streetAddress}, {item.postalCode}, {item.state}, {item.country}
                    
                </p>

                {showButton && (
                    <Button
                   fullWidth onClick={() => handleSelectAddress(item)}
                    variant="outlined" //contained
                    className="w-full"
              >
                    SELECCIONA
                </Button>)}
            </div>
        </Card>
    )
}

export default AddressCard
