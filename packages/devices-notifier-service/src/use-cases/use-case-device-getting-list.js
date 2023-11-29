import { UseCaseDeviceGettingList } from 'core';
import { GettingDeviceListByPlaylistId } from 'postgresql-adapters';
import { postgresPool } from '../postgres-pool';
import { useCaseAuthorization } from './use-case-authorization';

export const useCaseDeviceGettingList = new UseCaseDeviceGettingList(
  useCaseAuthorization,
  new GettingDeviceListByPlaylistId(postgresPool)
)