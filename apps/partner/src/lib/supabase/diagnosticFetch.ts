export type TransportFailure =
  | 'MIXED_CONTENT'          
  | 'TIMEOUT'
  | 'ABORTED'                
  | 'CORS_OR_GATEWAY_NO_CORS'
  | 'UNREACHABLE'            
  | 'UNKNOWN';

export interface TransportErrorReport {
  kind: TransportFailure;
  method: string;
  url: string;
  origin: string;
  pageOrigin: string;
  elapsedMs: number;
  online: boolean;
  originProbe: 'REACHABLE' | 'UNREACHABLE' | 'SKIPPED';
  swControlled: boolean;
  hint: string;
  causeName: string;
  causeMessage: string;
}

export interface DiagnosticFetchOptions {
  timeoutMs?: number;
  retries?: number;
  onError?: (report: TransportErrorReport) => void;
}

const HINTS: Record<TransportFailure, string> = {
  MIXED_CONTENT: 'Page is HTTPS but API URL is HTTP. Use an https:// Supabase URL.',
  TIMEOUT: 'No response within the timeout. Check project status (paused?) and gateway latency.',
  ABORTED: 'Request aborted by caller.',
  CORS_OR_GATEWAY_NO_CORS:
    'Origin is reachable (no-cors probe succeeded) but the CORS-mode request failed. ' +
    'Likely a gateway error (5xx/4xx) without CORS headers or a rejected preflight.',
  UNREACHABLE:
    'Origin unreachable even in no-cors mode: DNS failure/blocking, TLS error, paused project, or SW blocker.',
  UNKNOWN: 'Unclassified transport failure.',
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function probeOrigin(origin: string): Promise<'REACHABLE' | 'UNREACHABLE'> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 5000);
  try {
    await fetch(`${origin}/auth/v1/health`, {
      mode: 'no-cors', cache: 'no-store', credentials: 'omit', signal: ctrl.signal,
    });
    return 'REACHABLE';
  } catch {
    return 'UNREACHABLE';
  } finally {
    clearTimeout(t);
  }
}

export function createDiagnosticFetch(opts: DiagnosticFetchOptions = {}): typeof fetch {
  const { timeoutMs = 20_000, retries = 1, onError } = opts;

  return async (input, init) => {
    const req = new Request(input, init);
    const url = new URL(req.url);
    const method = req.method.toUpperCase();
    const idempotent = method === 'GET' || method === 'HEAD';
    const maxAttempts = idempotent ? retries + 1 : 1;

    let lastErr: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const started = performance.now();
      const timeoutCtrl = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => { timedOut = true; timeoutCtrl.abort(); }, timeoutMs);

      const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
      const onCallerAbort = () => timeoutCtrl.abort();
      callerSignal?.addEventListener('abort', onCallerAbort, { once: true });

      try {
        return await fetch(req.clone(), { signal: timeoutCtrl.signal });
      } catch (err) {
        lastErr = err;
        const callerAborted = callerSignal?.aborted === true;
        const retriable = !callerAborted && !timedOut && attempt < maxAttempts;
        if (retriable) { await sleep(300 * 2 ** (attempt - 1)); continue; }

        const elapsedMs = Math.round(performance.now() - started);
        const e = err as Error;

        let kind: TransportFailure = 'UNKNOWN';
        let originProbe: TransportErrorReport['originProbe'] = 'SKIPPED';

        if (callerAborted) kind = 'ABORTED';
        else if (timedOut) kind = 'TIMEOUT';
        else if (location.protocol === 'https:' && url.protocol === 'http:') kind = 'MIXED_CONTENT';
        else {
          originProbe = await probeOrigin(url.origin);
          kind = originProbe === 'REACHABLE' ? 'CORS_OR_GATEWAY_NO_CORS' : 'UNREACHABLE';
        }

        const report: TransportErrorReport = {
          kind, method, url: req.url, origin: url.origin, pageOrigin: location.origin,
          elapsedMs, online: navigator.onLine, originProbe,
          swControlled: !!navigator.serviceWorker?.controller,
          hint: HINTS[kind], causeName: e?.name ?? 'Error', causeMessage: e?.message ?? String(err),
        };

        try { onError?.(report); } catch {}
        if (import.meta.env.DEV) console.error('[supabase:transport]', report);

        const customError = new Error(
          `[${kind}] ${method} ${url.origin}${url.pathname} after ${elapsedMs}ms ` +
          `(probe=${originProbe}, sw=${report.swControlled}). ${report.hint}`
        );
        (customError as any).cause = err;
        throw customError;
      } finally {
        clearTimeout(timer);
        callerSignal?.removeEventListener('abort', onCallerAbort);
      }
    }
    throw lastErr;
  };
}
