// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { NewDocParams, UpdateDocParams, YuqueResponse, RepoNamespace, Identity, UserIdentity, RoleType, LoginString } from './type'
import { Client } from "./HttpClient";

/** 对外的api路径前缀 */
const DEFAULT_YUQUE_API_PREFIX = 'https://www.yuque.com/api/v2/';

export interface Warpper<T> {
  data: T;
}

export class YuqueSDK {
  private httpClient: Client;
  // private token: string;
  // private apiPrefix: string;

  constructor(token: string, apiPrefix: string = DEFAULT_YUQUE_API_PREFIX) {
    // this.token = token;
    // this.apiPrefix = apiPrefix;
    this.httpClient = new Client(token, apiPrefix);
  }

  /******************************************************
   * 用户账号相关操作
   *****************************************************/

  /**
   * 基于用户 login 或 id 获取一个用户的基本信息。
   * GET /users/:login 或
   * GET /users/:id
   * @param id
   * @returns {Promise<YuqueResponse.UserSerializer>} 用户信息
   */
  public profile(id: UserIdentity): Promise<YuqueResponse.UserSerializer> {
    return this.httpClient.get(`/users/${id}`)
  }

  /**
   * 获取认证的用户的个人信息
   * 需要认证
   */
  public user(): Promise<Warpper<YuqueResponse.UserSerializer>> {
    return this.httpClient.get('/user')
  }

  /**
   * 获取我创建的文档
   * 需要认证
   * @param q {string} 文档标题模糊搜索
   * @param offset {number} 整数；用于分页，效果类似 MySQL 的 limit offset，一页 20 条
   */
  public docs(q?: string, offset?: number): Promise<Warpper<Array<YuqueResponse.DocSerializer>>> {
    return this.httpClient.get('/user/docs', {
      params: {
        q,
        offset
      }
    })
  }

  /**
   * 获取我最近参与的文档/知识库
   * Defined at https://www.yuque.com/yuque/developer/user#u34mpg
   * @param type
   * @param offset
   */
  public recentUpdate(
    type: "Doc" | "Book" = "Book",
    offset: number = 20
  ): Promise<Array<YuqueResponse.DocSerializer> | Array<YuqueResponse.BookSerializer>> {
    return this.httpClient.get('/user/recent-updated', {
      params: {
        type,
        offset
      }
    })
  }

  /******************************************************
   * 组织的操作
   *****************************************************/

  /**
   * 获取某个用户的加入的组织列表
   *
   * GET /users/:login/groups
   * 或
   * GET /users/:id/groups
   * https://www.yuque.com/yuque/developer/group#13hlny
   * @param id {UserIdentity} 个人id或者团队id、个人路径或者团队路径
   */
  public groups(id: UserIdentity): Promise<Array<YuqueResponse.UserSerializer>> {
    return this.httpClient.get(`/users/${id}/groups`)
  }

  /**
   * 获取公开组织列表
   * https://www.yuque.com/yuque/developer/group#9gl6xg
   */
  public publicGroups() {
    return this.httpClient.get('/groups')
  }

  /**
   * 创建 Group
   * https://www.yuque.com/yuque/developer/group#wuq6dz
   * @param name
   * @param login
   * @param description
   */
  public createGroup(name: string, login: string, description: string | null = null): Promise<YuqueResponse.UserSerializer> {
    return this.httpClient.post('/groups', {}, {
      params: {
        name,
        login,
        description
      }
    })
  }

  /**
   * 获取单个组织的详细信息
   * GET /groups/:login
   * # 或
   * GET /groups/:id
   */
  public groupProfile(id: UserIdentity) {
    return this.httpClient.get(`/groups/${id}`)
  }

  /**
   * 更新单个组织的详细信息
   * https://www.yuque.com/yuque/developer/group#ww5bhs
   * @param id 个人id或者团队id、个人路径或者团队路径
   */
  public updateGroupProfile(id: UserIdentity) {
    return this.httpClient.put(`/groups/${id}`)
  }

  /**
   * 删除组织
   * https://www.yuque.com/yuque/developer/group#msggsm
   * @param id 个人id或者团队id、个人路径或者团队路径
   */
  public deleteGroup(id: UserIdentity) {
    return this.httpClient.delete(`/groups/${id}`)
  }

  /**
   * 获取组织成员信息
   * https://www.yuque.com/yuque/developer/group#qf4xae
   * @param id 个人id或者团队id、个人路径或者团队路径
   * @returns {Promise<Array<YuqueResponse.GroupUserSerializer>>} 群组用户数组
   */
  public getGroupUsers(id: UserIdentity): Promise<Array<YuqueResponse.GroupUserSerializer>> {
    return this.httpClient.get(`/groups/${id}/users`)
  }

  /**
   * 增加或更新组织成员
   * - https://www.yuque.com/yuque/developer/group#am7zgu
   * - PUT /groups/:group_login/users/:login
   * - PUT /groups/:group_id/users/:login
   * @param groupId 目标群组id
   * @param id 目标群组id
   * @param role {RoleType} 管理员或者是组员
   */
  public updateGroupUsers(
    groupId: UserIdentity,
    id: UserIdentity,
    role: RoleType
  ): Promise<YuqueResponse.GroupUserSerializer> {
    return this.httpClient.put(`/groups/${groupId}/users/${id}`, {}, {params: {role}})
  }

  /**
   * ### 删除组织成员
   * - https://www.yuque.com/yuque/developer/group#e90bdm
   * - DELETE /groups/:group_login/users/:login
   * - DELETE /groups/:group_id/users/:login
   */
  public deleteGroupUsers(groupId: UserIdentity, id: LoginString): Promise<any> {
    return this.httpClient.delete(`/groups/${groupId}/users/${id}`)
  }

  /******************************************************
   * 仓库相关的操作
   *****************************************************/

  /**
   * 获取某个用户/组织的仓库列表
   * https://www.yuque.com/yuque/developer/repo#parameters
   */
  public getRepos(
    userType: 'users' | 'groups',
    type: "Book" | "Design" | "all",
    includeMembered: boolean,
    offset: number
  ) {
    const id: UserIdentity = ''
    return this.httpClient.get(`/${userType}/${id}/repos`, {
      params: {
        type,
        offset,
        include_membered: includeMembered
      }
    })
  }

  /**
   * 获取单个用户下所有的Repos
   * @param type
   * @param includeMembered
   * @param offset
   */
  public getUserRepos(
    type: "Book" | "Design" | "all",
    includeMembered: boolean,
    offset: number
  ) {
    return this.getRepos('users', type, includeMembered, offset);
  }

  /**
   * 获取群组用户下所有的Repos
   * @param type
   * @param includeMembered
   * @param offset
   */
  public getGroupRepos(
    type: "Book" | "Design" | "all",
    includeMembered: boolean,
    offset: number
  ) {
    return this.getRepos('groups', type, includeMembered, offset);
  }

  /**
   * https://www.yuque.com/yuque/developer/repo#parameters
   */
  public updateRepo() {
    return
  }

  /******************************************************
   * 文档相关的操作
   *****************************************************/

  /**
   * 获取一个仓库的文档列表
   * https://www.yuque.com/yuque/developer/doc#6d560c5e
   * @param owner
   */
  public reposDocsList(owner: Identity | RepoNamespace) {
    return this.httpClient.get(`/repos/${owner}/docs`)
  }

  /**
   * 获取单篇文档的详细信息
   * https://www.yuque.com/yuque/developer/doc#684fb2c5
   * @param raw
   */
  public docDetail(raw?: 1) {
    return this.httpClient.get(`/repos/:namespace/docs/:slug`, { params: { raw } })
  }

  /**
   * 创建文档
   * https://www.yuque.com/yuque/developer/doc#63851c78
   * /repos/:namespace/docs
   */
  public createDoc(data: any, params: NewDocParams) {
    return this.httpClient.post(`/repos/:namespace/docs`, data, { params })
  }

  /**
   * 更新文档
   * https://www.yuque.com/yuque/developer/doc#c2e9ee2a
   * @param namespace
   * @param docId
   * @param params
   */
  public updateDoc(
    namespace: RepoNamespace,
    docId: Identity,
    params: UpdateDocParams
  ) {
    return this.httpClient.put(`/repos/${namespace}/docs/${docId}`, {}, { params })
  }

  /**
   * 删除文档
   * https://www.yuque.com/yuque/developer/doc#f28f9fb9
   * - DELETE /repos/:namespace/docs/:id
   * - DELETE /repos/:repo_id/docs/:id
   * @param namespace
   * @param id
   */
  public deleteReposDoc(namespace: RepoNamespace, id: Identity) {
    return this.httpClient.delete(`/repos/${namespace}/docs/${id}`)
  }
}

export default YuqueSDK;
