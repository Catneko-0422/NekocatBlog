import { h } from "hastscript";
import { visit } from "unist-util-visit";

import mermaidRenderScript from "./mermaid-render-script.js?raw";

export function rehypeMermaid() {
	return (tree) => {
		// 每個頁面只注入一次渲染腳本，避免多個圖表重複輸出整份腳本
		let scriptInjected = false;

		// 創建客戶端渲染腳本
		const renderScript = h(
			"script",
			{
				type: "text/javascript",
			},
			mermaidRenderScript,
		);

		visit(tree, "element", (node) => {
			if (
				node.tagName === "div" &&
				node.properties &&
				node.properties.className &&
				node.properties.className.includes("mermaid-container")
			) {
				const mermaidCode = node.properties["data-mermaid-code"] || "";
				const mermaidId = `mermaid-${Math.random().toString(36).slice(-6)}`;

				// 創建 Mermaid 容器
				const mermaidContainer = h(
					"div",
					{
						class: "mermaid-wrapper",
						id: mermaidId,
					},
					[
						h(
							"div",
							{
								class: "mermaid",
								"data-mermaid-code": mermaidCode,
							},
							mermaidCode,
						),
					],
				);

				// 替換原始節點
				node.tagName = "div";
				node.properties = { class: "mermaid-diagram-container" };
				node.children = [mermaidContainer];
				if (!scriptInjected) {
					node.children.push(renderScript);
					scriptInjected = true;
				}
			}
		});
	};
}
