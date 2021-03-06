// deno-lint-ignore-file

import { Router } from 'https://deno.land/x/oak@v8.0.0/mod.ts'
import { MESSAGE_UNAUTHORIZED } from "../const.ts";

import Like from  '../model/like.model.ts'

import {
    register_like_in_elo,
    find_like_in_elo
} from '../service/like.service.ts'
import { Payload } from "../types.ts";
import { verifyToken } from "../utils/token.ts";


const routes = new Router()

routes.post('/like',async ({request,response})=>{
   try {
    const payload = await verifyToken(
        request.headers.get('authorization') as string
    ) as unknown as Payload
    
    const likeData = await request.body().value as Like

    if(payload.data.id != likeData.id_user) throw new Error(MESSAGE_UNAUTHORIZED);

    const  {error,message,status} = await register_like_in_elo(likeData)

    response.status = status
    response.body = {
        error,
        message
    }
   } catch (error) {
    response.status = 401
    response.body = {error: true,message: error.message}
   }
})

routes.get('/like',async ({request,response})=>{
    try {
     await verifyToken(
         request.headers.get('authorization') as string
     ) as unknown as Payload
     
     const id_user = request.url.searchParams.get("id_user") 
     const id_elo = request.url.searchParams.get("id_elo") 

  
     const  {error,message,status,likes} = await find_like_in_elo({
        id_elo: Number(id_elo),
        id_user: Number(id_user)
    })
 
     response.status = status
     response.body = {
         error,
         message,
         likes
     }
    } catch (error) {
     response.status = 401
     response.body = {error: true,message: error.message,likes: []}
    }
 })



export default routes