/**
 * 系统配置模块 Mock 数据
 * 包含：基础配置、问题类型、视频监控配置、通知公告、制度文档
 */

import { createCrudMock } from '@/utils/crud'

// ─── 基础配置 ───────────────────────────────────────────────────────────────

export interface BasicConfig {
  systemName: string
  systemLogo: string
  systemDesc: string
  timezone: string
  dateFormat: string
}

/** 基础配置数据（单条记录，不需要 CRUD） */
export const basicConfigData: BasicConfig = {
  systemName: '智慧厂区巡检平台',
  systemLogo: '',
  systemDesc: '能源厂区设备巡检数字化管理系统',
  timezone: 'Asia/Shanghai',
  dateFormat: 'YYYY-MM-DD HH:mm:ss'
}

// ─── 问题类型 ───────────────────────────────────────────────────────────────

export interface IssueType {
  id: number
  name: string
  defaultReviewer: string
  defaultReviewerId: number | null
  sort: number
  status: number
  createTime: string
}

const initialIssueTypes: IssueType[] = [
  {
    id: 1,
    name: '设备故障',
    defaultReviewer: '张三',
    defaultReviewerId: 1,
    sort: 1,
    status: 1,
    createTime: '2026-01-01 09:00:00'
  },
  {
    id: 2,
    name: '安全隐患',
    defaultReviewer: '李四',
    defaultReviewerId: 2,
    sort: 2,
    status: 1,
    createTime: '2026-01-02 09:00:00'
  },
  {
    id: 3,
    name: '环境问题',
    defaultReviewer: '王五',
    defaultReviewerId: 3,
    sort: 3,
    status: 1,
    createTime: '2026-01-03 09:00:00'
  },
  {
    id: 4,
    name: '跑冒滴漏',
    defaultReviewer: '张三',
    defaultReviewerId: 1,
    sort: 4,
    status: 1,
    createTime: '2026-01-04 09:00:00'
  },
  {
    id: 5,
    name: '仪表异常',
    defaultReviewer: '',
    defaultReviewerId: null,
    sort: 5,
    status: 0,
    createTime: '2026-01-05 09:00:00'
  }
]

export const issueTypeMock = createCrudMock<IssueType>(initialIssueTypes, {
  searchFields: ['name']
})

// ─── 视频监控配置 ────────────────────────────────────────────────────────────

export interface VideoMonitor {
  id: number
  deviceName: string
  ipAddress: string
  port: number
  username: string
  password: string
  brand: string
  createTime: string
}

const initialVideoMonitors: VideoMonitor[] = [
  {
    id: 1,
    deviceName: '厂区大门监控',
    ipAddress: '192.168.1.101',
    port: 8080,
    username: 'admin',
    password: '******',
    brand: '海康威视 DS-2CD2T47G2',
    createTime: '2026-01-01 09:00:00'
  },
  {
    id: 2,
    deviceName: '设备区A监控',
    ipAddress: '192.168.1.102',
    port: 8080,
    username: 'admin',
    password: '******',
    brand: '大华 IPC-HDW2831T',
    createTime: '2026-01-02 09:00:00'
  },
  {
    id: 3,
    deviceName: '仓储区监控',
    ipAddress: '192.168.1.103',
    port: 8080,
    username: 'admin',
    password: '******',
    brand: '海康威视 DS-2CD2T47G2',
    createTime: '2026-01-03 09:00:00'
  }
]

export const videoMonitorMock = createCrudMock<VideoMonitor>(initialVideoMonitors, {
  searchFields: ['deviceName']
})

// ─── 通知公告 ───────────────────────────────────────────────────────────────

export interface Announcement {
  id: number
  title: string
  content: string
  attachments: { name: string; url: string }[]
  status: 'draft' | 'published' | 'recalled'
  publishTime: string | null
  createTime: string
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: '关于开展2026年度安全生产大检查的通知',
    content:
      '<p>各部门：根据上级要求，定于2026年5月开展年度安全生产大检查，请各部门做好准备工作。</p>',
    attachments: [{ name: '检查方案.pdf', url: '/files/check-plan.pdf' }],
    status: 'published',
    publishTime: '2026-04-01 09:00:00',
    createTime: '2026-03-30 14:00:00'
  },
  {
    id: 2,
    title: '巡检系统使用培训通知',
    content: '<p>各巡检人员：系统将于本周五下午进行使用培训，请准时参加。</p>',
    attachments: [],
    status: 'published',
    publishTime: '2026-04-10 10:00:00',
    createTime: '2026-04-09 16:00:00'
  },
  {
    id: 3,
    title: '五一假期巡检安排草稿',
    content: '<p>五一假期期间巡检安排待定，请关注后续通知。</p>',
    attachments: [],
    status: 'draft',
    publishTime: null,
    createTime: '2026-04-28 11:00:00'
  }
]

export const announcementMock = createCrudMock<Announcement>(initialAnnouncements, {
  searchFields: ['title']
})

// ─── 制度文档 ───────────────────────────────────────────────────────────────

export interface PolicyDocument {
  id: number
  name: string
  category: string
  fileUrl: string
  fileType: string
  createTime: string
}

const initialDocuments: PolicyDocument[] = [
  {
    id: 1,
    name: '设备巡检管理制度',
    category: '管理制度',
    fileUrl: '/files/inspection-rule.pdf',
    fileType: 'pdf',
    createTime: '2026-01-10 09:00:00'
  },
  {
    id: 2,
    name: '安全生产操作规程',
    category: '操作规程',
    fileUrl: '/files/safety-procedure.pdf',
    fileType: 'pdf',
    createTime: '2026-01-15 09:00:00'
  },
  {
    id: 3,
    name: '整改工单填写规范',
    category: '操作规程',
    fileUrl: '/files/rectification-spec.docx',
    fileType: 'docx',
    createTime: '2026-02-01 09:00:00'
  },
  {
    id: 4,
    name: '设备台账模板',
    category: '表单模板',
    fileUrl: '/files/equipment-template.xlsx',
    fileType: 'xlsx',
    createTime: '2026-02-10 09:00:00'
  }
]

export const documentMock = createCrudMock<PolicyDocument>(initialDocuments, {
  searchFields: ['name', 'category']
})

/** 文档分类枚举 */
export const documentCategories = ['管理制度', '操作规程', '表单模板', '应急预案', '培训资料']
