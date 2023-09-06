import { regCustomPanel } from '@capital/common';
import { Webview } from '@capital/component';
import { useIconIsShow } from '../../../../../server/plugins/com.msgbyte.livekit/web/plugins/com.msgbyte.livekit/src/navbar/useIconIsShow';
import React from 'react';

const PLUGIN_ID = 'cn.e-u.aidialog';
const PLUGIN_NAME = 'AI对话';

console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_ID}) is loaded`);
regCustomPanel({
  position: 'personal',
  icon: 'aidialog:conver',
  name: `${PLUGIN_ID}/groupdetail`,
  label: `${PLUGIN_NAME}`,
  render: () => (
    <Webview
      className="w-full h-full bg-white"
      url="http://talks.hjqtxy.net:8001/chat/gyeZJ6KrO2hmCofv"
    />
  ),
  useIsShow: useIconIsShow,
});
