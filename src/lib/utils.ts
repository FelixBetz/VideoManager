export function removeNumber(arr: number[], numToRemove: number): number[] {
	return arr.filter((n) => n !== numToRemove);
}
