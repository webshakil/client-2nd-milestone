import React from 'react';

const DeviceTab = ({ deviceInfo }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Platform</div>
              <div className="font-medium">{deviceInfo.platform}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Language</div>
              <div className="font-medium">{deviceInfo.language}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Timezone</div>
              <div className="font-medium">{deviceInfo.timezone}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Screen Resolution</div>
              <div className="font-medium">{deviceInfo.screen.width}x{deviceInfo.screen.height}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Color Depth</div>
              <div className="font-medium">{deviceInfo.screen.colorDepth}-bit</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Pixel Ratio</div>
              <div className="font-medium">{deviceInfo.screen.pixelRatio}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">CPU Cores</div>
              <div className="font-medium">{deviceInfo.hardwareConcurrency}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Memory</div>
              <div className="font-medium">{deviceInfo.memory} GB</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Browser Capabilities</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${deviceInfo.cookieEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Cookies: {deviceInfo.cookieEnabled ? 'Enabled' : 'Disabled'}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${deviceInfo.javaEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Java: {deviceInfo.javaEnabled ? 'Enabled' : 'Disabled'}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${deviceInfo.onLine ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Online: {deviceInfo.onLine ? 'Yes' : 'No'}
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${!deviceInfo.webdriver ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              Automation: {deviceInfo.webdriver ? 'Detected' : 'None'}
            </div>
          </div>
        </div>

        {deviceInfo.connection && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Network Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>Connection Type: {deviceInfo.connection.type}</div>
              <div>Effective Type: {deviceInfo.connection.effectiveType}</div>
              <div>Downlink: {deviceInfo.connection.downlink} Mbps</div>
              <div>RTT: {deviceInfo.connection.rtt} ms</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceTab;