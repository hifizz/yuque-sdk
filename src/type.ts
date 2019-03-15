/**
 * 数据的唯一编号/主键 （用户、群组、知识库、文档、草稿的id）
 */
export type Identity = number;

/**
 * 用户／团队的唯一名称
 * 用户／团队编号
 */
export type LoginString = string;

/**
 *
 * 个人id或者团队id、个人路径或者团队路径
 */
export type UserIdentity = Identity | LoginString;

/**
 * 仓库的唯一名称
 * 需要组合 :login/:book_slug或可以直接使用仓库编号
 */
export type RepoNamespace = string;

/**
 * 文档唯一名称（slug意为懒，缩略）
 */
export type ISlug = string;

/**
 * 用户类型[User - 用户, Group - 团队]
 */
export enum UserType {
  User = "User",
  Group = "Group"
}

/**
 * 用户提交内容的格式
 */
export enum ContentFormat {
  lake = 'lake',
  markdown = 'markdown'
}

/**
 * 公开级别 [0 - 私密, 1 - 公开]
 */
export enum PublicType {
  public = 1,
  private = 0
}

/**
 * 状态 [0 - 草稿, 1 - 发布]
 */
export enum statusType {
  draft = 0,
  published = 1
}

/**
 * 角色 [0 - Owner, 1 - Member]
 */
export enum RoleType {
  Owner = 0, // 管理员
  Member = 1 // 普通成员
}

// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------

/**
 * https://www.yuque.com/yuque/developer/doc#Parameters-1
 */
export interface NewDocParams {
  title: string; // 标题
  slug: string; // 文档 Slug
  public: PublicType; // 0 - 私密，1 - 公开
  format: ContentFormat; // 支持 markdown 和 lake，默认为 markdown
  body: string; // format 描述的正文内容，最大允许 5MB
}

/**
 * 更新文档需要的参数
 * https://www.yuque.com/yuque/developer/doc#Parameters-2
 */
export interface UpdateDocParams {
  title: string; // 标题
  slug: string; // 文档 Slug
  public: PublicType; // 0 - 私密，1 - 公开
  body: string; // format 描述的正文内容，最大允许 5MB
}

export namespace YuqueResponse {

  /**
   * 一般在列表的场景返回的用户信息。
   * https://www.yuque.com/yuque/developer/userserializer
   */
  export interface UserSerializer {

    id: Identity; // - 用户编号

    type: UserType; // - 类型 [User - 用户, Group - 团队]

    login: LoginString; // - 用户个人路径

    name: string; // - 昵称

    avatar_url: string; // - 头像 URL

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间
  }

  /**
   * 用户/团队详细信息
   * https://www.yuque.com/yuque/developer/userdetailserializer
   */
  export interface UserDetailSerializer {
    id: number; // - 用户资料编号

    space_id: number; // - 企业空间编号

    account_id: number; // - 用户账户编号

    type: UserType; // - 类型 [User - 用户, Group - 团队]

    login: LoginString; // - 用户个人路径

    name: string; // - 昵称

    owner_id: number; // - 团队创建人，仅适用于 type - 'Group'

    avatar_url: string; // - 头像 URL

    books_count: number; // - 仓库数量

    public_books_count: number; // - 公开仓库数量

    members_count: number; // - 团队成员数量

    description: string; // - 介绍

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间
  }

  /**
   * 一般在列表的场景返回的仓库信息。
   * https://www.yuque.com/yuque/developer/bookserializer
   */
  export interface BookSerializer {
    id: Identity; // - 仓库编号

    type: "Book"; // - 类型 [Book - 文档]

    slug: string; // - 仓库路径

    name: string; // - 名称

    namespace: string;// - 仓库完整路径 user.login/book.slug

    user_id: Identity; // - 所属的团队/用户编号

    user: UserSerializer; // - <UserSerializer>

    description: string; // - 介绍

    creator_id: number; // - 创建人 User Id

    public: 0 | 1; // - 公开状态 [1 - 公开, 0 - 私密]

    likes_count: number; // - 喜欢数量

    watches_count: number;// - 订阅数量

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间

  }

  /**
   * 仓库的详细信息
   * https://www.yuque.com/yuque/developer/bookdetailserializer
   */
  export interface BookDetailSerializer {
    id: number; // - 仓库编号

    type: "Book"; // - 类型 [Book - 文档]

    slug: string; // - 仓库路径

    name: string; // - 名称

