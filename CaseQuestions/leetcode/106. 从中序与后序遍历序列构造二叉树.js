// 根据一棵树的中序遍历与后序遍历构造二叉树。
// 注意:
// 你可以假设树中没有重复的元素。
// 例如，给出
// 中序遍历 inorder = [9,3,15,20,7]
// 后序遍历 postorder = [9,15,7,20,3]
// 返回如下的二叉树：
//     3
//    / \
//   9  20
//     /  \
//    15   7
// ```js
// // 后序遍历的数组最后一个元素代表的即为根节点

// // 中序遍历的顺序是每次遍历左孩子，再遍历根节点，最后遍历右孩子。
// // 后序遍历的顺序是每次遍历左孩子，再遍历右孩子，最后遍历根节点。
// void inorder(TreeNode* root) {
//   if (root == nullptr) {
//       return;
//   }
//   inorder(root->left);
//   ans.push_back(root->val);
//   inorder(root->right);
// }
// // 后序遍历
// void postorder(TreeNode* root) {
//   if (root == nullptr) {
//       return;
//   }
//   postorder(root->left);
//   postorder(root->right);
//   ans.push_back(root->val);
// }
// ```;
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
var buildTree = function(inorder, postorder) {
  let posIndex; // 表示后序遍历最后的index 后序遍历的数组最后一个元素代表的即为根节点

  const map = new Map(); // 缓存中序遍历的哈希表, 用于通过后序遍历的val找到对应在中序遍历的索引

  inorder.forEach((val, index) => {
    map.set(val, index);
  });

  function deep(in_left, in_right) {
    if (in_left > in_right) return null; // 表示没有节点可以构造了

    const root_val = postorder[posIndex];
    const in_index = map.get(root_val); // 后序遍历最后的值在中序遍历中所在的索引, 也是表示根节点
    const root = new TreeNode(root_val); // 生成根节点

    posIndex--; // 更新 后序遍历最后的索引

    root.right = deep(in_index + 1, in_right); // 生成右子树
    root.left = deep(in_left, in_index - 1); // 生成左子树

    return root;
  }

  posIndex = postorder.length - 1;

  return deep(0, inorder.length - 1);
};

console.log(buildTree([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]));
