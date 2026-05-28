import { useMemo } from 'react';

import { createApiClient } from '@/src/lib/api-client';
import { useAuth } from '@/src/providers/auth-provider';

export function useApi() {
  const { accessToken } = useAuth();

  return useMemo(() => createApiClient({ token: accessToken }), [accessToken]);
}
