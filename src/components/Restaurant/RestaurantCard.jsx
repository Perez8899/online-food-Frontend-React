import { Card, Chip, IconButton } from '@mui/material'
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { addToFavorites } from '../State/Authentication/Action';
import { isPresentInFavorites } from '../Config/Logic';


const RestaurantCard = ({data}) => {

const navigate = useNavigate(); //react-router-dom
const dispatch = useDispatch();
const jwt = localStorage.getItem("jwt")
const { auth }= useSelector((store)=>store);

const handleAddToFavorites =()=>{
    dispatch(addToFavorites({restaurantId:data.id, jwt:auth.jwt||jwt}));
}

const navigateToRestaurant = () => {
    if(data.open)
    navigate(`/restaurant/${data.address.city}/${data.name}/${data.id}`);
  };                      

  return (
    <Card className='m-2 w-[300px] h-[380px]'>
        <div onClick={navigateToRestaurant} className={`${data.open? 'cursor-pointer': "cursor-not-allowed"} relative`}>
            <img className='w-full h-[10rem] rounded-t-md object-cover'
                 src={data.images[0]} 
                 alt=''/>

     {/* STATUS */}
            <Chip size='small'
                  className='absolute top-2 left-2'
                  color={data.open?'success':'error'}
                  label={data.open?'Open':'close'}
            />
      
        </div>  
        <div className='p-4 flex-grow flex flex-col'>
            <div className='space-y-1'>
                <p className='font-semibold text-lg'>{data.name}</p>{/* restaurant name */}
                <p className="text-gray-500 text-sm">
                       {data.description.length > 40
                        ? data.description.substring(0, 40) + "..."
                        : data.description} 
                </p>
            </div>
           <div className='mt-auto self-end'>
            <IconButton onClick={handleAddToFavorites}>
              {isPresentInFavorites(auth.favorities, data) 
                ? <FavoriteIcon color='primary'/> 
                : <FavoriteBorderIcon/>}
            </IconButton>
          </div>
        </div> 
    </Card>
  )
}

export default RestaurantCard
