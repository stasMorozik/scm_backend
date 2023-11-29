import { UseCaseDeviceUpdating } from 'core';
import { GettingPlaylistById } from 'postgresql-adapters';
import { GettingDeviceById } from 'postgresql-adapters';
import { UpdatingDevice } from 'postgresql-adapters';
import { postgresPool } from '../postgres-pool';
import { useCaseAuthorization } from './use-case-authorization';

export const useCaseUpdatingDevice = new UseCaseDeviceUpdating(
  useCaseAuthorization,
  new GettingDeviceById(postgresPool),
  new GettingPlaylistById(postgresPool),
  new UpdatingDevice(postgresPool)
)