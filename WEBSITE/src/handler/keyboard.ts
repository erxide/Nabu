import { ETool } from "@/types/enums";
import { RefObject, SetStateAction, Dispatch } from "react";

export function handleKeyDown(
	e: KeyboardEvent,
	rotation: RefObject<number>,
	selectedTool: RefObject<ETool>,
	setSelectedToolState: Dispatch<SetStateAction<ETool>>,
) {
	switch (e.key) {
		case "r":
			if (selectedTool.current !== ETool.Add) return;

			rotation.current =
				rotation.current !== 270 ? rotation.current + 90 : 0;
			break;
		case "a":
			selectedTool.current = ETool.Add;
			setSelectedToolState(ETool.Add);
			break;
		case "d":
			selectedTool.current = ETool.Delete;
			setSelectedToolState(ETool.Delete);
			break;
		default:
			break;
	}
}
