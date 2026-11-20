import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection
      staleTime: 1000 * 60 * 5, // 5 minutes before background refetch
      retry: 2,
      networkMode: 'offlineFirst',
    },
  },
});

export const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'EAGLE_TN_QUERY_CACHE',
});
