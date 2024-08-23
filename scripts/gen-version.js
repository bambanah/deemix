import { execSync } from "child_process";
function generateVersion() {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const day = now.getDate();

	const commitsNumber = String(execSync("git rev-list --count HEAD")).trim();
	const commitHash = String(execSync("git rev-parse --short=10 HEAD")).trim();

	return `${year}.${month}.${day}-r${commitsNumber}.${commitHash}`;
}

console.log(generateVersion());

export default generateVersion;
