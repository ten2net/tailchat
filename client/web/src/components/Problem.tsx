import React from 'react';
import emptyDataPng from '@assets/images/empty-data.png';
import { t } from 'tailchat-shared';
import clsx from 'clsx';

interface ProblemProps {
  className?: string;
  style?: React.CSSProperties;
  text?: React.ReactNode;
}

/**
 * 问题页面占位
 */
export const Problem: React.FC<ProblemProps> = React.memo((props) => {
  return (
    <div
      className={clsx('text-center w-full', props.className)}
      style={props.style}
    >
      <img className="w-32 h-32 m-auto mb-2" src={emptyDataPng} />

      <div>{props.text ?? t('出现了一些问题')}</div>
    </div>
  );
});
Problem.displayName = 'Problem';
