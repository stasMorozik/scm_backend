import { UseCasePlaylistGetting } from 'core';
import { GettingPlaylistByDeviceId } from 'postgresql-adapters';
import { postgresPool } from '../postgres-pool';
import { useCaseAuthorization } from './use-case-authorization';

export const useCaseGettingPlaylist = new UseCasePlaylistGetting(
  useCaseAuthorization,
  new GettingPlaylistByDeviceId(postgresPool)
)