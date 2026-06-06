export function getSseMessage(stringData: string): string {
	return `data: ${stringData}\n\n`
}
