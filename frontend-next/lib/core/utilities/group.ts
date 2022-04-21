export const group = <T>(items: T[], groupSize: number): T[][] => items.reduce<T[][]>((acc, item, index) => {
	if (index % groupSize === 0) {
		acc.push([item]);
	} else {
		acc[acc.length - 1].push(item);
	}
	return acc;
}, []);
