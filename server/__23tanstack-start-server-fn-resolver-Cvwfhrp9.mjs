//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Cvwfhrp9.js
var manifest = {
	"0c0b2a7731c0dfcd3878ecbc17e5fc69e087db6d5d31b43645da46b2d2bbc18b": {
		functionName: "listDownlineUsers_createServerFn_handler",
		importer: () => import("./_ssr/admin-users.functions-BCuv-6Cb.mjs")
	},
	"2126a6ecc8ee62cf0b1932a84e68ca4d3d03e630fadd5fe7c34fcc37c77df0a0": {
		functionName: "getMyWalletOverview_createServerFn_handler",
		importer: () => import("./_ssr/wallet.functions-BiEhLnWW.mjs")
	},
	"2c76b7e84a90f7efbe64ded1d1797cb7db54e090c4b0644224410dacccd3d865": {
		functionName: "createDownlineUser_createServerFn_handler",
		importer: () => import("./_ssr/admin-users.functions-BCuv-6Cb.mjs")
	},
	"3d4f02749ba77e4b88d1b2126e3126e6eeeacb743164f797f61b5deaf7625028": {
		functionName: "submitKycForReview_createServerFn_handler",
		importer: () => import("./_ssr/kyc.functions-DDluA6Vk.mjs")
	},
	"491a621ace5d08940f2d8a6d2e5d76bf890f6c138ac2259097000c585449c5d2": {
		functionName: "listPendingKyc_createServerFn_handler",
		importer: () => import("./_ssr/kyc.functions-DDluA6Vk.mjs")
	},
	"5819067632a3801522878cfa0e5d994133d44499ccdc0185fbe87e723a4bdc10": {
		functionName: "recordKycDoc_createServerFn_handler",
		importer: () => import("./_ssr/kyc.functions-DDluA6Vk.mjs")
	},
	"881463f41fb34281d471e949f238ca51cc40a00a66363281bc354f28e0b56671": {
		functionName: "listMyKyc_createServerFn_handler",
		importer: () => import("./_ssr/kyc.functions-DDluA6Vk.mjs")
	},
	"9f379731e1b30c5f0472e627e15aec25fb4f2788880ca65d1db8169e634f8274": {
		functionName: "setUserStatus_createServerFn_handler",
		importer: () => import("./_ssr/admin-users.functions-BCuv-6Cb.mjs")
	},
	"a3286e95bc7d6841ec9b6892e6f62f2e5a5dffbdeb1cb35f24064c1205333fde": {
		functionName: "transferBetweenOwnWallets_createServerFn_handler",
		importer: () => import("./_ssr/wallet.functions-BiEhLnWW.mjs")
	},
	"b6d049347e2289db2fc08d612602f8525efeea75017b812a51117ec28b1bc944": {
		functionName: "verifyMobileOtp_createServerFn_handler",
		importer: () => import("./_ssr/otp.functions-CgCLDWJa.mjs")
	},
	"d5bfda6d99b56061715f5290d902e3f08901dfd394083ce2940a9012ceaf10a0": {
		functionName: "listVerifiedRetailersForCredit_createServerFn_handler",
		importer: () => import("./_ssr/wallet.functions-BiEhLnWW.mjs")
	},
	"d84ef2ae7d181a250316c94c4d06710b2e1ff702170e90fb7ea7617d835d136e": {
		functionName: "resolveUsernameEmail_createServerFn_handler",
		importer: () => import("./_ssr/username.functions-T4VoYl4P.mjs")
	},
	"d9678013493c18c5011bf48d158e38ea420b74f84ac0f2d93b06f355388a1a88": {
		functionName: "requestWalletTopup_createServerFn_handler",
		importer: () => import("./_ssr/wallet.functions-BiEhLnWW.mjs")
	},
	"db8d7909eed18063cfd70f56466d2f58c15de60b7fc8ea5e8b4062102bfd504b": {
		functionName: "creditVerifiedRetailerWallet_createServerFn_handler",
		importer: () => import("./_ssr/wallet.functions-BiEhLnWW.mjs")
	},
	"dbdb65b15d7ab268cbb800ec2d03c93275d348451cd092f427b42c2b103dd067": {
		functionName: "reviewKyc_createServerFn_handler",
		importer: () => import("./_ssr/kyc.functions-DDluA6Vk.mjs")
	},
	"dd0c76af6de7f43745617255528a67fe19bd2a9ef12db2cb71b95cde00b53c1a": {
		functionName: "sendMobileOtp_createServerFn_handler",
		importer: () => import("./_ssr/otp.functions-CgCLDWJa.mjs")
	},
	"e69806ee8e0970a82b2060d95ade0f3784dc736bb8749e124f493ac23a86c7e4": {
		functionName: "verifyUsernamePassword_createServerFn_handler",
		importer: () => import("./_ssr/username.functions-T4VoYl4P.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
