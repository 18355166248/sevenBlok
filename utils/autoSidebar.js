const path = require("path");
const dirTree = require("directory-tree");
const { startsWith } = require("lodash");
const SRC_PATH = path.resolve(__dirname, "./src");

// 默认置顶的文件名
const topList = ["README.md", "index.md", "Index.md", "INDEX.md"];
const collapsableAuto = ["LeetcodeClass"];

// 针对tree 排序, 将 README.md 排到第一位
function moveREADMETop(list) {
  const readmeIndex = list.findIndex((v) => topList.includes(v.name));
  if (readmeIndex > -1) {
    list.unshift(list.splice(readmeIndex, 1)[0]);
  }
}

// 按照 vuepress '分组侧边栏'的规范生成单个配置
// https://vuepress.vuejs.org/zh/theme/default-theme-config.html#%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%88%86%E7%BB%84
function toSidebarOption(tree = []) {
  if (!Array.isArray(tree)) return {};
  // 针对tree 排序, 将 README.md 排到第一位
  moveREADMETop(tree);
  return tree.map((v) => {
    if (v.type === "directory") {
      let title = v.name.split("-")[1];

      const isCollapsable = collapsableAuto.some(
        (v1) => v.path.indexOf(v1) > -1
      );
      try {
        if (v.children[0] && v.children[0].name.startsWith("0.title__")) {
          title = v.children[0].name.split("0.title__")[1];
          title = title.replaceAll(/\.(md|js)/g, "");
        }
      } catch (error) {
        console.log("🚀 ~ returntree.map ~ error:", error);
      }
      // 对带有符号 . 的文件 取点前面的字符做从大到小的排序
      v.children.sort((a, b) => a.name.split('.')[0] - b.name.split('.')[0]);

      return {
        title,
        collapsable: isCollapsable, // 可选的, 默认值是 true,
        sidebarDepth: 1,
        children: toSidebarOption(v.children),
      };
    } else {
      // 因为所有的md文件必须放到'docs'文件夹下
      // 所以相对路径就是'docs'后面的部分
      // 最后把扩展名去掉, 就是路由的路径
      const path = v.path.split("docs")[1];
      if (path.indexOf("README") > -1 || path.indexOf("index") > -1) return "";
      return path.replace(/\.md$/, "");
    }
  });
}

/**
 * @desc 根据 自定义文件夹'docs/src'自动生成vuepress的sidebar选项
 * @param {string} srcPath 自定义文件夹路径,必须在docs文件夹下
 * @returns {object[]}
 */
function autoGetSidebarOptionBySrcDir(srcPath = SRC_PATH) {
  const srcDir = dirTree(srcPath, {
    extensions: /\.md$/,
    normalizePath: true,
  });

  const siderbar = {};

  srcDir.children.forEach((src) => {
    if (src && Array.isArray(src.children)) {
      src.children.forEach((item) => {
        const key = item.path.split("/docs")[1] + "/";
        siderbar[key] = toSidebarOption(item.children);
      });
    }
  });

  return siderbar;

  // return toSidebarOption(srcDir.children);
  // [title:'group-name', children:['/route-a','route-b']]
}

module.exports = autoGetSidebarOptionBySrcDir;
