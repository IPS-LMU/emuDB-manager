// Taken from https://www.frankmitchell.org/2015/01/fisher-yates/
export function shuffleArray(array: Array<any>) {
	let i = 0;
	let j = 0;
	let temp = null;

	for (i = array.length - 1; i > 0; --i) {
		j = Math.floor(Math.random() * (i + 1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}