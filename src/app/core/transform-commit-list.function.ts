export function transformCommitList(commitList) {
	let sortedResult = [];

	let currentMonth: string;
	let currentDay: string;

	for (let i = 0; i < commitList.length; ++i) {
		let dateTime: string = commitList[i].date;

		let month = dateTime.substring(0, 7);
		let day = dateTime.substring(0, 10);
		let time = dateTime.substring(11);

		if (month !== currentMonth) {
			sortedResult.push({
				month: month,
				open: false,
				days: []
			});
		}

		currentMonth = month;
		let monthObject = sortedResult[sortedResult.length - 1];

		if (day !== currentDay) {
			monthObject.days.push({
				day: day,
				open: false,
				commits: []
			});
		}

		currentDay = day;
		let dayObject = monthObject.days[monthObject.days.length - 1];

		dayObject.commits.push({
			commitID: commitList[i].commitID,
			dateTime: time,
			message: commitList[i].message,
			tagLabel: ''
		});
	}

	return sortedResult;
}