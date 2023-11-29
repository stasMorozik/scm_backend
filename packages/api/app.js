import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';

import { 
  handlerCreating as handlerCreatingConfirmationCode 
} from './src/confirmation-code/handler-creating';
import { 
  handlerConfirming as handlerConfirmingConfirmationCode 
} from './src/confirmation-code/handler-confirming';

import { 
  handlerAuthentication 
} from './src/user/handler-authentication';
import { 
  handlerAuthorization 
} from './src/user/handler-authorization';
import { 
  handlerRefreshToken 
} from './src/user/handler-refresh-token';
import {
  handlerCreatingToken
} from './src/user/handler-creating-token';

import { 
  handlerCreating as  handlerCreatingPlaylist
} from './src/playlist/handler-creating';
import { 
  handlerUpdating as handlerUpdatingPlaylist 
} from './src/playlist/handler-updating';
import { 
  handlerGetting as handlerGettingPlaylist
} from './src/playlist/handler-getting';
import{ 
  handlerGettingByDeviceId as handlerGettingPlaylistByDeviceId
} from './src/playlist/handler-getting-by-device-id';
import { 
  handlerGettingList as handlerGettingListPlaylist
} from './src/playlist/handler-getting-list';

import { 
  handlerCreating as handlerCreatingDevice
} from './src/device/handler-creating';
import { 
  handlerUpdating as handlerUpdatingDevice
} from './src/device/handler-updating';
import {
  handlerGetting as handlerGettingDevice
} from './src/device/handler-getting';
import { 
  handlerGettingList as handlerGettingListDevice
} from './src/device/handler-getting-list';

const fastify = Fastify({
  logger: parseInt(process.env.PRODUCTION) ? true : false
})

/* *** */
// Домен кода подтверждения
/* *** */

fastify.post("/confirmation-code/email", handlerCreatingConfirmationCode)

fastify.put("/confirmation-code/email", handlerConfirmingConfirmationCode)

/* *** */
//Домен пользователя
/* *** */

fastify.post("/user/authentication", handlerAuthentication)

fastify.get("/user/authorization", handlerAuthorization)

fastify.post("/user/token", handlerCreatingToken)

fastify.put("/user/token", handlerRefreshToken)

/* *** */
//Домен плэйлиста
/* *** */

fastify.post("/playlists", handlerCreatingPlaylist)

fastify.post('/playlists/:id', handlerUpdatingPlaylist)

fastify.get('/playlists', handlerGettingListPlaylist)

fastify.get('/playlists/:id', handlerGettingPlaylist)

fastify.get('/playlists/by-device-id/:id', handlerGettingPlaylistByDeviceId)

/* *** */
//Домен устройства
/* *** */

fastify.post('/devices', handlerCreatingDevice)

fastify.post('/devices/:id', handlerUpdatingDevice)

fastify.get('/devices', handlerGettingListDevice)

fastify.get('/devices/:id', handlerGettingDevice)

fastify.register(cookie, {
  hook: "onRequest",
  parseOptions: {} 
})

fastify.register(multipart)

try {
  await fastify.listen({ port: process.env.PORT })
  console.log(`listen ${process.env.PORT}`)
} catch (e) {
  console.log(e)
  process.exit(1)
}