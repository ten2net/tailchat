import React, { useEffect, useRef } from 'react';
import {
  useAsync,
  showToasts,
  useNavigate,
  loginWithToken,
  setUserJWT,
  useIsMobile,
} from '@capital/common';
import { Tooltip } from '@capital/component';
import { request } from './request';
import { Translate } from './translate';

export const IAMAction: React.FC = React.memo(() => {
  const { loading, value: strategies } = useAsync(async () => {
    const { data: strategies } = await request.get('availableStrategies');

    return strategies;
  }, []);
  const newWin = useRef<Window>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fn = (event: MessageEvent<any>) => {
      if (newWin.current && event.source === newWin.current) {
        newWin.current.close();

        const payload = event.data;

        if (payload.type === 'existed') {
          showToasts(Translate.accountExistedTip, 'warning');
        } else if (payload.type === 'infoDeviant') {
          showToasts(Translate.infoDeviantTip, 'error');
        } else if (payload.type === 'token') {
          const token = payload.token;
          setUserJWT(token)
            .then(loginWithToken(token))
            .then(() => {
              navigate('/main');
            })
            .catch((err) => {
              console.error(err);
              showToasts(Translate.loginFailed, 'error');
            });
        } else {
          console.warn('Unknown payload type', payload.type);
        }
      }
    };
    window.addEventListener('message', fn);

    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);

  if (loading) {
    return null;
  }
  if (Array.isArray(strategies) && strategies.length > 0) {
    return (
      <div>
        {isMobile ? (
          <div
            style={{ textAlign: 'center', opacity: 0.8, fontSize: '0.75rem' }}
          >
            {Translate.notSupportMobile}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {strategies.map((s) => (
              <Tooltip key={s.name} title="统一身份认证登录">
                <button style={{width:'318px',height:'63px',background:'#6676ff',fontSize:'18px',borderRadius:'50px'}} id='casLoginBtn1' onClick={async () => {
                    if (s.type === 'oauth') {
                      const { data: url } = await request.get(
                        `${s.name}.loginUrl`
                      );
                      const win = window.open(url, 'square', 'frame=true');
                      newWin.current = win;
                    }
                  }}>数字校园统一身份认证登录</button>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
});
IAMAction.displayName = 'IAMAction';
