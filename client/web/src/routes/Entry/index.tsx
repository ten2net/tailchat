import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginView } from './LoginView';
import clsx from 'clsx';
import styles from './index.module.less';
import { RegisterView } from './RegisterView';
import { useRecordMeasure } from '@/utils/measure-helper';
import { GuestView } from './GuestView';
import { ForgetPasswordView } from './ForgetPasswordView';
import { useGlobalConfigStore } from 'tailchat-shared';
import { pluginLoginAction } from '@/plugin/common';
const EntryRoute = React.memo(() => {
  useRecordMeasure('appEntryRenderStart');
  const { disableOwnerLogin } = useGlobalConfigStore((state) => ({
    disableOwnerLogin: state.disableOwnerLogin,
  }));
  return (
    <div className={clsx(styles.loginBg, 'h-full flex flex-row')}>
      <div className={clsx(styles.cont_box)}>
        <div className={clsx(styles.cont_box_left)}></div>
        <div
          className={clsx(
            styles.cont_box_right,
            styles.login_cont,
            // disableOwnerLogin: 是否禁用自主登录
            // pluginLoginAction: 第三方登录插件集合
            !disableOwnerLogin
              ? pluginLoginAction.length == 0
                ? // 仅使用自主登录
                  styles.layout_owner
                : // 使用自主登录和cas登录
                  styles.layout_all
              : // 仅使用第三方登录
                styles.layout_disable_owner
          )}
        >
          <div className={clsx(styles.cont_box_right_header)}></div>
          <div className={clsx(styles.cont_box_right_cont)}>
            <Routes>
              <Route path="/login" element={<LoginView />} />
              <Route path="/register" element={<RegisterView />} />
              <Route path="/guest" element={<GuestView />} />
              <Route path="/forget" element={<ForgetPasswordView />} />
              <Route
                path="/"
                element={<Navigate to="/entry/login" replace={true} />}
              />
            </Routes>
          </div>
          <div className={clsx(styles.cont_box_bottom)}>
            <p>
              <span>免责申明：</span>
              该服务处于前沿探索阶段，您应当合规使用本服务，并承担由此产生的责任。我们对您的使用不做保证并且不承担任何责任。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';

export default EntryRoute;
