import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginView } from './LoginView';
import clsx from 'clsx';
import styles from './index.module.less';
import { RegisterView } from './RegisterView';
import { useRecordMeasure } from '@/utils/measure-helper';
import { GuestView } from './GuestView';
import { ForgetPasswordView } from './ForgetPasswordView';
import {
  useGlobalConfigStore,
} from 'tailchat-shared';
const EntryRoute = React.memo(() => {
  useRecordMeasure('appEntryRenderStart');
  const { disableOwnerLogin } =
    useGlobalConfigStore((state) => ({
      disableOwnerLogin:state.disableOwnerLogin
    }));
  return (
    <div className={clsx(
      styles.loginBg,
      'h-full flex flex-row'
    )}>
      <div className={clsx(styles.cont_box)}>
        <div className={clsx(styles.cont_box_left)}></div>  
          <div className={disableOwnerLogin?clsx(styles.cont_box_right)+" "+clsx(styles.cont_box_right_padding_top):clsx(styles.cont_box_right)}>
            <div className={disableOwnerLogin?clsx(styles.cont_box_right_header)+" "+clsx(styles.cont_box_right_header_mb):clsx(styles.cont_box_right_header)}>
            </div>
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
