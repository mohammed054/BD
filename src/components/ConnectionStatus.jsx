import { useConnectionStatus } from '../utils/api';

export default function ConnectionStatus() {
  const { isConnected, lastChecked } = useConnectionStatus();

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="status-dot"></span>
      <span className="status-text">
        {isConnected ? '☁️ Cloud Sync Active' : '⚠️ Cloud Sync Offline'}
      </span>
      {lastChecked && (
        <span className="last-checked">
          Updated {new Date(lastChecked).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
