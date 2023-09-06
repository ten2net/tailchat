import { Icon } from 'tailchat-design';
import React from 'react';
import { t, useInboxList } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';

/**
 * 收件箱
 */
export const InboxNav: React.FC = React.memo(() => {
  const inbox = useInboxList();
  const unreadList = inbox.filter((i) => !i.readed);

  return (
    <NavbarNavItem
      style={{ backgroundColor: '#0193ff' }}
      name={t('收件箱')}
      to={'/main/inbox'}
      showPill={true}
      badge={unreadList.length > 0}
      badgeProps={{
        count: unreadList.length,
      }}
      data-testid="inbox"
    >
      <Icon className="text-3xl text-white" icon="mdi:email-arrow-left" />
    </NavbarNavItem>
  );
});
InboxNav.displayName = 'InboxNav';
