import { createCrudMock } from '@/utils/crud'

export interface AdminUser {
  id: number
  username: string
  realName: string
  avatar?: string
  email?: string
  phone?: string
  status: number
  departmentId?: number
  departmentName?: string
  positionName?: string
  roles?: { id: number; name: string }[]
  createTime: string
  updateTime: string
}

const mockUsers: AdminUser[] = [
  {
    id: 1,
    username: 'admin',
    realName: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 1,
    departmentId: 21,
    departmentName: '技术部',
    positionName: '技术总监',
    roles: [{ id: 1, name: '系统管理员' }],
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 2,
    username: 'lisi',
    realName: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 1,
    departmentId: 21,
    departmentName: '技术部',
    positionName: '高级工程师',
    roles: [{ id: 2, name: '普通用户' }],
    createTime: '2024-01-02 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 3,
    username: 'wangwu',
    realName: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    status: 1,
    departmentId: 22,
    departmentName: '市场部',
    positionName: '市场经理',
    roles: [{ id: 2, name: '普通用户' }],
    createTime: '2024-01-03 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 4,
    username: 'zhaoliu',
    realName: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    status: 0,
    departmentId: 31,
    departmentName: '财务部',
    positionName: '财务主管',
    roles: [{ id: 2, name: '普通用户' }],
    createTime: '2024-01-04 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  },
  {
    id: 5,
    username: 'sunqi',
    realName: '孙七',
    email: 'sunqi@example.com',
    phone: '13800138005',
    status: 1,
    departmentId: 32,
    departmentName: '人事部',
    positionName: 'HR专员',
    roles: [{ id: 2, name: '普通用户' }],
    createTime: '2024-01-05 10:00:00',
    updateTime: '2025-03-01 09:00:00'
  }
]

export const userMock = createCrudMock<AdminUser>(mockUsers, {
  searchFields: ['realName', 'username', 'phone']
})
