import { type ApiHandler } from "@/types.js";
import { getAccessToken, getArlFromAccessToken } from "@/deemixApp.js";
import { saveLoginCredentials } from "@/helpers/loginStorage.js";

const path = "/loginEmail";

const handler: ApiHandler["handler"] = async (req, res) => {
	const isSingleUser = req.app.get("isSingleUser");
	const { email, password } = req.body;
	let accessToken = req.body.accessToken;

	if (!accessToken) {
		accessToken = await getAccessToken(email, password);
		if (accessToken === "undefined") accessToken = undefined;
	}
	let arl;
	if (accessToken) arl = await getArlFromAccessToken(accessToken);

	if (isSingleUser && accessToken)
		saveLoginCredentials({
			accessToken,
			arl: arl || null,
		});

	res.send({ accessToken, arl });
};

const apiHandler = { path, handler };

export default apiHandler;
