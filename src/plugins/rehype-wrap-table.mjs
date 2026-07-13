import { visit } from "unist-util-visit";

export function rehypeWrapTable() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName === "table" && parent) {
				// 創建包裝器 div
				const wrapper = {
					type: "element",
					tagName: "div",
					properties: {
						className: ["table-wrapper"],
					},
					children: [node],
				};

				// 替換原始的 table 節點
				parent.children[index] = wrapper;
			}
		});
	};
}
