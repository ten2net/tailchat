import { sharedEvent, regPluginColorScheme } from '@capital/common';

regPluginColorScheme({
  label: '海军～蓝',
  name: 'light+navy-blue',
});

// TODO: 配置为默认主题

sharedEvent.on('loadColorScheme', (colorSchemeName) => {
  console.log('切换到主题：', colorSchemeName);
  if (colorSchemeName === 'light+navy-blue') {
    console.log('正在加载海军蓝主题...');
    import('./blue/theme.less');
  }
});
