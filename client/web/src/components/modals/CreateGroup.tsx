import { Button, Divider, Input, Typography } from 'antd';
import React, { Fragment, useCallback, useRef, useState } from 'react';
import {
  createGroup,
  GroupPanelType,
  t,
  useAppDispatch,
  useAsyncRequest,
  groupActions,
} from 'tailchat-shared';
import type { GroupPanel } from 'tailchat-shared';
import { closeModal, ModalWrapper } from '../Modal';
import { Slides, SlidesRef } from '../Slides';
import { useNavigate } from 'react-router';
import { applyDefaultFallbackGroupPermission } from 'tailchat-shared';
import { Avatar } from 'tailchat-design';

const panelTemplate: {
  key: string;
  label: string;
  panels: GroupPanel[];
}[] = [
  {
    key: 'default',
    label: t('默认群组'),
    panels: [
      {
        id: '00',
        name: t('文字频道'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '01',
        name: t('大厅'),
        parentId: '00',
        type: GroupPanelType.TEXT,
      },
      {
        id: '02',
        name: t('markdown'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'Markdown Panel',
        pluginPanelName: 'Markdown Panel/customwebpanel',
        meta: { disableSendMessage: false },
      },
    ],
  },
  {
    key: 'teaching',
    label: t('教研协作组'),
    panels: [
      {
        id: '00',
        name: t('部门概况'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '001',
        name: t('教研室介绍'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f2aa6f2013d.html',
        },
      },
      {
        id: '002',
        name: t('课程介绍'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f30ae12014c.html',
        },
      },
      {
        id: '003',
        name: t('教学安排'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f3314cf0158.html',
        },
      },
      {
        id: '01',
        name: t('教学研讨'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '011',
        name: t('交流研讨'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '012',
        name: t('资料发布'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '013',
        name: t('工作安排'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '02',
        name: t('教学助手'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '021',
        name: t('备课助手'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/tVQNwEhPIbCgC1LD' },
      },
      {
        id: '022',
        name: t('作业助手'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/gC0sF0nhFZXWhaKs' },
      },
    ],
  },
  {
    key: 'course',
    label: t('课程学习组'),
    panels: [
      {
        id: '00',
        name: t('课程信息'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '001',
        name: t('教学大纲'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f349b9a0169.html',
        },
      },
      {
        id: '002',
        name: t('教学安排'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f3314cf0158.html',
        },
      },
      {
        id: '01',
        name: t('教学研讨'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '011',
        name: t('AI答疑'),
        parentId: '01',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/chat/5bV05ak3vnFyzu9f' },
      },
      {
        id: '012',
        name: t('学习研讨'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '02',
        name: t('自学自测'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '021',
        name: t('课前预习'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/Y7gncagCWlkHYaLz' },
      },
      {
        id: '022',
        name: t('课程学习'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f30ae12014c.html',
        },
      },
      {
        id: '023',
        name: t('课后作业'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/gC0sF0nhFZXWhaKs' },
      },
      {
        id: '024',
        name: t('单元自测'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/bZ062XKJ1wNAkpeK' },
      },
    ],
  },
  {
    key: 'project',
    label: t('科研项目组'),
    panels: [
      {
        id: '00',
        name: t('项目介绍'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '001',
        name: t('项目简介'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f39c40f0181.html',
        },
      },
      {
        id: '002',
        name: t('研究内容'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f3bc4d9018d.html',
        },
      },
      {
        id: '003',
        name: t('项目计划'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f401fe301a2.html',
        },
      },
      {
        id: '01',
        name: t('创新研讨'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '011',
        name: t('AI助手'),
        parentId: '01',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/chat/SvY558a1OkfLD33T' },
      },
      {
        id: '012',
        name: t('创新研讨'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '02',
        name: t('项目助手'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '021',
        name: t('资料推荐'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/Xm0QjEp7E23WnpAI' },
      },
      {
        id: '022',
        name: t('文档起草'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/cUJqajzOT7KPxqSs' },
      },
      {
        id: '023',
        name: t('论文修改'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/lThsxotKiRex5LGg' },
      },
    ],
  },
  {
    key: 'department',
    label: t('部门工作组'),
    panels: [
      {
        id: '00',
        name: t('部门介绍'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '001',
        name: t('部门职责'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f44a46b01be.html',
        },
      },
      {
        id: '002',
        name: t('对外服务'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f4835b101ca.html',
        },
      },
      {
        id: '01',
        name: t('交流研讨'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '011',
        name: t('AI工作答疑'),
        parentId: '01',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/chat/3EbGgV9o32VmblC1' },
      },
      {
        id: '012',
        name: t('部门讨论'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '013',
        name: t('资源共享'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '02',
        name: t('工作助手'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '021',
        name: t('规章制度'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/0vSJQaVegsD7E327' },
      },
      {
        id: '022',
        name: t('文档编写'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/fJT9OYG5K9oGsSPS' },
      },
      {
        id: '023',
        name: t('归纳总结'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/LvsmG2DkPpXv9rNU' },
      },
    ],
  },
  {
    key: 'student',
    label: t('学员班队组'),
    panels: [
      {
        id: '00',
        name: t('学员队'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '001',
        name: t('班队介绍'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f4c18ae01d6.html',
        },
      },
      {
        id: '002',
        name: t('在队学员'),
        parentId: '00',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: {
          url: 'http://192.168.200.8:8989/webdoc/view/Pub4028488888f00218018a3f4f4fe301e2.html',
        },
      },
      {
        id: '01',
        name: t('学员研讨'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '011',
        name: t('AI辅导'),
        parentId: '01',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/chat/jkDWp7ntkkaScCdE' },
      },
      {
        id: '012',
        name: t('军事研讨'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '013',
        name: t('生活交流'),
        parentId: '01',
        type: GroupPanelType.TEXT,
      },
      {
        id: '02',
        name: t('学员服务'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '021',
        name: t('规章制度'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/0vSJQaVegsD7E327' },
      },
      {
        id: '022',
        name: t('办事指南'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/completion/euvbAXALMUmp9JDM' },
      },
      {
        id: '023',
        name: t('心理咨询'),
        parentId: '02',
        type: GroupPanelType.PLUGIN,
        provider: 'com.msgbyte.webview',
        pluginPanelName: 'com.msgbyte.webview/grouppanel',
        meta: { url: 'http://192.168.15.130:8001/chat/RgTilRjUTNebCaJ6' },
      },
    ],
  },
];

export const ModalCreateGroup: React.FC = React.memo(() => {
  const slidesRef = useRef<SlidesRef>(null);
  const [panels, setPanels] = useState<GroupPanel[]>([]);
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSelectTemplate = useCallback((panels: GroupPanel[]) => {
    setPanels(panels);
    slidesRef.current?.next();
  }, []);

  const handleBack = useCallback(() => {
    slidesRef.current?.prev();
  }, []);

  const [{ loading }, handleCreate] = useAsyncRequest(async () => {
    const data = await createGroup(name, panels);

    dispatch(groupActions.appendGroups([data]));

    navigate(`/main/group/${data._id}`); // 创建完成后跳转到新建的群组

    // 应用默认权限
    await applyDefaultFallbackGroupPermission(String(data._id));

    closeModal();
  }, [name, panels, location]);

  return (
    <ModalWrapper style={{ maxWidth: 440 }}>
      <Slides ref={slidesRef}>
        <div>
          <Typography.Title level={4} className="text-center mb-4">
            {t('创建群组')}
          </Typography.Title>

          <Typography.Paragraph className="mb-4 text-center">
            {t('选择以下模板, 开始创建属于自己的群组吧!')}
          </Typography.Paragraph>

          <div className="space-y-2.5">
            {panelTemplate.map((template, index) => (
              <Fragment key={template.key}>
                {/* Hardcode: 将第一个模板与之后的模板区分开 */}
                {index === 1 && <Divider />}
                <div
                  key={template.key}
                  className="w-full border rounded text-base py-2 px-3 cursor-pointer font-bold hover:bg-white hover:bg-opacity-10"
                  onClick={() => handleSelectTemplate(template.panels)}
                >
                  {template.label}
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <div>
          <Typography.Title level={4} className="text-center mb-4">
            {t('自定义你的群组')}
          </Typography.Title>

          <Typography.Paragraph className="text-center mb-2">
            {t('不要担心, 在此之后你可以随时进行变更')}
          </Typography.Paragraph>

          <div className="text-center mb-2">
            {/* TODO: upload avatar */}
            <Avatar className="mx-auto" size={80} name={name} />
          </div>

          <div>
            <div>{t('群组名称')}:</div>

            <Input
              className="shadow-none"
              size="large"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Divider />

          <div className="flex justify-between">
            <Button
              type="link"
              onClick={handleBack}
              className="text-gray-600 dark:text-white font-bold"
            >
              {t('返回')}
            </Button>
            <Button type="primary" loading={loading} onClick={handleCreate}>
              {t('确认创建')}
            </Button>
          </div>
        </div>
      </Slides>
    </ModalWrapper>
  );
});
ModalCreateGroup.displayName = 'ModalCreateGroup';
