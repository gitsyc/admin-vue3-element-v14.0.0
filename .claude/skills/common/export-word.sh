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

  if [ -f "$OUTPUT_FILE" ] && [ "$TEMPLATE" = "req-doc" ] && command -v python3 >/dev/null 2>&1; then
    python3 - "$MD_DIR/$OUTPUT_FILE" <<'PY'
import sys
import zipfile
import xml.etree.ElementTree as ET
import tempfile
import os
import shutil

docx_path = sys.argv[1]
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ns = {"w": W}
ET.register_namespace("w", W)

with zipfile.ZipFile(docx_path) as z:
    names = z.namelist()
    data = {n: z.read(n) for n in names}

doc_xml = data.get("word/document.xml")
if not doc_xml:
    sys.exit(0)

root = ET.fromstring(doc_xml)

sect_prs = root.findall(".//w:sectPr", ns)
sect_pr = sect_prs[-1] if sect_prs else None

def get_int_attr(el, attr_name):
    if el is None:
        return None
    v = el.get(f"{{{W}}}{attr_name}")
    if v is None:
        return None
    try:
        return int(v)
    except ValueError:
        return None

pg_sz = sect_pr.find("w:pgSz", ns) if sect_pr is not None else None
pg_mar = sect_pr.find("w:pgMar", ns) if sect_pr is not None else None

page_w = get_int_attr(pg_sz, "w") or 11906
mar_l = get_int_attr(pg_mar, "left") or 1440
mar_r = get_int_attr(pg_mar, "right") or 1440
usable_w = max(1, page_w - mar_l - mar_r)

def ensure_child(parent, tag):
    el = parent.find(f"w:{tag}", ns)
    if el is None:
        el = ET.SubElement(parent, f"{{{W}}}{tag}")
    return el

def get_grid_span(tc):
    tc_pr = tc.find("w:tcPr", ns)
    if tc_pr is None:
        return 1
    grid_span = tc_pr.find("w:gridSpan", ns)
    v = get_int_attr(grid_span, "val")
    return v if v and v > 0 else 1

for tbl in root.findall(".//w:tbl", ns):
    tbl_pr = tbl.find("w:tblPr", ns)
    if tbl_pr is None:
        continue

    tbl_w = tbl_pr.find("w:tblW", ns)
    if tbl_w is None:
        tbl_w = ET.SubElement(tbl_pr, f"{{{W}}}tblW")
    tbl_w.set(f"{{{W}}}type", "pct")
    tbl_w.set(f"{{{W}}}w", "5000")

    tbl_layout = tbl_pr.find("w:tblLayout", ns)
    if tbl_layout is None:
        tbl_layout = ET.SubElement(tbl_pr, f"{{{W}}}tblLayout")
    tbl_layout.set(f"{{{W}}}type", "fixed")

    tbl_grid = tbl.find("w:tblGrid", ns)
    if tbl_grid is not None:
        ncols = len(tbl_grid.findall("w:gridCol", ns))
    else:
        first_tr = tbl.find("w:tr", ns)
        if first_tr is None:
            continue
        ncols = 0
        for tc in first_tr.findall("w:tc", ns):
            ncols += get_grid_span(tc)

    if ncols <= 0:
        continue

    col_w = max(1, usable_w // ncols)

    if tbl_grid is None:
        tbl_grid = ET.Element(f"{{{W}}}tblGrid")
        tbl.insert(0, tbl_grid)
    else:
        for ch in list(tbl_grid):
            tbl_grid.remove(ch)

    for _ in range(ncols):
        gc = ET.SubElement(tbl_grid, f"{{{W}}}gridCol")
        gc.set(f"{{{W}}}w", str(col_w))

    for tr in tbl.findall("w:tr", ns):
        col_index = 0
        tcs = tr.findall("w:tc", ns)
        for tc in tcs:
            span = get_grid_span(tc)
            width = col_w * span
            tc_pr = ensure_child(tc, "tcPr")
            tc_w = tc_pr.find("w:tcW", ns)
            if tc_w is None:
                tc_w = ET.SubElement(tc_pr, f"{{{W}}}tcW")
            tc_w.set(f"{{{W}}}type", "dxa")
            tc_w.set(f"{{{W}}}w", str(width))
            col_index += span

data["word/document.xml"] = ET.tostring(root, encoding="utf-8", xml_declaration=True)

fd, tmp_path = tempfile.mkstemp(suffix=".docx")
os.close(fd)
try:
    with zipfile.ZipFile(tmp_path, "w", compression=zipfile.ZIP_DEFLATED) as out:
        for n in names:
            out.writestr(n, data[n])
    shutil.copyfile(tmp_path, docx_path)
finally:
    try:
        os.remove(tmp_path)
    except OSError:
        pass
PY
  fi

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
