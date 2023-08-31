import { regCustomPanel } from '@capital/common';
import { Webview } from '@capital/component';
import { useIconIsShow } from '../../../../../server/plugins/com.msgbyte.livekit/web/plugins/com.msgbyte.livekit/src/navbar/useIconIsShow';
import React from 'react';

const PLUGIN_ID = 'cn.e-u.aiapplication';
const PLUGIN_NAME = 'AI应用';

console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_ID}) is loaded`);
console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_ID}) is loaded`);
regCustomPanel({
  position: 'personal',
  icon: 'aiapplication:conver',
  name: `${PLUGIN_ID}/groupdetail`,
  label: `${PLUGIN_NAME}`,
  render: () => (
    <Webview
      className="w-full h-full bg-white"
      url="http://192.168.200.87:8084/index.html#/app/list"
    />
  ),
  useIsShow: useIconIsShow,
});
