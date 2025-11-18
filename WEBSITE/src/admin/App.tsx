import { useState, useEffect, useRef } from "react";
import {
	handleMouseUp,
		handleMouseWheel,
		handleMouseMove,
		handleMouseDown,
} from "@/handler/mouse";
import { handleKeyDown } from "@/handler/keyboard";
import { drawPreview } from "@/draw/preview";
import { drawGrid } from "@/draw/grid";
import { drawChairs } from "@/draw/chair";
import { clearScreen } from "@/draw/clear";
import { Coords, Tool, Chair } from "@/types/interfaces";
import { ETool } from "@/types/enums";

const TOOL_LIST: Map<ETool, Tool> = new Map([
		[
		ETool.Add,
		{
name: ETool.Add,
description: "add chair",
shortcut: "a",
img: "/chair.svg",
},
		],
		[
		ETool.Delete,
		{
name: ETool.Delete,
description: "delete a chair",
shortcut: "d",
img: "/delete.svg",
},
		],
]);

const LINE_WEIGHT = 0.2;
const ROW_NBR = 50;
const COL_NBR = 50;

export default function App() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

	const chairs = useRef<Map<string, Chair>>(new Map());

	const cellSize = useRef<number>(0);

	const cursorAbsCoords = useRef<Coords>({ x: 0, y: 0 });
	const cursorGridCoords = useRef<Coords>({ x: 0, y: 0 });

	const rotation = useRef<number>(0);

	const prevCoords = useRef<Coords>({ x: 0, y: 0 });
	const isMiddleClickDown = useRef<boolean>(false);

	const offset = useRef<Coords>({ x: 0, y: 0 });
	const prevOffset = useRef<Coords>({ x: 0, y: 0 });

	const selectedTool = useRef<ETool>(ETool.Add);
	const [selectedToolState, setSelectedToolState] = useState<ETool>(
			ETool.Add,
			);

	const zoomLevel = useRef<number>(1);

	function render() {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;

		if (!canvas || !ctx) return;

		cellSize.current = Math.max(
				zoomLevel.current * 10,
				Math.min(canvas.width / COL_NBR, canvas.height / ROW_NBR),
				);

		clearScreen(ctx, canvas);

		drawGrid(canvas, ctx, cellSize.current, LINE_WEIGHT, offset.current);

		const chairImg = new Image();
		chairImg.src = "/chair.svg";

		const deleteImg = new Image();
		deleteImg.src = "/delete.svg";

		drawChairs(
				ctx,
				chairs.current,
				cellSize.current,
				cursorGridCoords.current,
				selectedTool.current,
				offset.current,
				chairImg,
				);
		drawPreview(
				ctx,
				cursorGridCoords.current,
				cellSize.current,
				rotation.current,
				TOOL_LIST.get(selectedTool.current)!,
				chairs.current,
				offset.current,
				chairImg,
				deleteImg,
				);
	}

	useEffect(() => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
			if (!ctx) return;

			ctxRef.current = ctx;

			render();

			const keyHandler = (e: KeyboardEvent) => {
			handleKeyDown(e, rotation, selectedTool, setSelectedToolState);
			render();
			};
			document.addEventListener("keydown", keyHandler);

			return () => {
				document.removeEventListener("keydown", keyHandler);
			};
	}, []);

	return (
			<>
			<div className="flex flex-col bg-white border left-4 top-4 bg-blue-500 absolute">
			{Array.from(TOOL_LIST.entries()).map(([toolKey, tool]) => (
						<button
						title={`${tool.description} (${tool.shortcut})`}
						key={toolKey}
						onClick={() => {
						setSelectedToolState(toolKey);
						selectedTool.current = toolKey;
						}}
						className={`m-1 p-2 h-20 w-20 ${
						selectedToolState === toolKey
						? "opacity-100"
						: "opacity-40"
						}`}
						>
						<img src={tool.img} className="w-12 h-12" />
						</button>
						))}
			</div>
				<canvas
				ref={canvasRef}
			onMouseDown={(e) => {
				handleMouseDown(
						e.nativeEvent,
						chairs,
						cursorGridCoords.current!,
						rotation.current!,
						TOOL_LIST.get(selectedToolState)!,
						isMiddleClickDown,
						prevCoords,
						prevOffset,
						offset.current,
						);
				render();
			}}
			onMouseUp={(e) =>
				handleMouseUp(e.nativeEvent, isMiddleClickDown)
			}
			onMouseMove={(e) => {
				handleMouseMove(
						e.nativeEvent,
						cursorAbsCoords,
						cursorGridCoords,
						cellSize.current!,
						isMiddleClickDown.current,
						offset,
						prevOffset.current,
						prevCoords.current,
						);
				render();
			}}
			onWheel={(e) => {
				handleMouseWheel(e.nativeEvent, zoomLevel);
				render();
			}}
			></canvas>
				</>
				);
}
