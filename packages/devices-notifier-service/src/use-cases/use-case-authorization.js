import { UseCaseAuthorization } from 'core';
import { GettingUserById } from 'postgresql-adapters';
import { postgresPool } from '../postgres-pool';

export const useCaseAuthorization = new UseCaseAuthorization(
  new GettingUserById(postgresPool),
  process.env.SECRET_KEY
)