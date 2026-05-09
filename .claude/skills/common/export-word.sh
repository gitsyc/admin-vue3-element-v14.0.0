#!/bin/bash
# export-word.sh - 统一文档导出工具
# 用法：
#   1. 直接执行：bash export-word.sh <markdown文件> <模板>
#   2. 作为函数：source export-word.sh && export_word <markdown文件> <模板>

# URL 解码函数（纯 Bash 实现，无需 Python）
url_decode() {
  local url_encoded="${1//+/ }"
  printf '%b' "${url_encoded//%/\\x}"
}

# 导出带图片的 Word 文档
# 参数：
#   $1: Markdown 文件路径（支持相对路径和绝对路径）
#   $2: 模板名称（req-doc, test-cases, operation-manual, default, formal, simple）
export_word() {
  local MD_FILE=$1
  local TEMPLATE=$2

  # 参数校验
  if [ -z "$MD_FILE" ] || [ -z "$TEMPLATE" ]; then
    echo "❌ 错误: 缺少必要参数"
    echo ""
    echo "用法: $0 <markdown文件> <模板>"
    echo ""
    echo "模板选项:"
    echo "  req-doc           - 需求说明书"
    echo "  test-cases        - 测试用例"
    echo "  operation-manual  - 操作手册"
    echo "  feasibility-report - 可行性研究报告"
    echo "  feature-list      - 功能清单"
    echo "  default           - 默认模板"
    echo "  formal            - 正式模板"
    echo "  simple            - 简洁模板"
    echo ""
    echo "示例: $0 docs/需求说明书.md req-doc"
    return 1
  fi

  # 检查 Markdown 文件是否存在
  if [ ! -f "$MD_FILE" ]; then
    echo "❌ 错误: 文件不存在: $MD_FILE"
    return 1
  fi

  # 获取 Markdown 文件的绝对路径和所在目录
  local MD_FILE_ABS=$(cd "$(dirname "$MD_FILE")" && pwd)/$(basename "$MD_FILE")
  local MD_DIR=$(dirname "$MD_FILE_ABS")
  local ORIGINAL_DIR=$(pwd)
  local SCRIPT_DIR_NAME
  SCRIPT_DIR_NAME="$(dirname "${BASH_SOURCE[0]}")"
  local SCRIPT_DIR
  if [[ "$SCRIPT_DIR_NAME" = /* ]]; then
    SCRIPT_DIR="$(cd "$SCRIPT_DIR_NAME" && pwd)"
  else
    SCRIPT_DIR="$(cd "$ORIGINAL_DIR/$SCRIPT_DIR_NAME" && pwd)"
  fi

  echo "📂 Markdown 文件: $MD_FILE_ABS"
  echo "📂 工作目录: $MD_DIR"

  if ! command -v pandoc >/dev/null 2>&1; then
    echo "❌ 错误: 未找到 pandoc，请先安装 pandoc"
    cd "$ORIGINAL_DIR"
    return 1
  fi

  cd "$MD_DIR"

  local BASE_NAME
  BASE_NAME=$(basename "$MD_FILE_ABS")
  local OUTPUT_FILE="${BASE_NAME%.*}.docx"
  local REFERENCE_DOC="$SCRIPT_DIR/reference-docs/${TEMPLATE}.docx"
  local PANDOC_ARGS=()
  if [ -f "$REFERENCE_DOC" ]; then
    PANDOC_ARGS+=(--reference-doc="$REFERENCE_DOC")
  fi

  echo ""
  echo "🚀 开始导出..."
  pandoc "$MD_FILE_ABS" \
    -o "$OUTPUT_FILE" \
    --from markdown+yaml_metadata_block \
    --resource-path="$MD_DIR:." \
    "${PANDOC_ARGS[@]}" \
    --toc

  if [ -f "$OUTPUT_FILE" ]; then
    local FILE_SIZE
    FILE_SIZE=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)
    echo ""
    echo "✅ 导出成功!"
    echo "📄 文件: $OUTPUT_FILE"
    echo "📊 大小: $FILE_SIZE"
    cd "$ORIGINAL_DIR"
    return 0
  fi

  echo ""
  echo "❌ 导出失败，请检查日志"
  cd "$ORIGINAL_DIR"
  return 1
}

# 如果直接执行脚本（不是被 source），则调用导出函数
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  export_word "$@"
fi
