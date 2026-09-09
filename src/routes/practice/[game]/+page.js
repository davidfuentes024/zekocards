import { error } from '@sveltejs/kit';
import { GAMES, GAME_BY_ID } from '$lib/data/games.js';

export const prerender = true;

export function entries() {
	return GAMES.map((g) => ({ game: g.id }));
}

export function load({ params }) {
	const game = GAME_BY_ID.get(params.game);
	if (!game) error(404, 'No such drill');
	return { game };
}
