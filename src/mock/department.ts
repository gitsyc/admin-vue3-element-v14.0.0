import { createCrudMock } from '@/utils/crud'

export interface Department {
  id: number
  parentId: number | null
  name: string
  code?: string
  type?: string
  leader?: string
  phone?: string
  sort?: number
  status?: number
  children?: Department[]
  createTime?: string
  updateTime?: string
}

const mockDepartments: Department[] = [
  {
    id: 1,
    name: '总公司',
    parentId: null,
    code: 'HQ',
    type: '省公司',
    leader: '张三',
    phone: '13800138001',
    sort: 1,
    status: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2025-03-01 09:00:00',
    children: [
      {
        id: 2,
        name: '北京分公司',
        parentId: 1,
        code: 'BJ',
        type: '分公司',
        leader: '李四',
        phone: '13800138002',
        sort: 1,
        status: 1,
        createTime: '2024-01-02 10:00:00',
        updateTime: '2025-03-01 09:00:00',
        children: [
          {
            id: 21,
            name: '技术部',
            parentId: 2,
            code: 'BJ-TECH',
            type: '部门',
            leader: '王五',
            phone: '13800138021',
            sort: 1,
            status: 1,
            createTime: '2024-01-03 10:00:00',
            updateTime: '2025-03-01 09:00:00'
          },
          {
            id: 22,
            name: '市场部',
            parentId: 2,
            code: 'BJ-MKT',
            type: '部门',
            leader: '赵六',
            phone: '13800138022',
            sort: 2,
            status: 1,
            createTime: '2024-01-03 10:00:00',
            updateTime: '2025-03-01 09:00:00'
          }
        ]
      },
      {
        id: 3,
        name: '上海分公司',
        parentId: 1,
        code: 'SH',
        type: '分公司',
        leader: '孙七',
        phone: '13800138003',
        sort: 2,
        status: 1,
        createTime: '2024-01-02 10:00:00',
        updateTime: '2025-03-01 09:00:00',
        children: [
          {
            id: 31,
            name: '财务部',
            parentId: 3,
            code: 'SH-FIN',
            type: '部门',
            leader: '周八',
            phone: '13800138031',
            sort: 1,
            status: 1,
            createTime: '2024-01-03 10:00:00',
            updateTime: '2025-03-01 09:00:00'
          },
          {
            id: 32,
            name: '人事部',
            parentId: 3,
            code: 'SH-HR',
            type: '部门',
            leader: '吴九',
            phone: '13800138032',
            sort: 2,
            status: 1,
            createTime: '2024-01-03 10:00:00',
            updateTime: '2025-03-01 09:00:00'
          }
        ]
      }
    ]
  }
]

export const departmentMock = createCrudMock<Department>(mockDepartments, {
  searchFields: ['name', 'code', 'leader'],
  isTree: true
})