    namespace: string;// - 仓库完整路径 user.login/book.slug

    user_id: number; // - 所属的团队/用户编号

    user: UserSerializer; // - <UserSerializer>

    description: string; // - 介绍

    toc_yml: string; // - 目录原文

    creator_id: number; // - 创建人 User Id

    public: 0 | 1; // - 公开状态 [1 - 公开, 0 - 私密]

    item_count: number; // - 文档数量

    likes_count: number; // - 喜欢数量

    watches_count: number; // - 订阅数量

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间
  }

  /**
   * 文档基本信息，一般用在列表场景。
   * https://www.yuque.com/yuque/developer/docserializer
   */
  export interface DocSerializer {
    id: number; // - 文档编号

    slug: string; // - 文档路径

    title: string; // - 标题

    user_id: number; // - 文档创建人 user_id

    format: string; // - 描述了正文的格式 [asl, markdown]

    public: 1 | 0; // - 是否公开 [1 - 公开, 0 - 私密]

    status: 1 | 0; // - 状态 [1 - 正常, 0 - 草稿]

    likes_count: number; // - 喜欢数量

    comments_count: number; //  - 评论数量

    content_updated_at: string; // - 文档内容更新时间

    book: BookSerializer; // - <BookSerializer> 所属知识库

    user: UserSerializer; // - <UserSerializer> 所属团队（个人）

    last_editor: UserSerializer; // - <UserSerializer> 最后修改人

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间
  }

  /**
   * 文档详细信息
   * https://www.yuque.com/yuque/developer/docdetailserializer
   */
  export interface DocDetailSerializer {
    id: number; // - 文档编号

    slug: string; // - 文档路径

    title: string; // - 标题

    book_id: number; // - 仓库编号，就是 repo_id

    book: BookSerializer; // - 仓库信息 <BookSerializer>，就是 repo 信息

    user_id: number; // - 用户/团队编号

    user: UserSerializer; // - 用户/团队信息 <UserSerializer>

    format: ContentFormat;// - 描述了正文的格式 [lake , markdown]

    body: string; // - 正文 Markdown 源代码

    body_draft: string; // - 草稿 Markdown 源代码

    body_html: string; // - 转换过后的正文 HTML

    body_lake: string; // - 语雀 lake 格式的文档内容

    creator_id: number; // - 文档创建人 User Id

    public: PublicType; // - 公开级别 [0 - 私密, 1 - 公开]

    status: statusType; // - 状态 [0 - 草稿, 1 - 发布]

    likes_count: number; // - 赞数量

    comments_count: number; // - 评论数量

    content_updated_at: string; // - 文档内容更新时间

    deleted_at: string | null; // - 删除时间，未删除为 null

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间
  }

  /**
   * 文档版本基本信息
   * https://www.yuque.com/yuque/developer/docversionserializer
   */
  export interface DocVersionSerializer {
    id: Identity; // - 草稿编号

    doc_id: number; // - 文档编号

    slug: string; // - 文档 slug

    title: string; // - 标题

    user_id: Identity; // - 创建人编号

    user: UserSerializer; // - 创建人 <UserSerializer>

    draft: boolean; // - 是否是草稿

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间
  }

  /**
   * 文档版本详细信息
   * https://www.yuque.com/yuque/developer/docversiondetailserializer
   */
  export interface DocVersionDetailSerializer {
    id: Identity; // - 草稿编号

    doc_id: number; // - 文档编号

    slug: string; // - 文档 slug

    title: string; // - 标题

    user_id: Identity;// - 创建人编号

    user: UserSerializer; // - 创建人 <UserSerializer>

    draft: boolean; // - 是否是草稿

    body: string; // - 正文 markdown，参考 <DocDetailSerializer> 里面关于 body, body_asl 的介绍

    body_asl: string; // - asl 格式正文

    body_html: string; // - 正文 HTML 代码

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间
  }

  /**
   * 团队成员信息
   * https://www.yuque.com/yuque/developer/groupuserserializer
   */
  export interface GroupUserSerializer {
    id: number; // - GroupUser Id

    group_id: number; // - 团队编号

    group: UserSerializer; // - 团队信息 <UserSerializer>

    user_id: number; // - 用户编号

    user: UserSerializer; // - 用户信息 <UserSerializer>

    role: RoleType; // - 角色 [0 - Owner, 1 - Member]

    created_at: string; // - 创建时间

    updated_at: string; // - 更新时间
  }

}
