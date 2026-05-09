# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供代码库工作指南。

## 技能与 Agent 体系

本项目配置了完整的 AI 辅助开发体系，覆盖从需求分析到代码实现的全流程。

### 全流程技能地图

```
产品规划阶段
  pm-market-research    市场调研与竞品分析
  pm-user-persona       用户画像设计
  pm-feature-prioritization  功能优先级排序（RICE/MoSCoW/ICE/Kano）
  pm-roadmap            产品路线图规划
  pm-okr-designer       OKR/KPI 体系设计

需求与规划阶段
  feasibility-report    可行性研究报告（analyzer → writer → reviewer）
  req-doc               SRS 需求规格说明书（analyzer → writer → reviewer）
  feature-list          功能清单提取与导出（xlsx / Word）
  diagram-generator     流程图、架构图、时序图（Kroki 渲染）

设计阶段
  ui-ux-pro-max         UI/UX 设计智能（67种风格、161配色、57字体配对）
  design                品牌设计、Logo、CIP、Banner、图标
  design-system         设计 Token 体系与组件规范
  ui-styling            shadcn/ui + Tailwind 组件样式
  banner-design         Banner 设计（社交媒体/广告/网站）
  brand                 品牌声音与视觉识别
  slides                HTML 演示文稿

开发阶段
  brainstorming         功能设计前的需求探索（实现前必须先用）
  page-generator        页面生成（需求→规范→设计→代码→验收，7步工作流）
  annotation            原型标注（prd-analyzer → selector-validator）
  frontend-design       高质量前端界面设计

测试与交付阶段
  pm-test-cases         测试用例生成（功能/边界/异常/权限）
  pm-operation-manual   操作手册生成
  pm-release-notes      发版说明撰写
  pm-sprint-planning    迭代规划与敏捷管理
  pm-stakeholder-report 汇报材料生成

文档处理
  docx                  Word 文档处理
  pdf                   PDF 文件处理
  pptx                  PowerPoint 处理
  xlsx                  Excel 表格处理

全流程
  pm-product-pipeline   产品全流程编排（市调→画像→优先级→路线图→需求→原型→测试→手册→发版）
```

### Agent 协作架构

各技能内部通过 Agent 协作完成复杂任务：

```
req-doc 技能
  req-analyzer    → 从设计文档/代码提取功能摘要
  req-writer      → 将摘要转化为 PRD 语言的章节内容
  req-reviewer    → 四维度审查（语言规范/章节结构/三要素/提示文案）

feasibility-report 技能
  feasibility-analyzer  → 分析项目文档，输出结构化摘要
  feasibility-writer    → 撰写可研报告章节
  feasibility-reviewer  → 审查报告质量

page-generator 技能
  page-spec-loader  → 检测技术栈，加载组件库规范
  design-advisor    → 查询 ui-ux-pro-max，输出设计决策
  page-reviewer     → 四维度验收（需求完整性/规范遵守/代码质量/交互完整性）

annotation 技能
  annotation-prd-analyzer      → 读取需求文档，生成标注清单
  annotation-selector-validator → 验证 CSS 选择器有效性
```

---

## 强制规则：必须使用技能的场景

**⚠️ 遇到以下触发词，必须先调用 Skill 工具，禁止直接执行。**

| 技能 | 触发关键词（任一匹配即触发） |
|------|---------------------------|
| `page-generator` | 创建页面、生成页面、添加页面、新建页面、实现功能、开发功能、做功能、实现xx页面、开发xx模块 |
| `annotation` | 标注页面、生成标注、添加标注、原型标注、给xx页面加标注、标注xx功能、注入标注组件、初始化标注 |
| `req-doc` | 写需求说明书、生成需求说明书、创建需求文档、需求文档、SRS、细化需求、补充需求、完善需求说明书 |
| `feasibility-report` | 写可研报告、生成可行性研究报告、做可研、项目可行性分析、项目立项报告 |
| `feature-list` | 生成功能清单、导出功能清单、功能清单、功能列表、功能汇总表 |
| `brainstorming` | 创建功能、构建组件、添加功能、修改行为（在实现前） |
| `diagram-generator` | 生成流程图、画流程图、生成架构图、画时序图、生成图表、插入图表 |
| `pm-test-cases` | 生成测试用例、写测试用例、创建测试用例、QA测试、测试文档、验收标准 |
| `pm-operation-manual` | 生成操作手册、写操作手册、创建操作手册、用户手册、使用说明、功能说明文档 |
| `ui-ux-pro-max` | UI设计、配色方案、字体配对、设计风格、UX规范（在设计或美化界面时） |

**执行规则：**
1. 扫描用户消息中是否包含上表中的任一触发关键词
2. 匹配到触发词 → 必须先调用 `Skill` 工具，传入对应技能名称
3. 技能调用后，严格按技能的工作流执行，不能跳步骤、不能简化流程
4. 技能内部的 Agent 协作由技能自动调度，主流程不干预

---

## 通用规范

### 克制原则

**只做被要求的事，不要自作主张添加额外内容。**

- 让你去掉边框，就只去掉边框，不要顺手加阴影、加圆角、加背景色
- 让你加一个按钮，就只加按钮，不要顺手加 tooltip、加动画、加 loading 状态
- 让你改颜色，就只改颜色，不要顺手调整间距或字体
- 需求里没有提到的视觉效果、交互效果、样式属性，一律不加
- 如果你认为某个额外改动有必要，先问用户，不要直接做

### 注释规范

所有生成或修改的代码必须包含注释，具体要求如下：

**Vue 组件（.vue）**
- `<script setup>` 顶部写组件用途说明（1-2行）
- 每个功能块（数据定义、API调用、事件处理等）前加单行注释说明用途
- 复杂逻辑（如数据转换、条件判断）行内加注释解释原因
- 示例：
  ```ts
  // 表格列定义
  const columns = [...]

  // 获取列表数据（带分页和筛选）
  const fetchList = async () => { ... }

  // 删除前检查关联关系，有关联时阻止删除
  const handleDelete = async (record) => { ... }
  ```

**TypeScript/JavaScript（.ts/.js）**
- 每个导出函数/接口前写 JSDoc 注释说明用途和参数
- mock 文件每个接口前注释说明接口路径和用途
- 示例：
  ```ts
  /** 获取角色列表，支持分页和按名称/状态筛选 */
  export const getRoleList = (params: ...) => { ... }
  ```

**CSS/样式**
- 非显而易见的样式值加注释说明原因
- 示例：
  ```css
  /* 撑满内容区高度，配合 PageContainer flex 布局 */
  .table-card { flex: 1; }
  ```
