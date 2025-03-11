declare module 'vtt-creator' {
	class Vtt {
		add(start: number, end: number, text: string): void;
		toString(): string;
	}
	export default Vtt;
}
