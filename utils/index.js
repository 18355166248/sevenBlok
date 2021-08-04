var fs = require("fs");

const sidebar = [
  "",
  {
    title: "题解",
    sidebarDepth: 0,
    children: [],
  },
];

module.exports = sidebar;

let components = [];
const files = fs.readdirSync("./docs/Algorithm/LeetCode");
files.sort((a, b) => parseInt(a) - parseInt(b));
files.forEach(function(item) {
  if (item.indexOf(".md") && item !== "README.md") {
    const name = item.substr(0, item.length - 3);
    components.push("/Algorithm/LeetCode/" + name);
  }
});

sidebar[1].children = components;

fs.writeFile(
  "./docs/.vuepress/sidebar/leecode.json",
  JSON.stringify(sidebar),
  function(err) {
    if (err) {
      return res.status(500).send("Server is error...");
    }

    console.log("写入leecode菜单成功");
  }
);
