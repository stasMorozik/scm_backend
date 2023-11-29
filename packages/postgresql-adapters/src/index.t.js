import pg from 'pg';

export { GettingByEmail as GettingUserByEmail } from './user/getting-by-email';
export { GettingById as GettingUserById } from './user/getting-by-id';

export { 
  GettingByDeviceId as GettingPlaylistByDeviceId 
} from './playlist/getting/getting-by-device-id';
export { GettingById as GettingPlaylistById } from './playlist/getting/getting-by-id';
export { GettingList as GettingPlaylistList } from './playlist/getting/getting-list';
export { Inserting as InsertingPlaylist } from './playlist/transform/inserting';
export { Updating as UpdatingPlaylist } from './playlist/transform/updating';

export { GettingById as GettingDeviceById } from './device/getting/getting-by-id';
export { GettingList as GettingDeviceList } from './device/getting/getting-list';
export { Inserting as InsertingDevice } from './device/transform/inserting';
export { Updating as UpdatingDevice } from './device/transform/updating';

export { 
  Inserting as InsertingConfirmationCode
} from './confirmation-code/inserting';
export { 
  Updating as UpdatingConfirmationCode 
} from './confirmation-code/updating';
export { 
  Getting as GettingConfirmationCode 
} from './confirmation-code/getting';

export const pgPool = new pg.Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.PASSWORD,
  port: parseInt(process.env.PORT),
})
