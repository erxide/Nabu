import { ETool } from "./enums";

export interface Chair {
    coords: Coords;
    rotation: number;
}

export interface Coords {
    x: number;
    y: number;
}

export interface Tool {
    name: ETool;
    description: string;
    shortcut: string;
    img: string;
}
