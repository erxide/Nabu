import { ETool } from "./enums";

export interface Chair {
	coords: Coords;
	rotation: number;
};

export interface Coords {
	coords: {x: number, y: number};
};

export interface Tool {
	name: ETool;
	description: string;
	shortcut: string;
	img: string;
}
