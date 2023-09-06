import { Icon } from 'tailchat-design';
import { Divider } from 'antd';
import {
  isValidStr,
  loginWithEmail,
  t,
  useAsyncFn,
  useGlobalConfigStore,
} from 'tailchat-shared';
import React, { useEffect, useState } from 'react';
import { string } from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { setUserJWT } from '../../utils/jwt-helper';
import { setGlobalUserLoginInfo, tryAutoLogin } from '../../utils/user-helper';
import { useSearchParam } from '@/hooks/useSearchParam';
import { useNavToView } from './utils';
import { EntryInput } from './components/Input';
import { SecondaryBtn } from './components/SecondaryBtn';
import { PrimaryBtn } from './components/PrimaryBtn';
import { pluginLoginAction } from '@/plugin/common';
import styles from './index.module.less';
import clsx from 'clsx';

/**
 * TODO:
 * 第三方登录
 */
const OAuthLoginView: React.FC = React.memo(() => {
  return (
    <>
      <Divider>{t('或')}</Divider>

      <div className="bg-gray-400 w-1/3 px-4 py-1 text-3xl text-center rounded-md cursor-pointer shadow-md">
        <Icon className="mx-auto" icon="mdi:github" />
      </div>
    </>
  );
});
OAuthLoginView.displayName = 'OAuthLoginView';

/**
 * 登录视图
 */
export const LoginView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const navRedirect = useSearchParam('redirect');
  const { pathname } = useLocation();
  const {
    serverName,
    disableGuestLogin,
    disableUserRegisterBtn,
    disableOwnerLogin,
  } = useGlobalConfigStore((state) => ({
    serverName: state.serverName,
    disableGuestLogin: state.disableGuestLogin,
    disableUserRegisterBtn: state.disableUserRegisterBtn,
    disableOwnerLogin: state.disableOwnerLogin,
  }));

  useEffect(() => {
    tryAutoLogin()
      .then(() => {
        navigate('/main');
      })
      .catch(() => {});
  }, []);

  const [{ loading, error }, handleLogin] = useAsyncFn(async () => {
    await string()
      .email(t('邮箱格式不正确'))
      .required(t('邮箱不能为空'))
      .validate(email);

    await string()
      .min(6, t('密码不能低于6位'))
      .required(t('密码不能为空'))
      .validate(password);

    const data = await loginWithEmail(email, password);

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);

    if (isValidStr(navRedirect) && navRedirect !== pathname) {
      // 增加非当前状态判定避免循环
      navigate(decodeURIComponent(navRedirect));
    } else {
      navigate('/main');
    }
  }, [email, password, navRedirect, pathname, navigate]);

  const navToView = useNavToView();

  return (
    <div className="w-96 relative">
      <div>
        {!disableOwnerLogin && (
          <div>
            <div className="mb-3 login-input">
              <EntryInput
                name="login-email"
                placeholder={t('邮箱')}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <EntryInput
                name="login-password"
                type="password"
                placeholder={t('密码')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        )}
        {loading === false && error && (
          <div className="flex justify-between">
            <p className="text-red-500 text-sm" style={{ lineHeight: '14px' }}>
              {error.message}
            </p>
            <div
              className="text-gray-200 cursor-pointer"
              onClick={() => navToView('/entry/forget')}
            >
              {t('忘记密码？')}
            </div>
          </div>
        )}
        {!disableOwnerLogin && (
          <PrimaryBtn
            className={clsx(styles.login_btn)}
            loading={loading}
            onClick={handleLogin}
          >
            {t('登录')}
          </PrimaryBtn>
        )}

        {!disableUserRegisterBtn && (
          <SecondaryBtn
            disabled={loading}
            onClick={() => navToView('/entry/register')}
          >
            {t('注册账号')}
            <Icon icon="mdi:arrow-right" className="ml-1 inline" />
          </SecondaryBtn>
        )}
        {!disableGuestLogin && (
          <SecondaryBtn
            disabled={loading}
            onClick={() => navToView('/entry/guest')}
          >
            {t('游客访问')}
            <Icon icon="mdi:arrow-right" className="ml-1 inline" />
          </SecondaryBtn>
        )}
      </div>
      <div
        className={
          disableOwnerLogin
            ? clsx(styles.cont_box_right_cont_mt_pb) + ' text-white'
            : 'text-white'
        }
      >
        {pluginLoginAction.map((item) => {
          const { name, component: Component } = item;

          return <Component key={name} />;
        })}
      </div>
    </div>
  );
});
LoginView.displayName = 'LoginView';
