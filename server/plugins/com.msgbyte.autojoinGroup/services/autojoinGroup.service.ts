import { call, TcContext } from 'tailchat-server-sdk';
import { TcService } from 'tailchat-server-sdk';

/**
 * Autojoin Group
 *
 * Auto join group after register
 */
class AutojoinGroupService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.autojoinGroup';
  }

  get autojoinGroupIds(): string[] | null {
    const ids = process.env.AUTOJOIN_GROUP_ID;
    if (!ids) {
      return null;
    }

    return ids.split(',');
  }
  //教员群组
  get autojoinGroupEmployeeIds(): string[] | null {
    const ids = process.env.AUTOJOIN_GROUP_ID_EMPLOYEE;
    if (!ids) {
      return null;
    }
    return ids.split(',');
  }
  //学员群组
  get autojoinGroupStudentIds(): string[] | null {
    const ids = process.env.AUTOJOIN_GROUP_ID_STUDENT;
    if (!ids) {
      return null;
    }
    return ids.split(',');
  }

  onInit() {
    if (!this.autojoinGroupIds) {
      return;
    }

    this.registerAfterActionHook('user.register', 'autojoinGroup');
    this.registerAfterActionHook('user.createTemporaryUser', 'autojoinGroup');

    this.registerAction('autojoinGroup', this.autojoinGroup, {
      visibility: 'public',
    });
  }

  async autojoinGroup(ctx: TcContext) {
    const autojoinGroupIds = this.autojoinGroupIds;
    if (!autojoinGroupIds) {
      return;
    }
    console.log(ctx.params, ctx.meta);

    const userId = ctx.meta.actionResult?._id;
    const t = ctx.meta.t;

    if (!userId) {
      this.logger.fatal('Autojoin Group Failed: cannot found userId from ctx');
      return;
    }
    //自动加入群组的默认的群组ID集合
    let autoGroupIds = autojoinGroupIds;
    //包含用户信息的json
    const params = ctx.params as any;
    //当前用户为教员
    if (params.userType == process.env.USERTYPE_EMPLOYEE) {
      autoGroupIds = this.autojoinGroupEmployeeIds;
    } else if (params.userType == process.env.USERTYPE_STUDENT) {
      //学员
      autoGroupIds = this.autojoinGroupStudentIds;
    }
    await Promise.all(
      autoGroupIds.map(async (groupId: string) => {
        await ctx.call('group.addMember', {
          groupId,
          userId,
        });

        const nickname = ctx.meta.actionResult?.nickname;
        await call(ctx).addGroupSystemMessage(
          String(groupId),
          t('{{nickname}} 通过系统自动加入群组', {
            nickname,
          })
        );
      })
    );
  }
}

export default AutojoinGroupService;
